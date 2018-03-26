/* globals document */
'use strict';

(function () {
    'use strict';

    GuideDateDirective.$inject = ["moment", "$timeout", "GuideService", "$rootScope", "$interpolate", "rx"];
    angular.module('ovpApp.guide').directive('guideDate', GuideDateDirective);

    function GuideDateDirective(moment, $timeout, GuideService, $rootScope, $interpolate, rx) {

        return {
            restrict: 'E',
            templateUrl: '/js/ovpApp/guide/guide-date-directive.html',
            scope: {
                onDateToggle: '=',
                jumpToDay: '=',
                times: '='
            },
            compile: function compile(tElement) {
                var template = tElement.find('.time-container').html(),
                    interpol = $interpolate(template);
                tElement.find('.time-container').empty();
                return function ($scope, $element) {
                    var days = [],
                        dayHeight = 0,
                        zero = GuideService.getZeroHour(),
                        startMoment = moment(zero),
                        timesDeregister,
                        localTimeIndex = 0,
                        pendingMove = false,
                        pendingPage = null,
                        currentDay = null;

                    $scope.timeIndex = 0;
                    $scope.dayOffset = 0;
                    $scope.dates = days;
                    $scope.showDate = false;
                    $scope.dateCarouselConfig = {
                        ariaLabel: '',
                        supportVariableWidth: true,
                        arrowIconClass: 'small-arrow-icon',
                        useArrows: false
                    };

                    generateDayList(startMoment.hours());

                    updateCurrentDate(currentDay);

                    // escape key should close date picker
                    tElement.on('keyup', function (e) {
                        if (e.which === 27) {
                            if ($scope.showDate) {
                                $scope.toggleDate();
                                $timeout(function () {
                                    angular.element('.date-picker-button').focus();
                                });
                            }
                        }
                    });

                    $scope.$on('guide:timejump', function (event, time) {
                        generateDayList(moment(time).hours());
                    });

                    $rootScope.$on('guide:updateTodaysDate', function (event) {
                        $scope.handleDateClick(days[0], event);
                    });

                    $scope.jumpTo = function (date) {
                        $rootScope.$broadcast('guide:timejump', date.start);
                        startMoment = moment(date.start);
                        pendingMove = true;
                        localTimeIndex = $scope.times.indexOf(date.start);
                        if (localTimeIndex < 0) {
                            localTimeIndex = 0;
                        }
                        $scope.currentDate = date;
                    };

                    $scope.toggleDate = function () {
                        $scope.showDate = !$scope.showDate;
                        $scope.onDateToggle($scope.showDate);
                        if ($scope.showDate) {
                            focusCurrent();
                        }
                    };

                    $scope.nextTimeBlock = function () {
                        sendPageUpdate(4);
                    };

                    $scope.prevTimeBlock = function () {
                        sendPageUpdate(-4);
                    };

                    timesDeregister = $scope.$watch('times', function (nv) {
                        if (nv) {
                            var contain = $element.find('.time-container');
                            contain.append(nv.reduce(function (times, time, idx) {
                                times += interpol({
                                    time: time,
                                    visible: idx < 4
                                });
                                return times;
                            }, ''));
                            timesDeregister();
                        }
                    });

                    //Find the height we need to shift the display by to show the _next_ element
                    $timeout(function () {
                        dayHeight = $element.find('.day-box').height();
                    }, 100);

                    $rootScope.$eventToObservable('guide:timeScroll')
                    //Using debounce to limit the number of updates, this also keeps the screen reader happy
                    .debounce(function () {
                        return rx.Observable.timer(600);
                    }).subscribe(function (data) {
                        var hoursPastStart = data[1];
                        $scope.timeIndex = 2 * Math.floor(hoursPastStart);
                        localTimeIndex = $scope.timeIndex;
                        // Calculate currentTime where the user has scrolled to.
                        var currentPosition = $scope.times[$scope.timeIndex];
                        // Calculate the day from currentPosition.
                        var daymovedTo = moment(currentPosition).startOf('day');
                        // Set currentDay to the day where user has scrolled to.
                        // This will be used to update the date/day in the day-box-container.
                        currentDay = days.find(function (d) {
                            return d.startOfDay === daymovedTo.unix() * 1000;
                        });
                        updateCurrentDate(currentDay);
                        pendingMove = false;
                        $scope.$apply();
                    });

                    function updateCurrentDate(currentDay) {
                        var alertDate = $element.find('#date-time-alert').html();
                        var newDate = startMoment.format('dddd MMMM Do');
                        if (newDate !== alertDate) {
                            $element.find('#date-time-alert').html(newDate);
                        }
                        $scope.currentDate = {
                            dow: currentDay.dow,
                            day: currentDay.day,
                            ariaLabel: currentDay.ariaLabel,
                            start: currentDay.start
                        };
                    }

                    $scope.handleDateClick = function (item, $event) {
                        currentDay = item;
                        $scope.jumpTo(item);
                        $event.preventDefault();

                        if ($event.stopPropagation) {
                            $event.stopPropagation();
                        }
                        //Force close instead of using toggleDate to make sure we are closing
                        $scope.showDate = false;
                        $scope.onDateToggle($scope.showDate);
                    };

                    $scope.focusDayBox = function () {
                        $element.find('.day-box-holder').focus();
                    };

                    function generateDayList(hours) {
                        zero = new Date(zero).setHours(hours);
                        startMoment = moment(zero);
                        days = []; // Reset
                        $scope.dates = days;

                        days.push({
                            dow: 'Today',
                            ariaLabel: 'Today, ' + moment(zero).format('MMMM Do'),
                            day: moment(zero).format('MMM Do'),
                            start: startMoment.unix() * 1000,
                            startOfDay: startMoment.startOf('day').unix() * 1000
                        });
                        for (var i = 1; i < 14; i++) {
                            var cd = moment(zero).add(i, 'days');
                            var day = {
                                dow: cd.format('dddd'),
                                ariaLabel: cd.format('dddd, MMMM Do'),
                                day: cd.format('MMM Do'),
                                start: cd.unix() * 1000,
                                startOfDay: cd.startOf('day').unix() * 1000
                            };
                            days.push(day);
                        }
                        currentDay = days[0];
                    }

                    function sendPageUpdate(moveIndex) {
                        if ($scope.times[localTimeIndex + moveIndex]) {
                            localTimeIndex = localTimeIndex + moveIndex;
                            if (!pendingMove && pendingPage === null) {
                                // set the startMoment when it has been changed
                                // due to scrolling. It is used by timescroll to set the correct date.
                                startMoment = moment($scope.times[localTimeIndex]);
                                $rootScope.$broadcast('guide:timejump', $scope.times[localTimeIndex]);
                                pendingMove = true;
                            } else {
                                if (pendingPage) {
                                    $timeout.cancel(pendingPage);
                                    pendingPage = null;
                                }
                                pendingPage = $timeout(function () {
                                    $rootScope.$broadcast('guide:timejump', $scope.times[localTimeIndex]);
                                    pendingMove = true;
                                    pendingPage = null;
                                });
                            }
                            updateTimeVisibility(localTimeIndex);
                        }
                    }

                    function updateTimeVisibility(startIndex) {
                        var range = getRange(startIndex, 4);
                        // set the existing visible to hidden
                        var visibleTimes = document.querySelectorAll('.time-position[aria-hidden=false]');
                        for (var i = 0; i < visibleTimes.length; i++) {
                            angular.element(visibleTimes[i]).attr('aria-hidden', true);
                        }

                        for (var n = 0; n < range.length; n++) {
                            var el = document.querySelector('.time-position[time="' + $scope.times[range[n]] + '"]');
                            if (el) {
                                angular.element(el).attr('aria-hidden', false);
                            }
                        }
                    }

                    function getRange(start, number) {
                        return Array.from(new Array(number), function (x, i) {
                            return i + start;
                        });
                    }

                    function focusCurrent() {
                        //Make sure the UI has been updated
                        $timeout(function () {
                            var el = $element.find('.day-box:[start=' + currentDay.start + ']');
                            if (el.length > 0) {
                                el.focus();
                            } else {
                                $element.find('.day-box').first().focus();
                            }
                        });
                    }
                };
            }
        };
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/guide/guide-date-directive.js.map
