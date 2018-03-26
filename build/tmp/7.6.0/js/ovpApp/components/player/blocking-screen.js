'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    /**
    * blockingScreen
    *
    * Example Usage:
    * <blocking-screen player="$ctrl.player" fullscreen="$ctrl.isVodMode()" asset="$ctrl.asset"></blocking-screen>
    *
    * Bindings:
    *    player: ([type]) the video player object
    *    fullscreen: ([type]) whether or not to take up the full area of the player. If false, a strip is left at the
    *        bottom for the controls
    *    asset: ([type]) the program to display information about
    */
    blockingScreenService.$inject = ["rx"];
    angular.module('ovpApp.player.blockingScreen', ['rx', 'ovpApp.parentalControlsDialog']).factory('blockingScreenService', blockingScreenService).component('blockingScreen', {
        bindings: {
            player: '<',
            fullscreen: '<',
            asset: '<'
        },
        templateUrl: '/js/ovpApp/components/player/blocking-screen.html',
        controller: (function () {
            /* @ngInject */

            BlockingScreen.$inject = ["$scope", "$rootScope", "$controller", "$timeout", "$document", "$location", "blockingScreenService", "parentalControlsDialog", "parentalControlsContext"];
            function BlockingScreen($scope, $rootScope, $controller, $timeout, $document, $location, blockingScreenService, parentalControlsDialog, parentalControlsContext) {
                _classCallCheck(this, BlockingScreen);

                angular.extend(this, { $scope: $scope, $rootScope: $rootScope, $controller: $controller,
                    $timeout: $timeout, $document: $document, $location: $location, blockingScreenService: blockingScreenService, parentalControlsDialog: parentalControlsDialog,
                    parentalControlsContext: parentalControlsContext });
            }

            _createClass(BlockingScreen, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.visible = false;

                    this.stateSubscription = this.blockingScreenService.getSource().subscribe(function (state) {
                        _this.visible = state.visible;
                        if (_this.visible) {
                            try {
                                _this.player.stop();
                            } catch (ex) {}
                            _this.blockType = state.type;
                            _this.url = _this.$location.$$host;
                        }
                    });

                    this.focusListener = this.$rootScope.$on('player:focusUnblock', function () {
                        return _this.focusUnblock();
                    });
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.focusListener();
                    this.stateSubscription.dispose();
                }
            }, {
                key: 'focusUnblock',
                value: function focusUnblock() {
                    var _this2 = this;

                    this.$timeout(function () {
                        _this2.$document[0].getElementById('unblock-parental-controls-button').focus();
                    }, 0, false);
                }
            }, {
                key: 'unblockOnKeyDown',
                value: function unblockOnKeyDown($event) {
                    var keys = { enter: 13, space: 32 };
                    if ([keys.space, keys.enter].indexOf($event.keyCode) > -1) {
                        this.unlockParentalControls();
                    }
                }
            }, {
                key: 'unlockParentalControls',
                value: function unlockParentalControls() {
                    var _this3 = this;

                    this.parentalControlsDialog.withContext(this.parentalControlsContext.PLAYBACK).unlock().then(function () {
                        _this3.$rootScope.$broadcast('player:parentalControlsUnblocked');
                    });
                }
            }, {
                key: 'onClick',
                value: function onClick($event) {
                    if ($event.target.className.indexOf('base-button') > -1) {
                        return;
                    }
                    this.$rootScope.$broadcast('player-control:click');
                }
            }]);

            return BlockingScreen;
        })()
    });

    /**
    * Tracks and modifies the state of the blocking screen
    */
    /* @ngInject */
    function blockingScreenService(rx) {
        var state = new rx.BehaviorSubject({ visible: false });
        var service = {
            show: show,
            hide: hide,
            getSource: getSource
        };

        return service;

        ///////////

        /**
        * Display the blocking screen
        * @param  {object} options
        * @param  {string} options.type either 'adBlocker' or 'parentalControls'
        */
        function show() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            options.visible = true;
            state.onNext(options);
        }

        function hide() {
            state.onNext({ visible: false });
        }

        function getSource() {
            return state.asObservable().distinctUntilChanged();
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/blocking-screen.js.map
