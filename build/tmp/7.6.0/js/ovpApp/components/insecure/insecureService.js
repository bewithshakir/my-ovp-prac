'use strict';

(function () {
    'use strict';

    InsecureService.$inject = ["$document", "$timeout"];
    angular.module('ovpApp.components.insecure', ['ovpApp.config']).service('InsecureService', InsecureService);

    /* @ngInject */
    function InsecureService($document, $timeout) {
        this.get = get;
        return;

        /////////

        function get(url) {
            var trackingEl = angular.element('<img class=\'hide\' src="' + url + '" />');
            trackingEl.appendTo($document[0].body);
            $timeout(function () {
                trackingEl.remove();
            }, 10000);
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/insecure/insecureService.js.map
