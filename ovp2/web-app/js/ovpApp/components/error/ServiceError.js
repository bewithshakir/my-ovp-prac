(function () {
    'use strict';
    angular.module('ovpApp.components.error.ServiceError', [])
    .factory('ServiceError', serviceError);

    /* @ngInject */
    function serviceError() {
        function ServiceError(message) {
            this.name = 'ServiceError';
            this.message = message;
            Error.prototype.constructor.call(this, message);
        }
        ServiceError.prototype = new Error();
        ServiceError.prototype.constructor = ServiceError;

        return ServiceError;

    }
}());
