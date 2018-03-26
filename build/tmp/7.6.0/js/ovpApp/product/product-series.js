'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.product.series', ['ovpApp.config', 'ovpApp.directives.carousel', 'ovpApp.directives.person', 'ovpApp.services.locationService', 'ovpApp.directives.affix', 'ovpApp.directives.focus', 'ovpApp.product.productActionService', 'ovpApp.dataDelegate', 'ovpApp.messages', 'ovpApp.services.parentalControlsService', 'ovpApp.services.dateFormat', 'ovpApp.product.episodes', 'ovpApp.product.focusRestore', 'ui.router']).component('productSeries', {
        bindings: {
            fetcher: '<', // Method for fetching the series. Used if a refresh is needed
            series: '<',
            blocked: '<',
            cameFromWatchLater: '<'
        },
        templateUrl: '/js/ovpApp/product/product-series.html',
        controller: (function () {
            ProductSeries.$inject = ["$scope", "$rootScope", "$state", "searchService", "productService", "delegateFactory", "productFocusRestore", "locationService", "$q", "$timeout"];
            function ProductSeries($scope, $rootScope, $state, searchService, productService, delegateFactory, productFocusRestore, locationService, $q, $timeout) {
                _classCallCheck(this, ProductSeries);

                angular.extend(this, { $scope: $scope, $rootScope: $rootScope, $state: $state, searchService: searchService, productService: productService,
                    delegateFactory: delegateFactory, productFocusRestore: productFocusRestore, locationService: locationService, $q: $q, $timeout: $timeout });
            }

            _createClass(ProductSeries, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.entitled = this.series.isEntitled !== false;
                    this.deregister = [];

                    this.initParentalControls();
                    this.initOoh();
                    this.deregister.push(this.$scope.$on('update-dvr', function (event, schedule, asset, action) {
                        _this.actionExecuting(asset, action);
                    }));

                    this.onUpdateData();
                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.deregister.forEach(function (d) {
                        return d();
                    });
                }
            }, {
                key: 'onUpdateData',
                value: function onUpdateData() {
                    if (this.series.episodesAvailable <= 0) {
                        this.activateTab('info', null, 'application');
                    }

                    this.$rootScope.$emit('ovp:setPageTitle', this.series.title);
                }
            }, {
                key: 'initParentalControls',
                value: function initParentalControls() {
                    var _this2 = this;

                    this.deregister.push(this.$rootScope.$on('ParentalControls:updated', function () {
                        return _this2.updateBlocked();
                    }));
                }
            }, {
                key: 'initOoh',
                value: function initOoh() {
                    var _this3 = this;

                    this.locationService.getLocation().then(function (location) {
                        _this3.ooh = !location.behindOwnModem;
                        _this3.oohUnavailable = _this3.ooh && !_this3.series.availableOutOfHome;
                    });

                    this.deregister.push(this.$scope.$on('LocationService:locationChanged', function (event, location) {
                        _this3.ooh = !location.behindOwnModem;
                        _this3.oohUnavailable = _this3.ooh && !_this3.series.availableOutOfHome;
                    }));
                }
            }, {
                key: 'updateBlocked',
                value: function updateBlocked() {
                    var _this4 = this;

                    this.series.isBlocked.then(function (isBlocked) {
                        return _this4.blocked = isBlocked;
                    });
                }
            }, {
                key: 'isOnTab',
                value: function isOnTab(tabName) {
                    return this.$state.includes('product.series.' + tabName);
                }
            }, {
                key: 'actionExecuting',
                value: function actionExecuting(asset, action) {
                    var _this5 = this;

                    if (this.fetcher) {
                        var waitForFresh = true;
                        var promise = this.$q.when(this.fetcher(waitForFresh)).then(function (asset) {
                            _this5.series = asset;
                            _this5.onUpdateData();
                            // Focus first action after performing action
                            if (_this5.series.actions && asset.isSeries) {
                                _this5.series.actions[0].focus = true;
                            }
                        });

                        this.$scope.$broadcast('product:update-started', asset, action, promise);
                    }
                }
            }, {
                key: 'availabilityMessage',
                value: function availabilityMessage() {
                    return this.productService.availabilityMessage(this.series, this.cameFromWatchLater) || '';
                }
            }, {
                key: 'activateTab',
                value: function activateTab(tab, evt) {
                    var _this6 = this;

                    var triggeredBy = arguments.length <= 2 || arguments[2] === undefined ? 'user' : arguments[2];

                    var activeTab = 'product.series.episodes';

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

                    if (tab === 'episodes' && this.series.episodesAvailable <= 0) {
                        // set state to 'info' in case
                        // episodes are not available
                        activeTab = 'product.series.info';
                    }

                    this.$state.go(activeTab, {}, {
                        location: 'replace'
                    }).then(function () {
                        return _this6.$rootScope.$emit('ovp:setPageTitle', _this6.series.title);
                    });
                }
            }, {
                key: 'getSectionAriaLabel',
                value: function getSectionAriaLabel() {
                    return this.series.title + ', ' + this.series.episodesAvailable + ' episodes' + ', ' + this.availabilityMessage() + ', ' + this.series.description.long;
                }
            }]);

            return ProductSeries;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/product/product-series.js.map
