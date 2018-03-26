'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.ondemand.networkThreeTier', ['ovpApp.ondemand.data', 'ovpApp.ondemand.subheaderService']).component('networkThreeTier', {
        templateUrl: '/js/ovpApp/ondemand/networks/network-3-tier.html',
        bindings: {
            data: '<',
            page: '<?',
            index: '<?'
        },
        controller: (function () {
            /* @ngInject */

            NetworkThreeTier.$inject = ["$rootScope", "ondemandSubheaderService"];
            function NetworkThreeTier($rootScope, ondemandSubheaderService) {
                _classCallCheck(this, NetworkThreeTier);

                this.$rootScope = $rootScope;
                this.ondemandSubheaderService = ondemandSubheaderService;
            }

            _createClass(NetworkThreeTier, [{
                key: '$onInit',
                value: function $onInit() {
                    if (angular.isUndefined(this.index) || this.index < 0) {
                        this.index = 0;
                    }

                    if (angular.isUndefined(this.page) || this.page < 1) {
                        this.page = 1;
                    }
                }
            }]);

            return NetworkThreeTier;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/ondemand/networks/network-3-tier.js.map
