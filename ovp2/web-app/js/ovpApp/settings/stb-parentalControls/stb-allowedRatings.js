(() => {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.allowedRatings', [
        'ovpApp.directives.dropdownList',
        'ovpApp.services.stbSettingsService',
        'ovpApp.directives.arrowNav',
        'ovpApp.services.parentalControlsService'])
    .component('stbAllowedRatings', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-allowedRatings.html',
        bindings: {
            'stb': '<',
            'blockedRatings': '<',
            'ratings': '<'
        },
        controller: class StbAllowedRatingsController {
            /* @ngInject */
            constructor(StbSettingsService, parentalControlsService) {
                angular.extend(this, {StbSettingsService, parentalControlsService});
            }

            $onInit() {
                this.alertmessage = '';
                this.ratingTypes = [{
                    id: 'tvRatings',
                    name: 'TV ratings'
                }, {
                    id: 'movieRatings',
                    name: 'movie ratings'
                }];
                this.blockedRatings = this.blockedRatings || [];

                this.separatedRatings = {
                    tvRatings: [],
                    movieRatings: []
                };
                this.ratings.forEach(rating => {
                    if (this.parentalControlsService.isMovieRating(rating.toUpperCase())) {
                        this.separatedRatings.movieRatings.push(rating);
                    } else {
                        this.separatedRatings.tvRatings.push(rating);
                    }
                });
            }

            ratingClicked(rating) {
                let isBlocked = this.isRatingBlocked(rating);
                this.updateBlockedRatings(rating, !isBlocked);
                return this.StbSettingsService.updateBlockedRatings(this.stb, this.blockedRatings).catch(() => {
                    // Revert changes
                    this.updateBlockedRatings(rating, isBlocked);
                }).then(() => {
                    this.alertmessage = 'Rating ' + rating + (isBlocked ? ', unblocked' : ', blocked');
                });
            }

            /* Private method */
            updateBlockedRatings(rating, isBlocked) {
                if (isBlocked) {
                    this.blockedRatings.push(rating);
                } else {
                    this.blockedRatings.splice(this.blockedRatings.indexOf(rating), 1);
                }
            }

            isRatingBlocked(rating) {
                return this.blockedRatings.includes(rating);
            }
        }
    });
})();
