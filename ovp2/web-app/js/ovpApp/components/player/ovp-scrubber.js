(function () {
    'use strict';

    angular
        .module('ovpApp.playerControls.ovpScrubber', ['ovpApp.directives.draggable'])
        .component('ovpScrubber', {
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
            controller: class Scrubber {
                /* @ngInject */
                constructor($scope, $element, $timeout, config, $rootScope) {
                    this.$scope = $scope;
                    this.$element = $element;
                    this.$timeout = $timeout;
                    this.config = config;
                    this.$rootScope = $rootScope;
                }

                $onInit() {
                    this.player.on('player-end-position-changed', this.onPlayerEndPositionChanged);
                    this.adBreaks = this.adBreaks || [];
                    this.mousePosition = null;
                    this.sliderFocused = false;
                    this.sliderDragging = false;
                    this.skipSeconds = parseInt(this.config.playerParameters.skipSeconds);
                    this.mouseOverSlider = false;
                    this.sliderElem = angular.element(this.$element[0]).find('.slider-track')[0];

                    if (this.$element.focusOn === 'true') {
                        this.$timeout(() => this.sliderElem.focus());
                    }

                    this.$scope.$on('slider-handle-position-changed', (event, data) => {
                        if (this.isAdPlaying) {
                            return;
                        }
                        this.mousePosition = Math.max(0, Math.min(data.position,
                            this.sliderElem.offsetLeft + this.sliderElem.offsetWidth));
                    });

                    this.$scope.$on('slider-handle-drag-start', (event, data) => {
                        this.sliderDragging = true;
                        this.mousePosition = data.position;
                    });

                    this.$scope.$on('slider-handle-drag-end', () => {
                        let selectionWidthFraction = this.calcSliderSelectionWidthFraction();
                        this.sliderDragging = false;

                        // Mouse moved out, but we delayed removing focus until this event.
                        if (!this.mouseOverSlider) {
                            this.sliderFocused = false;
                        }

                        // Use the position of the center of the drag
                        // circle as the seek point so that the UI matches
                        // where we are seeking.
                        this.seekToPosition(selectionWidthFraction, 'scrubber');
                    });

                    this.$scope.$on('playerControls: skip', (event, data) => {
                        this.skip(data.multiplier);
                    });

                    this.player.on('seekBegin', () => {
                        this.seeking = true;
                    });
                    this.player.on('seekEnd', () => {
                        this.seeking = false;
                    });
                }

                $onDestroy() {
                    this.player.off('seekBegin');
                    this.player.off('seekEnd');
                }

                $doCheck() {
                    if (this.mousePosition) {
                        this.mousePositionAsFraction = this.mousePosition / this.sliderElem.offsetWidth;
                    }
                }

                onSliderClick(event) {
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
                        this.$element[0].querySelector('.slider-handle').style.left = event.target.offsetLeft +
                            event.offsetX + 'px';
                        let position = event.target.offsetLeft + event.offsetX;
                        this.seekToPosition((position / this.sliderElem.offsetWidth), 'scrubber');
                    }
                }

                calcAdBreakStyle(adBreak) {
                    return {
                        left: (adBreak.startTime * 100 / (this.max * 1000)) + '%',
                        width: (adBreak.duration * 100 / (this.max * 1000)) + '%'
                    };
                }

                onKeyUp(event) {
                    this.mousePosition = null;
                    if (this.seeking) {
                        return;
                    }
                    if (event.keyCode === 39 || event.keyCode === 38) { // right, up
                        this.skip(1);
                    } else if (event.keyCode === 37 || event.keyCode === 40) { // left, down
                        this.skip(-1);
                    }
                }


                valueMax() {
                    return Math.round(this.max / 60);
                }

                valueNow() {
                    return Math.round(this.value / 60);
                }

                getTooltipMessage() {
                    let msg = '';
                    if ((this.ffDisabled && (!this.mousePosition || !this.isMouseOnSelectedSlider)) ||
                        (this.isAdPlaying && this.mousePosition)) {
                        msg = 'Fast forward is disabled for the duration of this content';
                    }
                    return msg;
                }

                calcSliderHandlePosition() {
                    if (!this.sliderDragging) {
                        return {
                            left: ((this.value / this.max) * 100) + '%'
                        };
                    }
                    return {
                        left: this.mousePosition
                    };
                }

                calcStartTime() {
                    if (this.mousePosition) {
                        return parseInt((this.mousePosition / this.sliderElem.offsetWidth) * this.max);
                    } else {
                        return this.value;
                    }
                }

                calcSliderSelectionWidthFraction() {
                    let width = (this.value / this.max);
                    if (this.sliderDragging && !this.isAdPlaying) {
                        if (this.isPastBuffer(this.mousePositionAsFraction)) {
                            width = this.bufferTime / this.max;
                        } else {
                            width = this.mousePositionAsFraction;
                        }
                    }
                    return width;
                }

                calcSliderSelectionStyle() {
                    return {
                        left: '0px',
                        width: (this.calcSliderSelectionWidthFraction() * 100) + '%'
                    };
                }

                calcSliderBufferStyle() {
                    let left = this.calcSliderSelectionStyle().width,
                        //(bufferTime - currentTime) / length of program (52 minutes - 38 minutes) / 60 minutes
                        width = (((this.bufferTime - this.value) / this.max) * 100) + '%';

                    if (this.sliderDragging) {
                        if (this.isPastBuffer(this.mousePositionAsFraction)) {
                            width = 0;
                        } else {
                            let bufferPositionAsPercentage = this.bufferTime / this.max,
                                widthPercentage = bufferPositionAsPercentage - this.mousePositionAsFraction;
                            width = widthPercentage * 100 + '%';
                        }

                    }
                    return {
                        left: left,
                        width: width
                    };
                }

                calcSliderHighStyle() {
                    let sliderWidth,
                        width = (100 - ((this.value / this.max) * 100)) + '%';
                    if (this.sliderDragging && !this.isAdPlaying) {
                        if (this.isPastBuffer(this.mousePositionAsFraction)) {
                            width = (100 - ((this.bufferTime / this.max) * 100)) + '%';
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

                calcTooltipPosition() {
                    // Arrow at center
                    let tooltipWidth = this.$element[0].querySelector('.slider-tooltip').offsetWidth / 2,
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
                        let newPos = (this.value / this.max);
                        result.tooltip.left = (newPos * 100) + '%';
                    }

                    return result;
                }

                onMouseMove(event) {
                    // Ignore if dragging. The events from the slider move will take care of position
                    if (this.sliderDragging) {
                        return;
                    }

                    let sliderWidth = this.sliderElem.offsetWidth;
                    this.mousePosition = event.target.offsetLeft + event.offsetX;
                    this.isMouseOnSelectedSlider =
                        this.$element[0].querySelector('.slider-handle').offsetLeft > this.mousePosition;
                    if (this.mousePosition < 0) {
                        this.mousePosition = 0;
                    } else if (this.mousePosition > sliderWidth) {
                        this.mousePosition = sliderWidth;
                    }
                }

                onMouseEnter() {
                    this.sliderFocused = true;
                    this.mouseOverSlider = true;
                }

                onMouseLeave() {
                    this.mouseOverSlider = false;

                    // Keep slider focused even if mouse moved away.
                    if (!this.sliderDragging) {
                        this.sliderFocused = false;
                        this.mousePosition = null;
                    }
                }

                onPlayerEndPositionChanged (time) {
                    if (this.showBuffer) {
                        this.bufferTime = time.endPosition / 1000;
                        this.calcSliderBufferStyle();
                    }
                }

                isPastBuffer(position) {
                    let desiredPositionInSeconds = position * this.max;
                    return this.showBuffer && desiredPositionInSeconds > this.bufferTime;
                }

                seekToPosition(position, sourceElement) {
                    if (this.isAdPlaying) {
                        return;
                    }

                    let absPositionSec;
                    position = Math.min(1, position);

                    // Position at this point is percentage of the UI
                    // width. Convert this to an absolute value of the
                    // actual asset length.
                    absPositionSec = Math.floor(position * this.max);
                    this.$scope.$emit('seek-to-position', {positionSec: absPositionSec, sourceElement: sourceElement});
                }

                skip(multiplier) {
                    this.value += (this.skipSeconds * multiplier);
                    this.seekToPosition(this.value / this.max, 'skipButton');
                }
            }
        });
})();
