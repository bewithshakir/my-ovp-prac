'use strict';

(function () {
    'use strict';
    ErrorCodesDirective.$inject = ["errorCodesService", "$log"];
    ErrorCodesHeaderDirective.$inject = ["errorCodesService", "$log"];
    angular.module('ovpApp.config').directive('errorCodes', ErrorCodesDirective).directive('errorCodesHeader', ErrorCodesHeaderDirective);

    /* @ngInject */
    function ErrorCodesDirective(errorCodesService, $log) {

        return {
            restrict: 'AE',
            template: '{{errorMessage}}',
            scope: {
                errorCodes: '@',
                replaceVars: '@'
            },
            link: function link($scope) {
                var vars = {};
                $scope.errorMessage = '';
                if ($scope.errorCodes) {
                    if ($scope.replaceVars) {
                        try {
                            vars = JSON.parse($scope.replaceVars);
                        } catch (e) {
                            $log.error(e);
                        }
                    }
                    $scope.errorMessage = errorCodesService.getMessageForCode($scope.errorCodes, vars) + ' (' + $scope.errorCodes + ')';
                }
            }
        };
    }

    /* @ngInject */
    function ErrorCodesHeaderDirective(errorCodesService, $log) {

        return {
            restrict: 'AE',
            template: '{{errorHeader}}',
            scope: {
                errorCodesHeader: '@',
                replaceVars: '@'
            },
            link: function link($scope) {
                var vars = {};
                $scope.errorHeader = '';
                if ($scope.errorCodesHeader) {
                    if ($scope.replaceVars) {
                        try {
                            vars = JSON.parse($scope.replaceVars);
                        } catch (e) {
                            $log.error(e);
                        }
                    }
                    $scope.errorHeader = errorCodesService.getHeaderForCode($scope.errorCodesHeader, vars);
                }
            }
        };
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/config/error-codes/error-codes-directive.js.map
