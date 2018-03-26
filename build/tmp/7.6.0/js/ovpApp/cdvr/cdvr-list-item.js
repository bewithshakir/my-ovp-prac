'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.cdvr').component('cdvrListItem', {
        bindings: {
            asset: '<'
        },
        templateUrl: '/js/ovpApp/cdvr/cdvr-list-item.html',
        controller: (function () {
            /* @ngInject */

            CdvrListItem.$inject = ["$state", "cdvrService"];
            function CdvrListItem($state, cdvrService) {
                _classCallCheck(this, CdvrListItem);

                this.$state = $state;
                this.cdvrService = cdvrService;
            }

            _createClass(CdvrListItem, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.cdvrService.getChannelNumber(this.asset).then(function (channelNumber) {
                        return _this.channelNumber = channelNumber;
                    });
                }
            }, {
                key: 'click',
                value: function click() {
                    var route = this.asset.clickRoute;
                    if (route) {
                        var _$state;

                        (_$state = this.$state).go.apply(_$state, _toConsumableArray(route));
                    }
                }
            }, {
                key: 'getTitlePrefix',
                value: function getTitlePrefix() {
                    var prefix = '';
                    if (this.asset.isBlockedByParentalControls) {
                        prefix = 'Blocked';
                    }
                    return prefix;
                }
            }]);

            return CdvrListItem;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/cdvr/cdvr-list-item.js.map
