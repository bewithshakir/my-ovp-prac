'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.components.loadingTracker', ['ajoslin.promise-tracker']).component('loadingTracker', {
        templateUrl: '/js/ovpApp/components/loading-tracker/loading-tracker.html',
        controller: (function () {
            /* @ngInject */

            LoadingTrackerController.$inject = ["$scope", "$element", "promiseTracker"];
            function LoadingTrackerController($scope, $element, promiseTracker) {
                _classCallCheck(this, LoadingTrackerController);

                angular.extend(this, {
                    $scope: $scope, $element: $element, promiseTracker: promiseTracker
                });
            }

            _createClass(LoadingTrackerController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    var defaultMessage = 'Loading...';

                    this.$scope.$on('message:loading', function (event, promise, message) {
                        _this.loadingTracker.addPromise(promise);
                        if (angular.isDefined(message)) {
                            _this.message = message;
                        } else {
                            _this.message = defaultMessage;
                        }
                    });

                    var width = this.$element.width();
                    if (width > 0) {
                        //element is fixed at 50% right, so set negative margin
                        this.$element.css('margin-right', -(width / 2));
                    }

                    this.$scope.$on('message:loading:cancel', function () {
                        return _this.reset();
                    });

                    this.reset();
                }
            }, {
                key: 'reset',
                value: function reset() {
                    if (this.loadingTracker && this.loadingTracker.tracking()) {
                        this.loadingTracker.cancel();
                    }
                    this.loadingTracker = this.promiseTracker({ activationDelay: 150 });
                }
            }]);

            return LoadingTrackerController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/loading-tracker/loading-tracker.js.map
