'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.playerControls.skipButton', []).component('skipButton', {
        templateUrl: '/js/ovpApp/components/player/skip-button.html',
        bindings: {
            seconds: '<',
            ovpDisabled: '<',
            direction: '<',
            player: '<',
            onSkip: '&',
            ffDisabled: '<',
            enlargeIcon: '='
        },
        controller: (function () {
            /*  @ngInject */

            SkipButton.$inject = ["version"];
            function SkipButton(version) {
                _classCallCheck(this, SkipButton);

                this.version = version;
            }

            _createClass(SkipButton, [{
                key: 'getAriaLabel',
                value: function getAriaLabel() {
                    if (this.ffDisabled) {
                        return 'Jump forward disabled for this program';
                    } else {
                        return 'Jump ' + this.directionText + ' ' + this.seconds + ' seconds';
                    }
                }
            }, {
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.appVersion = this.version.appVersion;
                    this.player.on('seekBegin', function () {
                        _this.seeking = true;
                    });
                    this.player.on('seekEnd', function () {
                        _this.seeking = false;
                    });
                }
            }, {
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.direction) {
                        this.directionText = this.direction < 0 ? 'backward' : 'forward';
                    }
                    if (changes.ffDisabled || changes.direction || changes.seconds) {
                        this.ariaLabel = this.getAriaLabel();
                    }
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.player.off('seekBegin');
                    this.player.off('seekEnd');
                }
            }, {
                key: 'skip',
                value: function skip() {
                    if (!this.ovpDisabled && !this.seeking) {
                        this.onSkip({ direction: this.direction });
                    }
                }
            }, {
                key: 'image',
                value: function image() {
                    return this.appVersion + '/images/skip-' + this.directionText + (this.enlargeIcon ? '-enlarge' : '') + (this.skipHover ? '-active.svg' : '.svg');
                }
            }]);

            return SkipButton;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/skip-button.js.map
