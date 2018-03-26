'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.components.growlTracker', ['ajoslin.promise-tracker', 'ovpApp.config']).component('growlTracker', {
        templateUrl: '/js/ovpApp/components/growl/growl.html',
        controller: (function () {
            /* @ngInject */

            GrowlTrackerController.$inject = ["$scope", "promiseTracker", "$timeout", "$q", "config", "$document", "$element"];
            function GrowlTrackerController($scope, promiseTracker, $timeout, $q, config, $document, $element) {
                _classCallCheck(this, GrowlTrackerController);

                angular.extend(this, {
                    $scope: $scope,
                    promiseTracker: promiseTracker,
                    $timeout: $timeout,
                    $q: $q,
                    config: config,
                    $document: $document,
                    $element: $element
                });
            }

            _createClass(GrowlTrackerController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.message = undefined;
                    this.growlTracker = this.promiseTracker();

                    this.$scope.$on('message:growl', function (event, message, millisecondsLength) {
                        var length = angular.isDefined(millisecondsLength) ? millisecondsLength : _this.config.confirmMessageDelayMs;
                        _this.clean();
                        _this.deferred = _this.$q.defer();
                        _this.growlTracker.addPromise(_this.deferred.promise);
                        _this.message = message;
                        _this.boundEventHandler = _this.growlHandleEvent.bind(_this);
                        _this.$document.on('keydown', _this.boundEventHandler);
                        _this.$document.on('click', _this.boundEventHandler);
                        _this.previousActiveElement = _this.$document[0].activeElement;
                        var width = _this.$element.width();
                        if (width > 0) {
                            //element is fixed at 50% right, so set negative margin
                            _this.$element.css('margin-right', -(width / 2));
                        }

                        //wait until after this is displayed to set the focus
                        _this.$timeout(function () {
                            _this.$document.find('#growlpopup .popupCloseClick').focus();
                        }, 50);

                        _this.timer = _this.$timeout(function () {
                            _this.deferred.resolve();
                            _this.deferred = undefined;
                            _this.clean();
                        }, length);
                    });

                    this.hide = function () {
                        // Cleaning will cause the template to hide
                        this.clean();
                    };
                }
            }, {
                key: 'growlHandleEvent',
                value: function growlHandleEvent(evt) {
                    // Do not register click for HTML elements that do not have classNames as String.
                    // E.g; svg icons.
                    if (!this.timer || !(evt.target && angular.isFunction(evt.target.className.search))) {
                        return;
                    }

                    //Not an escape key or enter or a click on the message, just keep the focus
                    if (!(evt.keyCode === 27 || evt.keyCode === 13) && !(evt.keyCode === undefined && angular.element(evt.target).parents('#popup').length === 0)) {
                        this.$document.find('#growlpopup .popupCloseClick').focus();
                        evt.preventDefault();
                        return true;
                    }
                }
            }, {
                key: 'clean',
                value: function clean() {
                    this.$document.off('keydown', this.boundEventHandler);
                    this.$document.off('click', this.boundEventHandler);

                    this.message = undefined;

                    if (this.timer) {
                        this.$timeout.cancel(this.timer);
                        this.timer = undefined;
                    }

                    if (this.deferred) {
                        this.deferred.reject();
                        this.deferred = undefined;
                    }

                    if (this.previousActiveElement) {
                        angular.element(this.previousActiveElement).focus();
                    }
                }
            }]);

            return GrowlTrackerController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/growl/growl.js.map
