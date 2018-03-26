'use strict';

(function () {
    'use strict';

    guideTimeContainerDirective.$inject = ["$window", "GuideService", "$timeout", "$interpolate"];
    angular.module('ovpApp.guide').directive('guideTimeContainer', guideTimeContainerDirective);

    /**
     * This directive manages cooordianting the scrolling along the time axis (x) and fetching the channel data
     * as it comes into view.
     */
    /* @ngInject */
    function guideTimeContainerDirective($window, GuideService, $timeout, $interpolate) {
        return {
            restrict: 'A',
            require: '^guide-scroll-container',
            compile: function compile(tElement) {
                var container = tElement.find('#hidden-time-row');
                var timeRowTemplate = $interpolate(container.html());
                container.html('');

                return function guideTimeLink($scope, $element, $attr, $ctrl) {
                    var hoursPastZero,
                        lastTimeTime = 0,
                        lastTimePos = 0,
                        leftOffset = 0,
                        $times;

                    $scope.$watch('vm.times', function (nv) {
                        if (nv) {
                            var timeHtml = nv.reduce(function (memo, time, idx) {
                                memo += timeRowTemplate({ index: idx, time: time.time });
                                return memo;
                            }, '');
                            container.html(timeHtml);
                        }
                    });

                    $element.bind('scroll', function () {
                        leftOffset = $element.scrollLeft();

                        if (!$times || $times.length === 0) {
                            $times = $element.parents('.wrap').find('.guide-header .time-container');
                        }

                        $times.css({
                            transform: 'translateX(' + -1 * leftOffset + 'px)'
                        });

                        var currentHoursPastZero = Math.floor(leftOffset / $ctrl.getPixelsPerHour());
                        if (currentHoursPastZero !== hoursPastZero) {
                            hoursPastZero = currentHoursPastZero;
                            $scope.$emit('guide:timeScroll', hoursPastZero);
                        }

                        $scope.$broadcast('guide:adjustOffset', leftOffset, currentHoursPastZero);

                        var scrollTime = Date.now();
                        var currentVelocity = $ctrl.calculateVelocity(lastTimeTime, lastTimePos, scrollTime, leftOffset);
                        $ctrl.scrollHandler(leftOffset, null, currentVelocity);
                        lastTimeTime = scrollTime;
                        lastTimePos = leftOffset;
                    });

                    $scope.$on('displayZone', function () {
                        $timeout(function () {
                            $scope.$broadcast('guide:adjustOffset', leftOffset);
                        }, 100);
                    });

                    $scope.$on('guide:timejump', function (event, time) {
                        var offsetTimeMicros = time - GuideService.getZeroHour().getTime();
                        var offsetPix = offsetTimeMicros / (3600 * 1000) * $ctrl.getPixelsPerHour();
                        $element.animate({
                            scrollLeft: offsetPix
                        });
                    });
                };
            }
        };
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/guide/guide-time-container-directive.js.map
