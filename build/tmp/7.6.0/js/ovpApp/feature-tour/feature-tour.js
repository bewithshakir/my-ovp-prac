'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    /**
     * featureTour
     *
     * Example Usage:
     * <feature-tour></feature-tour>
     *
     */
    scrollToSlides.$inject = ["$document"];
    angular.module('ovpApp.featureTour', ['ovpApp.featureTour.slide', 'ovpApp.config', 'ngSanitize']).directive('scrollToSlides', scrollToSlides).component('featureTour', {
        bindings: {},
        templateUrl: '/js/ovpApp/feature-tour/feature-tour.html',
        controller: (function () {
            /* @ngInject */

            FeatureTour.$inject = ["config"];
            function FeatureTour(config) {
                _classCallCheck(this, FeatureTour);

                angular.extend(this, { config: config });
            }

            _createClass(FeatureTour, [{
                key: '$onInit',
                value: function $onInit() {
                    this.slides = this.config.featureTourSlides;
                }
            }, {
                key: 'hasSlides',
                value: function hasSlides() {
                    return this.slides && angular.isArray(this.slides) && this.slides.length > 0;
                }
            }]);

            return FeatureTour;
        })()
    });

    /* @ngInject */
    function scrollToSlides($document) {
        return {
            restrict: 'A',
            link: function link(scope, $elm) {
                $elm.on('click', function () {
                    angular.element('html,body').animate({ scrollTop: angular.element($document.find('#tour-slides')).offset().top }, 'slow');
                });
            }
        };
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/feature-tour/feature-tour.js.map
