(function () {
    'use strict';

    angular.module('ovpApp.components.ovpParentalControlsSlider', ['ovpApp.services.parentalControlsService'])
    .component('ovpParentalControlsSlider', {
        bindings: {
            ratings: '<',
            currentRating: '=', /*current rating is the highest unblocked rating*/
            disabled: '<',
            enableCallback: '<',
            label: '<'
        },
        templateUrl: '/js/ovpApp/components/ovp/ovp-parental-controls-slider/ovp-parental-controls-slider.html',
        controller: class RatingsSlider {
            /* @ngInject */
            constructor($q, $rootScope, parentalControlsService) {
                angular.extend(this, {$q, $rootScope, parentalControlsService});
            }

            $onInit() {
                this.pcDisabled = false;
                this.updatePcDisabled();
                this.$rootScope.$on('ParentalControls:updated', this.updatePcDisabled.bind(this));
            }

            updatePcDisabled() {
                this.parentalControlsService.isParentalControlsDisabledForClient()
                    .then(isDisabled => this.pcDisabled = isDisabled);
            }

            ratingClicked(rating) {
                if (!this.disabled) {
                    if (this.getIndexOfRating(this.currentRating) >= this.getIndexOfRating(rating)) {
                        // user clicked on unblocked rating
                        // current rating, which is highest unblocked rating, is -1 of rating.
                        let i = this.getIndexOfRating(rating);
                        this.currentRating = this.ratings[i - 1] || '';
                    } else {
                        // user clicked on blocked
                        this.currentRating = rating;
                    }
                }
            }

            ratingIsBlocked(testRating) {
                return this.getIndexOfRating(testRating) > this.getIndexOfRating(this.currentRating);
            }

            getIndexOfRating(testRating) {
                if (!testRating) {
                    return -1;
                }
                for (let i = 0; i < this.ratings.length; i++) {
                    if (testRating === this.ratings[i]) {
                        return i;
                    }
                }
            }

            currentDescription() {
                let caveat = '';
                let tense = 'are';
                if (this.pcDisabled) {
                    caveat = ', if you enable parental controls';
                    tense = 'will be';
                }

                if (this.currentRating) {
                    return `${this.currentRating} and lower ${tense} allowed ${caveat}`;
                } else {
                    return `all ratings ${tense} blocked ${caveat}`;
                }
            }

            onKeydown(event) {
                if (event.ctrlKey || event.shiftKey || event.altKey) {
                    return true;
                }

                const keys = {
                    end: 35,
                    home: 36,
                    left: 37,
                    up: 38,
                    down: 39,
                    right: 40
                };

                let index = this.getIndexOfRating(this.currentRating);

                if (event.keyCode >= keys.end && event.keyCode <= keys.right) {
                    event.preventDefault();

                    let enabledPromise;
                    if (this.disabled) {
                        enabledPromise = this.enableCallback ?
                            this.enableCallback() || this.$q.resolve() : this.$q.reject();
                    } else {
                        enabledPromise = this.$q.resolve();
                    }

                    enabledPromise.then(() => {
                        if (event.keyCode == keys.left || event.keyCode == keys.up) {
                            this.currentRating = this.ratings[index - 1];
                        } else if (event.keyCode == keys.right || event.keyCode == keys.down) {
                            this.currentRating = this.ratings[Math.min(index + 1, this.ratings.length - 1)];
                        } else if (event.keyCode == keys.home) {
                            this.currentRating = undefined;
                        } else if (event.keyCode == keys.end) {
                            this.currentRating = this.ratings[this.ratings.length - 1];
                        }

                    });
                }
            }
        }
    });

}());
