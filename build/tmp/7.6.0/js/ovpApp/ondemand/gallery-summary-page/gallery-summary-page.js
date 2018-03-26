'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.ondemand.gallerySummaryPage', ['ovpApp.ondemand.data']).component('gallerySummaryPage', {
        templateUrl: '/js/ovpApp/ondemand/gallery-summary-page/gallery-summary-page.html',
        bindings: {
            data: '<'
        },
        controller: (function () {
            /* @ngInject */

            gallerySummaryPageController.$inject = ["onDemandData", "$state", "$rootScope"];
            function gallerySummaryPageController(onDemandData, $state, $rootScope) {
                _classCallCheck(this, gallerySummaryPageController);

                this.onDemandData = onDemandData;
                this.$state = $state;
                this.$rootScope = $rootScope;
            }

            _createClass(gallerySummaryPageController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.itemLimit = 8;
                    var currentStateName = this.$state.current.name;
                    this.viewAllUris = this.data.categories.map(function (category) {
                        if (!category.uri) {
                            return;
                        }

                        var name = _this.onDemandData.formatCategoryNameForRoute(category.name);
                        return currentStateName + '.viewall({name: \'' + name + '\'})';
                    });
                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }
            }, {
                key: 'updateLimit',
                value: function updateLimit(limit) {
                    this.itemLimit = Math.max(limit, this.itemLimit);
                }
            }]);

            return gallerySummaryPageController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/ondemand/gallery-summary-page/gallery-summary-page.js.map
