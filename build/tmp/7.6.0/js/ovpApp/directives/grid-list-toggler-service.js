'use strict';

(function () {
    'use strict';

    gridListTogglerService.$inject = ["rx", "$rootScope", "$log"];
    angular.module('ovpApp.directives.gridList.togglerService', ['rx']).factory('gridListTogglerService', gridListTogglerService);

    //Intended for use only by ovp-grid-list and grid-list-toggler, to facilitate
    //   communication between the two. Not intended for use by other components.

    /* @ngInject */
    function gridListTogglerService(rx, $rootScope, $log) {
        var DEFAULT_ID = '__default';
        var DEBUG_LOGGING = false;

        var contexts = {};

        var service = {
            register: register,
            setState: setState
        };
        return service;

        ////////////////

        function log(message) {
            if (DEBUG_LOGGING) {
                $log.debug(message);
            }
        }

        /**
         * Creates a new grouping of gridlists and gridlist togglers, or joins the existing one.
         * @param  {string} proposedState state that the group will begin in if it doesn't exist yet
         * @param  {string} id            (optional) identifier of the group
         * @return {object}               Object containing the starting state, and an observable that
         *                                will emit changes to the state of the group.
         */
        function register(proposedState) {
            var id = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_ID : arguments[1];

            log('>> enter register(' + proposedState + ', ' + id + ')');
            if (!contexts[id]) {
                log('context "' + id + '" doesn\'t yet exist. Creating it');
                contexts[id] = {
                    state: null,
                    source: null,
                    observers: []
                };
            } else {
                log('context "' + id + '" already eists, with state = ' + contexts[id].state);
            }

            if (proposedState && !contexts[id].state) {
                log('accepting proposed state: ' + proposedState);
                setState(proposedState, id);
            }

            if (!contexts[id].source) {
                contexts[id].source = createSource(id);
            }

            log('<< exit register(' + proposedState + ', ' + id + ')');
            return { state: contexts[id].state, source: contexts[id].source };
        }

        function createSource() {
            var id = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_ID : arguments[0];

            log('creating a new observable for context ' + id);
            var source = rx.Observable.create(function (observer) {
                contexts[id].observers.push(observer);

                return rx.Disposable.create(function () {
                    log('disposing one observer for ' + id);
                    contexts[id].observers.splice(contexts[id].observers.indexOf(observer), 1);
                    if (contexts[id].observers.length === 0) {
                        log(id + ' has no more observers; clearing state');
                        contexts[id].state = null;
                    }
                });
            });

            return source;
        }

        /**
         * Toggles a group to a new state, and notifies all listeners
         * @param {string} newState new state of the group (eg, 'list' or 'grid')
         * @param {string} id       (optional) identifier of the group
         */
        function setState(newState) {
            var id = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_ID : arguments[1];

            log('>> enter setState(' + newState + ', ' + id + ')');
            if (!contexts[id]) {
                log('context "' + id + '" doesn\'t yet exist. Creating it');
                contexts[id] = {
                    state: null,
                    source: null,
                    observers: []
                };
            }

            contexts[id].state = newState;
            log('notifying ' + contexts[id].observers.length + ' observers');
            contexts[id].observers.forEach(function (o) {
                return o.onNext(newState);
            });
            log('<< exit setState(' + newState + ', ' + id + ')');
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/directives/grid-list-toggler-service.js.map
