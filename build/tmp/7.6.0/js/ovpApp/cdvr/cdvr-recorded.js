'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.cdvr').component('cdvrRecorded', {
        templateUrl: '/js/ovpApp/cdvr/recorded.html',
        controller: (function () {
            /* @ngInject */

            CdvrRecorded.$inject = ["$state", "$rootScope", "messages", "cdvrService", "storageKeys"];
            function CdvrRecorded($state, $rootScope, messages, cdvrService, storageKeys) {
                _classCallCheck(this, CdvrRecorded);

                angular.extend(this, { $state: $state, $rootScope: $rootScope, messages: messages, cdvrService: cdvrService, storageKeys: storageKeys });
            }

            _createClass(CdvrRecorded, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.message = this.messages.getMessageForCode('MSG-9079');
                    this.gridConfig = {
                        showTotal: false,
                        showToggle: true,
                        id: this.storageKeys.recordingGridCategoryViewMode,
                        useLocalStorage: true
                    };

                    this.getRecordings();

                    this.unregisterUpdateDvrListener = this.$rootScope.$on('update-dvr', function () {
                        _this.getRecordings();
                    });
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.unregisterUpdateDvrListener();
                }
            }, {
                key: 'getRecordings',
                value: function getRecordings() {
                    var _this2 = this;

                    var promise = this.cdvrService.getProgramList().then(function (recordings) {
                        _this2.cdvrRecordings = recordings;
                        _this2.$rootScope.$broadcast('pageChangeComplete', _this2.$state.current);
                    })['catch'](function (message) {
                        _this2.message = message;
                        _this2.cdvrRecordings = [];
                    });
                    this.$rootScope.$broadcast('message:loading', promise, undefined, 'DVR Recordings');
                }
            }]);

            return CdvrRecorded;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/cdvr/cdvr-recorded.js.map
