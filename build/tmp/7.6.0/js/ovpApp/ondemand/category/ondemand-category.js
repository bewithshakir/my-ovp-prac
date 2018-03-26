'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.ondemand.category', []).component('ondemandCategory', {
        bindings: {
            category: '<',
            page: '<',
            hideLogo: '<'
        },
        templateUrl: '/js/ovpApp/ondemand/category/ondemand-category.html',
        controller: (function () {
            /* @ngInject */

            OndemandCategory.$inject = ["$rootScope", "storageKeys", "config", "onDemandData", "$q", "$state"];
            function OndemandCategory($rootScope, storageKeys, config, onDemandData, $q, $state) {
                _classCallCheck(this, OndemandCategory);

                angular.extend(this, { $rootScope: $rootScope, storageKeys: storageKeys, config: config, onDemandData: onDemandData, $q: $q,
                    $state: $state });
            }

            _createClass(OndemandCategory, [{
                key: '$onInit',
                value: function $onInit() {
                    this.clientSidePaging = this.category.totalResults === this.category.media.length;
                    this.pageSize = this.config.vodAssetsPerPage;
                    if (this.page === undefined || this.page < 1) {
                        this.page = 1;
                    }

                    this.gridListConfig = {
                        title: this.category.name,
                        defaultState: this.category.uiHint == 'list' ? 'list' : 'grid',
                        totalItems: this.category.totalResults,
                        showTotal: true,
                        showToggle: false,
                        id: this.storageKeys.vodMinorCategoryViewMode,
                        useLocalStorage: true
                    };
                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }
            }, {
                key: 'onPageChanged',
                value: function onPageChanged(page) {
                    var currentState = this.$state.current;
                    var currentParams = this.$state.params;
                    currentParams.page = page;
                    this.$state.go(currentState.name, currentParams);
                }
            }]);

            return OndemandCategory;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/ondemand/category/ondemand-category.js.map
