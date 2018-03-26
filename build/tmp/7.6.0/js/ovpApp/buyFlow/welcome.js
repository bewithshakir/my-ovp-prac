'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.buyFlow.welcome', ['ovpApp.messages', 'ovpApp.buyFlow.service', 'ovpApp.dataDelegate', 'ovpApp.directives.focus']).component('buyFlowWelcome', {
        templateUrl: '/js/ovpApp/buyFlow/welcome.html',
        controller: (function () {
            /* @ngInject */

            BuyFlowWelcomeController.$inject = ["messages", "$state", "$timeout", "$window", "$document", "config", "$rootScope", "buyFlowService", "delegateUtils"];
            function BuyFlowWelcomeController(messages, $state, $timeout, $window, $document, config, $rootScope, buyFlowService, delegateUtils) {
                _classCallCheck(this, BuyFlowWelcomeController);

                angular.extend(this, { messages: messages, $state: $state, $timeout: $timeout, $window: $window,
                    $document: $document, config: config, $rootScope: $rootScope, buyFlowService: buyFlowService, delegateUtils: delegateUtils });
            }

            _createClass(BuyFlowWelcomeController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.phone = this.config.streamPlusIvrNumber;
                    this.buyFlowEnabled = this.config.streamPlus.buyFlowEnabled;
                    this.streamBuyUrl = this.config.streamBuyUrl;
                    this.buyFlowService.getBaseOffers().then(function (result) {
                        _this.networks = result[0].networks;
                    });
                    // Analytics
                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }
            }, {
                key: '$postLink',
                value: function $postLink() {
                    // Added timeout to avoid focus issue on Windows 7 + IE
                    this.$timeout((function () {
                        // Focus should be on the 'Get Started' button.
                        angular.element('.streamplus-welcome')[0].focus();
                    }).bind(this), 200);
                }
            }, {
                key: 'getNetworkIcons',
                value: function getNetworkIcons(network) {
                    return this.delegateUtils.networkImageFromTmsId(network.tmsId)({ width: 96 });
                }
            }, {
                key: 'start',
                value: function start() {
                    if (!this.buyFlowEnabled) {
                        this.$window.open(this.streamBuyUrl);
                        return;
                    }

                    // Analytics:
                    // Analytics (must happen before popup)
                    this.$rootScope.$broadcast('Analytics:select', {
                        category: 'navigation',
                        context: 'stream2',
                        elementUiName: 'Let\'s get started',
                        pageSectionName: 'conversionArea',
                        elementStandardizedName: 'confirm',
                        triggeredBy: 'user',
                        operationType: 'buttonClick',
                        featureName: 'stream2',
                        featureType: 'stream2BuyFlow',
                        featureCurrentStep: 1
                    });

                    this.$state.go('buyFlow.offers');
                }
            }]);

            return BuyFlowWelcomeController;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/buyFlow/welcome.js.map
