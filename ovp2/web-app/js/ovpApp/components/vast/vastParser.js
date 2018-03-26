/* globals $ */
/**
 * Created by sachin.kota on 1/15/16.
 */
(function () {
    'use strict';
    angular.module('ovpApp.components.vast', ['ovpApp.legacy.stringUtil', 'ovpApp.legacy.httpUtil'])

        .constant('VAST_EVENT_MAP', {
            'adStartTracking': 'impression',
            'adEndTracking': 'complete',
            'adFirstQuartileTracking': 'firstQuartile',
            'adMidPointTracking': 'midpoint',
            'adThirdQuartileTracking': 'thirdQuartile',
            'ad-started': 'ad-started',
            'ad-stopped': 'ad-stopped'
        })
        .service('VastParser', VastParser)
        .service('LegacyAdParser', LegacyAdParser);

    /* @ngInject */
    function VastParser(stringUtil, httpUtil, VAST_EVENT_MAP) {
        return {
            parseAdBreaks,
            parseAdEvent,
            macroMapper,
            getTrackingUrls
        };

        function getVastAd(base64Ad, startTime, index) {
            var adData = stringUtil.fromBase64(base64Ad),
                AdXml = $.parseXML(adData),
                vastAds = AdXml.getElementsByTagName('Ad'),
                id = '',
                adSystem = '',
                adTitle = '',
                errorTrackUrls = [],
                impressionUrls = [],
                linear = new Linear();

            if (vastAds.length !== 0) {
                angular.forEach(vastAds, function (adEle) {
                    if (adEle.getElementsByTagName('InLine').length !== 0) {
                        id = adEle.getAttribute('id');
                        let adSystemEle = adEle.getElementsByTagName('AdSystem');
                        if (adSystemEle.length !== 0) {
                            adSystem = adSystemEle[0].textContent;
                        }
                        let adTitleEle = adEle.getElementsByTagName('AdTitle');
                        if (adTitleEle.length !== 0) {
                            adTitle = adTitleEle[0].textContent;
                        }
                        let durationEle = adEle.getElementsByTagName('Duration');
                        if (durationEle.length !== 0) {
                            linear.duration = hmsToSecondsOnly(durationEle[0].textContent);
                        }

                    }
                    let errorElements =  adEle.getElementsByTagName('Error');
                    errorTrackUrls = pushErrorUrls(errorElements, errorTrackUrls);
                    let impressionElements = adEle.getElementsByTagName('Impression');
                    impressionUrls = pushImpressionUrls(impressionElements, impressionUrls);
                    let trackingEventElements = adEle.getElementsByTagName('TrackingEvents');
                    if (trackingEventElements.length !== 0) {
                        $.each(trackingEventElements, function (index,trackingEle) {
                            linear.trackingEvents = getTrackEvents(trackingEle, false, linear.trackingEvents);

                        });
                    }
                });
            }

            return new VastAd(index, startTime, id, adTitle, adSystem, errorTrackUrls, impressionUrls, linear);
        }



        function parseAdBreaks(AdBreaks, streamInfo) {
            var _adBreaks = [];
            var breakIndex = 0;
            var adIndex = 0;
            var currentAdBreak = null;
            var currentAd = null;
            angular.forEach(AdBreaks, function (tag) {
                if (tag.name !== null) {
                    if (tag.name == '#EXT-X-AD-BREAK-START') {
                        if (currentAdBreak !== null) {
                            let last = [...currentAdBreak.adArray].pop();
                            if (last && last.endTime) {
                                currentAdBreak.endTime = last.endTime;
                                currentAdBreak.duration = currentAdBreak.endTime - currentAdBreak.startTime;
                                adIndex = 0;
                            }
                            currentAdBreak = null;
                        }
                        currentAdBreak = new AdBreak(++breakIndex, tag.time);
                        _adBreaks.push(currentAdBreak);
                        if (currentAd) {
                            currentAdBreak.adArray.push(currentAd);
                        }
                    } else if (tag.name == '#EXT-X-AD-START') {
                        if (currentAd) { //Close previous ad if it is still open
                            currentAd.endTime = tag.time;
                            currentAd.duration = tag.time -
                                currentAd.startTime;
                        }
                        currentAd = getVastAd(tag.content, tag.time, ++adIndex);
                        currentAd.streamInfo = streamInfo;
                        if (currentAdBreak) { //Allow a delayed insert if this is out of order
                            currentAdBreak.adArray.push(currentAd);
                        }
                    } else if (tag.name == '#EXT-X-AD-END' && currentAd) {
                        currentAd.endTime = tag.time;
                        currentAd.duration = tag.time -
                            currentAd.startTime;
                        currentAd = null;
                    } else if (tag.name == '#EXT-X-AD-BREAK-END') {
                        if (currentAdBreak) {
                            currentAdBreak.endTime = tag.time;
                            currentAdBreak.duration = currentAdBreak.endTime - currentAdBreak.startTime;
                            adIndex = 0;
                        }

                        if (currentAd) { //Make sure this gets closed
                            currentAd.endTime = tag.time;
                            currentAd.duration = tag.time -
                                currentAd.startTime;
                            currentAd = null;
                        }
                        currentAdBreak = null;
                    }
                }
            });
            //Only return adBreaks that have content.
            return _adBreaks.filter((adBreak) => (adBreak && adBreak.adArray && adBreak.adArray.length > 0));

        }

        function parseAdEvent(AdEvent, streamInfo) {
            if (AdEvent.name == '#EXT-X-AD-START') {
                let currentAd = getVastAd(AdEvent.content, AdEvent.time, null);
                currentAd.streamInfo = streamInfo;
                return currentAd;
            }
        }

        function pushErrorUrls(errorElements,errorTrackUrls) {
            for (let j = 0; j < errorElements.length; j++) {
                errorTrackUrls.push(errorElements[j].textContent.replace(/\s/g, ''));

            }
            return errorTrackUrls;
        }

        function pushImpressionUrls(impressionElements,impressionUrls) {
            for (let j = 0; j < impressionElements.length; j++) {
                impressionUrls.push(impressionElements[j].textContent.replace(/\s/g, ''));

            }
            return impressionUrls;
        }



        function getTrackEvents(trackingElement,isAdBreak,trackingEvents) {
            if (isAdBreak && trackingElement.parentNode.tagName !== 'vmap:AdBreak')  {
                return null;
            }

            let trackingeventsEle = trackingElement.getElementsByTagName('Tracking');
            for (let i = 0; i < trackingeventsEle.length; i++) {
                let e = trackingeventsEle.item(i).getAttribute('event');
                let url = trackingeventsEle[i].textContent.replace(/\s/g, '');
                let tempTrack = new TrackingEvent(e, url);
                trackingEvents.push(tempTrack);
            }
            return trackingEvents;
        }

        function VastAd(index, startTime, id, adTitle, adSystem, errorTrackUrls, impressionUrls, linear) {
            this.index = index || null;
            this.startTime = startTime || null;
            this.id = id || null;
            this.adSystem = adSystem || null;
            this.adTitle = adTitle || null;
            this.errorTrackUrls = errorTrackUrls || [];
            this.impressionUrls = impressionUrls || [];
            this.linear = linear || null;
            this.endTime = null;
            this.duration = null;
            if (this.linear && this.linear.duration && !this.duration) {
                this.duration = this.linear.duration * 1000;
            }
            if (this.duration && !this.endTime) {
                this.endTime = this.startTime + (this.duration);
            }
        }

        function TrackingEvent(event, url) {
            this.event = event;
            this.url = url;

        }

        function Linear() {
            this.trackingEvents = [];
            this.duration = null;
        }


        function hmsToSecondsOnly(str) {
            var p = str.split(':'),
                s = 0, m = 1;

            while (p.length > 0) {
                s += m * parseInt(p.pop(), 10);
                m *= 60;
            }
            return s;
        }

        function macroMapper(trackingUrl, evt) {
            var urlVariables, adInstance;
            let queryString = trackingUrl.split('?');
            if (queryString.length < 2) {
                return trackingUrl;
            } else {
                queryString = queryString[1];
            }
            urlVariables = httpUtil.getPairsFromQueryString(queryString);
            adInstance = evt.adInstance;

            if (urlVariables) {
                if (urlVariables.hasOwnProperty('status')) {
                    urlVariables.status = 0;
                }

                if (urlVariables.hasOwnProperty('prog')) {
                    urlVariables.prog = 0;
                }

                if (urlVariables.hasOwnProperty('note')) {
                    urlVariables.note = 'null';
                }

                ['[NOTE]', '[NPT]', '[STATUS]'].forEach(function (tag) {
                    let keyName = searchPropByValue(urlVariables, tag);
                    if (keyName) {
                        urlVariables[keyName] = 0;
                    }
                });

                if (trackingUrl.indexOf('[ASSETURI]') >= 0) {
                    let assetUri = searchPropByValue(urlVariables, '[ASSETURI]');
                    urlVariables[assetUri] = adInstance.caid;
                }

                if (trackingUrl.indexOf('[CACHEBUSTING]') >= 0) {

                    let cacheBust = searchPropByValue(urlVariables, '[CACHEBUSTING]');
                    urlVariables[cacheBust] = Math.floor((Math.random() + 1) * 10000000);
                }

                if (trackingUrl.indexOf('[CONTENTPLAYHEAD]') >= 0) {
                    let playHead = searchPropByValue(urlVariables, '[CONTENTPLAYHEAD]');
                    if (adInstance.streamInfo.type == 'LIVE') {
                        urlVariables[playHead] = adInstance.startTime;
                    } else {
                        let startTimeSec = Math.floor(adInstance.startTime / 1000);
                        let hour = Math.floor(startTimeSec / 3600);
                        startTimeSec -= (hour * 3600);
                        let hours = twoDigits(hour);
                        let minute = Math.floor((startTimeSec / 60));
                        startTimeSec -= (minute * 60);
                        let minutes = twoDigits(minute);
                        let seconds = twoDigits(startTimeSec);
                        urlVariables[playHead] = hours + ':' + minutes + ':' + seconds + '.000';
                    }
                }

                /*
                if(eventType == "error"){
                    var errorCode:String = searchPropByValue(urlVariables,"[ERRORCODE]");
                    //to do update Url macro with the specific error code
                }
                */
                return trackingUrl.split('?')[0] + '?' + Object.keys(urlVariables)
                    .map(key => key + '=' + encodeURIComponent(urlVariables[key]))
                    .join('&');
            } else {
                return trackingUrl;
            }
        }

        function twoDigits(num) {
            return ('00' + num).slice(-2);
        }

        function getTrackingUrls(trackingEvent) {
            let eventType = trackingEvent.type;
            if (eventType && VAST_EVENT_MAP[eventType]) {
                eventType = VAST_EVENT_MAP[eventType];
            }
            if (trackingEvent &&
                trackingEvent.type &&
                trackingEvent.adInstance &&
                trackingEvent.adInstance.trackingEvents) {
                let event = trackingEvent.adInstance.trackingEvents.find(evt => evt.eventType === eventType);
                if (event) {
                    return event.trackingUrls.map(url => macroMapper(url, trackingEvent));
                }
            }
            return [];
        }

        function searchPropByValue(vals, prop) {
            return Object.keys(vals).find(key => vals[key] === prop);
        }
    }

    function AdBreak(index, startTime, endTime, adArray) {
        this.index = index;
        this.startTime = startTime;
        this.endTime = endTime;
        this.adArray = adArray || [];
    }

    /**
     * This is a stripped down version of the AdInstance object in the flash player
     */
    function AdInstance() {

        this.startTime = null;
        this.endTime = null;
        this.duration = null;
        this.id = null; //adId
        this.index = null; //Ad index (position)

        //Legacy (mostly unused)
        this.assetId = null;
        this.serverId = null;
        this.providerId = null;
        this.spotTrackingEventUrl = null;
        this.adStartTrackingUrl = null;
        this.trackingEventUrl = null;
        this.messageRef = null;
        this.linear = {
            trackingEvents: []
        };
        this.adEndTrackingUrl = null;
        this.index = null;

        this.getEvent = function (type) {
            return this.trackingEvent.find(trackingEvent => trackingEvent.eventType === type);
        };
    }

    /* @ngInject */
    function LegacyAdParser(stringUtil, $log, httpUtil) {

        return {
            parseAdEvents
        };

        //////////

        function parseAdEvents(tags) {
            var _adBreaks = [];
            var currentAdBreak = null;
            var currentAdInstance = null;
            var previousAdEndtime = -1;
            var adIndex = 0;
            var adBreakIndex = 0;

            angular.forEach(tags, function (timedMetatadata) {

                if (timedMetatadata.name === '#[ADEVENT]') {

                    let adEventContent = stringUtil.fromBase64(timedMetatadata.content);
                    let urlVariables = httpUtil.getPairsFromQueryString(adEventContent);

                    if (urlVariables.assetid1 && urlVariables.percentile1) {
                        let percentage = parseInt(urlVariables.percentile1);
                        if (percentage === 0) {
                            //previousAdEndtime initial -1
                            if (timedMetatadata.time != previousAdEndtime) {
                                if (currentAdBreak !== null && currentAdBreak.adArray.length > 0) {
                                    //Not to add empty adbreak.
                                    //close and push on going adbreak and start a new one.
                                    _adBreaks.push(currentAdBreak);
                                    currentAdBreak.index = adBreakIndex;
                                    adBreakIndex++;
                                }
                                currentAdBreak = new AdBreak();
                                currentAdBreak.startTime = timedMetatadata.time;
                                adIndex = 0; //reset adIndex
                            }

                            currentAdInstance = new AdInstance();
                            //This will create the trackgingEvent with the name 'impression' which is
                            currentAdInstance.impressionUrls = [adEventContent];
                            currentAdInstance.startTime = timedMetatadata.time;
                            currentAdInstance.assetId = urlVariables.assetid1;
                            currentAdInstance.serverId = urlVariables.adsid1;
                            currentAdInstance.providerId = urlVariables.providerid1;
                            currentAdInstance.spotTrackingEventUrl = urlVariables.spottracking1;
                            currentAdInstance.trackingEventUrl = urlVariables.tracking1;
                            currentAdInstance.messageRef = urlVariables.messageref1;

                        } else if (percentage == 100) {
                            if (currentAdInstance === null) {
                                $log.error('Unexpected ad TAG of percentile 100');
                            } else {
                                if (currentAdInstance.assetId !== urlVariables.assetid1) {
                                    $log.debug('Assetid missmatch', currentAdInstance.assetId, urlVariables.adtime1);
                                    currentAdInstance = null; //close on going adInstance.
                                } else {
                                    currentAdInstance.endTime = timedMetatadata.time;
                                    currentAdInstance.duration = currentAdInstance.endTime -
                                        currentAdInstance.startTime;
                                    //End event to trigger the
                                    let trackingEvent = {
                                        event: 'complete',
                                        url: adEventContent
                                    };
                                    currentAdInstance.linear.trackingEvents.push(trackingEvent);
                                    //adEndTrackingUrl = adEventContent;
                                    previousAdEndtime = currentAdInstance.endTime;
                                    //add and close on going adInstance.
                                    currentAdInstance.index = adIndex;
                                    //Changed to match the current
                                    currentAdBreak.adArray.push(currentAdInstance);
                                    currentAdBreak.endTime = timedMetatadata.time;
                                    adIndex++;
                                    currentAdInstance = null;
                                }
                            }
                        }
                    }
                }
            }); //for ad TAG


            if (currentAdBreak !== null && currentAdBreak.adArray.length > 0) {
                currentAdBreak.index = adBreakIndex;
                _adBreaks.push(currentAdBreak);
            }

            //output ad break info
            $log.debug('Adbreaks', _adBreaks);
            return _adBreaks;
        }


    }

}());
