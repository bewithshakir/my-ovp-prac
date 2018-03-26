/**
 * ovpPerson
 *
 * Displays the image and other simple information about a person (actor/director/etc).
 *
 * example usage:
 * <ovp-person person="vm.somePersonObject"></ovp-person>
 *
 * OR, with options:
 *
 * <ovp-person person="vm.somePersonObject" options="vm.someOptionsObject"></ovp-person>
 *
 * OR, in a carousel:
 *
 * <ovp-carousel items="vm.people">
 *    <ovp-person ng-repeat="person in vm.people" person="person"></ovp-person>
 * </ovp-carousel>
 *
 * Bindings:
 *    person: (object) a person data delegate object, or similar
 *    options: (object) options to modify behavior. See below.
 *
 * Options:
 *    imageWidth: (number) width of the image file to download. The actual size it appears to
 *       the user will depend on the css, so this value should be chosen to match the size
 *       defined in the css. Defaults to 147
 */

(function () {
    'use strict';
    angular.module('ovpApp.directives.person', [
        'ovpApp.directives.fadeinOnload',
        'ovpApp.search.searchService'
        ])
    .component('ovpPerson', {
        bindings: {
            person: '<',
            options: '<',
            category: '<'
        },
        templateUrl: '/js/ovpApp/components/ovp/ovp-person/ovp-person.html',
        controller: class OvpPerson {
            /* @ngInject */
            constructor($state, searchService, searchFocusIndex, $rootScope) {
                this.$state = $state;
                this.searchService = searchService;
                this.searchFocusIndex = searchFocusIndex;
                this.$rootScope = $rootScope;
            }

            $onInit() {
                this.focusOnLoad = (this.options && this.options.focusOnLoad) || false;
            }

            $onChanges(changes) {
                if (changes.options) {
                    this.applyDefaultOptions(changes.options.currentValue);
                }
            }

            click() {
                let route = this.person && this.person.clickRoute;
                if (route) {
                    route[1] = route[1] || {};
                    route[2] = route[2] || {};

                    if (this.$state.includes('search')) {
                        // Analytics: Indicate a person search result was clicked.
                        this.$rootScope.$emit('Analytics:search-select-item', {
                            asset: this.person
                        });

                        this.searchFocusIndex.set(this.options.index, this.options.parentIndex);
                        this.$state.go(...route);
                    } else {
                        route[2].location = 'replace';

                        // Flag it to not redirect on the next search page
                        this.searchService.doNotRedirect = true;

                        // go to search.blank first so that it pops quickly
                        this.$state.go('search.blank')
                            .then(() => {
                                this.$state.go(...route);
                            });
                    }
                }
            }

            //////////

            applyDefaultOptions(newOptions) {
                const defaults = {
                    imageWidth: 147
                };

                this.options = angular.extend({}, defaults, newOptions);
            }
        }
    });
})();
