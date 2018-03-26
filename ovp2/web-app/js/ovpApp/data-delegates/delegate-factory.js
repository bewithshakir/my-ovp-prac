(function () {
    'use strict';

    /**
     * A factory for creating the correct type of data delegate, based on what the data looks like.
     *
     * This is useful if you're downloading data that might match multiple types of data. For example,
     * the product page might get series data or movie data, and this factory handles the task of
     * deciding which of the two data delegates is appropriate.
     *
     * If you know ahead of time exactly what data delegate is required, then it can be instantiated
     * directly without need of this factory.
     */
    angular
        .module('ovpApp.dataDelegate', [
            'dataDelegate',
            'ovpApp.config',
            'ovpApp.messages',
            'ovpApp.services.entitlementsService',
            'ovpApp.services.parentalControlsService',
            'ovpApp.services.bookmark',
            'ovpApp.services.dateFormat',
            'ovpApp.services.channel',
            'ovpApp.services.errorCodes',
            'ovpApp.product.service',
            'ovpApp.filters.titleCase',
            'ui.router'
        ])
        .factory('delegateFactory', delegateFactory);

    /* @ngInject */
    function delegateFactory($log) {
        let registrations = [];

        let service = {
            registerDelegateDefinition,
            createInstance
        };

        return service;

        ////////////////

        /**
         * Called by a data delegate to make the delegate factory aware of it.
         *
         * @param  {[type]} definition data delegate definition
         * @param  {[type]} idFxn      a function that inspects an object and returns a boolean
         *                             indicating whether the data matches this data delegate. It is
         *                             important that the developer make this function specific enough
         *                             that it does not match the data from other data delegates.
         */
        function registerDelegateDefinition(definition, idFxn) {
            registrations[registrations.length] = {definition, idFxn};
        }

        /**
         * Create a data delegate around an object.
         * @param  {[type]} asset the object to install a data delegate around.
         * @return {[type]}       a data delegate if a matching one was found, or the original object
         *                        if one was not found.
         */
        function createInstance(asset) {
            let matches = registrations.filter(r => r.idFxn(asset));
            if (matches.length > 1) {
                $log.debug('multiple datadelegate matches! your identifier functions are too broad');
                matches[0].definition.createInstance(asset);
            } else if (matches.length === 0) {
                $log.debug('couldn\'t find a matching datadelegate. Have you registered a definition?');
                return asset;
            } else {
                return matches[0].definition.createInstance(asset);
            }
        }
    }
})();
