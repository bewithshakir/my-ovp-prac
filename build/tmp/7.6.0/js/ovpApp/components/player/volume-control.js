'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.playerControls').component('volumeControl', {
        bindings: {
            player: '<',
            enlargeIcon: '='
        },
        templateUrl: '/js/ovpApp/components/player/volume-control.html',
        controller: (function () {
            VolumeControl.$inject = ["version", "ovpStorage", "createObservableFunction", "$rootScope", "windowFocus", "globalKeydown", "keyMap", "playerService"];
            function VolumeControl(version, ovpStorage, createObservableFunction, $rootScope, windowFocus, globalKeydown, keyMap, playerService) {
                _classCallCheck(this, VolumeControl);

                angular.extend(this, { version: version, ovpStorage: ovpStorage, createObservableFunction: createObservableFunction, $rootScope: $rootScope,
                    windowFocus: windowFocus, globalKeydown: globalKeydown, keyMap: keyMap, playerService: playerService });
            }

            _createClass(VolumeControl, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.onFocus = this.createObservableFunction();
                    this.onBlur = this.createObservableFunction();
                    this.onMouseOver = this.createObservableFunction();
                    this.onMouseLeave = this.createObservableFunction();
                    this.sliderVisible = false;
                    this.sliderFocussed = false;
                    this.imagePath = '/' + this.version.appVersion;
                    this.isMouseOver = false;
                    this.isMuted = this.player.isMuted();
                    this.volume = this.isMuted ? 0 : this.getVolume();

                    this.onMouseOver.subscribe(function () {
                        return _this.isMouseOver = true;
                    });
                    this.onMouseLeave.subscribe(function () {
                        return _this.isMouseOver = false;
                    });

                    var enterSource = this.onFocus.filter(function () {
                        return !_this.windowFocus.windowJustGotFocus();
                    }).merge(this.onMouseOver);
                    var exitSource = this.onBlur.merge(this.onMouseLeave);

                    enterSource.subscribe(function () {
                        _this.sliderVisible = true;
                        exitSource.delay(500).takeUntil(enterSource).subscribe(function () {
                            _this.sliderVisible = false;
                            _this.$rootScope.$apply();
                        });
                    });

                    var focusSlider = this.onFocus.filter(function (_ref) {
                        var _ref2 = _slicedToArray(_ref, 1);

                        var val = _ref2[0];
                        return val === 'slider';
                    }).map(function () {
                        return true;
                    });
                    var blurSlider = this.onBlur.filter(function (_ref3) {
                        var _ref32 = _slicedToArray(_ref3, 1);

                        var val = _ref32[0];
                        return val === 'slider';
                    }).map(function () {
                        return false;
                    });
                    focusSlider.merge(blurSlider).subscribe(function (val) {
                        return _this.sliderFocussed = val;
                    });

                    this.keydownHandler = this.globalKeydown.observable
                    // Ignore key events if not playing video
                    .filter(function (event) {
                        return _this.playerService.isValidPlayRoute() && _this.keyMap[event.keyCode] === 'm' && !(event.ctrlKey || event.shiftKey || event.altKey || event.metaKey);
                    }).subscribe(function () {
                        return _this.toggleMute();
                    });
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.keydownHandler.dispose();
                }
            }, {
                key: 'onVolumeChange',
                value: function onVolumeChange() {
                    this.adjustVolume(this.volume);
                }
            }, {
                key: 'toggleMute',
                value: function toggleMute() {
                    if (this.player.isMuted()) {
                        this.player.setMuted(false);
                        // Reset volume
                        this.volume = this.getVolume() || 40; // default volume
                        this.adjustVolume(this.volume, false);
                    } else {
                        this.player.setMuted(true);
                        this.volume = 0;
                    }
                    this.isMuted = this.player.isMuted();
                }
            }, {
                key: 'onPlaybackStarted',
                value: function onPlaybackStarted() {
                    this.volume = this.isMuted ? 0 : this.getVolume();
                }
            }, {
                key: 'image',
                value: function image() {
                    var volumeImage = undefined;
                    if (this.isMuted || this.volume === 0) {
                        volumeImage = '/images/volume-mute';
                    } else {
                        volumeImage = '/images/volume';
                    }

                    volumeImage = volumeImage + (this.enlargeIcon ? '-enlarge' : '');

                    return this.imagePath + volumeImage + (this.isMouseOver ? '-active.svg' : '.svg');
                }
            }, {
                key: 'adjustVolume',
                value: function adjustVolume(volume) {
                    var toggleMute = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

                    volume = parseInt(volume);
                    this.player.setVolume(volume / 100);
                    // Toggle mute
                    if (toggleMute && this.isMuted && volume > 0 || !this.isMuted && volume === 0) {
                        this.toggleMute();
                    }
                }
            }, {
                key: 'getVolume',
                value: function getVolume() {
                    var volumeLevel = this.player.getVolume();
                    if (volumeLevel !== undefined && !isNaN(volumeLevel)) {
                        volumeLevel = 1 * volumeLevel;
                    } else {
                        volumeLevel = 0.4;
                    }

                    return parseFloat(volumeLevel * 100);
                }
            }]);

            return VolumeControl;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/volume-control.js.map
