(() => {
    'use strict';
    angular
        .module('ovpApp.ondemand.subheader', [
            'ovpApp.directives.focus'
        ])
        .component('onDemandSubheader', {
            bindings: {
                menuItems: '<'
            },
            templateUrl: '/js/ovpApp/ondemand/subheader/ondemand-subheader.html',
            controller: class OnDemandSubheaderController {
                /* @ngInject */
                constructor(onDemandData, $rootScope, $scope, $state, $transitions,
                    ondemandSubheaderService) {
                    angular.extend(this, {onDemandData, $rootScope, $scope, $state, $transitions,
                        ondemandSubheaderService});
                }

                $onInit() {
                    this.returnedFromViewAll = false;

                    this.subscription = this.ondemandSubheaderService.getSource()
                        .subscribe(options => this.onOptionsChanged(options));

                }

                $onDestroy() {
                    this.subscription.dispose();
                }

                selectSubheading(item) {
                    // Analytics
                    this.$rootScope.$broadcast('Analytics:select', {
                        elementUiName: 'Continue',
                        nonNormalizedElementStdName: item.name,
                        operationType: 'navigationClick',
                        pageSectionName: 'navPageSecondary'
                    });
                }

                onOptionsChanged(options) {
                    this.options = options;
                    this.index = options.network3TierIndex || 0;
                    if (options.pageTitle) {
                        this.$rootScope.$emit('ovp:setPageTitle', options.pageTitle);
                    }
                }

                getState(menuItem) {
                    const catName = this.onDemandData.formatCategoryNameForRoute(menuItem.name);
                    return `ovp.ondemand.${catName}`;
                }

                isSelected(menuItem) {
                    let catName = this.onDemandData.formatCategoryNameForRoute(menuItem.name);
                    return this.$state.current.name === `ovp.ondemand.${catName}`;
                }

                networkSelected(network) {
                    this.index = this.options.childNetworks().indexOf(network);

                    let currentState = this.$state.current;
                    let currentParams = this.$state.params;
                    currentParams.index = this.index;
                    currentParams.page = 1;
                    this.$state.go(currentState.name, currentParams);
                }

                goBack() {
                    if (this.options && this.options.onBackClick) {
                        this.options.onBackClick();
                    }
                }
            }
        });
})();
