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

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.directives.person', ['ovpApp.directives.fadeinOnload', 'ovpApp.search.searchService']).component('ovpPerson', {
        bindings: {
            person: '<',
            options: '<',
            category: '<'
        },
        templateUrl: '/js/ovpApp/components/ovp/ovp-person/ovp-person.html',
        controller: (function () {
            /* @ngInject */

            OvpPerson.$inject = ["$state", "searchService", "searchFocusIndex", "$rootScope"];
            function OvpPerson($state, searchService, searchFocusIndex, $rootScope) {
                _classCallCheck(this, OvpPerson);

                this.$state = $state;
                this.searchService = searchService;
                this.searchFocusIndex = searchFocusIndex;
                this.$rootScope = $rootScope;
            }

            _createClass(OvpPerson, [{
                key: '$onInit',
                value: function $onInit() {
                    this.focusOnLoad = this.options && this.options.focusOnLoad || false;
                }
            }, {
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.options) {
                        this.applyDefaultOptions(changes.options.currentValue);
                    }
                }
            }, {
                key: 'click',
                value: function click() {
                    var _this = this;

                    var route = this.person && this.person.clickRoute;
                    if (route) {
                        route[1] = route[1] || {};
                        route[2] = route[2] || {};

                        if (this.$state.includes('search')) {
                            var _$state;

                            // Analytics: Indicate a person search result was clicked.
                            this.$rootScope.$emit('Analytics:search-select-item', {
                                asset: this.person
                            });

                            this.searchFocusIndex.set(this.options.index, this.options.parentIndex);
                            (_$state = this.$state).go.apply(_$state, _toConsumableArray(route));
                        } else {
                            route[2].location = 'replace';

                            // Flag it to not redirect on the next search page
                            this.searchService.doNotRedirect = true;

                            // go to search.blank first so that it pops quickly
                            this.$state.go('search.blank').then(function () {
                                var _$state2;

                                (_$state2 = _this.$state).go.apply(_$state2, _toConsumableArray(route));
                            });
                        }
                    }
                }

                //////////

            }, {
                key: 'applyDefaultOptions',
                value: function applyDefaultOptions(newOptions) {
                    var defaults = {
                        imageWidth: 147
                    };

                    this.options = angular.extend({}, defaults, newOptions);
                }
            }]);

            return OvpPerson;
        })()
    });
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/components/ovp/ovp-person/ovp-person.js.map
