'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.playerControls.ovpScrubber', ['ovpApp.directives.draggable']).component('ovpScrubber', {
        templateUrl: '/js/ovpApp/components/player/ovp-scrubber.html',
        bindings: {
            seconds: '<',
            adBreaks: '<',
            max: '<',
            value: '<',
            ffDisabled: '<',
            isAdPlaying: '<',
            showBuffer: '<',
            player: '<',
            enlargeIcon: '='
        },
        controller: (function () {
            /* @ngInject */

            Scrubber.$inject = ["$scope", "$element", "$timeout", "config", "$rootScope"];
            function Scrubber($scope, $element, $timeout, config, $rootScope) {
                _classCallCheck(this, Scrubber);

                this.$scope = $scope;
                this.$element = $element;
                this.$timeout = $timeout;
                this.config = config;
                this.$rootScope = $rootScope;
            }

            _createClass(Scrubber, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.player.on('player-end-position-changed', this.onPlayerEndPositionChanged);
                    this.adBreaks = this.adBreaks || [];
                    this.mousePosition = null;
                    this.sliderFocused = false;
                    this.sliderDragging = false;
                    this.skipSeconds = parseInt(this.config.playerParameters.skipSeconds);
                    this.mouseOverSlider = false;
                    this.sliderElem = angular.element(this.$element[0]).find('.slider-track')[0];

                    if (this.$element.focusOn === 'true') {
                        this.$timeout(function () {
                            return _this.sliderElem.focus();
                        });
                    }

                    this.$scope.$on('slider-handle-position-changed', function (event, data) {
                        if (_this.isAdPlaying) {
                            return;
                        }
                        _this.mousePosition = Math.max(0, Math.min(data.position, _this.sliderElem.offsetLeft + _this.sliderElem.offsetWidth));
                    });

                    this.$scope.$on('slider-handle-drag-start', function (event, data) {
                        _this.sliderDragging = true;
                        _this.mousePosition = data.position;
                    });

                    this.$scope.$on('slider-handle-drag-end', function () {
                        var selectionWidthFraction = _this.calcSliderSelectionWidthFraction();
                        _this.sliderDragging = false;

                        // Mouse moved out, but we delayed removing focus until this event.
                        if (!_this.mouseOverSlider) {
                            _this.sliderFocused = false;
                        }

                        // Use the position of the center of the drag
                        // circle as the seek point so that the UI matches
                        // where we are seeking.
                        _this.seekToPosition(selectionWidthFraction, 'scrubber');
                    });

                    this.$scope.$on('playerControls: skip', function (event, data) {
                        _this.skip(data.multiplier);
                    });

                    this.player.on('seekBegin', function () {
                        _this.seeking = true;
                    });
                    this.player.on('seekEnd', function () {
                        _this.seeking = false;
                    });
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.player.off('seekBegin');
                    this.player.off('seekEnd');
                }
            }, {
                key: '$doCheck',
                value: function $doCheck() {
                    if (this.mousePosition) {
                        this.mousePositionAsFraction = this.mousePosition / this.sliderElem.offsetWidth;
                    }
                }
            }, {
                key: 'onSliderClick',
                value: function onSliderClick(event) {
                    if (this.seeking) {
                        return;
                    }
                    if (event.type === 'keypress') {
                        this.$rootScope.$emit('toggle-playback');
                        event.preventDefault();
                    } else {
                        if (this.isAdPlaying) {
                            return;
                        }

                        // Use the actual click point.
                        this.$element[0].querySelector('.slider-handle').style.left = event.target.offsetLeft + event.offsetX + 'px';
                        var position = event.target.offsetLeft + event.offsetX;
                        this.seekToPosition(position / this.sliderElem.offsetWidth, 'scrubber');
                    }
                }
            }, {
                key: 'calcAdBreakStyle',
                value: function calcAdBreakStyle(adBreak) {
                    return {
                        left: adBreak.startTime * 100 / (this.max * 1000) + '%',
                        width: adBreak.duration * 100 / (this.max * 1000) + '%'
                    };
                }
            }, {
                key: 'onKeyUp',
                value: function onKeyUp(event) {
                    this.mousePosition = null;
                    if (this.seeking) {
                        return;
                    }
                    if (event.keyCode === 39 || event.keyCode === 38) {
                        // right, up
                        this.skip(1);
                    } else if (event.keyCode === 37 || event.keyCode === 40) {
                        // left, down
                        this.skip(-1);
                    }
                }
            }, {
                key: 'valueMax',
                value: function valueMax() {
                    return Math.round(this.max / 60);
                }
            }, {
                key: 'valueNow',
                value: function valueNow() {
                    return Math.round(this.value / 60);
                }
            }, {
                key: 'getTooltipMessage',
                value: function getTooltipMessage() {
                    var msg = '';
                    if (this.ffDisabled && (!this.mousePosition || !this.isMouseOnSelectedSlider) || this.isAdPlaying && this.mousePosition) {
                        msg = 'Fast forward is disabled for the duration of this content';
                    }
                    return msg;
                }
            }, {
                key: 'calcSliderHandlePosition',
                value: function calcSliderHandlePosition() {
                    if (!this.sliderDragging) {
                        return {
                            left: this.value / this.max * 100 + '%'
                        };
                    }
                    return {
                        left: this.mousePosition
                    };
                }
            }, {
                key: 'calcStartTime',
                value: function calcStartTime() {
                    if (this.mousePosition) {
                        return parseInt(this.mousePosition / this.sliderElem.offsetWidth * this.max);
                    } else {
                        return this.value;
                    }
                }
            }, {
                key: 'calcSliderSelectionWidthFraction',
                value: function calcSliderSelectionWidthFraction() {
                    var width = this.value / this.max;
                    if (this.sliderDragging && !this.isAdPlaying) {
                        if (this.isPastBuffer(this.mousePositionAsFraction)) {
                            width = this.bufferTime / this.max;
                        } else {
                            width = this.mousePositionAsFraction;
                        }
                    }
                    return width;
                }
            }, {
                key: 'calcSliderSelectionStyle',
                value: function calcSliderSelectionStyle() {
                    return {
                        left: '0px',
                        width: this.calcSliderSelectionWidthFraction() * 100 + '%'
                    };
                }
            }, {
                key: 'calcSliderBufferStyle',
                value: function calcSliderBufferStyle() {
                    var left = this.calcSliderSelectionStyle().width,

                    //(bufferTime - currentTime) / length of program (52 minutes - 38 minutes) / 60 minutes
                    width = (this.bufferTime - this.value) / this.max * 100 + '%';

                    if (this.sliderDragging) {
                        if (this.isPastBuffer(this.mousePositionAsFraction)) {
                            width = 0;
                        } else {
                            var bufferPositionAsPercentage = this.bufferTime / this.max,
                                widthPercentage = bufferPositionAsPercentage - this.mousePositionAsFraction;
                            width = widthPercentage * 100 + '%';
                        }
                    }
                    return {
                        left: left,
                        width: width
                    };
                }
            }, {
                key: 'calcSliderHighStyle',
                value: function calcSliderHighStyle() {
                    var sliderWidth = undefined,
                        width = 100 - this.value / this.max * 100 + '%';
                    if (this.sliderDragging && !this.isAdPlaying) {
                        if (this.isPastBuffer(this.mousePositionAsFraction)) {
                            width = 100 - this.bufferTime / this.max * 100 + '%';
                        } else {
                            sliderWidth = this.sliderElem.offsetWidth;
                            width = sliderWidth - this.mousePosition + 'px';
                        }
                    }
                    return {
                        right: '0px',
                        width: width
                    };
                }
            }, {
                key: 'calcTooltipPosition',
                value: function calcTooltipPosition() {
                    // Arrow at center
                    var tooltipWidth = this.$element[0].querySelector('.slider-tooltip').offsetWidth / 2,

                    // Tooltip Arrow width
                    arrowCenter = 10,

                    // Result style
                    result = {
                        'tooltip': {},
                        'tooltipArrow': {
                            left: tooltipWidth - arrowCenter + 'px'
                        }
                    };

                    if (this.mousePosition) {
                        result.tooltip.left = this.mousePosition + 'px';
                    } else {
                        var newPos = this.value / this.max;
                        result.tooltip.left = newPos * 100 + '%';
                    }

                    return result;
                }
            }, {
                key: 'onMouseMove',
                value: function onMouseMove(event) {
                    // Ignore if dragging. The events from the slider move will take care of position
                    if (this.sliderDragging) {
                        return;
                    }

                    var sliderWidth = this.sliderElem.offsetWidth;
                    this.mousePosition = event.target.offsetLeft + event.offsetX;
                    this.isMouseOnSelectedSlider = this.$element[0].querySelector('.slider-handle').offsetLeft > this.mousePosition;
                    if (this.mousePosition < 0) {
                        this.mousePosition = 0;
                    } else if (this.mousePosition > sliderWidth) {
                        this.mousePosition = sliderWidth;
                    }
                }
            }, {
                key: 'onMouseEnter',
                value: function onMouseEnter() {
                    this.sliderFocused = true;
                    this.mouseOverSlider = true;
                }
            }, {
                key: 'onMouseLeave',
                value: function onMouseLeave() {
                    this.mouseOverSlider = false;

                    // Keep slider focused even if mouse moved away.
                    if (!this.sliderDragging) {
                        this.sliderFocused = false;
                        this.mousePosition = null;
                    }
                }
            }, {
                key: 'onPlayerEndPositionChanged',
                value: function onPlayerEndPositionChanged(time) {
                    if (this.showBuffer) {
                        this.bufferTime = time.endPosition / 1000;
                        this.calcSliderBufferStyle();
                    }
                }
            }, {
                key: 'isPastBuffer',
                value: function isPastBuffer(position) {
                    var desiredPositionInSeconds = position * this.max;
                    return this.showBuffer && desiredPositionInSeconds > this.bufferTime;
                }
            }, {
                key: 'seekToPosition',
                value: function seekToPosition(position, sourceElement) {
                    if (this.isAdPlaying) {
                        return;
                    }

                    var absPositionSec = undefined;
                    position = Math.min(1, position);

                    // Position at this point is percentage of the UI
                    // width. Convert this to an absolute value of the
                    // actual asset length.
                    absPositionSec = Math.floor(position * this.max);
                    this.$scope.$emit('seek-to-position', { positionSec: absPositionSec, sourceElement: sourceElement });
                }
            }, {
                key: 'skip',
                value: function skip(multiplier) {
                    this.value += this.skipSeconds * multiplier;
                    this.seekToPosition(this.value / this.max, 'skipButton');
                }
            }]);

            return Scrubber;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/ovp-scrubber.js.map
