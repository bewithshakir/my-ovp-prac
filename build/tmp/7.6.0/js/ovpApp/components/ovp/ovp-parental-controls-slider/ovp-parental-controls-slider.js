'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.components.ovpParentalControlsSlider', ['ovpApp.services.parentalControlsService']).component('ovpParentalControlsSlider', {
        bindings: {
            ratings: '<',
            currentRating: '=', /*current rating is the highest unblocked rating*/
            disabled: '<',
            enableCallback: '<',
            label: '<'
        },
        templateUrl: '/js/ovpApp/components/ovp/ovp-parental-controls-slider/ovp-parental-controls-slider.html',
        controller: (function () {
            /* @ngInject */

            RatingsSlider.$inject = ["$q", "$rootScope", "parentalControlsService"];
            function RatingsSlider($q, $rootScope, parentalControlsService) {
                _classCallCheck(this, RatingsSlider);

                angular.extend(this, { $q: $q, $rootScope: $rootScope, parentalControlsService: parentalControlsService });
            }

            _createClass(RatingsSlider, [{
                key: '$onInit',
                value: function $onInit() {
                    this.pcDisabled = false;
                    this.updatePcDisabled();
                    this.$rootScope.$on('ParentalControls:updated', this.updatePcDisabled.bind(this));
                }
            }, {
                key: 'updatePcDisabled',
                value: function updatePcDisabled() {
                    var _this = this;

                    this.parentalControlsService.isParentalControlsDisabledForClient().then(function (isDisabled) {
                        return _this.pcDisabled = isDisabled;
                    });
                }
            }, {
                key: 'ratingClicked',
                value: function ratingClicked(rating) {
                    if (!this.disabled) {
                        if (this.getIndexOfRating(this.currentRating) >= this.getIndexOfRating(rating)) {
                            // user clicked on unblocked rating
                            // current rating, which is highest unblocked rating, is -1 of rating.
                            var i = this.getIndexOfRating(rating);
                            this.currentRating = this.ratings[i - 1] || '';
                        } else {
                            // user clicked on blocked
                            this.currentRating = rating;
                        }
                    }
                }
            }, {
                key: 'ratingIsBlocked',
                value: function ratingIsBlocked(testRating) {
                    return this.getIndexOfRating(testRating) > this.getIndexOfRating(this.currentRating);
                }
            }, {
                key: 'getIndexOfRating',
                value: function getIndexOfRating(testRating) {
                    if (!testRating) {
                        return -1;
                    }
                    for (var i = 0; i < this.ratings.length; i++) {
                        if (testRating === this.ratings[i]) {
                            return i;
                        }
                    }
                }
            }, {
                key: 'currentDescription',
                value: function currentDescription() {
                    var caveat = '';
                    var tense = 'are';
                    if (this.pcDisabled) {
                        caveat = ', if you enable parental controls';
                        tense = 'will be';
                    }

                    if (this.currentRating) {
                        return this.currentRating + ' and lower ' + tense + ' allowed ' + caveat;
                    } else {
                        return 'all ratings ' + tense + ' blocked ' + caveat;
                    }
                }
            }, {
                key: 'onKeydown',
                value: function onKeydown(event) {
                    var _this2 = this;

                    if (event.ctrlKey || event.shiftKey || event.altKey) {
                        return true;
                    }

                    var keys = {
                        end: 35,
                        home: 36,
                        left: 37,
                        up: 38,
                        down: 39,
                        right: 40
                    };

                    var index = this.getIndexOfRating(this.currentRating);

                    if (event.keyCode >= keys.end && event.keyCode <= keys.right) {
                        event.preventDefault();

                        var enabledPromise = undefined;
                        if (this.disabled) {
                            enabledPromise = this.enableCallback ? this.enableCallback() || this.$q.resolve() : this.$q.reject();
                        } else {
                            enabledPromise = this.$q.resolve();
                        }

                        enabledPromise.then(function () {
                            if (event.keyCode == keys.left || event.keyCode == keys.up) {
                                _this2.currentRating = _this2.ratings[index - 1];
                            } else if (event.keyCode == keys.right || event.keyCode == keys.down) {
                                _this2.currentRating = _this2.ratings[Math.min(index + 1, _this2.ratings.length - 1)];
                            } else if (event.keyCode == keys.home) {
                                _this2.currentRating = undefined;
                            } else if (event.keyCode == keys.end) {
                                _this2.currentRating = _this2.ratings[_this2.ratings.length - 1];
                            }
                        });
                    }
                }
            }]);

            return RatingsSlider;
        })()
    });
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/components/ovp/ovp-parental-controls-slider/ovp-parental-controls-slider.js.map
