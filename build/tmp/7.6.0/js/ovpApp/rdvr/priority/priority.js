'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    /**
     * rdvrPriority
     *
     * Series priority subpage for Remote DVR
     *
     * Example Usage:
     * <rdvr-priority></rdvr-priority>
     *
     */
    angular.module('ovpApp.rdvr.priority', ['ovpApp.rdvr.rdvrService', 'ovpApp.components.ovp.sortable', 'ovpApp.rdvr.cacheService', 'ovpApp.messages', 'ovpApp.components.alert', 'ovpApp.services.errorCodes']).component('rdvrPriority', {
        templateUrl: '/js/ovpApp/rdvr/priority/priority.html',
        controller: (function () {
            /* @ngInject */

            RdvrPriority.$inject = ["$log", "alert", "messages", "$scope", "createObservableFunction", "stbService", "rdvrService", "$q", "$rootScope", "rx", "$state", "errorCodesService"];
            function RdvrPriority($log, alert, messages, $scope, createObservableFunction, stbService, rdvrService, $q, $rootScope, rx, $state, errorCodesService) {
                _classCallCheck(this, RdvrPriority);

                angular.extend(this, { $log: $log, alert: alert, messages: messages, $scope: $scope, createObservableFunction: createObservableFunction, stbService: stbService,
                    rdvrService: rdvrService, $q: $q, $rootScope: $rootScope, rx: rx, $state: $state, errorCodesService: errorCodesService });
            }

            _createClass(RdvrPriority, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.teardown = this.createObservableFunction();

                    this.stbService.currentStbSource['do'](function (stb) {
                        return _this.stb = stb;
                    }).filter(function (stb) {
                        return _this.hasRdvrVersion2(stb);
                    }).flatMap(function (stb) {
                        return _this.getSeriesPriorities(stb);
                    }).takeUntil(this.teardown).subscribe(function (result) {
                        _this.processSeries(result);

                        _this.updateLoadingIndicator(result);

                        _this.handleError(result);
                    });

                    this.$scope.$on('ovp-sortable:order-change', function (evt, data) {
                        _this.$scope.$emit('Analytics:' + (data.movedUp ? 'rdvr-higher-priority' : 'rdvr-lower-priority'), {});
                        return _this.updatePriorities();
                    });
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.teardown();
                }
            }, {
                key: 'getSeriesPriorities',
                value: function getSeriesPriorities(stb) {
                    var stbChanged = this.stbService.currentStbSource.skip(1);

                    return this.rdvrService.getSeriesPriorities(stb).takeUntil(stbChanged);
                }
            }, {
                key: 'processSeries',
                value: function processSeries(_ref) {
                    var data = _ref.data;
                    var isComplete = _ref.isComplete;

                    if (isComplete) {
                        // Series priority needs the full set of data before showing it to the user
                        this.seriesPriorities = data;
                    } else {
                        this.seriesPriorities = [];
                    }
                }
            }, {
                key: 'updateLoadingIndicator',
                value: function updateLoadingIndicator(_ref2) {
                    var data = _ref2.data;
                    var isComplete = _ref2.isComplete;
                    var error = _ref2.error;

                    if (error) {
                        if (this.loading) {
                            this.loading.reject();
                            this.loading = undefined;
                        }
                    } else if (data.length === 0 && !isComplete) {
                        //Start of Fetch
                        if (this.loading) {
                            this.loading.reject();
                        }

                        this.loading = this.$q.defer();
                        this.$rootScope.$broadcast('message:loading', this.loading.promise, undefined, 'DVR Priority');
                    } else if (isComplete) {
                        // Data is fully loaded
                        if (this.loading) {
                            this.loading.resolve();
                            this.loading = undefined;
                        }
                        this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                    }
                    // Series priority doesn't display partially loaded data, so no need to handle that.
                }
            }, {
                key: 'handleError',
                value: function handleError(_ref3) {
                    var error = _ref3.error;

                    this.error = error;
                    if (this.error) {
                        this.$log.error('Series Priority: Error fetching series priority; status:- ' + error);
                        this.alert.open({
                            message: this.errorCodesService.getMessageForCode('WCM-9000'),
                            title: this.errorCodesService.getHeaderForCode('WCM-1009'),
                            buttonText: 'OK'
                        });
                    }
                }
            }, {
                key: 'updatePriorities',
                value: function updatePriorities() {
                    var _this2 = this;

                    var order = this.seriesPriorities.map(function (p) {
                        return p.settings.seriesPriority;
                    });

                    this.rdvrService.setSeriesPriorities(this.stb, order).then(function () {
                        _this2.seriesPriorities.forEach(function (p, i) {
                            return p.settings.seriesPriority = i + 1;
                        });
                    }, function (error) {
                        _this2.$log.error('Series Priority: Error updating series priority; status:- ' + error);
                        _this2.alert.open({
                            message: _this2.errorCodesService.getMessageForCode('WCM-9000'),
                            title: _this2.errorCodesService.getMessageForCode('WCM-1013'),
                            buttonText: 'OK'
                        });
                    });
                }
            }, {
                key: 'hasRdvrVersion2',
                value: function hasRdvrVersion2() {
                    var stb = arguments.length <= 0 || arguments[0] === undefined ? this.stb : arguments[0];

                    return stb.dvr && stb.dvr && stb.rdvrVersion > 1;
                }
            }]);

            return RdvrPriority;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/rdvr/priority/priority.js.map
