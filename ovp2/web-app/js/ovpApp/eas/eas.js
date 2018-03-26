(function () {
    'use strict';

    angular.module('ovpApp.eas', [
        'ngAudio',
        'ovpApp.directives.svgPath',
        'ovpApp.service.vpns',
        'selectn'
    ])
    .component('eas', {
        templateUrl: '/js/ovpApp/eas/eas.html',
        controller: class EasController {
            constructor ($rootScope, $http, selectn, $state, $timeout, ngAudio, $element, $window, vpnsService) {
                angular.extend(this, {
                    $rootScope,
                    $http,
                    selectn,
                    $state,
                    $timeout,
                    ngAudio,
                    $element,
                    $window,
                    vpnsService //Required to start
                });
            }
            $onInit () {
                this.easData = {};
                this.crawlSpeed = 15;
                this.vpnsListener = this.$rootScope.$on('VpnsAlert', (event, data) => {
                    this.$http({
                        url: data.SecureContent.Location
                    }).then(this.easDataCallback.bind(this));
                });
            }

            $onDestroy () {
                this.vpnsListener();
            }

            exit () {
                if (this.easTimer) {
                    this.$timeout.cancel(this.easTimer);
                    this.easTimer = null;
                    this.clearEASMessage('user');
                }
            }

            easDataCallback (response) {
                if ('EAN' === this.selectn('info.eventCode.value', response.data)) {
                    let eanData = this.readEANData(response.data);
                    if (eanData.mediaUrl) {
                        if (this.$state.current.name === 'ovp.livetv') {
                            this.$rootScope.$emit('EAN:start', {'eanUrl': eanData.mediaUrl});
                        } else {
                            this.$state.go('ovp.livetv', {'eanUrl': eanData.mediaUrl});
                        }
                    }
                } else {
                    // Clear previous message
                    if (this.easTimer) {
                        this.$timeout.cancel(this.easTimer);
                        this.clearEASMessage('user');
                    }

                    this.easData = this.readEASData(response.data);
                    this.easAudio = this.ngAudio.play(this.easData.audioUri);
                    this.easAudio.loop = true;

                    this.$rootScope.$broadcast('player:minimize', this.easData);
                    this.$rootScope.$broadcast('EAS:start', this.easData);

                    this.$timeout(() => {
                        let crawlElement = this.$element.find('.crawl');
                        let msgWidth = crawlElement.width();
                        let fontSize = this.$window.getComputedStyle(crawlElement[0], null)
                            .getPropertyValue('font-size');
                        this.crawlSpeed = parseInt(msgWidth / (parseInt(fontSize, 10) * 3), 10);
                    }, 0); // Update animation speed
                    this.easTimer = this.$timeout(() => {
                        this.easTimer = null;
                        this.clearEASMessage('application');
                    }, (2 * 60 * 1000)); // Hide message after 2 minutes
                }
            }

            readEASData (easData) {
                var message = '',
                    audioUri = '',
                    effective,
                    expires,
                    geocode = []; // fips codes

                if (angular.isString(easData)) {
                    easData = JSON.parse(easData);
                }

                if (easData && easData.info) {
                    // read EAS message
                    let easInfo = easData.info;
                    if (easInfo.event) {
                        message = message + easInfo.event + '...';
                    }
                    if (angular.isArray(easInfo.parameter)) {
                        let easTexts = easInfo.parameter.filter(e => e.valueName == 'EASText');
                        if (angular.isArray(easTexts)) {
                            let plucked = easTexts.map(e => e.value);
                            if (angular.isArray(plucked)) {
                                message += plucked.join(' ');
                            }
                        }
                    }
                    // read the FIPS code(s)
                    if (easInfo.area && easInfo.area.geocode) {
                        geocode = this.extractFipsCodes(easInfo.area.geocode);
                    }

                    // read EAS audio resource
                    if (angular.isArray(easInfo.resource)) {
                        easInfo.resource.forEach(function (r) {
                            if (r.uri && r.mimeType &&
                                r.mimeType.indexOf('audio-mp3') !== -1) {
                                audioUri = r.uri;
                            }
                        });
                    } else if (angular.isObject(easInfo.resource)) {
                        if (easInfo.resource.uri && easInfo.resource.mimeType &&
                            easInfo.resource.mimeType.indexOf('audio-mp3') !== -1) {
                            audioUri = easInfo.resource.uri;
                        }
                    }

                    // read EAS effective
                    effective = easInfo.effective ? new Date(easInfo.effective) : new Date();

                    // read EAS expiration
                    expires = easInfo.expires ? new Date(easInfo.expires) : new Date();
                }

                return {
                    'message': message,
                    'audioUri': audioUri,
                    'effective': effective,
                    'expires': expires,
                    'geocode': geocode
                };
            }

            clearEASMessage (triggeredBy) {
                this.easAudio.pause();
                this.easAudio.unbind();
                this.easData = {};

                this.$rootScope.$broadcast('EAS:end', triggeredBy);
            }

            readEANData (eanData) {
                var mediaUrl,
                    eanInfo = eanData.info || {},
                    mimeType = 'video/HLS';
                // Read EAN video resource
                if (angular.isArray(eanInfo.resource)) {
                    eanInfo.resource.forEach(function (r) {
                        if (r.uri && r.mimeType &&
                            r.mimeType.indexOf(mimeType) !== -1) {
                            mediaUrl = r.uri;
                        }
                    });
                } else if (angular.isObject(eanInfo.resource)) {
                    mediaUrl = this.selectn('resource.uri', eanInfo);
                }

                return {
                    'mediaUrl': mediaUrl
                };
            }

            extractFipsCodes (geocodes) {
                return geocodes.map(g => g.value);
            }
        }
    });
}());
