'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.shareInProgressList', ['ovpApp.components.ovp.ovpSwitch', 'ovpApp.services.stbSettingsService']).component('stbShareInProgressList', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-shareInProgressList.html',
        bindings: {
            'stb': '<'
        },
        controller: (function () {
            /* @ngInject */

            StbShareInProgressList.$inject = ["StbSettingsService"];
            function StbShareInProgressList(StbSettingsService) {
                _classCallCheck(this, StbShareInProgressList);

                angular.extend(this, { StbSettingsService: StbSettingsService });
            }

            _createClass(StbShareInProgressList, [{
                key: '$onInit',
                value: function $onInit() {
                    this.setToggleState();
                }
            }, {
                key: 'toggleShareInProgressList',
                value: function toggleShareInProgressList() {
                    this.shareInProgressListEnabledForClient = !this.shareInProgressListEnabledForClient;
                    this.StbSettingsService.setShareInProgressListForClient(this.stb, this.shareInProgressListEnabledForClient).then(this.setToggleState.bind(this), this.setToggleState.bind(this));
                }
            }, {
                key: 'setToggleState',
                value: function setToggleState() {
                    var _this = this;

                    this.StbSettingsService.shareInProgressListEnabled(this.stb).then(function (enabled) {
                        _this.shareInProgressListEnabledForClient = enabled;
                    });
                    if (this.shareInProgressListEnabledForClient === undefined) {
                        this.shareInProgressListEnabledForClient = false;
                    }
                }
            }]);

            return StbShareInProgressList;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/settings/stb-parentalControls/stb-shareInProgressList.js.map
