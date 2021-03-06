/* globals $ */
'use strict';

(function () {
    'use strict';

    guideChannelRowDirective.$inject = ["$compile", "$animate", "$interpolate", "$state", "$window", "rx", "$q", "guideChannelRowCoordinator", "profileService"];
    var template = '\n        <a id=\'{{::channelIndex}}-{{::showKey}}\' class=\'channel-content {{onnow}} {{::timeZoneClass}}\n            {{iconClasses}} {{paddingClass}}\'\n            href=\'{{link}}\'\n            data-show-id=\'{{::showKey}}\'\n            style="width:{{::width}}px; left:{{::left}}px; padding-left: {{contentShiftPadding}}px;"\n            tabindex=\'-1\'\n            aria-describedby=\'rowheader-{{::channelIndex}} {{::timeColumn}}\'\n            ng-style=\'showstyle\'>\n                <div class=\'title-line event-off flex-box\'>\n                    <div class=\'title truncate\'>{{::show.title}}</div>\n                    <span class=\'restart {{(ondemandLink)?\'\':\'hide\'}}\' aria-label=\'Available on demand\'></span>\n                </div>\n                <div class=\'show-details truncate event-off\'>\n                    <span class=\'recording-status\'>{{show.recordingElement}}</span>\n                    <span class=\'new-status\'>New</span>\n                    <span class=\'subtitle\'>{{::show.metadata.title || show.shortDesc }}</span>\n                </div>\n        </a>\n    ';

    angular.module('ovpApp.guide').directive('guideChannelRow', guideChannelRowDirective).factory('guideChannelRowCoordinator', guideChannelRowCoordinator);

    /* @ngInject */
    function guideChannelRowDirective($compile, $animate, $interpolate, $state, $window, rx, $q, guideChannelRowCoordinator, profileService) {
        return {
            restrict: 'E',
            replace: true,
            require: '^guide-scroll-container',
            template: '<div class=\'channel-listings-row\'>\n                <span id=\'{{::id()}}\' class=\'accessibilityhidden\'>\n                    {{::description()}}\n                </span>\n                </div>',
            link: function link($scope, $element, $attr, $ctrl) {
                var cachedWatchers = null;
                var content = {};
                var pixPerHour = $ctrl.getPixelsPerHour();
                var interpolateFn = $interpolate(template);
                var deRegisterWatch = null;
                var scrollOffset = 0;
                var injectCallback;
                var selfFocus = false;
                var delayedInvalidate = false;
                var focusRestore = false;

                //If this channel is not included in the 'displayZone' then
                //prevent the watchers from being executed in the digest cycle
                $scope.$on('displayZone', function (event, channelZones) {
                    // manageShowElements(timeZones);

                    if (channelZones.indexOf($scope.zone.zoneIndex) >= 0 || $ctrl.adjacentZone($scope.zone.zoneIndex, channelZones)) {
                        if (delayedInvalidate) {
                            wipeData();
                        }
                        $element.show();
                        if (cachedWatchers) {
                            $scope.$$watchers = cachedWatchers;
                            cachedWatchers = null;
                        }
                        $scope.channel.displayed = true;
                        mergeStaged();
                    } else if (deRegisterWatch !== null) {
                        $scope.channel.displayed = false;
                        // This causes a repaint, and may be counter productive
                        deRegisterWatch();
                        deRegisterWatch = null;
                    }
                });

                $scope.$on('guide:invalidateData', function () {
                    //This will get picked up in next digest cycle
                    delayedInvalidate = true;
                    $scope.channel.staged = [];
                });

                $scope.$on('guide:updateRecordings', function () {
                    if ($scope.channel.recordings) {
                        Object.keys(content).forEach(function (showKey) {
                            var show = content[showKey];
                            var currentRecordingElement = show.recordingElement;
                            setRecordingElement(show);
                            if (show.recordingElement !== currentRecordingElement) {
                                $element.find('.channel-content[data-show-id=\'' + showKey + '\'] .recording-status').html(show.recordingElement);
                            }
                        });
                    }
                });

                $scope.$on('guide:clearRecordings', function () {
                    $element.find('.recording-status').removeClass('recording series');
                    $scope.channel.recordings = null;
                    Object.keys(content).forEach(function (showKey) {
                        content[showKey].recordingElement = null;
                    });
                });

                //This is kind of a nasty solution, but the alternative is a:
                // $scope.$on('guide:focus', focusShow); which is more of a shotgun approach that
                // seemed to be causing issues on slow devices;
                if ($scope.channel) {
                    $scope.channel.focusIn = function (time, show) {
                        return focusShow(time, show);
                    };
                }

                guideChannelRowCoordinator.getDebouncedAdjustOffsetSource($scope).subscribe(function (data) {
                    scrollOffset = data[1];
                    if ($scope.channel.displayed) {
                        if ($window.requestAnimationFrame) {
                            $window.requestAnimationFrame(function () {
                                adjustShowPadding(scrollOffset);
                            });
                        } else {
                            adjustShowPadding(scrollOffset);
                        }
                    }
                });

                $scope.id = function () {
                    if (!$scope.channel) {
                        return '';
                    }

                    return 'rowheader-' + $scope.channel.globalIndex;
                };

                $scope.description = function () {
                    var chan = $scope.channel;
                    if (!chan) {
                        return '';
                    }

                    var hasChannelNumber = !profileService.isSpecU() && angular.isDefined(chan.channelNumber);
                    var number = hasChannelNumber ? chan.channelNumber : '';

                    return 'Channel ' + number + ' ' + (chan.networkName || chan.callSign);
                };

                $scope.getShow = function (showId) {
                    var show = content[showId];
                    if (!show) {
                        return content[showId.replace($scope.channel.globalIndex + '-', '')];
                    }
                    return show;
                };

                $element.on('focusin', '.channel-content', function (e) {
                    if (!selfFocus) {
                        var focusScope = angular.element(e.target).scope();
                        var show = focusScope.getShow(angular.element(e.target).attr('id'));
                        $scope.vm.setFocus(focusScope.zone, focusScope.channel, show);
                    }
                });

                $element.on('click', '.channel-content', function (e) {
                    var anchorScope = angular.element(e.target).scope();
                    var show = anchorScope.getShow(angular.element(e.target).attr('id'));
                    anchorScope.$root.$emit('Analytics:selectContent', {
                        showFromGuide: show,
                        channel: $scope.channel,
                        elementType: 'cell',
                        pageSectionName: 'guideArea',
                        pageSubSectionName: 'programCell'
                    });
                });

                function wipeData() {
                    delayedInvalidate = false;
                    content = {};
                    var focus = $element.find('.channel-content:focus');
                    if (focus.length > 0) {
                        focusRestore = focus.data('show-id');
                    }
                    $element.find('.channel-content').remove();
                }

                /**
                 * Pull any content out of the staged variable. This helps ensure that - if the watcher is not active
                 * (due to the above caching of the watcher)
                 * then we don't accidentally merge it into an unwatched array.
                 */
                function mergeStaged() {
                    if ($scope.channel.staged && $scope.channel.staged.length > 0) {
                        (function () {
                            var staged = $scope.channel.staged.reduce(function (memo, show) {
                                var showKey = getShowKey(show);
                                if (!content[showKey] && !memo[showKey]) {
                                    memo[showKey] = show;
                                    setRecordingElement(show);
                                }
                                return memo;
                            }, {});
                            $scope.channel.staged = [];
                            //Attempt to render these elements in an animation frame
                            if ($window.requestAnimationFrame) {
                                $window.requestAnimationFrame(function () {
                                    injectShows(staged);
                                });
                            } else {
                                injectShows(staged);
                            }
                            // adjustShowPadding(scrollOffset);
                        })();
                    }
                    if (deRegisterWatch === null) {
                        deRegisterWatch = $scope.$watch('channel.staged', function (nv) {
                            if (nv && nv.length > 0) {
                                mergeStaged();
                            }
                        });
                    }
                }

                /**
                 * Generate template data and apply it against the template.
                 * @param  {Object[]} shows to create template from
                 */
                function injectShows(shows) {
                    var added = '';
                    var foundFocus = false;

                    Object.keys(shows).map(function (showKey) {
                        return shows[showKey];
                    }).sort(function (a, b) {
                        return a.startTimeOffset - b.startTimeOffset;
                    }).forEach(function (show) {
                        var showKey = getShowKey(show);
                        if (showKey === focusRestore && !foundFocus) {
                            foundFocus = true;
                        }
                        var data = calculateShowPostion(show);
                        data.showKey = showKey;
                        data.show = show;
                        data.link = generateLink(show);
                        data.iconClasses = show.icons.map(function (s) {
                            return s.toLowerCase();
                        }).join(' ');
                        data.channelIndex = $scope.channel.globalIndex;
                        data.ondemandLink = show.vodProviderAssetId ? true : false;
                        added += interpolateFn(data);
                        content[showKey] = show;
                    });
                    $animate.enter(added, $element).then(function () {
                        if (injectCallback) {
                            injectCallback(shows);
                            injectCallback = null;
                        }
                        if (foundFocus && focusRestore) {
                            $element.children('.channel-content[data-show-id=\'' + focusRestore + '\']').focus();
                            foundFocus = false;
                            focusRestore = false;
                        }
                    });
                }

                /**
                 * Gerenarete a 'unique' key based on the show data. The key is only unique within the channel - it
                 * may not be unique in the entire page since channels may be duplicated.
                 * @param  {Object} show
                 * @return {String}
                 */
                function getShowKey(show) {
                    return show.startTimeSec + '-' + show.tmsProgramId;
                }

                /**
                 * Calculate the absolute position and width based on the determined pixel width
                 * @param  {Object} show
                 * @return {Object} position class and style data
                 */
                function calculateShowPostion(show) {
                    var durationPix = 0;
                    var startPix = undefined;
                    var zone = 0;
                    var zoneWidthSeconds = 4 * 3600; //Zone is 4 hours wide ...
                    var endTimeUtcSeconds = show.durationMinutes * 60 + show.startTimeSec;
                    var onNow = '';
                    var pad = 0;
                    var paddingClass = '';

                    if (show.startTimeOffset < 0) {
                        startPix = 0;
                        durationPix = Math.floor((show.durationMinutes / 60 + show.startTimeOffset / 3600) * pixPerHour);
                        zone = 'zone_' + Math.floor(show.startTimeOffset / zoneWidthSeconds);
                    } else {
                        startPix = Math.floor(show.startTimeOffset / 3600 * pixPerHour);
                        durationPix = Math.floor(show.durationMinutes / 60 * pixPerHour);
                        zone = 'zone_' + Math.floor(show.startTimeOffset / zoneWidthSeconds);
                    }

                    var now = Date.now();
                    if (now > show.startTimeSec * 1000 && now < endTimeUtcSeconds * 1000) {
                        onNow = 'onnow';
                    }
                    show.startPix = startPix;
                    show.endPix = startPix + durationPix;

                    if (show.startPix < scrollOffset && show.endPix > scrollOffset) {
                        pad = scrollOffset - show.startPix + 20;
                    } else {
                        paddingClass = 'normal-pos';
                    }

                    return {
                        contentShiftPadding: pad,
                        paddingClass: paddingClass,
                        left: startPix,
                        width: durationPix,
                        timeZoneClass: zone,
                        onnow: onNow,
                        timeColumn: 'timecol_' + Math.floor(show.startTimeOffset / (60 * 30))
                    };
                }

                /**
                 * Generate the text url to display
                 * @param  {Object} show show element
                 * @return {String}      link to product page
                 */
                function generateLink(show) {
                    var productState = 'product.event';
                    var productStateOptions = {
                        tmsId: show.tmsProgramId,
                        tmsProgramId: show.tmsProgramId,
                        airtime: show.startTimeSec,
                        app: 'guide',
                        tmsGuideServiceId: $scope.channel.tmsGuideId,
                        displayChannel: $scope.channel.channelNumber || show.channelNumber
                    };

                    if (show.metadata && show.metadata.tmsSeriesId) {
                        productState = 'product.series';
                        productStateOptions.tmsSeriesId = show.metadata.tmsSeriesId;
                    }
                    show.state = productState;
                    show.stateOptions = productStateOptions;

                    return $state.href(productState, productStateOptions);
                }

                /**
                 * Determine the recording status classes
                 * @param {Object} show show object that might have
                 */
                function setRecordingElement(show) {
                    if (show.cdvrSeries && show.cdvrState) {
                        show.recordingElement = '<span class= "twcicon-svg twcicon-svg-recording-series"' + 'aria-label="Scheduled to record"></span>';
                    } else if (show.cdvrState) {
                        show.recordingElement = '<span class= "twcicon-svg twcicon-svg-recording"' + 'aria-label="Scheduled to record"></span>';
                    } else if ($scope.channel.recordings && $scope.channel.recordings[show.tmsProgramId]) {
                        show.recording = $scope.channel.recordings[show.tmsProgramId];
                        if (show.recording.recordSeries) {
                            show.recordingElement = '<span class= "twcicon-svg twcicon-svg-recording-series"' + 'aria-label="Scheduled to record"></span>';
                        } else {
                            show.recordingElement = '<span class= "twcicon-svg twcicon-svg-recording"' + 'aria-label="Scheduled to record"></span>';
                        }
                        return true;
                    } else {
                        show.recording = null;
                        show.recordingElement = '';
                        return false;
                    }
                }

                /**
                 * Given the x-axis scroll offset - add padding inside the cell to position the contents in the
                 * visible area
                 * @param  {int} pixOffset the current pixel scroll offset of the container element
                 * @return undefined
                 */
                function adjustShowPadding(pixOffset) {
                    Object.keys(content).forEach(function (showKey) {
                        if (content[showKey].startPix < pixOffset && content[showKey].endPix > pixOffset) {
                            var padd = pixOffset - content[showKey].startPix + 20;
                            getShowElement(showKey, $scope.channel.globalIndex).removeClass('normal-pos').css('padding-left', padd);
                        } else {
                            getShowElement(showKey, $scope.channel.globalIndex).addClass('normal-pos');
                        }
                    });
                }

                /**
                 * Get the element from the page and cache it in the show object, return the cached
                 * element if it exists.
                 * @param  {String} showKey the string key from 'getShowKey'
                 * @return {jQuery element}
                 */
                function getShowElement(showKey, index) {
                    var show = content[showKey];
                    if (!show) {
                        throw 'Unable to find the show: ' + showKey + ' on Channel:  ' + index;
                    }
                    if (!show.el) {
                        show.el = {};
                    }
                    if (!show.el[index]) {
                        show.el[index] = $element.children('.channel-content[data-show-id=\'' + showKey + '\']');
                    }
                    return show.el[index];
                }

                /**
                 * Given a given time, find the show that appears during that time
                 * @param  {event} event
                 * @param  {int} channelNumber
                 * @param  {int} timeSlot
                 * @param  {function} onFocusCallback function to call when a show has been found and focused
                 * @return undefined
                 */
                function focusShow(timeSlot, show) {
                    var setInjectCallBack = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

                    var showkey = null;
                    if (show) {
                        showkey = getShowKey(show);
                    } else {
                        showkey = Object.keys(content).find(function (showKey) {
                            var showEndOffsetSeconds = content[showKey].startTimeOffset + content[showKey].durationMinutes * 60;
                            return content[showKey].startTimeOffset <= timeSlot && timeSlot < showEndOffsetSeconds;
                        });
                    }
                    if (!showkey) {
                        if (setInjectCallBack) {
                            var _ret2 = (function () {
                                var defer = $q.defer();
                                injectCallback = function () {
                                    focusShow(timeSlot, show, false).then(function (focusShow) {
                                        defer.resolve(focusShow);
                                    });
                                };
                                return {
                                    v: defer.promise
                                };
                            })();

                            if (typeof _ret2 === 'object') return _ret2.v;
                        } else {
                            return $q.resolve(false);
                        }
                    } else {
                        var el = undefined;
                        try {
                            el = getShowElement(showkey, $scope.channel.globalIndex);
                        } catch (e) {
                            //The show likely hasn't been displayed yet
                            return $q.reject(e);
                        }
                        selfFocus = true;
                        el.focus();
                        selfFocus = false;
                        angular.element('#guide-channels-body').attr('aria-activedecendent', el.attr('id'));
                        //Check to ensure the focus is not underneath the fixed header
                        if (el.offset().top - angular.element($window).scrollTop() < 130) {
                            $('html, body').animate({
                                scrollTop: el.offset().top - 130
                            }, 200);
                        }
                        return $q.resolve(content[showkey]);
                    }
                }
            }
        };
    }

    // Each channel row doing its own debouncing results in extraneous overhead in the form of timers.
    // This coordinator service does the debouncing once, and shares it with all the channel rows.
    /* @ngInject */
    function guideChannelRowCoordinator() {
        var observable = undefined;

        var service = {
            getDebouncedAdjustOffsetSource: function getDebouncedAdjustOffsetSource(scope) {
                if (!observable) {
                    observable = scope.$eventToObservable('guide:adjustOffset').debounce(60).share();
                }
                return observable;
            }
        };

        return service;
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/guide/guide-channel-row-directive.js.map
