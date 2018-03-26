'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.playerControls').component('toggleWatchOnTv', {
        bindings: {
            asset: '<',
            stream: '<'
        },
        templateUrl: '/js/ovpApp/components/player/toggle-watch-on-tv.html',
        controller: (function () {
            /* @ngInject */

            ToggleWatchOnTvController.$inject = ["modal", "version", "$state", "productActionService"];
            function ToggleWatchOnTvController(modal, version, $state, productActionService) {
                _classCallCheck(this, ToggleWatchOnTvController);

                angular.extend(this, { modal: modal, version: version, $state: $state, productActionService: productActionService });
            }

            _createClass(ToggleWatchOnTvController, [{
                key: 'checkForWatchOnTvActions',
                value: function checkForWatchOnTvActions() {
                    this.hasWatchOnTvActions = this.asset ? this.asset.hasWatchOnTvActions : false;
                    if (this.asset && this.asset.isEpisode) {
                        this.hasWatchOnTvActions = !!this.action;
                    }
                    this.action = this.asset && this.asset.actions && this.asset.actions.find(function (a) {
                        return a.actionType === 'watchOnDemandOnTv' || a.actionType === 'resumeOnDemandOnTv';
                    });
                }
            }, {
                key: '$onInit',
                value: function $onInit() {
                    this.checkForWatchOnTvActions();
                }
            }, {
                key: '$onChanges',
                value: function $onChanges() {
                    this.checkForWatchOnTvActions();
                }
            }, {
                key: 'watchOnTvToggle',
                value: function watchOnTvToggle() {
                    this.productActionService.executeAction(this.action, this.asset);
                }
            }, {
                key: 'watchOnTvImage',
                value: function watchOnTvImage() {
                    if (this.asset && !this.hasWatchOnTvActions) {
                        return this.version.appVersion + '/images/watch-on-tv-disable.svg';
                    } else if (this.hovered) {
                        return this.version.appVersion + '/images/watch-on-tv-active.svg';
                    } else {
                        return this.version.appVersion + '/images/watch-on-tv.svg';
                    }
                }
            }]);

            return ToggleWatchOnTvController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/toggle-watch-on-tv.js.map
