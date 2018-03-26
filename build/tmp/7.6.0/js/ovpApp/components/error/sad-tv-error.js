'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.components.error.sadTv', []).component('sadTvError', {
        bindings: {
            errorCode: '<'
        },
        templateUrl: '/js/ovpApp/components/error/sad-tv-error.html',
        controller: (function () {
            /* @ngInject */

            sadTvError.$inject = ["$window", "$rootScope"];
            function sadTvError($window, $rootScope) {
                _classCallCheck(this, sadTvError);

                angular.extend(this, { $window: $window, $rootScope: $rootScope });
            }

            _createClass(sadTvError, [{
                key: '$onInit',
                value: function $onInit() {
                    this.focusButton = true;
                    this.$rootScope.$broadcast('Analytics:pageChangeComplete');
                }
            }, {
                key: 'retry',
                value: function retry() {
                    // Analytics: Prepare to go offline, then capture select event.
                    this.$rootScope.$emit('Analytics:prepareForRefresh');
                    this.$rootScope.$broadcast('Analytics:select', {
                        elementStandardizedName: 'retry'
                    });

                    this.$window.location.reload();
                }
            }]);

            return sadTvError;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/error/sad-tv-error.js.map
