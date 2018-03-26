'use strict';

(function () {
    'use strict';

    config.$inject = ["$stateProvider"];
    angular.module('ovpApp.watchlater.router', ['ui.router']).config(config);

    /* @ngInject */
    function config($stateProvider) {
        $stateProvider.state('ovp.watchLater', {
            data: {
                pageTitle: 'Watch Later'
            },
            views: {
                appView: {
                    component: 'myLibrary'
                }
            },
            url: '/watchlater'
        });
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/watch-later/watch-later-ui-router.js.map
