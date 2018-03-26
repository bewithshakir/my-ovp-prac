(() => {
    'use strict';

    angular
        .module('ovpApp.search.sportsResults', [
            'ovpApp.directives.gridList',
            'ovpApp.search.sportsResultListItem',
            'ovpApp.filters.titleCase'
        ])
        .component('sportsSearchResults', {
            templateUrl: '/js/ovpApp/search/result-pages/sports-search-results.html',
            bindings: {
                query: '<',
                results: '<',
                index: '<'
            },
            controller: class SportsSearchResultsController {
                /* @ngInject */
                constructor($state, $rootScope) {
                    this.$state = $state;
                    this.$rootScope = $rootScope;
                }

                $onInit() {
                    this.layout = {
                        categories: []
                    };
                    this.calculateLayout();
                    this.focusOnLoad = this.$state.current.name.startsWith('search') &&
                        this.$state.previous && this.$state.previous.name.startsWith('search');

                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }

                calculateLayout() {
                    let categories = [{
                        title: 'Games On Now',
                        programs: []
                    }, {
                        title: 'Games On Later',
                        programs: []
                    }, {
                        title: 'Other',
                        programs: []
                    }];

                    this.results.forEach((programOrSeries) => {
                        let cat = programOrSeries.sportsCategory;
                        let now = Date.now();
                        if (cat == 'Games On Now' ||
                            (programOrSeries.isLive &&
                                now >= programOrSeries.scheduledStartTimeSec * 1000 &&
                                now < programOrSeries.scheduledEndTimeSec * 1000)) {
                            categories[0].programs.push(programOrSeries);
                        } else if (cat == 'Games On Later') {
                            categories[1].programs.push(programOrSeries);
                        } else {
                            categories[2].programs.push(programOrSeries);
                        }
                    });

                    this.layout = {
                        categories: categories.filter(cat => cat.programs.length > 0)
                    };
                    this.layout.categories.forEach((element, index) => {
                        element.showToggle = index === 0;
                    });
                }
            }
        });
})();
