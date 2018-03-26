'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.search.sportsResults', ['ovpApp.directives.gridList', 'ovpApp.search.sportsResultListItem', 'ovpApp.filters.titleCase']).component('sportsSearchResults', {
        templateUrl: '/js/ovpApp/search/result-pages/sports-search-results.html',
        bindings: {
            query: '<',
            results: '<',
            index: '<'
        },
        controller: (function () {
            /* @ngInject */

            SportsSearchResultsController.$inject = ["$state", "$rootScope"];
            function SportsSearchResultsController($state, $rootScope) {
                _classCallCheck(this, SportsSearchResultsController);

                this.$state = $state;
                this.$rootScope = $rootScope;
            }

            _createClass(SportsSearchResultsController, [{
                key: '$onInit',
                value: function $onInit() {
                    this.layout = {
                        categories: []
                    };
                    this.calculateLayout();
                    this.focusOnLoad = this.$state.current.name.startsWith('search') && this.$state.previous && this.$state.previous.name.startsWith('search');

                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }
            }, {
                key: 'calculateLayout',
                value: function calculateLayout() {
                    var categories = [{
                        title: 'Games On Now',
                        programs: []
                    }, {
                        title: 'Games On Later',
                        programs: []
                    }, {
                        title: 'Other',
                        programs: []
                    }];

                    this.results.forEach(function (programOrSeries) {
                        var cat = programOrSeries.sportsCategory;
                        var now = Date.now();
                        if (cat == 'Games On Now' || programOrSeries.isLive && now >= programOrSeries.scheduledStartTimeSec * 1000 && now < programOrSeries.scheduledEndTimeSec * 1000) {
                            categories[0].programs.push(programOrSeries);
                        } else if (cat == 'Games On Later') {
                            categories[1].programs.push(programOrSeries);
                        } else {
                            categories[2].programs.push(programOrSeries);
                        }
                    });

                    this.layout = {
                        categories: categories.filter(function (cat) {
                            return cat.programs.length > 0;
                        })
                    };
                    this.layout.categories.forEach(function (element, index) {
                        element.showToggle = index === 0;
                    });
                }
            }]);

            return SportsSearchResultsController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/search/result-pages/sports-search-results.js.map
