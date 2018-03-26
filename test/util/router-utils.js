/* globals window */

/*
 * Utils to help test UI routes. Adapted from
 * http://nikas.praninskas.com/angular/2014/09/27/unit-testing-ui-router-configuration/
 */

(function () {
    'use strict';

    var UiRouterTester = window.UiRouterTester = function ($injector) {
        this.$templateCache = $injector.get('$templateCache');
        this.$location = $injector.get('$location');
        this.$rootScope = $injector.get('$rootScope');
        this.$state = $injector.get('$state');
    };

    /*
     * Since ui-router will by default try to retrieve your views,
     * we use this tiny function to mock a template for a specific route.
     */
    UiRouterTester.prototype.mockTemplate = function (templateRoute, tmpl) {
        this.$templateCache.put(templateRoute, tmpl);
    };

    /*
     * Go to a state by name
     */
    UiRouterTester.prototype.goToState = function (stateName) {
        this.$state.go(stateName);
        this.$rootScope.$digest();
    };

    /*
     * Literally takes you to the specified URL and then does a $digest. Simply to make tests look more readable.
     */
    UiRouterTester.prototype.goTo = function (url) {
        this.$location.url(url);
        this.$rootScope.$digest();
    };

    /*
     * This is used mainly to check onEnter and onExit blocks, as you actually need to do the state transition.
     * We prime the $location so that the ui-router does not immediately go somewhere different on $scope.$digest().
     */
    UiRouterTester.prototype.goFrom = function (url) {
        return {
            toState: function (state, params) {
                this.$location.replace().url(url); //Don't actually trigger a reload
                this.$state.go(state, params);
                this.$rootScope.$digest();
            }
        };
    };

    /*
     * Resolve blocks are a bit tricky to test, so this is what I've been using personally.
     * It's a bit weird, but it essentially lets you execute the resolve as if you were ui-router.
     * It uses $injector to get you the fully wired up version of the resolve result.
     */
    UiRouterTester.prototype.resolve = function (value) {
        return {
            forStateAndView: angular.bind(this, function (stateName, view) {
                var state = this.$state.get(stateName),
                    viewDefinition;

                if (!state) {
                    throw 'State [' + stateName + '] not found';
                }

                viewDefinition = view ?
                    state.views[view] :
                    state;

                return this.$injector.invoke(viewDefinition.resolve[value]);
            })
        };
    };
})();
