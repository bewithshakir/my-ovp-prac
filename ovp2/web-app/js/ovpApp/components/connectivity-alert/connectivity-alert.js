(function () {
    'use strict';

    angular.module('ovpApp.connectivityAlert', [
        'angularMoment',
        'ovpApp.directives.focus',
        'ovpApp.messages'
    ])
    .component('connectivityAlert', {
        templateUrl: '/js/ovpApp/components/connectivity-alert/connectivity-alert.html',
        controller: class ConnectivityAlertController {
            /* @ngInject */
            constructor ($rootScope, $scope, $timeout, $interval, $document,
                config, connectivityService, moment, messages) {
                angular.extend(this, {
                    $rootScope,
                    $scope,
                    $timeout,
                    $interval,
                    $document,
                    config,
                    connectivityService,
                    moment,
                    messages
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

            $onInit() {
                this.setupListener();
            }

            $onDestroy() {
                this.listener();
                if (this.alertTimeout) {
                    this.$timeout.cancel(this.alertTimeout);
                }
            }

            setupListener() {
                this.listener = this.$rootScope.$on('connectivityService:statusChanged',
                    (event, isOnline, delay) => {

                    if (!delay) {
                        delay = this.config.connectivityService.delayMessageWhenNotPlayingMs;
                    }

                    if (!isOnline) {
                        this.alertTimeout = this.$timeout(() => {
                            this.activeElement = this.$document[0].activeElement;
                            this.showAlertBox();
                            this.startTimer();
                        }, delay);
                    } else {

                        if (this.alertTimeout) {
                            this.$timeout.cancel(this.alertTimeout);
                        }

                        this.setAlertMessage(this.onlineText);
                        this.cancelTimer();
                        this.resetTimer();
                        this.hideRetryCounter();
                        this.$timeout(() => {
                            this.hideAlertBox();
                            if (this.activeElement) {
                                this.activeElement.focus();
                            }
                        }, 2000);
                    }
                });
            }

            setAlertMessage(text) {
                this.alertMessage = text;
            }

            showAlertBox() {
                this.setAlertMessage(this.offlineText);
                this.retryCounter = this.formatTime(this.moment.duration(this.retryTimerInterval * 1000));
                this.showRetryCounter();
                this.showAlert = true;

                // Borrow from EAS broadcast.  This will cause the player to exit
                // full screen if required.
                this.$rootScope.$broadcast('player:minimize');
            }

            hideAlertBox() {
                this.showAlert = false;
            }

            showRetryCounter() {
                this.showCounter = true;
                this.showButton = true;
            }

            hideRetryCounter() {
                this.showCounter = false;
                this.showButton = false;
            }

            keypress(event) {
                if (event.keyCode === 9) { //tab
                    event.preventDefault();
                }
            }

            checkNow() {
                this.cancelTimer();
                this.hideRetryCounter();

                this.setAlertMessage(this.retryingNowText);
                this.retryTimerInterval = this.retryTimerInterval * 2;

                if (this.retryTimerInterval > this.retryTimerMaxInterval) {
                    this.retryTimerInterval = this.retryTimerMaxInterval;
                }

                this.connectivityService.checkXhr().then(() => {
                    this.resetTimer();
                }, () => {
                    this.$timeout(() => {
                        this.startTimer();
                    }, 1000);

                });
            }

            startTimer() {
                var minutes = '';
                var minutesText = 'minutes';
                var seconds = '';

                this.timer = this.moment.duration(this.retryTimerInterval * 1000);
                this.retryCounter = this.formatTime(this.timer);
                this.setAlertMessage(this.offlineText);
                this.showRetryCounter();

                this.retryTimer = this.$interval(() => {

                    if (this.timer.asSeconds() <= 1) {
                        this.retryCounter = this.formatTime(this.timer);
                        this.checkNow();

                    } else {
                        this.timer.subtract(1, 'second');
                        this.retryCounter = this.formatTime(this.timer);

                        // only for screen reader
                        if (this.timer.asSeconds() % 10 === 0) {
                            if (this.timer.asSeconds() > 59) {
                                if (this.timer.minutes() < 2) {
                                    minutesText = 'minute';
                                }

                                minutes = this.timer.minutes() + ' ' + minutesText;
                            } else {
                                minutes = '';
                            }

                            seconds = this.timer.seconds() + ' seconds';

                            this.srTime = 'retrying in ' + minutes + ' ' + seconds;
                        } else {
                            minutes = '';
                            seconds = '';
                        }
                    }
                }, 1000);
            }

            formatTime(duration) {
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

            cancelTimer() {
                this.showDefaultText = false;
                this.showCheckingNowText = true;
                this.retryCounter = this.retryTimerInterval;

                if (this.retryTimer) {
                    this.$interval.cancel(this.retryTimer);
                    this.retryTimer = null;
                }
            }

            resetTimer() {
                this.retryTimerInterval = this.config.connectivityService.checkXhrIntervalMs / 1000;
            }



        }
    });
}());
