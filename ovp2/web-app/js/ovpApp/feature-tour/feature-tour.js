(function () {
    'use strict';

    /**
     * featureTour
     *
     * Example Usage:
     * <feature-tour></feature-tour>
     *
     */
    angular.module('ovpApp.featureTour', [
        'ovpApp.featureTour.slide',
        'ovpApp.config',
        'ngSanitize'])
    .directive('scrollToSlides', scrollToSlides)
    .component('featureTour', {
        bindings: {
        },
        templateUrl: '/js/ovpApp/feature-tour/feature-tour.html',
        controller: class FeatureTour {
            /* @ngInject */
            constructor(config) {
                angular.extend(this, {config});
            }

            $onInit() {
                this.slides = this.config.featureTourSlides;
            }

            hasSlides() {
                return this.slides && angular.isArray(this.slides) && this.slides.length > 0;
            }
        }
    });

    /* @ngInject */
    function scrollToSlides($document) {
        return {
            restrict: 'A',
            link: function (scope, $elm) {
                $elm.on('click', function () {
                    angular.element('html,body').
                        animate({scrollTop: angular.element($document.find('#tour-slides'))
                            .offset().top}, 'slow');
                });
            }
        };
    }
})();
