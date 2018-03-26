'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    /**
     * rdvrPage
     *
     * Main page for Remote DVR feature
     *
     * Example Usage:
     * <rdvr-page></rdvr-page>
     *
     */
    angular.module('ovpApp.rdvr', ['ovpApp.services.stbService', 'ovpApp.rdvr.router', 'ovpApp.rdvr.diskUsage', 'ovpApp.rdvr.rdvrService', 'ovpApp.rdvr.myRecordings', 'ovpApp.rdvr.scheduled', 'ovpApp.rdvr.priority', 'ovpApp.rdvr.rdvrToolbar', 'ovpApp.messages', 'ovpApp.legacy.DateUtil', 'ovpApp.rdvr.cacheService', 'ovpApp.services.ovpStorage']).component('rdvrPage', {
        templateUrl: '/js/ovpApp/rdvr/rdvr.html',
        controller: (function () {
            /* @ngInject */

            RdvrPage.$inject = ["$scope", "messages", "stbService"];
            function RdvrPage($scope, messages, stbService) {
                _classCallCheck(this, RdvrPage);

                angular.extend(this, { $scope: $scope, messages: messages, stbService: stbService });
            }

            _createClass(RdvrPage, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.stbService.currentStbSource.subscribe(function (stb) {
                        return _this.setTopBox = stb;
                    });
                }
            }, {
                key: 'hasDvr',
                value: function hasDvr() {
                    return this.setTopBox && this.setTopBox.dvr;
                }
            }]);

            return RdvrPage;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/rdvr/rdvr.js.map
