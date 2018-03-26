'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    remotePlayService.$inject = ["rx"];
    angular.module('ovpApp.remotePlayer', ['ovpApp.remotePlayer.controls', 'ovpApp.product.productActionService', 'rx', 'ovpApp.directives.focus']).factory('remotePlayService', remotePlayService).component('remotePlayer', {
        templateUrl: '/js/ovpApp/components/player/remote-player.html',
        controller: (function () {
            /* @ngInject */

            Player.$inject = ["$state", "remotePlayService", "productActionService", "$transitions", "$timeout"];
            function Player($state, remotePlayService, productActionService, $transitions, $timeout) {
                _classCallCheck(this, Player);

                angular.extend(this, { $state: $state, remotePlayService: remotePlayService, productActionService: productActionService, $transitions: $transitions, $timeout: $timeout });
            }

            _createClass(Player, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.visible = false;
                    this.selectedStb = null;
                    this.asset = null;
                    this.ariaLiveMessage = '';
                    this.buttonText = 'Switch Playback to This Device';
                    this.remotePlaySubscription = this.remotePlayService.getSource().subscribe(function (options) {
                        if (options.asset) {
                            _this.selectedStb = options.stb;
                            _this.asset = options.asset;
                            _this.tvAction = options.tvAction;
                            _this.ipAction = options.ipAction;
                        }
                    });
                    this.$transitions.onEnter({}, function (transition) {
                        _this.visible = transition.to().name.startsWith('ovp.playRemote');
                        if (_this.visible) {
                            // for screen reader
                            _this.$timeout(function () {
                                _this.ariaLiveMessage = 'This title has been sent to play on TV named\n                                ' + (_this.selectedStb.name || _this.selectedStb.macAddress) + ',\n                                Use your TV remote or device for player controls.';
                            }, 100);
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
                key: 'switchPlayBack',
                value: function switchPlayBack() {
                    this.remotePlayService.stopRemotePlay();

                    if (this.ipAction) {
                        this.productActionService.executeAction(this.ipAction, this.asset);
                    } else {
                        this.$state.go('ovp.livetv');
                    }
                }
            }]);

            return Player;
        })()
    });

    function remotePlayService(rx) {
        var state = new rx.BehaviorSubject({});
        return {
            remotePlay: remotePlay,
            stopRemotePlay: stopRemotePlay,
            getSource: getSource
        };

        /////////////

        function remotePlay() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            state.onNext(options);
        }

        function stopRemotePlay() {
            state.onNext({});
        }

        function getSource() {
            return state.asObservable().distinctUntilChanged();
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/remote-player.js.map
