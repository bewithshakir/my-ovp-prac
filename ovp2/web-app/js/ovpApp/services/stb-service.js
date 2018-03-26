(function () {
    'use strict';

    angular.module('ovpApp.services.stbService', [
        'ovpApp.config',
        'ovpApp.legacy.DateUtil',
        'ovpApp.components.error.ServiceError',
        'ovpApp.services.profileService',
        'ovpApp.services.ovpStorage',
        'rx'
    ])
    .factory('stbService', stbService)
    .factory('realStbService', realStbService);

    /* @ngInject */
    function stbService($http, $q, ServiceError, config, dateUtil, $rootScope,
            $log, profileService, ovpStorage, storageKeys, rx) {

        let piHost = config.piHost,
            nrsBase = config.nrsApi,
            stbApi = config.nrs.stb,
            headendDefer = $q.defer(),
            // Initialize with the browser's timezone offset
            // until we hear from STB.
            offsetFromGMT = (new Date().getTimezoneOffset() / 60) * -1,
            setTopBoxes = [],
            stbDefer,
            selectedStb;

        let currentStbSubject = new rx.ReplaySubject(1);

        let service = {
            getHeadend,
            setHeadend,
            defaultDvrLanding,
            getSTBs,
            currentStbSource: createCurrentStbSource(),
            getCurrentStbPromise,
            getCurrentStb,
            setCurrentStb,
            postStbName,
            getDate,
            getOffsetFromGMT,
            setOffsetFromGMT,
            formatUnix,
            getDayLabel,
            selectDefaultDvr,
            _handleHttpError
        };

        return service;

        ////////////////////

        function storeCurrentStb(stb) {
            return $q.resolve(ovpStorage.setItem(storageKeys.currentStb, stb));
        }

        function retrieveCurrentStb() {
            // use value from storage, otherwise use cookie
            return $q.resolve(ovpStorage.getItem(storageKeys.currentStb));
        }

        function getHeadend() {
            profileService.isIpOnlyEnabled().then(isEnabled => {
                // If we are in IP only mode then the headend it irrelevant. Resolve the promise and return it.
                if (isEnabled) {
                    headendDefer.resolve();
                } else {
                    // getSTBs will call setHeadend() when the STB info
                    // is obtained. which will resolve the promise returned
                    // below.
                    getSTBs();
                }
            });

            return headendDefer.promise;
        }
        function setHeadend(headend) {
            headendDefer.resolve(headend);
        }
        function defaultDvrLanding() {
            let defer = $q.defer(),
                resolve = stb => {
                    if (stb && stb.rdvrVersion > 1) {
                        defer.resolve('ovp.dvr.my-recordings');
                    } else {
                        defer.resolve('ovp.dvr.scheduled');
                    }
                };

            getCurrentStb().then(stb => {
                if (!stb) {
                    selectDefaultDvr().then(() => {
                        getCurrentStb().then(stb => {
                            resolve(stb);
                        });
                    })
                    .catch(() => {
                        resolve({});
                    });
                }

                resolve(stb);
            });

            return defer.promise;
        }
        function getSTBs() {
            if (!stbDefer) {
                stbDefer = $q.defer();

                $q.all([profileService.isIpOnlyEnabled(),
                    profileService.canUseGuide()]).then(params => {
                    let isIpEnabled = params[0];
                    let isGuideEnabled = params[1];

                    if (!isIpEnabled && isGuideEnabled) {
                        $http({
                            method: 'GET',
                            url: piHost + nrsBase + stbApi,
                            withCredentials: true
                        })
                        .then(function (response) {
                            var data = response.data;
                            setTopBoxes = data.setTopBoxes || [];
                            setHeadend({
                                id: data.headend,
                                offsetFromGMT: data.offsetFromGMT
                            });

                            if (setTopBoxes.length) {

                                // make sure legacy "isDvr" prop is set
                                angular.forEach(setTopBoxes, function (stb) {
                                    stb.isDvr = stb.dvr;
                                });

                                getCurrentStb().then(currentStb => {
                                    selectedStb = currentStb;
                                    // select the first DVR box if no box already selected
                                    if (!selectedStb) {
                                        setTopBoxes.some(function (stb) {
                                            if (stb.dvr) {
                                                selectedStb = stb;
                                                return true;
                                            }
                                        });
                                    }

                                    selectedStb = selectedStb || setTopBoxes[0];
                                    setCurrentStb(selectedStb).finally(() => {
                                        stbDefer.resolve(setTopBoxes);
                                    });
                                });
                            } else {
                                stbDefer.resolve(setTopBoxes);
                            }
                            setOffsetFromGMT(data.offsetFromGMT);
                        }, function (data) {
                            stbDefer.reject(data);
                            // Use service prefix so unit test which references service can spy on this.
                            service._handleHttpError('Error pulling STB.');
                        });
                    } else {
                        stbDefer.resolve([]);
                        headendDefer.resolve();
                    }
                }, () => {
                    stbDefer.resolve([]);
                    headendDefer.resolve();
                });
            }
            return stbDefer.promise;
        }

        function _handleHttpError(msg) {
            throw new ServiceError(msg);
        }

        function createCurrentStbSource() {
            return currentStbSubject
                .asObservable()
                .distinctUntilChanged(x => x.macAddress, (a, b) => a === b);
        }

        function getCurrentStbPromise() {
            return getSTBs()
                .then(() => getCurrentStb())
                .catch(() => undefined);
        }
        function getCurrentStb() {
            return profileService.isIpOnlyEnabled()
                .then(isEnabled => {
                    if (isEnabled) {
                        //If we are ipOnly enabled then the current STB is irrelevant. No STB with ipOnly mode.
                        return undefined;
                    } else {
                        return retrieveCurrentStb().then(currentStb => {
                            if (!currentStb || setTopBoxes.length === 0) {
                                return undefined;
                            }
                            // Current stb comes from local storage. Match it with the latest data,
                            //   since things such as the name may have changed.
                            const match = setTopBoxes.find(stb => stb.macAddress === currentStb.macAddress);
                            //legacy code names the dvr attribute isDvr
                            if (match && angular.isDefined(match.isDvr)) {
                                match.dvr = match.isDvr;
                            }
                            return match;
                        });
                    }
                });
        }
        function setCurrentStb(stb) {
            //write legacy isDvr attribute to cookie
            if (angular.isDefined(stb) && angular.isObject(stb)) {
                stb.isDvr = stb.dvr;
            }

            $rootScope.$broadcast('set-top-box-selected', stb);
            currentStbSubject.onNext(stb);

            // TODO: Analytics Event
            // $rootScope.$emit('EG:stbSelected', {
            //     name: stb.name,
            //     deviceId: stb.macAddress,
            //     isDvr: stb.dvr
            // });
            return storeCurrentStb(stb);
        }
        function postStbName(stb, newName) {
            let url = config.piHost +
                    config.nrsApi +
                    config.nrs.stb + '/' +
                    stb.macAddressNormalized + '/name';

            const promise = $http({
                method: 'POST',
                url: url,
                withCredentials: true,
                data: { name : newName }
            });

            getCurrentStb().then(currentStb => {
                if (currentStb && stb.macAddress === currentStb.macAddress) {
                    setCurrentStb(stb);
                }
            });

            return promise;
        }
        /**
         * Get the date relative to the set top box
         */
        function getDate(date) {
            let offset = date.getTimezoneOffset(),
            stbOffset = getOffsetFromGMT() * 60;

            return dateUtil.addMinutes(date, offset + stbOffset);
        }
        function getOffsetFromGMT() {
            return offsetFromGMT;
        }
        function setOffsetFromGMT(offset) {
            offsetFromGMT = offset;
        }
        function formatUnix(unixTimestampSeconds, format) {
            let date = new Date(unixTimestampSeconds * 1000),
                offset = date.getTimezoneOffset(),
                stbOffset = getOffsetFromGMT() * 60;

            return dateUtil.formatDate(dateUtil.addMinutes(date, offset + stbOffset), format);
        }
        function getDayLabel(date) {
            let boxDate = getDate(new Date()),
                itemDate = getDate(date),
                dayLabel = '';

            if (dateUtil.isToday(boxDate, itemDate)) {
                dayLabel = 'Today';
            } else if (dateUtil.isTomorrow(boxDate, itemDate)) {
                dayLabel = 'Tomorrow';
            } else if (dateUtil.isYesterday(boxDate, itemDate)) {
                dayLabel = 'Yesterday';
            } else {
                dayLabel = dateUtil.formatDate(itemDate, 'eeee');
            }
            return dayLabel;
        }

        // select first non-DVR if there is one and selected device is not a DVR
        function selectDefaultDvr() {
            return getCurrentStb().then(currentStb => {
                if (currentStb && !currentStb.dvr) {
                    setTopBoxes.some(function (stb) {
                        if (stb.dvr) {
                            setCurrentStb(stb);
                            return true;
                        }
                    });
                }
            });
        }
    }

    // This function is here to allow this service to be mocked in test while
    // allowing the stb-serviceSpec to reference the real thing here.
    /* @ngInject */
    function realStbService($http, $q, ServiceError, config, dateUtil, $rootScope,
        $log, profileService,ovpStorage, storageKeys, rx) {
        return stbService($http, $q, ServiceError, config, dateUtil, $rootScope,
            $log, profileService, ovpStorage, storageKeys, rx);
    }
}());
