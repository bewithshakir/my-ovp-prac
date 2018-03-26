(function () {
    'use strict';

    /**
     * featureTourSlide
     *
     * Example Usage:
     * <feature-tour-slide slide="someInputSlide" image-on-left="trueOrFalse"></feature-tour-slide>
     *
     * Bindings:
     *    slide: ([type]) Data for the individual slide
     *    imageOnLeft: ([type]) If true, the image will be displayed on the left and the text on the right.
     */
    angular.module('ovpApp.featureTour.slide', [
        ])
        .component('featureTourSlide', {
            bindings: {
                slide: '<',
                imageOnLeft: '<'
            },
            templateUrl: '/js/ovpApp/feature-tour/feature-tour-slide.html',
            controller: class FeatureTourSlide {
                /* @ngInject */
                constructor(config) {
                    angular.extend(this, {config});
                }

                $onInit() {
                    this.artOrigin = this.config.piHost;
                }
            }
        });
})();
