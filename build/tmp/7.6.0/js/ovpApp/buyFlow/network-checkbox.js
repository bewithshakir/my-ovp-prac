'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.buyFlow.networkCheckbox', ['ovpApp.config', 'ovpApp.dataDelegate']).component('networkCheckbox', {
        bindings: {
            network: '<',
            checked: '<',
            inBundle: '<',
            onChange: '&'
        },
        templateUrl: '/js/ovpApp/buyFlow/network-checkbox.html',
        controller: (function () {
            /* @ngInject */

            NetworkCheckbox.$inject = ["config", "delegateUtils"];
            function NetworkCheckbox(config, delegateUtils) {
                _classCallCheck(this, NetworkCheckbox);

                angular.extend(this, { config: config, delegateUtils: delegateUtils });
            }

            _createClass(NetworkCheckbox, [{
                key: 'toggle',
                value: function toggle(event) {
                    this.checked = !this.checked;
                    this.onChange({ checked: this.checked });
                    event.preventDefault();
                }
            }, {
                key: 'getChannelImage',
                value: function getChannelImage(channel) {
                    if (channel.imageUrl) {
                        return channel.imageUrl;
                    } else {
                        return this.delegateUtils.networkImageFromTmsId(channel.tmsId)({ width: 84 });
                    }
                }
            }]);

            return NetworkCheckbox;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/buyFlow/network-checkbox.js.map
