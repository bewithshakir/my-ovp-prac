(function () {
    'use strict';
    angular.module('ovpApp.settings.favorites', [
        'ovpApp.settings.favoriteCard',
        'ovpApp.services.epgsService',
        'ovpApp.services.favoritesService',
        'ovpApp.config',
        'ovpApp.directives.arrowNav',
        'ovpApp.services.profileService'
        ])
    .component('favorites', {
        bindings: {
            channels: '<'
        },
        templateUrl: '/js/ovpApp/settings/favorites/favorites.html',
        controller: class FavoritesController {
            /* @ngInject */
            constructor($scope, epgsService, $window, $element,
                    favoritesService, profileService, config, $q, $rootScope, $state, $timeout) {
                angular.extend(this, {
                    $scope, epgsService, $window, $element,
                    favoritesService, profileService, config, $q, $rootScope, $state, $timeout
                });
            }

            $onInit() {
                this.isSpecU = this.profileService.isSpecU();
                this.callSignFilter = null;
                this.searchValue = '';
                this.$scope.$watch(() => this.searchValue, nv => {
                    if (nv) {
                        if (isFinite(nv) && !this.isSpecU) {
                            this.callSignFilter = null;
                            this.$timeout(() => this.jumpToChannel(parseInt(nv), 0, false));
                        } else {
                            this.callSignFilter = new RegExp(nv, 'i');
                        }
                    } else {
                        this.callSignFilter = null;
                    }
                    this.onFilterChanged();
                });

                this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
            }

            $postLink() {
                // To improve load performance, we start by displaying only the channels that will be on screen
                const cardWidth = 300;
                const cardHeight = 70;
                const container = this.$element.find('#favoritesListContent');
                const perRow = Math.max(1, Math.floor(container.width() / cardWidth));
                // The container doesn't have a height until it has contents, so we approximate by using the
                //   window height. this will result in a couple extra rows, but is close enough
                const rows = Math.ceil(this.$window.innerHeight / cardHeight);
                this.limit = rows * perRow;
                this.onFilterChanged();
                this.$timeout().then(() => {
                    this.limit = undefined;
                    this.onFilterChanged();
                });
            }
            sortFilter(a, b, isSpecU) {
                if (!isSpecU) {
                    return a.channelNumber - b.channelNumber;
                } else {
                    return a.networkName < b.networkName ? -1 : 1;
                }
            }
            onFilterChanged() {
                this.filteredChannels = this.channels
                    .filter((channel) => !this.callSignFilter || channel.callSign.match(this.callSignFilter))
                    .sort((a, b) => this.sortFilter(a, b, this.isSpecU));
                if (this.limit !== undefined) {
                    this.filteredChannels = this.filteredChannels.slice(0, this.limit);
                }
            }

            isEntitled(channel) {
                return channel.twcTvEntitled;
            }

            jumpToChannel(searchVal) {
                var channel = 0,
                    scrollTo = 0,
                    scrollAt = angular.element('body').scrollTop(),
                    domBlock;

                if (!isNaN(searchVal)) {
                    // find the nearest channel without going over
                    let diff = searchVal;
                    for (let i = 0; i < this.channels.length; i = i + 1) {
                        let chnl = this.channels[i].channelNumber || 0,
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
                                scrollTop:  scrollTo
                            }, 600, 'swing', function () {
                                domBlock.focus();
                            });
                        }
                    }
                }
            }

            cancelSearch() {
                this.searchValue = '';
            }
        }
    });
}());
