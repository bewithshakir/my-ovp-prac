'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.settings.accessibility', ['ovpApp.services.accessibility']).component('accessibility', {
        templateUrl: '/js/ovpApp/settings/accessibility/accessibility.html',
        controller: (function () {
            /* @ngInject */

            Accessibility.$inject = ["AccessibilityService", "$rootScope", "$state"];
            function Accessibility(AccessibilityService, $rootScope, $state) {
                _classCallCheck(this, Accessibility);

                angular.extend(this, { AccessibilityService: AccessibilityService, $rootScope: $rootScope, $state: $state });
            }

            _createClass(Accessibility, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                    this.AccessibilityService.isEnabled().then(function (r) {
                        return _this.accessibilityEnabledForClient = r;
                    });
                }
            }, {
                key: 'toggleAccessiblity',
                value: function toggleAccessiblity(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.accessibilityEnabledForClient = !this.accessibilityEnabledForClient;

                    // Analytics
                    this.$rootScope.$emit('Analytics:prepareForRefresh');
                    this.$rootScope.$emit('Analytics:select', {
                        operationType: 'accessibilityToggle',
                        toggleState: !this.accessibilityEnabledForClient,
                        elementStandardizedName: 'accessibilityToggle',
                        pageSectionName: 'settingsSelectArea'
                    });

                    if (this.accessibilityEnabledForClient) {
                        this.AccessibilityService.enable();
                    } else {
                        this.AccessibilityService.disable();
                    }
                }
            }]);

            return Accessibility;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/settings/accessibility/accessibility.js.map
