'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    /**
     * diskUsage
     *
     * Displays disk usage bar
     *
     * Example Usage:
     * <disk-usage></disk-usage>
     */
    angular.module('ovpApp.rdvr.diskUsage', ['ovpApp.rdvr.rdvrService', 'ovpApp.services.rxUtils']).component('diskUsage', {
        bindings: {
            stb: '<'
        },
        templateUrl: '/js/ovpApp/rdvr/disk-usage/disk-usage.html',
        controller: (function () {
            /* @ngInject */

            DiskUsage.$inject = ["$scope", "rdvrService", "stbService"];
            function DiskUsage($scope, rdvrService, stbService) {
                _classCallCheck(this, DiskUsage);

                angular.extend(this, { $scope: $scope, rdvrService: rdvrService, stbService: stbService });
            }

            _createClass(DiskUsage, [{
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.stb) {
                        this.getDiskUsage(changes.stb.currentValue);
                    }
                }
            }, {
                key: 'getDiskUsage',
                value: function getDiskUsage(stb) {
                    var _this = this;

                    if (this.hasRdvrVersion2(stb)) {
                        if (this.subscription) {
                            this.subscription.dispose();
                            this.subscription = null;
                        }
                        this.subscription = this.rdvrService.getUsage(stb).subscribe(function (result) {
                            return _this.onDiskUsageReceived(result);
                        });
                    }
                }
            }, {
                key: 'onDiskUsageReceived',
                value: function onDiskUsageReceived(result) {
                    if (!result.error && result.data && result.data.usedPercentage) {
                        this.usedPercent = Math.floor(result.data.usedPercentage * 100);
                    } else {
                        this.usedPercent = 0;
                    }
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    if (this.subscription) {
                        this.subscription.dispose();
                    }
                }
            }, {
                key: 'hasRdvrVersion2',
                value: function hasRdvrVersion2() {
                    var stb = arguments.length <= 0 || arguments[0] === undefined ? this.stb : arguments[0];

                    return stb && stb.dvr === true && stb.rdvrVersion > 1;
                }
            }]);

            return DiskUsage;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/rdvr/disk-usage/disk-usage.js.map
