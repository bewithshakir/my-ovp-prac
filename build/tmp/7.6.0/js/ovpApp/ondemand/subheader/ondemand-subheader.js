'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.ondemand.subheader', ['ovpApp.directives.focus']).component('onDemandSubheader', {
        bindings: {
            menuItems: '<'
        },
        templateUrl: '/js/ovpApp/ondemand/subheader/ondemand-subheader.html',
        controller: (function () {
            /* @ngInject */

            OnDemandSubheaderController.$inject = ["onDemandData", "$rootScope", "$scope", "$state", "$transitions", "ondemandSubheaderService"];
            function OnDemandSubheaderController(onDemandData, $rootScope, $scope, $state, $transitions, ondemandSubheaderService) {
                _classCallCheck(this, OnDemandSubheaderController);

                angular.extend(this, { onDemandData: onDemandData, $rootScope: $rootScope, $scope: $scope, $state: $state, $transitions: $transitions,
                    ondemandSubheaderService: ondemandSubheaderService });
            }

            _createClass(OnDemandSubheaderController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.returnedFromViewAll = false;

                    this.subscription = this.ondemandSubheaderService.getSource().subscribe(function (options) {
                        return _this.onOptionsChanged(options);
                    });
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.subscription.dispose();
                }
            }, {
                key: 'selectSubheading',
                value: function selectSubheading(item) {
                    // Analytics
                    this.$rootScope.$broadcast('Analytics:select', {
                        elementUiName: 'Continue',
                        nonNormalizedElementStdName: item.name,
                        operationType: 'navigationClick',
                        pageSectionName: 'navPageSecondary'
                    });
                }
            }, {
                key: 'onOptionsChanged',
                value: function onOptionsChanged(options) {
                    this.options = options;
                    this.index = options.network3TierIndex || 0;
                    if (options.pageTitle) {
                        this.$rootScope.$emit('ovp:setPageTitle', options.pageTitle);
                    }
                }
            }, {
                key: 'getState',
                value: function getState(menuItem) {
                    var catName = this.onDemandData.formatCategoryNameForRoute(menuItem.name);
                    return 'ovp.ondemand.' + catName;
                }
            }, {
                key: 'isSelected',
                value: function isSelected(menuItem) {
                    var catName = this.onDemandData.formatCategoryNameForRoute(menuItem.name);
                    return this.$state.current.name === 'ovp.ondemand.' + catName;
                }
            }, {
                key: 'networkSelected',
                value: function networkSelected(network) {
                    this.index = this.options.childNetworks().indexOf(network);

                    var currentState = this.$state.current;
                    var currentParams = this.$state.params;
                    currentParams.index = this.index;
                    currentParams.page = 1;
                    this.$state.go(currentState.name, currentParams);
                }
            }, {
                key: 'goBack',
                value: function goBack() {
                    if (this.options && this.options.onBackClick) {
                        this.options.onBackClick();
                    }
                }
            }]);

            return OnDemandSubheaderController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/ondemand/subheader/ondemand-subheader.js.map
