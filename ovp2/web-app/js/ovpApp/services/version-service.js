(function () {
    'use strict';

    angular.module('ovpApp.service.version', [
        'ovpApp.components.header.data',
        'ovpApp.version',
        'ui.router'
    ])
    .service('versionService', versionService);

    /**
     * will refresh the app if:
     * 1.  user is switching between menuItems and the version.txt file has been updated on the server
     * 2.  the last time app checked the version.txt is within the versionCheckTimeout (in activityConfig)
     * 3.  timeout is held only in memory, not in browser storage
     */

    /* @ngInject */
    function versionService($q, version, $http, $timeout, $transitions,
                            menuData, $rootScope, $log, $window, config) {


        var alreadyCheckedWithinTimeInterval = false;
        var menuItems = [];
        var timeoutInterval = parseInt(config.versionCheckTimeoutIntervalMS);
        activate();

        function isCurrentVersion() {
            var defer = $q.defer();

            if (alreadyCheckedWithinTimeInterval) {
                defer.resolve(true);
            } else {
                $http({
                    url: '/index.html?v=' + version.appVersion + '&h=' + version.commitHash,
                    method: 'GET',
                    headers: { 'Cache-Control' : 'no-cache' },
                    cache: false
                }).then(res => {
                    //find app version in head
                    var appVersion = /appVersion: '(.*)'/.exec(res.data)[1];
                    defer.resolve(version.appVersion === appVersion);
                    alreadyCheckedWithinTimeInterval = true;
                    $timeout(() => {
                        alreadyCheckedWithinTimeInterval = false;
                    }, timeoutInterval);
                }, error => {
                    defer.reject(error);
                });
            }
            return defer.promise;
        }

        function activate() {
            menuData.getMainMenuItems()
                .then(models => {
                    menuItems = models;
                });

            $transitions.onSuccess({}, function (transition) {
                const statesToCheck = menuItems.map(model => model.link);
                const toState = transition.to();
                const fromState = transition.from();

                const fromStateIsAMenuItem = function (fromState) {
                    if (fromState && fromState.name) {
                        //this will look for 'ovp.ondemand' from within 'ovp.ondemand.featured'
                        return menuItems.find(model => fromState.name.indexOf(model.link) > -1) !== undefined;
                    } else {
                        return false;
                    }
                };

                if (statesToCheck.indexOf(toState.name) > -1 &&
                    fromStateIsAMenuItem(fromState)) {
                    isCurrentVersion().then(isCurrentVersion => {
                        if (!isCurrentVersion) {
                            $log.info('version updated, refreshing page ...');
                            $window.location.reload(true);
                        }
                    });
                }
            });
        }
    }

}());
