'use strict';

(function () {
    'use strict';

    angular.module('ovpApp.components.ovp.checkBox', []).directive('ovpCheckBox', ovpCheckBox);

    /* @ngInject */
    function ovpCheckBox() {
        return {
            restrict: 'E',
            require: ['ngModel'],
            link: function link($scope, $element) {

                var modelController = $element.controller('ngModel');

                modelController.$render = function () {
                    if (modelController.$modelValue) {
                        $element.addClass('checked');
                    } else {
                        $element.removeClass('checked');
                    }
                };

                $element.addClass('ovp-check-box');

                $element.on('click', function () {
                    modelController.$setViewValue(!modelController.$modelValue);
                    modelController.$render();
                });

                $scope.$on('$destroy', function () {
                    $element.off();
                });
            }
        };
    }
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/components/ovp/ovp-check-box/ovp-check-box.js.map
