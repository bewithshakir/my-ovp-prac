(() => {
    'use strict';
    angular
    .module('ovpApp.ondemand.gallerySummaryPage', [
        'ovpApp.ondemand.data'])
    .component('gallerySummaryPage', {
        templateUrl: '/js/ovpApp/ondemand/gallery-summary-page/gallery-summary-page.html',
        bindings: {
            data: '<'
        },
        controller: class gallerySummaryPageController {
            /* @ngInject */
            constructor(onDemandData, $state, $rootScope) {
                this.onDemandData = onDemandData;
                this.$state = $state;
                this.$rootScope = $rootScope;
            }

            $onInit() {
                this.itemLimit = 8;
                const currentStateName = this.$state.current.name;
                this.viewAllUris = this.data.categories.map(category => {
                    if (!category.uri) {
                        return;
                    }

                    const name = this.onDemandData.formatCategoryNameForRoute(category.name);
                    return `${currentStateName}.viewall({name: '${name}'})`;
                });
                this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
            }

            updateLimit(limit) {
                this.itemLimit = Math.max(limit, this.itemLimit);
            }
        }
    });
})();
