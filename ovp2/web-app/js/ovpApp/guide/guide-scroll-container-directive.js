/*globals $*/
(function () {
    'use strict';

    angular.module('ovpApp.guide')
        .controller('GuideScrollContainerController', ContainerController)
        .directive('guideScrollContainer', guideScrollContainerDirective);

    /**
     * The guideScrollContainer handles a large portion of the performance enhancements required to make the guide
     * work. This includes using custom templating/compiling instead of ng-repeat. And calculating what is on screen
     * at any given time to ensure that we don't attempty to do any calculations on anything that isn't currently
     * visible.
     *
     * The high level operations
     * - Calculate the size of the page and emit the results
     * - Create zone containers in the page to help position the elements in the page
     * - - Create the channel headers
     * - - Create the channel rows
     * - Check the scroll position to determine what zone should be displayed
     * - broadcast the position and let channel-row-directive and guide-show-directive detemine if they should display
     */
    /* @ngInject */
    function guideScrollContainerDirective($window, $compile, $interpolate, $timeout, $rootScope, favoritesService,
        config, profileService) {

        return {
            restrict: 'E',
            templateUrl: '/js/ovpApp/guide/guide.html',
            controller: 'GuideScrollContainerController',
            controllerAs: 'scroll',
            replace: true,
            compile: function (tElement) {
                //Create templates from the underlying elements. This is to get around the usage of ng-repeat so that
                //we can take some shortcuts for performance reasons.
                let heading = tElement.find('.channel-heading');
                //Using interpolate since the left hand channel row heading does not need need to have any active
                //elements except the favorite 'checkbox'. This allows us to generate this only once and leave it
                //on the page.
                let channelHeaderTemplate = $interpolate(heading.html());
                let channelRowContainer = tElement.find('.channel-content-list-body');

                //This compiles the channel row container so that we can render each row on an as needed basis.
                //ng-repeat was proving to be a performance bottleneck because it could only render the entire
                //list. This helps to only execute the compiled template on rows that are currently in view.
                let channelRowTemplate = $compile(channelRowContainer.html());
                channelRowContainer.empty();
                heading.empty();

                return function ($scope, $element, $attr, $ctrl) {
                    var $win = angular.element($window),
                        viewportHeight,
                        pixelsPerHour,
                        pixelsPerChannel = 76,
                        topPos = 0,
                        lastTopPos = 0,
                        lastTopTime = 0,
                        allRowScopes = [],
                        disableResize = false,
                        pendingResize = false;

                    if ($element.is(':visible')) {
                        onceVisible();
                    } else {
                        $timeout(onceVisible, 50);
                    }

                    $win.on('scroll', onScroll);
                    $win.on('resize', pixelsPerHourCalc);

                    $scope.$on('$destroy', function () {
                        $win.off('scroll', onScroll);
                        $win.off('resize', pixelsPerHourCalc);
                    });

                    $element.find('.channel-heading').on('focus', (ev) => {
                        //Pass the focus to the first channel header.
                        ev.target.firstChild.firstChild.focus();
                    });

                    function focusNextChannelHeader(ev) {
                        if (!ev.target.nextElementSibling) {
                            if (ev.target.parentNode.nextElementSibling &&
                                ev.target.parentNode.nextElementSibling.firstChild) {
                                angular.element(ev.target.parentNode.nextElementSibling.firstChild).focus();
                            }
                        } else {
                            angular.element(ev.target.nextElementSibling).focus();
                        }
                        ev.preventDefault();
                        ev.stopPropagation();
                    }

                    function focusPrevChannelHeader(ev) {
                        if (!ev.target.previousElementSibling) {
                            if (ev.target.parentNode.previousElementSibling &&
                                ev.target.parentNode.previousElementSibling.lastChild) {
                                angular.element(ev.target.parentNode.previousElementSibling.lastChild).focus();
                            }
                        } else {
                            angular.element(ev.target.previousElementSibling).focus();
                        }
                        ev.preventDefault();
                        ev.stopPropagation();
                    }

                    function favoriteAria(chan) {
                        const hasChanNumber = !profileService.isSpecU() && angular.isDefined(chan.channelNumber);
                        const chanNumber = hasChanNumber ? `, Channel ${chan.channelNumber}` : '';
                        const favorite = chan.favorite ? ' Favorite' : '';
                        return `${chan.callSign}${chanNumber}${favorite}`;
                    }

                    //Click handler for the favorite icon, listens on the entire list and locates clock events
                    $element.find('.channel-heading').on('click keydown', '.channel-header-row', (ev) => {
                        const keys = {
                            left: 37,
                            up: 38,
                            down: 39,
                            right: 40,
                            tab: 9,
                            space: 32,
                            enter: 13
                        };
                        let clickTarget = angular.element(ev.target);
                        if (!clickTarget.is('.channel-header-row')) {
                            clickTarget = clickTarget.parents('.channel-header-row');
                        }
                        let channelIndex = clickTarget.attr('channel-index');
                        let el = clickTarget.find('.favorite');
                        let chan = $scope.vm.channels.find(channel => channelIndex == channel.globalIndex);
                        if (ev.keyCode === keys.down || ev.keyCode === keys.right) {
                            focusNextChannelHeader(ev);
                        } else if (ev.keyCode === keys.left || ev.keyCode === keys.up) {
                            focusPrevChannelHeader(ev);
                        } else if (ev.keyCode === keys.tab) {
                            if (ev.shiftKey) {
                                // Shift + tab handling
                                angular.element('.channel-filter a.filter').last().focus();
                            } else {
                                //Move focus to first grid cell of that channel;
                                $scope.vm.setFocus(null, chan);
                            }
                            ev.preventDefault();
                            ev.stopPropagation();
                        }
                        // Enter and Space and Click handling
                        if (ev.keyCode === keys.enter || ev.keyCode === keys.space || ev.type == 'click') {
                            if (chan) {
                                chan.favorite = !chan.favorite;
                                favoritesService.toggleFavorite(
                                   chan);
                                el.toggleClass('favon');
                                clickTarget.attr('aria-label', favoriteAria(chan));
                            }
                            ev.preventDefault();
                        }
                    });

                    $scope.$on('guide:updateZones', function () {
                        buildChannelZoneElements($scope.vm.zoneData);
                        let count = $scope.vm.zoneData.reduce((mem, zone) => {
                            return zone.zoneChannels.length + mem;
                        }, 0);
                        $('#guideAlert').html('<span >' + count + ' channels in filter</span>');
                        $ctrl.forceFetchCurrent();
                    });

                    //Called when the guide data needs refreshing
                    $scope.$on('guide:invalidateData', function () {
                        $ctrl.forceFetchCurrent();
                    });

                    $scope.$on('guide:inactivate', function () {
                        disableResize = true;
                    });

                    $scope.$on('guide:reactivate', function () {
                        disableResize = false;
                        if (pendingResize) {
                            $timeout(pixelsPerHourCalc, 0);
                        }
                    });

                    function onScroll() {
                        topPos = $win.scrollTop();
                        let scrollTime = Date.now();
                        let currentVelocity = $ctrl.calculateVelocity(lastTopTime, lastTopPos, scrollTime, topPos);
                        $ctrl.scrollHandler(null, topPos, currentVelocity);
                        lastTopTime = scrollTime;
                        lastTopPos = topPos;
                    }

                    /**
                     * Calculate the sizes for different elements
                     */
                    function onceVisible() {
                        pixelsPerHourCalc();
                        buildChannelZoneElements($scope.vm.zoneData);
                        pixelsPerChannel = $element.find('.channel-header-row').height() ||
                        pixelsPerChannel;
                        //initialize the channels that are in the display at start.
                        topPos = $win.scrollTop();
                        $ctrl.forceFetchCurrent();
                    }

                    function pixelsPerHourCalc() {
                        if (disableResize) {
                            pendingResize = true;
                            return;
                        } else {
                            pendingResize = false;
                        }

                        viewportHeight = $win.height() - $element.offset().top;
                        let containerWidth = $element.find('.channel-content-list-container').width();
                        pixelsPerHour = containerWidth / 2;

                        //Channels per zone
                        $ctrl.setZoneSize(
                            Math.ceil((viewportHeight / pixelsPerChannel) * config.guide.zoneHeightMultiplier),
                            2 * config.guide.zoneWidthMultiplier,
                            pixelsPerChannel,
                            pixelsPerHour,
                            2 * pixelsPerHour,
                            viewportHeight
                        );
                    }

                    function buildChannelZoneElements(channelZones) {
                        var heading = $element.find('.channel-heading'),
                            listContainer = $element.find('.channel-content-list-body'),
                            zoneHtml = '',
                            headingZoneHtml = '',
                            genZoneWrapper = (zone, height, width) => {
                                return `<div style="width:${width}px; height:${height}px;"
                                    id="${zone.zone_el_id}" class="zone" role="presentation"></div>`;
                            };
                        //This clears and removes all old elements
                        allRowScopes.forEach(cs => cs.$destroy());
                        allRowScopes = [];


                        channelZones.forEach((zone) => {
                            /*
                             * This compiles the each channel and appends it to the page. This only happens when the
                             * filters are updated and causes the ng-repeat to not add a watcher - and keeps each row
                             * relatively lightweight performance wise.
                             */
                            zone.zone_el_id = 'zone_idx_' + zone.zoneIndex;
                            zoneHtml += genZoneWrapper(zone,
                                zone.zoneChannels.length * pixelsPerChannel,
                                pixelsPerHour * 24 * 14);

                            headingZoneHtml += createChannelHeadersHtml(zone);
                        });
                        //Append static text, probably should use the requestAnimationFrame here
                        listContainer.html(zoneHtml);
                        heading.html(headingZoneHtml);

                        channelZones.forEach((zone) => {
                            zone.domElement = listContainer.find('#' + zone.zone_el_id);
                            zone.elements = [];
                            zone.scopes = [];
                            zone.zoneChannels.forEach(function (channel) {
                                let $childScope = $scope.$new();
                                $childScope.channel = channel;
                                $childScope.zone = zone;
                                allRowScopes.push($childScope);
                                channelRowTemplate($childScope, function (el, sc) {
                                    zone.domElement.append(el);
                                    zone.elements.push(el);
                                    zone.scopes.push(sc);
                                    channel.listingsElement = el;
                                });
                            });

                        });
                    }

                    function createChannelHeadersHtml(zone) {
                        //This builds the channel list as static html so there are _no_ watchers
                        var channelsHtml = '';
                        zone.zoneChannels.forEach(function (channel) {
                            const noChannelNumber = profileService.isSpecU() ||
                                !angular.isDefined(channel.channelNumber);
                            const channelAria = channel.callSign +
                                (noChannelNumber ? '' : ', Channel ' + channel.channelNumber) +
                                (channel.favorite ? ', favorite set' : '');

                            channelsHtml += channelHeaderTemplate({
                                channel: channel,
                                favOn: (channel.favorite) ? 'favon' : '',
                                noChannelNumber: noChannelNumber ? 'no-channel-number' : '',
                                channelAria: channelAria
                            });
                        });
                        return `<div style="height: ${zone.zoneChannels.length * pixelsPerChannel};"
                            class="channel-header-zone zone">${channelsHtml}</div>`;
                    }
                };
            }
        };
    }

    /* @ngInject */
    function ContainerController($scope, $window, config, $timeout) {
        var vm = this,
            channelZoneSize, //Integer number of channels in a single zone
            timeZoneSize, //Integer number of hours in a single zone
            pixelsPerHour,
            pixelsPerChannel,
            viewportWidth = 0,
            viewportHeight = 0,
            timePos = 0,
            topPos = 0,
            lastFetchedZones,
            lastScrollTime,
            lastPixPerSecond,
            adjacentZoneDistance = config.guide.prefetchDistance,
            zoneUpdateData = debounce(fetchZoneData, 100, false),
            zoneUpdateDisplay = debounce(fireZoneUpdateDisplay, 200, false),
            virtualViewportWidth = 0,
            virtualViewportHeight = 0;

        vm.setZoneSize = setZoneSize;
        vm.getZones = getZones;
        vm.getPixelsPerHour = getPixelsPerHour;
        vm.scrollHandler = scrollHandler;
        vm.calculateVelocity = calculateVelocity;
        vm.adjacentZone = adjacentZone;
        vm.scrollingPaused = true;
        vm.forceFetchCurrent = forceFetchCurrent;

        $scope.getPos = function () {
            return {
                channelIndex: Math.ceil(topPos / pixelsPerChannel),
                hour: Math.floor(timePos / pixelsPerHour),
                scroll: {
                    top: topPos,
                    left: timePos
                }
            };
        };

        $scope.setPos = function (scroll) {
            angular.element($window).scrollTop(scroll.top);
            angular.element('channel-content-list-container').scrollLeft(scroll.left);
        };

        $scope.setChannelPos = function (channelIndex) {
            $scope.setPos({top: channelIndex * pixelsPerChannel, left: undefined});
        };

        /**
         * Set the zone size. To calculate he actual pixel width of the channel, you can multiply ts * pixelsPerHour
         * @param {int} cs                channels per zone, "a zone is 'cs' channels tall"
         * @param {int} ts                time per zone, "a zone is 'ts' hours wide"
         * @param {int} _pixelsPerChannel a channel listing is x pixels tall
         * @param {int} _pixelsPerHour    an hour is x pixels wide
         */
        function setZoneSize(cs, ts, _pixelsPerChannel, _pixelsPerHour, width, height) {
            channelZoneSize = cs;
            timeZoneSize = ts;
            pixelsPerChannel = _pixelsPerChannel;
            pixelsPerHour = _pixelsPerHour;
            viewportWidth = width;
            viewportHeight = height;
            virtualViewportWidth = viewportWidth * config.guide.viewportWidthMultiplier;
            virtualViewportHeight = viewportHeight * config.guide.viewportHeightMultiplier;
            $scope.$emit('guide:zonesize', channelZoneSize, timeZoneSize);
        }

        /**
         * Return the pixelsPerHour, this is used by the guide-show-directive to calculate the position of show
         *
         * @return {int} pixelsPerHour
         */
        function getPixelsPerHour() {
            return pixelsPerHour;
        }

        /**
         * Get the zones that are currently displayed on the screen.
         *
         * @param  {int} left the left most pixel positon displayed on the screen.
         * @param  {int} top  the top most pixel on the screen.
         * @return {int[int[][]]} array of zone indexes
         */
        function getZones(left, top) {
            var pixelsPerTimeZone = pixelsPerHour * timeZoneSize,
                pixelsPerChannelZone = pixelsPerChannel * channelZoneSize;

            left = (left < 0) ? 0 : left;
            top = (top < 0) ? 0 : top;

            let topLeft = [
                Math.floor(left / pixelsPerTimeZone),
                Math.floor(top / pixelsPerChannelZone)
            ];
            let bottomRight = [
                Math.floor((left + virtualViewportWidth) / pixelsPerTimeZone),
                Math.floor((top + virtualViewportHeight) / pixelsPerChannelZone)
            ];

            let topRight = [bottomRight[0], topLeft[1]]; //brX, tlY
            let bottomLeft = [topLeft[0], bottomRight[1]];//brY, tlX
            let zones = [topLeft, bottomRight, topRight, bottomLeft].reduce((memo, checkZone) => {
                if (!memo.some(addedZone => addedZone[0] === checkZone[0] && addedZone[1] === checkZone[1])) {
                    memo.push(checkZone);
                }
                return memo;
            }, []);

            return zones;
        }

        function scrollHandler(_timePos, _topPos, pixPerSecond = 0, force = false) {
            let currentTime = Date.now();
            let diffTime = -1;
            if (lastScrollTime) {
                diffTime = currentTime - lastScrollTime;
            }
            lastScrollTime = currentTime;
            lastPixPerSecond = pixPerSecond;

            if (_timePos !== null) {
                timePos = _timePos;
            }
            if (_topPos !== null) {
                topPos = _topPos;
            }

            let zones = getZones(timePos, topPos);
            let channelZones = zones.map((zone) => zone[1]);
            let timeZones = zones.map((zone) => zone[0]);

            //Only trigger if we have scrolled into a new zone
            if (!angular.equals(zones, vm.zones) || force) {
                //We are in a new zone
                vm.channelZones = channelZones;
                vm.timeZones = timeZones;
                vm.zones = zones;
                zoneUpdateData();
                zoneUpdateDisplay();
            }
        }

        function forceFetchCurrent() {
            let zones = getZones(timePos, topPos);
            let channelZones = zones.map((zone) => zone[1]);
            let timeZones = zones.map((zone) => zone[0]);
            vm.channelZones = channelZones;
            vm.timeZones = timeZones;
            vm.zones = zones;
            lastFetchedZones = null; //Update to force the fetch
            fetchZoneData();
            fireZoneUpdateDisplay();
        }

        function fireZoneUpdateDisplay() {
            //Update these zones
            vm.currentChannelZone = vm.channelZones;
            vm.currentTimeZone = vm.timeZones;
            $scope.$broadcast('displayZone',  vm.currentChannelZone, vm.currentTimeZone);
        }

        function fetchZoneData() {
            if (!angular.equals(lastFetchedZones, vm.zones)) {
                lastFetchedZones = vm.zones;
                $scope.$emit('guide:currentZone', vm.zones);
            }
        }

        function calculateVelocity(lastTime, lastPos, currentTime, currentPos) {
            if (lastTime > 0) {
                let diffTime = lastTime - currentTime;
                let diffPos = currentPos - lastPos;
                let pixPerSecond = Math.abs((diffPos / diffTime) * 1000);
                return pixPerSecond;
            } else {
                return 0;
            }
        }

        function adjacentZone(zone, visibleZones) {
            return visibleZones.some(vz => ((vz + adjacentZoneDistance) >= zone &&
                (vz - adjacentZoneDistance) <= zone));
        }

        function debounce(func, wait, immediate) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                $timeout.cancel(timeout);
                timeout = $timeout(later, wait);
                if (callNow) {
                    func.apply(context, args);
                }
            };
        }
    }
}());
