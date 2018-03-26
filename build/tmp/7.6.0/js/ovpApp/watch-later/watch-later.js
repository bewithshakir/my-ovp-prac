'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.watchlater', ['ovpApp.messages', 'ovpApp.directives.carousel', 'ovpApp.directives.product', 'ovpApp.services.nns', 'ovpApp.services.bookmark', 'ovpApp.watchlater.data', 'ovpApp.watchlater.router', 'ovpApp.services.homePage', 'ovpApp.services.locationService', 'ui.router', 'ovpApp.services.parentalControlsService', 'ovpApp.components.alert', 'ovpApp.components.ovp.clickConfirm', 'ovpApp.services.errorCodes']).component('myLibrary', {
        templateUrl: '/js/ovpApp/watch-later/watch-later.html',
        controller: (function () {
            /* @ngInject */

            WatchLaterPage.$inject = ["$scope", "BookmarkService", "$rootScope", "$controller", "locationService", "watchLaterData", "$window", "$log", "$q", "$timeout", "alert", "messages", "$state", "errorCodesService"];
            function WatchLaterPage($scope, BookmarkService, $rootScope, $controller, locationService, watchLaterData, $window, $log, $q, $timeout, alert, messages, $state, errorCodesService) {
                _classCallCheck(this, WatchLaterPage);

                angular.extend(this, { $scope: $scope, BookmarkService: BookmarkService, $rootScope: $rootScope, $controller: $controller, locationService: locationService,
                    watchLaterData: watchLaterData, $window: $window, $log: $log, $q: $q, $timeout: $timeout, alert: alert, messages: messages, $state: $state, errorCodesService: errorCodesService });
            }

            _createClass(WatchLaterPage, [{
                key: '$onInit',
                value: function $onInit() {
                    this.alert = '';

                    this.initOOH();

                    this.initCategories();
                }
            }, {
                key: 'getItems',
                value: function getItems(category) {
                    var _this = this;

                    if (category.context !== 'inProgress') {
                        return category.media;
                    } else {
                        var filtered = category.media.filter(function (asset) {
                            return !_this.isUnrentedTvodAsset(asset);
                        });

                        // Need to return a saved copy in order to prevent infinite digest
                        if (!this.filteredInProgressItems || this.filteredInProgressItems.length != filtered.length) {
                            this.filteredInProgressItems = filtered;
                        }
                        return this.filteredInProgressItems;
                    }
                }
            }, {
                key: 'hasNoContent',
                value: function hasNoContent() {
                    return this.categories && (this.categories.length === 0 || this.categories.reduce(function (val, category) {
                        return val + category.media.length;
                    }, 0) === 0);
                }

                //////////////////////

            }, {
                key: 'isUnrentedTvodAsset',
                value: function isUnrentedTvodAsset(asset) {
                    return !asset.isSeries && asset.streamList && asset.streamList.every(this.isUnrentedTvodStream);
                }
            }, {
                key: 'isUnrentedTvodStream',
                value: function isUnrentedTvodStream(stream) {
                    return stream.type === 'ONLINE_ONDEMAND' && stream.streamProperties.price > 0 && !stream.streamProperties.tvodEntitlement;
                }
            }, {
                key: 'initOOH',
                value: function initOOH() {
                    var _this2 = this;

                    this.locationService.getLocation().then(function (location) {
                        _this2.ooh = !location.behindOwnModem;
                    });

                    this.$scope.$on('LocationService:locationChanged', function (event, location) {
                        _this2.ooh = !location.behindOwnModem;
                    });
                }
            }, {
                key: 'initCategories',
                value: function initCategories() {
                    var _this3 = this;

                    var promise = this.watchLaterData.getCategories().then(function (categories) {
                        _this3.categories = _this3.augmentCategories(categories);
                        _this3.$rootScope.$broadcast('pageChangeComplete', _this3.$state.current);
                    }, function () {
                        _this3.categories = [];
                        _this3.alert.open({
                            message: _this3.errorCodesService.getMessageForCode('WGE-1001')
                        });
                    });

                    this.$timeout(function () {
                        return _this3.$rootScope.$broadcast('message:loading', promise, undefined, 'My Library');
                    });
                }
            }, {
                key: 'augmentCategories',
                value: function augmentCategories(categories) {
                    var _this4 = this;

                    return categories.map(function (c) {
                        if (c.context == 'inProgress') {
                            c.enableRemove = true;
                            c.onRemove = function (asset) {
                                _this4.BookmarkService.deleteFromInProgressList(asset)['catch'](function () {
                                    _this4.$rootScope.$broadcast('message:growl', _this4.errorCodesService.getMessageForCode('WWL-1001'));
                                });
                            };
                            c.onClear = _this4.BookmarkService.clearInProgressList;
                            c.enableOOW = true;
                        } else if (c.context == 'saved') {
                            c.enableRemove = true;
                            c.onRemove = function (asset) {
                                _this4.BookmarkService.deleteFromWatchLater(asset)['catch'](function () {
                                    _this4.$rootScope.$broadcast('message:growl', _this4.errorCodesService.getMessageForCode('WWL-1001', {
                                        TITLE: asset.title
                                    }));
                                });
                            };
                            c.onClear = _this4.BookmarkService.clearWatchLater;
                            c.enableOOW = true;
                        } else if (c.context == 'rented') {
                            c.enableRemove = false;
                            c.enableOOW = true;
                        }

                        return c;
                    });
                }
            }]);

            return WatchLaterPage;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/watch-later/watch-later.js.map
