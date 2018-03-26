'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.buyFlow.confirmation', ['ovpApp.config']).component('buyFlowConfirmation', {
        bindings: {},
        templateUrl: '/js/ovpApp/buyFlow/confirmation.html',
        controller: (function () {
            /* @ngInject */

            Confirmation.$inject = ["$state", "$rootScope"];
            function Confirmation($state, $rootScope) {
                _classCallCheck(this, Confirmation);

                angular.extend(this, { $state: $state, $rootScope: $rootScope });

                // Page change is complete.
                this.$rootScope.$emit('Analytics:pageChangeComplete');
            }

            _createClass(Confirmation, [{
                key: 'watchTV',
                value: function watchTV() {

                    // Analytics: selectEvent
                    this.$rootScope.$broadcast('Analytics:select', {
                        context: 'stream2',
                        elementUiName: 'Start Watching TV',
                        elementStandardizedName: 'start',
                        featureCurrentStep: 6
                    });

                    this.$state.go('ovp.livetv');
                }
            }]);

            return Confirmation;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/buyFlow/confirmation.js.map
