'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.ondemand.networks', ['ovpApp.ondemand.networkThreeTier', 'ovpApp.ondemand.data', 'ovpApp.components.channelCard']).component('networkMainPage', {
        templateUrl: '/js/ovpApp/ondemand/networks/network-main-page.html',
        bindings: {
            networks: '<'
        },
        controller: (function () {
            NetworkMainPage.$inject = ["$rootScope", "$state"];
            function NetworkMainPage($rootScope, $state) {
                _classCallCheck(this, NetworkMainPage);

                angular.extend(this, { $rootScope: $rootScope, $state: $state });
            }

            _createClass(NetworkMainPage, [{
                key: '$onInit',
                value: function $onInit() {
                    this.gridListConfig = {
                        minimumGridItemSeparation: 35,
                        gridOnly: true,
                        showHeader: false,
                        showPagination: false
                    };
                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }
            }]);

            return NetworkMainPage;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/ondemand/networks/network-main-page.js.map
