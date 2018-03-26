(function () {
    'use strict';

    /**
     * fancyRatings
     *
     * Displays metacritic or common sense media rating
     *
     * Example Usage:
     * <fancy-ratings rating="someInputValue" type="metacritic"></fancy-ratings>
     *
     * Bindings:
     *    rating: (Number) numerical rating
     *    type: (String) 'metacritic' or 'common-sense-media'
     *    height: (Number) Height in pixels of the images. Defaults to 48
     */
    angular.module('ovpApp.components.fancy-ratings', ['ovpApp.config'])
        .component('fancyRatings', {
            bindings: {
                rating: '<',
                type: '<',
                height: '<'
            },
            template: `
                <div class="$ctrl.type" ng-if="$ctrl.rating">
                   <img class="icon" ng-src="{{$ctrl.iconSrc}}" alt="$ctrl.labelText">
                   <img class="label" ng-src="{{$ctrl.labelSrc}}" alt="$ctrl.labelText">
                </div>`,
            controller: class FancyRatings {
                /* @ngInject */
                constructor(config) {
                    this.config = config;
                }

                $onChanges(changes) {
                    if (changes.height && this.height === undefined) {
                        this.height = 48;
                    }

                    if (changes.rating) {
                        if (this.type === 'metacritic') {
                            //Force this to a 3 digit string with leading 0s
                            this.rating = this.rating && (parseInt(this.rating) + 1000).toString().substring(1);
                        } else if (this.type === 'common-sense-media') {
                            //Force to a 2 digit string
                            this.rating = this.rating && (parseInt(this.rating) + 100).toString().substring(1);
                        }
                    }

                    if (changes.type || changes.height) {
                        this.iconSrc = this.calculateIconSrc();
                    }

                    if (changes.type || changes.height || changes.rating) {
                        this.labelSrc = this.calculateLabelSrc();
                    }
                }

                calculateIconSrc() {
                    const baseUrl = this.config.image_api + '/supporting';
                    const prefix = this.getImagePrefix();

                    return `${baseUrl}?image=${prefix}logo-mini&height=${this.height}`;
                }

                calculateLabelSrc() {
                    const baseUrl = this.config.image_api + '/supporting';
                    const prefix = this.getImagePrefix();

                    return `${baseUrl}?image=${prefix}${this.rating}&height=${this.height}`;
                }

                getImagePrefix() {
                    if (this.type === 'common-sense-media') {
                        return 'cs-';
                    } else if (this.type === 'metacritic') {
                        return 'mc-';
                    }
                }
            }
        });
})();
