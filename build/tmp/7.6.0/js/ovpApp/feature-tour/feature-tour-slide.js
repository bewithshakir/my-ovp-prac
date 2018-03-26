'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
    angular.module('ovpApp.featureTour.slide', []).component('featureTourSlide', {
        bindings: {
            slide: '<',
            imageOnLeft: '<'
        },
        templateUrl: '/js/ovpApp/feature-tour/feature-tour-slide.html',
        controller: (function () {
            /* @ngInject */

            FeatureTourSlide.$inject = ["config"];
            function FeatureTourSlide(config) {
                _classCallCheck(this, FeatureTourSlide);

                angular.extend(this, { config: config });
            }

            _createClass(FeatureTourSlide, [{
                key: '$onInit',
                value: function $onInit() {
                    this.artOrigin = this.config.piHost;
                }
            }]);

            return FeatureTourSlide;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/feature-tour/feature-tour-slide.js.map
