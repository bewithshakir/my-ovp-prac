'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.remotePlayer.setTopConnection', ['ovpApp.remotePlayer']).component('setTopConnection', {
        templateUrl: '/js/ovpApp/components/player/set-top-connection.html',
        controller: (function () {
            /* @ngInject */

            SetTopConnectionController.$inject = ["remotePlayService", "$state", "$transitions", "$timeout"];
            function SetTopConnectionController(remotePlayService, $state, $transitions, $timeout) {
                _classCallCheck(this, SetTopConnectionController);

                angular.extend(this, {
                    remotePlayService: remotePlayService,
                    $state: $state,
                    $transitions: $transitions,
                    $timeout: $timeout
                });
            }

            _createClass(SetTopConnectionController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.remotePlaySubscription = this.remotePlayService.getSource().subscribe(function (options) {
                        _this.options = options;
                        _this.asset = options.asset;
                        _this.stb = options.stb;

                        // Update program-title and stb-title
                        _this.stbTitle = options.stb && (options.stb.name || options.stb.macAddress);
                        _this.programTitle = options.asset && options.asset.title;
                    });
                    this.$transitions.onSuccess({}, function () {
                        if (_this.canShow()) {
                            // for screen reader
                            _this.$timeout(function () {
                                _this.ariaLiveMessage = 'Watching ' + _this.programTitle + ' on ' + _this.stbTitle;
                            }, 100);
                        } else {
                            _this.ariaLiveMessage = '';
                        }
                    });
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    if (this.remotePlaySubscription) {
                        this.remotePlaySubscription.dispose();
                    }
                }
            }, {
                key: 'canShow',
                value: function canShow() {
                    return !this.$state.includes('ovp.playRemote') && !!this.asset && !!this.stb;
                }
            }, {
                key: 'reconnect',
                value: function reconnect() {
                    this.$state.go('ovp.playRemote', this.options);
                }
            }]);

            return SetTopConnectionController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/set-top-connection.js.map
