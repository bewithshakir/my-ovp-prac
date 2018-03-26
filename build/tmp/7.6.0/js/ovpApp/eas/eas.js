'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.eas', ['ngAudio', 'ovpApp.directives.svgPath', 'ovpApp.service.vpns', 'selectn']).component('eas', {
        templateUrl: '/js/ovpApp/eas/eas.html',
        controller: (function () {
            EasController.$inject = ["$rootScope", "$http", "selectn", "$state", "$timeout", "ngAudio", "$element", "$window", "vpnsService"];
            function EasController($rootScope, $http, selectn, $state, $timeout, ngAudio, $element, $window, vpnsService) {
                _classCallCheck(this, EasController);

                angular.extend(this, {
                    $rootScope: $rootScope,
                    $http: $http,
                    selectn: selectn,
                    $state: $state,
                    $timeout: $timeout,
                    ngAudio: ngAudio,
                    $element: $element,
                    $window: $window,
                    vpnsService: vpnsService //Required to start
                });
            }

            _createClass(EasController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.easData = {};
                    this.crawlSpeed = 15;
                    this.vpnsListener = this.$rootScope.$on('VpnsAlert', function (event, data) {
                        _this.$http({
                            url: data.SecureContent.Location
                        }).then(_this.easDataCallback.bind(_this));
                    });
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.vpnsListener();
                }
            }, {
                key: 'exit',
                value: function exit() {
                    if (this.easTimer) {
                        this.$timeout.cancel(this.easTimer);
                        this.easTimer = null;
                        this.clearEASMessage('user');
                    }
                }
            }, {
                key: 'easDataCallback',
                value: function easDataCallback(response) {
                    var _this2 = this;

                    if ('EAN' === this.selectn('info.eventCode.value', response.data)) {
                        var eanData = this.readEANData(response.data);
                        if (eanData.mediaUrl) {
                            if (this.$state.current.name === 'ovp.livetv') {
                                this.$rootScope.$emit('EAN:start', { 'eanUrl': eanData.mediaUrl });
                            } else {
                                this.$state.go('ovp.livetv', { 'eanUrl': eanData.mediaUrl });
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

                        this.$timeout(function () {
                            var crawlElement = _this2.$element.find('.crawl');
                            var msgWidth = crawlElement.width();
                            var fontSize = _this2.$window.getComputedStyle(crawlElement[0], null).getPropertyValue('font-size');
                            _this2.crawlSpeed = parseInt(msgWidth / (parseInt(fontSize, 10) * 3), 10);
                        }, 0); // Update animation speed
                        this.easTimer = this.$timeout(function () {
                            _this2.easTimer = null;
                            _this2.clearEASMessage('application');
                        }, 2 * 60 * 1000); // Hide message after 2 minutes
                    }
                }
            }, {
                key: 'readEASData',
                value: function readEASData(easData) {
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
                        var easInfo = easData.info;
                        if (easInfo.event) {
                            message = message + easInfo.event + '...';
                        }
                        if (angular.isArray(easInfo.parameter)) {
                            var easTexts = easInfo.parameter.filter(function (e) {
                                return e.valueName == 'EASText';
                            });
                            if (angular.isArray(easTexts)) {
                                var plucked = easTexts.map(function (e) {
                                    return e.value;
                                });
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
                                if (r.uri && r.mimeType && r.mimeType.indexOf('audio-mp3') !== -1) {
                                    audioUri = r.uri;
                                }
                            });
                        } else if (angular.isObject(easInfo.resource)) {
                            if (easInfo.resource.uri && easInfo.resource.mimeType && easInfo.resource.mimeType.indexOf('audio-mp3') !== -1) {
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
            }, {
                key: 'clearEASMessage',
                value: function clearEASMessage(triggeredBy) {
                    this.easAudio.pause();
                    this.easAudio.unbind();
                    this.easData = {};

                    this.$rootScope.$broadcast('EAS:end', triggeredBy);
                }
            }, {
                key: 'readEANData',
                value: function readEANData(eanData) {
                    var mediaUrl,
                        eanInfo = eanData.info || {},
                        mimeType = 'video/HLS';
                    // Read EAN video resource
                    if (angular.isArray(eanInfo.resource)) {
                        eanInfo.resource.forEach(function (r) {
                            if (r.uri && r.mimeType && r.mimeType.indexOf(mimeType) !== -1) {
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
            }, {
                key: 'extractFipsCodes',
                value: function extractFipsCodes(geocodes) {
                    return geocodes.map(function (g) {
                        return g.value;
                    });
                }
            }]);

            return EasController;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/eas/eas.js.map
