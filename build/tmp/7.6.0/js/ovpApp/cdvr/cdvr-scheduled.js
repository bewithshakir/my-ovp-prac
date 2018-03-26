'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.cdvr').component('cdvrScheduled', {
        templateUrl: '/js/ovpApp/cdvr/scheduled.html',
        controller: (function () {
            /* @ngInject */

            CdvrScheduled.$inject = ["$state", "$rootScope", "messages", "cdvrService", "storageKeys"];
            function CdvrScheduled($state, $rootScope, messages, cdvrService, storageKeys) {
                _classCallCheck(this, CdvrScheduled);

                angular.extend(this, { $state: $state, $rootScope: $rootScope, messages: messages, cdvrService: cdvrService, storageKeys: storageKeys });
            }

            _createClass(CdvrScheduled, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.message = this.messages.getMessageForCode('MSG-9080');
                    this.listConfig = {
                        showHeader: false,
                        listOnly: true,
                        showTotal: false,
                        showToggle: false,
                        id: this.storageKeys.scheduledListViewMode,
                        useLocalStorage: true
                    };

                    this.unregisterUpdateDvrListener = this.$rootScope.$on('update-dvr', function () {
                        _this.getScheduledRecordings();
                    });

                    this.getScheduledRecordings();
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.unregisterUpdateDvrListener();
                }
            }, {
                key: 'getScheduledRecordings',
                value: function getScheduledRecordings() {
                    var _this2 = this;

                    var promise = this.cdvrService.getScheduled().then(function (scheduled) {
                        _this2.schedule = scheduled;
                        _this2.$rootScope.$broadcast('pageChangeComplete', _this2.$state.current);
                    })['catch'](function (message) {
                        _this2.message = message;
                        _this2.schedule = [];
                    });
                    this.$rootScope.$broadcast('message:loading', promise, undefined, 'DVR Scheduled');
                }
            }]);

            return CdvrScheduled;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/cdvr/cdvr-scheduled.js.map
