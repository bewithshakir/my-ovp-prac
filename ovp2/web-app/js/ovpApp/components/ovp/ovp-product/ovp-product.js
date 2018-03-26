/**
 * ovpProduct
 *
 * Displays the boxart and other simple information about a movie or series.
 *
 * example usage:
 *
 * <ovp-product asset="vm.someProgramOrSeriesObject"></ovp-product>
 *
 * OR, with options:
 *
 * <ovp-product asset="vm.someProgram" options="vm.someOptionsObject"></ovp-product>
 *
 * OR, with options and template:
 *
 * <ovp-product asset="vm.someProgram" options="vm.options" template="list"></ovp-product>
 *
 * Or, in a carousel
 *
 * <ovp-carousel items="vm.someArray">
 *     <ovp-product ng-repeat="asset in vm.someArray" asset="asset"></ovp-product>
 * </ovp-carousel>
 *
 * Bindings:
 *    asset: (object) an event, episode-list, product, or series data delegate; or similar
 *    options: (object) options to modify the behavior. See below
 *    template: (string) specifies which template to use. Valid values = 'boxart' or 'list'.
 *       defaults to 'boxart'
 *    onRemove: (function) callback to be called when an item is removed
 *
 *
 * Options:
 *    enableRemove: (bool) if true, a remove icon will be displayed. defaults to false
 *    showRentalInfo: (bool or string) If true, price information will be displayed (if it
 *       exists). If 'auto', it will decide based on the type of asset. Defaults to 'auto'
 *    enableOOW: (bool) if true, item will be dimmed if flagged as out of window. Defaults
 *       to false
 *
 */

(function () {
    'use strict';

    const templates = {
        boxart: '/js/ovpApp/components/ovp/ovp-product/boxart-template.html',
        list: '/js/ovpApp/components/ovp/ovp-product/list-item-template.html'
    };

    angular.module('ovpApp.directives.product', [
        'ovpApp.services.parentalControlsService',
        'ovpApp.directives.fallbackImage',
        'ovpApp.directives.fadeinOnload',
        'ovpApp.directives.lazySrc',
        'ovpApp.directives.focus'])
    .component('ovpProduct', {
        bindings: {
            asset: '<',
            options: '<',
            onRemove: '&?',
            onClick: '&?',
            category: '<'
        },
        require: {
            // Some containers have specialized logic, so if we're inside one of them
            // we need to inherit that code.
            carouselContainer: '^^?ovpCarousel',
            gridlistContainer: '^^?ovpGridList'
        },
        /* @ngInject */
        templateUrl: function ($attrs) {
            return templates[$attrs.template] || templates.boxart;
        },
        controller: class OvpProduct {
            /* @ngInject */
            constructor(parentalControlsService, $q, $state, $controller, $rootScope, $window, searchFocusIndex,
                focusMediator) {
                angular.extend(this, {parentalControlsService, $q, $state, $controller, $rootScope, $window,
                        searchFocusIndex, focusMediator});
                let browserName = $window.navigator.userAgent;
                if (browserName.indexOf('Chrome') !== -1) {
                    this.isChrome = true;
                } else {
                    this.isChrome = false;
                }
            }

            $onInit() {
                this.container = this.carouselContainer || this.gridlistContainer;
                if (this.options && this.options.focusOnLoad) {
                    this.focusMediator.requestFocus(this.focusMediator.highPriority)
                        .then(() => this.focusOnLoad = true);
                } else {
                    this.focusOnLoad = false;
                }
            }

            $onChanges(changes) {
                if (changes.options) {
                    this.applyDefaultOptions(changes.options.currentValue);
                }
            }

            click(index) {

                // Analytics. Begin
                let selectContentData = {
                    asset: this.asset,
                    elementIndex: index
                };

                if (this.$state.current.name.startsWith('ovp.store') ||
                    (this.$state.current.name.startsWith('ovp.ondemand'))) {

                    selectContentData.navPagePrimaryName = 'curatedCollections';
                }

                if (this.options && this.options.mylibCatName) {
                    selectContentData.mylibCatName = this.options.mylibCatName;
                }

                if (this.carouselContainer && this.carouselContainer.options) {
                    selectContentData.pageSubSectionName = this.carouselContainer.options.title;
                } else if (this.gridlistContainer && this.gridlistContainer.options) {
                    selectContentData.pageSubSectionName = this.gridlistContainer.options.title;
                }

                if (this.$state.current.name.startsWith('search') && this.asset.resultDisplay) {
                    selectContentData.generateSelectContent = true;
                    this.$rootScope.$emit('Analytics:search-select-item', selectContentData);
                } else {
                    this.$rootScope.$emit('Analytics:selectContent', selectContentData);
                }
                // Analytics. End

                if (this.onClick) {
                    this.onClick({asset: this.asset, index: index});
                } else {
                    let route = this.asset.clickRoute;
                    if (route && route[0] && route[0].startsWith('search')) {
                        this.searchFocusIndex.set(this.options.index, this.options.parentIndex);
                    }
                    if (route) {
                        this.$state.go(...route);
                    }
                }
            }

            remove(event) {
                let callback = this.onRemove || angular.noop;
                callback({asset: this.asset});

                event.preventDefault();
                event.stopPropagation();
            }

            statusOptions() {
                if (!this.asset) {
                    return {};
                }

                let bom = true;
                if (this.$rootScope.location && !this.$rootScope.location.behindOwnModem) {
                    bom = false;
                }

                return {
                    outOfWindow: this.asset.isOutOfWindow && this.options.enableOOW,
                    outOfHome: !this.asset.availableOutOfHome && !bom
                };
            }

            playedStyle() {
                if (this.asset && this.asset.bookmark && !this.asset.bookmark.complete) {
                    return {width: this.asset.playedPct + '%'};
                } else {
                    return {};
                }
            }

            showRentalInfo() {
                if (this.options.showRentalInfo == 'auto') {
                    return this.isTvod();
                } else {
                    return this.options.showRentalInfo;
                }
            }

            isTvod() {
                const price = this.asset && this.asset.price;
                return angular.isDefined(price) && ((angular.isNumber(price) && price > 0) ||
                        (angular.isString(price) && price.toLowerCase() !== 'free'));
            }

            tabIndex() {
                if (this.container && angular.isFunction(this.container.itemTabIndex)) {
                    return this.container.itemTabIndex(this.asset);
                } else {
                    return '0';
                }
            }

            hasPagination() {
                if (this.container && angular.isFunction(this.container.hasPagination)) {
                    return this.container.hasPagination();
                } else {
                    return false;
                }
            }

            getTitlePrefix() {
                let prefix = '';
                if (this.asset.isBlockedByParentalControls) {
                    prefix = 'Blocked';
                }
                if (this.asset.isEntitled === false) {
                    prefix = 'Not Entitled';
                }
                return prefix;
            }

            ////////////////////////

            applyDefaultOptions(newOptions) {
                const defaults = {
                    enableRemove: false,
                    enableOOW: false,
                    showRentalInfo: 'auto'
                };
                this.options = angular.extend({}, defaults, newOptions);
            }
        }
    });
})();
