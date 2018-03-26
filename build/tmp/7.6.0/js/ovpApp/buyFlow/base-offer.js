'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.buyFlow.baseOffer', ['ovpApp.buyFlow.bundleCheckbox', 'ovpApp.buyFlow.networkCheckbox', 'ovpApp.buyFlow.collapsedStep', 'ovpApp.dataDelegate']).component('baseOffer', {
        bindings: {
            stepNumber: '<',
            title: '<stepTitle',
            offerings: '<',
            collapsed: '<',
            onTitleClick: '&',
            onContinue: '&',
            onCancel: '&'
        },

        templateUrl: '/js/ovpApp/buyFlow/base-offer.html',
        controller: (function () {
            /* @ngInject */

            BaseOffer.$inject = ["delegateUtils", "version"];
            function BaseOffer(delegateUtils, version) {
                _classCallCheck(this, BaseOffer);

                angular.extend(this, { delegateUtils: delegateUtils, version: version });
            }

            _createClass(BaseOffer, [{
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.offerings) {
                        // TODO: current code only supports one base offering. Do we need to support more?
                        this.bundle = this.offerings && this.offerings[0];
                    }
                }
            }, {
                key: 'getChannelImage',
                value: function getChannelImage(channel) {
                    if (channel.imageUrl) {
                        return channel.imageUrl;
                    } else {
                        return this.delegateUtils.networkImageFromTmsId(channel.tmsId)({ width: 96 });
                    }
                }
            }, {
                key: 'price',
                value: function price() {
                    return parseFloat(this.bundle.price);
                }
            }, {
                key: 'iconPath',
                value: function iconPath(file) {
                    var filename = file + '.svg';
                    return this.version.appVersion + '/images/' + filename;
                }
            }]);

            return BaseOffer;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/buyFlow/base-offer.js.map
