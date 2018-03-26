'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.search.resultListItem', []).component('resultListItem', {
        bindings: {
            item: '<',
            index: '<',
            category: '<',
            options: '<'
        },
        templateUrl: '/js/ovpApp/search/widgets/result-list-item.html',
        controller: (function () {
            /* @ngInject */

            ResultListItem.$inject = ["$state", "searchFocusIndex", "$rootScope"];
            function ResultListItem($state, searchFocusIndex, $rootScope) {
                _classCallCheck(this, ResultListItem);

                this.$state = $state;
                this.searchFocusIndex = searchFocusIndex;
                this.$rootScope = $rootScope;
            }

            _createClass(ResultListItem, [{
                key: '$onInit',
                value: function $onInit() {
                    this.isBlocked = false;
                    this.focusOnLoad = this.options && this.options.focusOnLoad || false;
                }
            }, {
                key: '$onChanges',
                value: function $onChanges(changes) {
                    var _this = this;

                    if (changes.item) {
                        if (this.item) {
                            this.item.isBlocked.then(function (blocked) {
                                return _this.isBlocked = blocked;
                            });
                        } else {
                            this.isBlocked = false;
                        }
                    }
                }
            }, {
                key: 'click',
                value: function click() {
                    var route = this.item.clickRoute;
                    this.$rootScope.$emit('Analytics:search-select-item', {
                        asset: this.item
                    });
                    if (route) {
                        var _$state;

                        this.searchFocusIndex.set(this.options.index, this.options.parentIndex);
                        (_$state = this.$state).go.apply(_$state, _toConsumableArray(route));
                    }
                }
            }, {
                key: 'getTitlePrefix',
                value: function getTitlePrefix() {
                    var prefix = '';
                    if (this.item.isBlockedByParentalControls) {
                        prefix = 'Blocked';
                    }
                    if (this.item.isEntitled === false) {
                        prefix = 'Not Entitled';
                    }
                    return prefix;
                }
            }]);

            return ResultListItem;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/search/widgets/result-list-item.js.map
