'use strict';

(function () {
    'use strict';

    angular.module('ovpApp.components.baseDropdown', []).controller('BaseDropdownController', BaseDropdownController);

    /* @ngInject */
    function BaseDropdownController() {
        this.toggled = function toggled() {
            this.alert = ''; // Clear alert message
            this.focusDropdownMenu = !this.focusDropdownMenu;
        };

        this.onFocus = function onFocus() {
            this.focusDropdownMenu = false;
            this.focusButton = false;
        };

        this.onBlur = function onBlur() {
            if (!this.focusDropdownMenu && !this.focusButton) {
                this.status.isOpen = false;
                this.focusDropdownMenu = true;
            }
        };

        this.onDropDownMenuItemBlur = function onDropDownMenuItemBlur(last) {
            if (last && !this.focusButton) {
                this.status.isOpen = false;
                this.focusDropdownMenu = false;
            }
        };
    }
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/components/header/tools/base-dropdown-controller.js.map
