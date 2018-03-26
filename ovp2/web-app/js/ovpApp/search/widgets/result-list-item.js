(function () {
    'use strict';

    angular
        .module('ovpApp.search.resultListItem', [])
        .component('resultListItem', {
            bindings: {
                item: '<',
                index: '<',
                category: '<',
                options: '<'
            },
            templateUrl: '/js/ovpApp/search/widgets/result-list-item.html',
            controller: class ResultListItem {
                /* @ngInject */
                constructor($state, searchFocusIndex, $rootScope) {
                    this.$state = $state;
                    this.searchFocusIndex = searchFocusIndex;
                    this.$rootScope = $rootScope;
                }

                $onInit() {
                    this.isBlocked = false;
                    this.focusOnLoad = (this.options && this.options.focusOnLoad) || false;
                }

                $onChanges(changes) {
                    if (changes.item) {
                        if (this.item) {
                            this.item.isBlocked.then(blocked => this.isBlocked = blocked);
                        } else {
                            this.isBlocked = false;
                        }
                    }
                }

                click() {
                    let route = this.item.clickRoute;
                    this.$rootScope.$emit('Analytics:search-select-item', {
                        asset: this.item
                    });
                    if (route) {
                        this.searchFocusIndex.set(this.options.index, this.options.parentIndex);
                        this.$state.go(...route);
                    }
                }

                getTitlePrefix() {
                    let prefix = '';
                    if (this.item.isBlockedByParentalControls) {
                        prefix = 'Blocked';
                    }
                    if (this.item.isEntitled === false) {
                        prefix = 'Not Entitled';
                    }
                    return prefix;
                }
            }
        });
})();
