'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.settings.favorites', ['ovpApp.settings.favoriteCard', 'ovpApp.services.epgsService', 'ovpApp.services.favoritesService', 'ovpApp.config', 'ovpApp.directives.arrowNav', 'ovpApp.services.profileService']).component('favorites', {
        bindings: {
            channels: '<'
        },
        templateUrl: '/js/ovpApp/settings/favorites/favorites.html',
        controller: (function () {
            /* @ngInject */

            FavoritesController.$inject = ["$scope", "epgsService", "$window", "$element", "favoritesService", "profileService", "config", "$q", "$rootScope", "$state", "$timeout"];
            function FavoritesController($scope, epgsService, $window, $element, favoritesService, profileService, config, $q, $rootScope, $state, $timeout) {
                _classCallCheck(this, FavoritesController);

                angular.extend(this, {
                    $scope: $scope, epgsService: epgsService, $window: $window, $element: $element,
                    favoritesService: favoritesService, profileService: profileService, config: config, $q: $q, $rootScope: $rootScope, $state: $state, $timeout: $timeout
                });
            }

            _createClass(FavoritesController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.isSpecU = this.profileService.isSpecU();
                    this.callSignFilter = null;
                    this.searchValue = '';
                    this.$scope.$watch(function () {
                        return _this.searchValue;
                    }, function (nv) {
                        if (nv) {
                            if (isFinite(nv) && !_this.isSpecU) {
                                _this.callSignFilter = null;
                                _this.$timeout(function () {
                                    return _this.jumpToChannel(parseInt(nv), 0, false);
                                });
                            } else {
                                _this.callSignFilter = new RegExp(nv, 'i');
                            }
                        } else {
                            _this.callSignFilter = null;
                        }
                        _this.onFilterChanged();
                    });

                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }
            }, {
                key: '$postLink',
                value: function $postLink() {
                    var _this2 = this;

                    // To improve load performance, we start by displaying only the channels that will be on screen
                    var cardWidth = 300;
                    var cardHeight = 70;
                    var container = this.$element.find('#favoritesListContent');
                    var perRow = Math.max(1, Math.floor(container.width() / cardWidth));
                    // The container doesn't have a height until it has contents, so we approximate by using the
                    //   window height. this will result in a couple extra rows, but is close enough
                    var rows = Math.ceil(this.$window.innerHeight / cardHeight);
                    this.limit = rows * perRow;
                    this.onFilterChanged();
                    this.$timeout().then(function () {
                        _this2.limit = undefined;
                        _this2.onFilterChanged();
                    });
                }
            }, {
                key: 'sortFilter',
                value: function sortFilter(a, b, isSpecU) {
                    if (!isSpecU) {
                        return a.channelNumber - b.channelNumber;
                    } else {
                        return a.networkName < b.networkName ? -1 : 1;
                    }
                }
            }, {
                key: 'onFilterChanged',
                value: function onFilterChanged() {
                    var _this3 = this;

                    this.filteredChannels = this.channels.filter(function (channel) {
                        return !_this3.callSignFilter || channel.callSign.match(_this3.callSignFilter);
                    }).sort(function (a, b) {
                        return _this3.sortFilter(a, b, _this3.isSpecU);
                    });
                    if (this.limit !== undefined) {
                        this.filteredChannels = this.filteredChannels.slice(0, this.limit);
                    }
                }
            }, {
                key: 'isEntitled',
                value: function isEntitled(channel) {
                    return channel.twcTvEntitled;
                }
            }, {
                key: 'jumpToChannel',
                value: function jumpToChannel(searchVal) {
                    var channel = 0,
                        scrollTo = 0,
                        scrollAt = angular.element('body').scrollTop(),
                        domBlock;

                    if (!isNaN(searchVal)) {
                        // find the nearest channel without going over
                        var diff = searchVal;
                        for (var i = 0; i < this.channels.length; i = i + 1) {
                            var chnl = this.channels[i].channelNumber || 0,
                                newDiff = searchVal - chnl;
                            if (newDiff >= 0 && newDiff <= diff) {
                                channel = chnl;
                                diff = newDiff;
                            }
                            if (newDiff === 0) {
                                break; // channel found
                            }
                        }

                        if (channel > 0) {
                            domBlock = this.$window.document.querySelector('#channel' + channel);
                            if (domBlock) {
                                scrollTo = domBlock.offsetTop;

                                if (scrollTo < 0) {
                                    // scroll up
                                    scrollTo += scrollAt;
                                }

                                angular.element('html, body').animate({
                                    scrollTop: scrollTo
                                }, 600, 'swing', function () {
                                    domBlock.focus();
                                });
                            }
                        }
                    }
                }
            }, {
                key: 'cancelSearch',
                value: function cancelSearch() {
                    this.searchValue = '';
                }
            }]);

            return FavoritesController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/settings/favorites/favorites.js.map
