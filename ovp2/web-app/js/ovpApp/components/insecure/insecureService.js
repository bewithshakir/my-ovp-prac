(function () {
    'use strict';

    angular.module('ovpApp.components.insecure', [
        'ovpApp.config'
    ])
    .service('InsecureService', InsecureService);

    /* @ngInject */
    function InsecureService($document, $timeout) {
        this.get = get;
        return;

        /////////

        function get(url) {
            let trackingEl = angular.element(`<img class='hide' src="${url}" />`);
            trackingEl.appendTo($document[0].body);
            $timeout(() => {
                trackingEl.remove();
            }, 10000);
        }
    }

}());
