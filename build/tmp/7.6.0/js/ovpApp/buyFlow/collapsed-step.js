'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.buyFlow.collapsedStep', []).component('collapsedStep', {
        bindings: {
            stepNumber: '<',
            stepNumberClass: '<',
            itemBodyClass: '<',
            title: '<stepTitle',
            regularCaption: '<',
            boldCaption: '<',
            price: '<',
            onTitleClick: '&'
        },

        templateUrl: '/js/ovpApp/buyFlow/collapsed-step.html',
        controller:
        /* @ngInject */
        function CollapsedStep() {
            _classCallCheck(this, CollapsedStep);

            angular.extend(this, {});
        }
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/buyFlow/collapsed-step.js.map
