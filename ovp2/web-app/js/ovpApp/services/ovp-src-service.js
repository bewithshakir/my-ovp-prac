(function () {
    'use strict';

    angular.module('ovpApp.src-service',
        [
            'ovpApp.version'
        ])

    .service('OvpSrcService', OvpSrcService);

    function OvpSrcService($window, version) {
        var vm = this,
            delimiter = '?';

        vm.versionPath = versionPath;
        vm.appendHash = appendHash;

        function versionPath(path) {
            var newPath = '/' + version.appVersion;
            if (path.charAt(0) !== '/') {
                newPath += '/';
            }
            newPath += path;
            return newPath;
        }

        function appendHash(url) {
            if (url) {
                if (url.indexOf('?') >= 0) {
                    delimiter = '&';
                }
                url += delimiter + 'v=' + version.commitHash;
            }
            return url;
        }
    }
}());
