(function () {
    'use strict';
    angular.module('ovpApp.cdvr', [
        'ovpApp.config',
        'ovpApp.messages',
        'ui.router',
        'ovpApp.services.cdvr',
        'ovpApp.services.ovpStorage',
        'ovpApp.services.errorCodes',
        'ovpApp.directives.gridList',
        'angularMoment'
    ]);
})();
