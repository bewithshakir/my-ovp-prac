'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    /**
     * quietLoadingTracker
     *
     * Displays an unobtrusive loading indicator, until a promise is resolved
     *
     * Example Usage:
     * <quiet-loading track="somePromise" message="'some message'"></quiet-loading>
     *
     * Bindings:
     *    track: (Promise) A promise object. When it resolves or rejects the loading will go away, provided
     *        no other outstanding promises are waiting to be resolved/rejected.
     *    message: (String) a message to display with the loading indicator. Defaults to 'Loading ...'
     */
    angular.module('ovpApp.directives.quiet-loading-tracker', []).component('quietLoadingTracker', {
        bindings: {
            track: '<',
            message: '@'
        },
        template: '\n                <div>\n                    <div class="quiet-loading-tracker" ng-show="$ctrl.loading">\n                        <div class="spinner"></div>\n                        {{$ctrl.message}}\n                    </div>\n                    <div class=\'sr-only\' role=\'status\' aria-live=\'polite\' aria-atomic=\'true\' ng-bind="$ctrl.srMessage">\n                    </div>\n                </div>',
        controller: (function () {
            /* @ngInject */

            QuietLoadingTracker.$inject = ["$q", "$timeout"];
            function QuietLoadingTracker($q, $timeout) {
                _classCallCheck(this, QuietLoadingTracker);

                angular.extend(this, { $q: $q, $timeout: $timeout });
            }

            _createClass(QuietLoadingTracker, [{
                key: '$onInit',
                value: function $onInit() {
                    this.loading = this.activePromises > 0;
                    this.srMessage = this.srMessage || '';
                }
            }, {
                key: '$onChanges',
                value: function $onChanges(changes) {
                    var _this = this;

                    if (changes.message && !this.message) {
                        this.message = 'Loading ...';
                    }

                    if (changes.track && this.track) {
                        this.loading = true;
                        //Use displayMessage to help with the a11y live
                        this.srMessage = this.message;
                        this.activePromises = this.activePromises ? this.activePromises + 1 : 1;
                        if (this.debounceTimeout) {
                            this.$timeout.cancel(this.debounceTimeout);
                        }

                        this.track['finally'](function () {
                            _this.activePromises--;
                            if (_this.debounceTimeout) {
                                _this.$timeout.cancel(_this.debounceTimeout);
                            }
                            _this.debounceTimeout = _this.$timeout(function () {
                                return _this.debounce();
                            }, 50);
                        });
                    }
                }
            }, {
                key: 'debounce',
                value: function debounce() {
                    if (this.activePromises < 1) {
                        this.loading = false;
                        this.srMessage = '';
                    }
                    this.debounceTimeout = null;
                }
            }]);

            return QuietLoadingTracker;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/directives/quiet-loading-tracker.js.map
