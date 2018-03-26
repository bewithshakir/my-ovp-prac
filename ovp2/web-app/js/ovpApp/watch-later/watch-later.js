(function () {
    'use strict';

    angular.module('ovpApp.watchlater', [
        'ovpApp.messages',
        'ovpApp.directives.carousel',
        'ovpApp.directives.product',
        'ovpApp.services.nns',
        'ovpApp.services.bookmark',
        'ovpApp.watchlater.data',
        'ovpApp.watchlater.router',
        'ovpApp.services.homePage',
        'ovpApp.services.locationService',
        'ui.router',
        'ovpApp.services.parentalControlsService',
        'ovpApp.components.alert',
        'ovpApp.components.ovp.clickConfirm',
        'ovpApp.services.errorCodes'
    ])
    .component('myLibrary', {
        templateUrl: '/js/ovpApp/watch-later/watch-later.html',
        controller: class WatchLaterPage {
            /* @ngInject */
            constructor($scope, BookmarkService, $rootScope, $controller, locationService,
                watchLaterData, $window, $log, $q, $timeout, alert, messages, $state, errorCodesService) {

                angular.extend(this, {$scope, BookmarkService, $rootScope, $controller, locationService,
                    watchLaterData, $window, $log, $q, $timeout, alert, messages, $state, errorCodesService});
            }


            $onInit() {
                this.alert = '';

                this.initOOH();

                this.initCategories();
            }

            getItems(category) {
                if (category.context !== 'inProgress') {
                    return category.media;
                } else {
                    let filtered = category.media.filter(asset => !this.isUnrentedTvodAsset(asset));

                    // Need to return a saved copy in order to prevent infinite digest
                    if (!this.filteredInProgressItems || this.filteredInProgressItems.length != filtered.length) {
                        this.filteredInProgressItems = filtered;
                    }
                    return this.filteredInProgressItems;
                }
            }

            hasNoContent() {
                return this.categories && (this.categories.length === 0 ||
                    this.categories.reduce((val, category) => val + category.media.length, 0) === 0);
            }

            //////////////////////

            isUnrentedTvodAsset(asset) {
                return !asset.isSeries && asset.streamList &&
                    asset.streamList.every(this.isUnrentedTvodStream);
            }

            isUnrentedTvodStream(stream) {
                return stream.type === 'ONLINE_ONDEMAND' &&
                    stream.streamProperties.price > 0 &&
                    !stream.streamProperties.tvodEntitlement;
            }

            initOOH() {
                this.locationService.getLocation().then((location) => {
                    this.ooh = !location.behindOwnModem;
                });

                this.$scope.$on('LocationService:locationChanged', (event, location) => {
                    this.ooh = !location.behindOwnModem;
                });
            }

            initCategories() {
                let promise = this.watchLaterData.getCategories()
                    .then(
                        categories => {
                            this.categories = this.augmentCategories(categories);
                            this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                        },
                        () => {
                            this.categories = [];
                            this.alert.open({
                                message: this.errorCodesService.getMessageForCode('WGE-1001')
                            });


                        }
                    );

                this.$timeout(() => this.$rootScope.$broadcast(
                    'message:loading',
                    promise,
                    undefined,
                    'My Library'
                ));
            }

            augmentCategories(categories) {
                return categories.map(c => {
                    if (c.context == 'inProgress') {
                        c.enableRemove = true;
                        c.onRemove = (asset) => {
                            this.BookmarkService.deleteFromInProgressList(asset).catch(() => {
                                this.$rootScope.$broadcast('message:growl',
                                    this.errorCodesService.getMessageForCode('WWL-1001'));
                            });
                        };
                        c.onClear = this.BookmarkService.clearInProgressList;
                        c.enableOOW = true;
                    } else if (c.context == 'saved') {
                        c.enableRemove = true;
                        c.onRemove = (asset) => {
                            this.BookmarkService.deleteFromWatchLater(asset).catch(() => {
                                this.$rootScope.$broadcast('message:growl',
                                    this.errorCodesService.getMessageForCode('WWL-1001', {
                                    TITLE: asset.title
                                }));
                            });
                        };
                        c.onClear = this.BookmarkService.clearWatchLater;
                        c.enableOOW = true;
                    } else if (c.context == 'rented') {
                        c.enableRemove = false;
                        c.enableOOW = true;
                    }

                    return c;
                });
            }
        }
    });
}());
