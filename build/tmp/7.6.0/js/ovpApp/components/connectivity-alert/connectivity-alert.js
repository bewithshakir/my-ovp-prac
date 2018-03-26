'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.connectivityAlert', ['angularMoment', 'ovpApp.directives.focus', 'ovpApp.messages']).component('connectivityAlert', {
        templateUrl: '/js/ovpApp/components/connectivity-alert/connectivity-alert.html',
        controller: (function () {
            /* @ngInject */

            ConnectivityAlertController.$inject = ["$rootScope", "$scope", "$timeout", "$interval", "$document", "config", "connectivityService", "moment", "messages"];
            function ConnectivityAlertController($rootScope, $scope, $timeout, $interval, $document, config, connectivityService, moment, messages) {
                _classCallCheck(this, ConnectivityAlertController);

                angular.extend(this, {
                    $rootScope: $rootScope,
                    $scope: $scope,
                    $timeout: $timeout,
                    $interval: $interval,
                    $document: $document,
                    config: config,
                    connectivityService: connectivityService,
                    moment: moment,
                    messages: messages
                });

                this.retryTimerInterval = this.config.connectivityService.checkXhrIntervalMs / 1000;
                this.retryTimerMaxInterval = this.config.connectivityService.checkXhrMaxIntervalMs / 1000;
                this.retryTimer = null;
                this.showDefaultText = true;
                this.showAlert = false;
                this.activeElement = undefined;
                this.offlineText = this.messages.getMessageForCode('MSG-9084');
                this.onlineText = this.messages.getMessageForCode('MSG-9085');
                this.retryNowText = this.messages.getMessageForCode('MSG-9086');
                this.retryingNowText = this.messages.getMessageForCode('MSG-9087');
                this.alertMessage = '';
            }

            _createClass(ConnectivityAlertController, [{
                key: '$onInit',
                value: function $onInit() {
                    this.setupListener();
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.listener();
                    if (this.alertTimeout) {
                        this.$timeout.cancel(this.alertTimeout);
                    }
                }
            }, {
                key: 'setupListener',
                value: function setupListener() {
                    var _this = this;

                    this.listener = this.$rootScope.$on('connectivityService:statusChanged', function (event, isOnline, delay) {

                        if (!delay) {
                            delay = _this.config.connectivityService.delayMessageWhenNotPlayingMs;
                        }

                        if (!isOnline) {
                            _this.alertTimeout = _this.$timeout(function () {
                                _this.activeElement = _this.$document[0].activeElement;
                                _this.showAlertBox();
                                _this.startTimer();
                            }, delay);
                        } else {

                            if (_this.alertTimeout) {
                                _this.$timeout.cancel(_this.alertTimeout);
                            }

                            _this.setAlertMessage(_this.onlineText);
                            _this.cancelTimer();
                            _this.resetTimer();
                            _this.hideRetryCounter();
                            _this.$timeout(function () {
                                _this.hideAlertBox();
                                if (_this.activeElement) {
                                    _this.activeElement.focus();
                                }
                            }, 2000);
                        }
                    });
                }
            }, {
                key: 'setAlertMessage',
                value: function setAlertMessage(text) {
                    this.alertMessage = text;
                }
            }, {
                key: 'showAlertBox',
                value: function showAlertBox() {
                    this.setAlertMessage(this.offlineText);
                    this.retryCounter = this.formatTime(this.moment.duration(this.retryTimerInterval * 1000));
                    this.showRetryCounter();
                    this.showAlert = true;

                    // Borrow from EAS broadcast.  This will cause the player to exit
                    // full screen if required.
                    this.$rootScope.$broadcast('player:minimize');
                }
            }, {
                key: 'hideAlertBox',
                value: function hideAlertBox() {
                    this.showAlert = false;
                }
            }, {
                key: 'showRetryCounter',
                value: function showRetryCounter() {
                    this.showCounter = true;
                    this.showButton = true;
                }
            }, {
                key: 'hideRetryCounter',
                value: function hideRetryCounter() {
                    this.showCounter = false;
                    this.showButton = false;
                }
            }, {
                key: 'keypress',
                value: function keypress(event) {
                    if (event.keyCode === 9) {
                        //tab
                        event.preventDefault();
                    }
                }
            }, {
                key: 'checkNow',
                value: function checkNow() {
                    var _this2 = this;

                    this.cancelTimer();
                    this.hideRetryCounter();

                    this.setAlertMessage(this.retryingNowText);
                    this.retryTimerInterval = this.retryTimerInterval * 2;

                    if (this.retryTimerInterval > this.retryTimerMaxInterval) {
                        this.retryTimerInterval = this.retryTimerMaxInterval;
                    }

                    this.connectivityService.checkXhr().then(function () {
                        _this2.resetTimer();
                    }, function () {
                        _this2.$timeout(function () {
                            _this2.startTimer();
                        }, 1000);
                    });
                }
            }, {
                key: 'startTimer',
                value: function startTimer() {
                    var _this3 = this;

                    var minutes = '';
                    var minutesText = 'minutes';
                    var seconds = '';

                    this.timer = this.moment.duration(this.retryTimerInterval * 1000);
                    this.retryCounter = this.formatTime(this.timer);
                    this.setAlertMessage(this.offlineText);
                    this.showRetryCounter();

                    this.retryTimer = this.$interval(function () {

                        if (_this3.timer.asSeconds() <= 1) {
                            _this3.retryCounter = _this3.formatTime(_this3.timer);
                            _this3.checkNow();
                        } else {
                            _this3.timer.subtract(1, 'second');
                            _this3.retryCounter = _this3.formatTime(_this3.timer);

                            // only for screen reader
                            if (_this3.timer.asSeconds() % 10 === 0) {
                                if (_this3.timer.asSeconds() > 59) {
                                    if (_this3.timer.minutes() < 2) {
                                        minutesText = 'minute';
                                    }

                                    minutes = _this3.timer.minutes() + ' ' + minutesText;
                                } else {
                                    minutes = '';
                                }

                                seconds = _this3.timer.seconds() + ' seconds';

                                _this3.srTime = 'retrying in ' + minutes + ' ' + seconds;
                            } else {
                                minutes = '';
                                seconds = '';
                            }
                        }
                    }, 1000);
                }
            }, {
                key: 'formatTime',
                value: function formatTime(duration) {
                    var minutes = duration.minutes();
                    var seconds = duration.seconds();
                    var formatted;
                    if (duration.asSeconds() >= 60) {
                        formatted = minutes + ':';
                        if (seconds < 10) {
                            formatted += '0' + seconds;
                        } else {
                            formatted += seconds;
                        }
                    } else {
                        formatted = seconds + ' seconds.';
                    }

                    return formatted;
                }
            }, {
                key: 'cancelTimer',
                value: function cancelTimer() {
                    this.showDefaultText = false;
                    this.showCheckingNowText = true;
                    this.retryCounter = this.retryTimerInterval;

                    if (this.retryTimer) {
                        this.$interval.cancel(this.retryTimer);
                        this.retryTimer = null;
                    }
                }
            }, {
                key: 'resetTimer',
                value: function resetTimer() {
                    this.retryTimerInterval = this.config.connectivityService.checkXhrIntervalMs / 1000;
                }
            }]);

            return ConnectivityAlertController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/connectivity-alert/connectivity-alert.js.map
