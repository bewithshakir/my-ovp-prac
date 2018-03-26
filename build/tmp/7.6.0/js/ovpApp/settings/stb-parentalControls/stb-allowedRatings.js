'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.allowedRatings', ['ovpApp.directives.dropdownList', 'ovpApp.services.stbSettingsService', 'ovpApp.directives.arrowNav', 'ovpApp.services.parentalControlsService']).component('stbAllowedRatings', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-allowedRatings.html',
        bindings: {
            'stb': '<',
            'blockedRatings': '<',
            'ratings': '<'
        },
        controller: (function () {
            /* @ngInject */

            StbAllowedRatingsController.$inject = ["StbSettingsService", "parentalControlsService"];
            function StbAllowedRatingsController(StbSettingsService, parentalControlsService) {
                _classCallCheck(this, StbAllowedRatingsController);

                angular.extend(this, { StbSettingsService: StbSettingsService, parentalControlsService: parentalControlsService });
            }

            _createClass(StbAllowedRatingsController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

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
                    this.ratings.forEach(function (rating) {
                        if (_this.parentalControlsService.isMovieRating(rating.toUpperCase())) {
                            _this.separatedRatings.movieRatings.push(rating);
                        } else {
                            _this.separatedRatings.tvRatings.push(rating);
                        }
                    });
                }
            }, {
                key: 'ratingClicked',
                value: function ratingClicked(rating) {
                    var _this2 = this;

                    var isBlocked = this.isRatingBlocked(rating);
                    this.updateBlockedRatings(rating, !isBlocked);
                    return this.StbSettingsService.updateBlockedRatings(this.stb, this.blockedRatings)['catch'](function () {
                        // Revert changes
                        _this2.updateBlockedRatings(rating, isBlocked);
                    }).then(function () {
                        _this2.alertmessage = 'Rating ' + rating + (isBlocked ? ', unblocked' : ', blocked');
                    });
                }

                /* Private method */
            }, {
                key: 'updateBlockedRatings',
                value: function updateBlockedRatings(rating, isBlocked) {
                    if (isBlocked) {
                        this.blockedRatings.push(rating);
                    } else {
                        this.blockedRatings.splice(this.blockedRatings.indexOf(rating), 1);
                    }
                }
            }, {
                key: 'isRatingBlocked',
                value: function isRatingBlocked(rating) {
                    return this.blockedRatings.includes(rating);
                }
            }]);

            return StbAllowedRatingsController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/settings/stb-parentalControls/stb-allowedRatings.js.map
