(function () {
    'use strict';
    angular.module('ovpApp.product.movie', [
        'ovpApp.config',
        'ovpApp.directives.carousel',
        'ovpApp.directives.person',
        'ovpApp.directives.fallbackImage',
        'ovpApp.components.ovp.rating',
        'ovpApp.components.fancy-ratings',
        'ovpApp.services.locationService',
        'ovpApp.dataDelegate',
        'ovpApp.search.searchService',
        'ovpApp.product.actionMenu',
        'ovpApp.product.info',
        'ovpApp.product.otherWays',
        'ovpApp.product.productActionService',
        'ovpApp.product.focusRestore',
        'ovpApp.messages',
        'ovpApp.services.parentalControlsService',
        'ovpApp.services.dateFormat',
        'ui.router',
        'ovpApp.playerControls',
        'ovpApp.components.modal'
    ])
    .component('productMovie', {
        bindings: {
            fetcher: '<', // Method for fetching the movie. Used if a refresh is needed
            movie: '<',
            blocked: '<',
            cameFromWatchLater: '<'
        },
        templateUrl: '/js/ovpApp/product/product-movie.html',
        controller: class ProductMovie {
            constructor(messages, $scope, $rootScope, $state, productService, locationService, $q) {
                angular.extend(this, {messages, $scope, $rootScope, $state, productService, locationService, $q});
            }

            $onInit() {
                this.$rootScope.$emit('ovp:setPageTitle', this.movie.title);

                this.entitled = this.movie.isEntitled !== false;
                this.deregister = [];

                this.initParentalControls();
                this.initOoh();

                this.deregister.push(this.$scope.$on('update-dvr',
                    (event, schedule, asset, action) => {
                        this.actionExecuting(asset, action);
                    }
                ));

                // Focus action button if navigating back from trailer playback
                if (this.$state.previous && this.$state.previous.name === 'ovp.ondemand.playProduct') {
                    let isTrailer = this.$state.previous.fromParams.trailer === 'true';
                    this.movie.actions.forEach(action => {
                        if (isTrailer && action.actionType.startsWith('watchTrailer')) {
                            action.focus = true;
                        }
                    });
                }

                this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
            }

            $onDestroy() {
                this.deregister.forEach(d => d());
            }

            initParentalControls() {
                this.deregister.push(this.$rootScope.$on('ParentalControls:updated',
                    () => this.updateBlocked()));
            }

            initOoh() {
                this.locationService.getLocation().then((location) => {
                    this.oohUnavailable = !location.behindOwnModem && !this.movie.availableOutOfHome;
                });

                this.deregister.push(this.$scope.$on('LocationService:locationChanged', (event, location) => {
                    this.oohUnavailable = !location.behindOwnModem && !this.movie.availableOutOfHome;
                }));
            }

            updateBlocked() {
                this.movie.isBlocked.then(isBlocked => this.blocked = isBlocked);
            }


            actionExecuting(asset, action) {
                if (this.fetcher) {
                    const waitForFresh = true;
                    const promise = this.$q.when(this.fetcher(waitForFresh))
                        .then(asset => {
                            this.movie = asset;
                            // Focus fist action after performing action
                            if (this.movie.actions) {
                                this.movie.actions[0].focus = true;
                            }
                        });
                    this.$scope.$broadcast('product:update-started', asset, action, promise);
                }
            }

            availabilityMessage() {
                return this.productService.availabilityMessage(this.movie, this.cameFromWatchLater) || '';
            }

            getSectionAriaLabel() {
                return this.movie.title + ', ' + this.movie.year + ', ' +
                    this.movie.rating + ', ' + this.movie.actorsString + ', ' +
                    this.availabilityMessage() + ', ' + this.movie.longDescription ;
            }

        }
    });
})();
