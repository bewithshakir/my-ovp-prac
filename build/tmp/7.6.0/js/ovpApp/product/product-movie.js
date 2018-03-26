'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.product.movie', ['ovpApp.config', 'ovpApp.directives.carousel', 'ovpApp.directives.person', 'ovpApp.directives.fallbackImage', 'ovpApp.components.ovp.rating', 'ovpApp.components.fancy-ratings', 'ovpApp.services.locationService', 'ovpApp.dataDelegate', 'ovpApp.search.searchService', 'ovpApp.product.actionMenu', 'ovpApp.product.info', 'ovpApp.product.otherWays', 'ovpApp.product.productActionService', 'ovpApp.product.focusRestore', 'ovpApp.messages', 'ovpApp.services.parentalControlsService', 'ovpApp.services.dateFormat', 'ui.router', 'ovpApp.playerControls', 'ovpApp.components.modal']).component('productMovie', {
        bindings: {
            fetcher: '<', // Method for fetching the movie. Used if a refresh is needed
            movie: '<',
            blocked: '<',
            cameFromWatchLater: '<'
        },
        templateUrl: '/js/ovpApp/product/product-movie.html',
        controller: (function () {
            ProductMovie.$inject = ["messages", "$scope", "$rootScope", "$state", "productService", "locationService", "$q"];
            function ProductMovie(messages, $scope, $rootScope, $state, productService, locationService, $q) {
                _classCallCheck(this, ProductMovie);

                angular.extend(this, { messages: messages, $scope: $scope, $rootScope: $rootScope, $state: $state, productService: productService, locationService: locationService, $q: $q });
            }

            _createClass(ProductMovie, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.$rootScope.$emit('ovp:setPageTitle', this.movie.title);

                    this.entitled = this.movie.isEntitled !== false;
                    this.deregister = [];

                    this.initParentalControls();
                    this.initOoh();

                    this.deregister.push(this.$scope.$on('update-dvr', function (event, schedule, asset, action) {
                        _this.actionExecuting(asset, action);
                    }));

                    // Focus action button if navigating back from trailer playback
                    if (this.$state.previous && this.$state.previous.name === 'ovp.ondemand.playProduct') {
                        (function () {
                            var isTrailer = _this.$state.previous.fromParams.trailer === 'true';
                            _this.movie.actions.forEach(function (action) {
                                if (isTrailer && action.actionType.startsWith('watchTrailer')) {
                                    action.focus = true;
                                }
                            });
                        })();
                    }

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
                        _this3.oohUnavailable = !location.behindOwnModem && !_this3.movie.availableOutOfHome;
                    });

                    this.deregister.push(this.$scope.$on('LocationService:locationChanged', function (event, location) {
                        _this3.oohUnavailable = !location.behindOwnModem && !_this3.movie.availableOutOfHome;
                    }));
                }
            }, {
                key: 'updateBlocked',
                value: function updateBlocked() {
                    var _this4 = this;

                    this.movie.isBlocked.then(function (isBlocked) {
                        return _this4.blocked = isBlocked;
                    });
                }
            }, {
                key: 'actionExecuting',
                value: function actionExecuting(asset, action) {
                    var _this5 = this;

                    if (this.fetcher) {
                        var waitForFresh = true;
                        var promise = this.$q.when(this.fetcher(waitForFresh)).then(function (asset) {
                            _this5.movie = asset;
                            // Focus fist action after performing action
                            if (_this5.movie.actions) {
                                _this5.movie.actions[0].focus = true;
                            }
                        });
                        this.$scope.$broadcast('product:update-started', asset, action, promise);
                    }
                }
            }, {
                key: 'availabilityMessage',
                value: function availabilityMessage() {
                    return this.productService.availabilityMessage(this.movie, this.cameFromWatchLater) || '';
                }
            }, {
                key: 'getSectionAriaLabel',
                value: function getSectionAriaLabel() {
                    return this.movie.title + ', ' + this.movie.year + ', ' + this.movie.rating + ', ' + this.movie.actorsString + ', ' + this.availabilityMessage() + ', ' + this.movie.longDescription;
                }
            }]);

            return ProductMovie;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/product/product-movie.js.map
