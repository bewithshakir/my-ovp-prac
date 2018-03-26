(function () {
    'use strict';

    angular.module('ovpApp.product.series', [
        'ovpApp.config',
        'ovpApp.directives.carousel',
        'ovpApp.directives.person',
        'ovpApp.services.locationService',
        'ovpApp.directives.affix',
        'ovpApp.directives.focus',
        'ovpApp.product.productActionService',
        'ovpApp.dataDelegate',
        'ovpApp.messages',
        'ovpApp.services.parentalControlsService',
        'ovpApp.services.dateFormat',
        'ovpApp.product.episodes',
        'ovpApp.product.focusRestore',
        'ui.router'
    ])
    .component('productSeries', {
        bindings: {
            fetcher: '<', // Method for fetching the series. Used if a refresh is needed
            series: '<',
            blocked: '<',
            cameFromWatchLater: '<'
        },
        templateUrl: '/js/ovpApp/product/product-series.html',
        controller: class ProductSeries {
            constructor($scope, $rootScope, $state, searchService, productService, delegateFactory,
                productFocusRestore, locationService, $q, $timeout) {
                angular.extend(this, {$scope, $rootScope, $state, searchService, productService,
                    delegateFactory, productFocusRestore, locationService, $q, $timeout});
            }

            $onInit() {
                this.entitled = this.series.isEntitled !== false;
                this.deregister = [];

                this.initParentalControls();
                this.initOoh();
                this.deregister.push(this.$scope.$on('update-dvr',
                    (event, schedule, asset, action) => {
                        this.actionExecuting(asset, action);
                    }
                ));

                this.onUpdateData();
                this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
            }

            $onDestroy() {
                this.deregister.forEach(d => d());
            }

            onUpdateData() {
                if (this.series.episodesAvailable <= 0) {
                    this.activateTab('info', null, 'application');
                }

                this.$rootScope.$emit('ovp:setPageTitle', this.series.title);
            }

            initParentalControls() {
                this.deregister.push(this.$rootScope.$on('ParentalControls:updated',
                    () => this.updateBlocked()));
            }

            initOoh() {
                this.locationService.getLocation().then((location) => {
                    this.ooh = !location.behindOwnModem;
                    this.oohUnavailable = this.ooh && !this.series.availableOutOfHome;
                });

                this.deregister.push(this.$scope.$on('LocationService:locationChanged', (event, location) => {
                    this.ooh = !location.behindOwnModem;
                    this.oohUnavailable = this.ooh && !this.series.availableOutOfHome;
                }));
            }

            updateBlocked() {
                this.series.isBlocked.then(isBlocked => this.blocked = isBlocked);
            }

            isOnTab(tabName) {
                return this.$state.includes('product.series.' + tabName);
            }

            actionExecuting(asset, action) {
                if (this.fetcher) {
                    const waitForFresh = true;
                    const promise = this.$q.when(this.fetcher(waitForFresh))
                        .then(asset => {
                            this.series = asset;
                            this.onUpdateData();
                            // Focus first action after performing action
                            if (this.series.actions && asset.isSeries) {
                                this.series.actions[0].focus = true;
                            }
                        });

                    this.$scope.$broadcast('product:update-started', asset, action, promise);
                }
            }

            availabilityMessage() {
                return this.productService.availabilityMessage(this.series, this.cameFromWatchLater) || '';
            }

            activateTab(tab, evt, triggeredBy = 'user') {
                let activeTab = 'product.series.episodes';

                // Analytics
                this.$rootScope.$emit('Analytics:select', {
                    elementStandardizedName: tab,
                    operationType: 'navigationClick',
                    triggeredBy: triggeredBy,
                    pageSectionName: 'navPagePrimary'
                });

                if (tab === 'episodes' || tab === 'info') {
                    activeTab = 'product.series.' + tab;
                }

                if (tab === 'episodes' && (this.series.episodesAvailable <= 0)) {
                    // set state to 'info' in case
                    // episodes are not available
                    activeTab = 'product.series.info';
                }

                this.$state.go(activeTab, {}, {
                    location: 'replace'
                }).then(() => this.$rootScope.$emit('ovp:setPageTitle', this.series.title));
            }

            getSectionAriaLabel() {
                return this.series.title + ', ' +
                    this.series.episodesAvailable + ' episodes' + ', ' +
                    this.availabilityMessage() + ', ' + this.series.description.long;
            }
        }
    });
})();
