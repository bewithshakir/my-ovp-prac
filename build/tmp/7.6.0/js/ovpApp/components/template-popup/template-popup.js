'use strict';

(function () {
    'use strict';
    TemplatePopup.$inject = ["$q", "$injector", "$templateRequest", "popUpService", "$transitions"];
    angular.module('ovpApp.components.templatePopup', ['ovpApp.directives.focus', 'ovpApp.components.popup', 'ngAria', 'ui.router']).factory('TemplatePopup', TemplatePopup).constant('PopupType', {
        ALERT: 'ALERT'
    });

    /* @ngInject */
    function TemplatePopup($q, $injector, $templateRequest, popUpService, $transitions) {
        var TPopup = function TPopup(templateUrl, scope, options) {
            this.templateUrl = templateUrl;
            this.scope = scope;
            this.options = options || {};
        };

        TPopup.prototype.setScope = function (scope) {
            this.scope = scope;
        };

        TPopup.prototype.getScope = function () {
            return this.scope;
        };

        TPopup.prototype.close = function () {
            this.scope.popup.close();
        };

        TPopup.prototype.removeClass = function () {
            this.scope.popup.removeClass(arguments);
        };

        TPopup.prototype.addClass = function () {
            this.scope.popup.addClass(arguments);
        };

        TPopup.prototype.show = function () {
            var popupDefer = $q.defer(),
                self = this,
                templateDefer = $templateRequest(this.templateUrl);
            // If video is playing and playerWrapper is visible,
            // append any popup to playerWrapper div else append it to the body.
            self.scope.parentContainer = function () {
                // Eliminate circular dependency with playerService by getting a reference here at runtime.
                var playerService = $injector.get('playerService');
                return playerService.isValidPlayRoute() ? angular.element('#playerWrapper') : angular.element('body');
            };

            templateDefer.then(function (template) {
                self.scope.popup = popUpService.show({
                    template: template,
                    showCloseIcon: angular.isDefined(self.options.showCloseIcon) ? self.options.showCloseIcon : true,
                    className: angular.isDefined(self.options.className) ? self.options.className : '',
                    overlayClickClosesPopup: self.options.overlayClickClosesPopup || false,
                    deferred: popupDefer,
                    config: self.scope.config
                }, self.scope);
            }, function () {
                throw 'Error pulling template';
            });

            popupDefer.promise.then(function () {
                self.scope.offPopupClose();
                self.getScope().$destroy();
            });

            this.scope.offPopupClose = $transitions.onSuccess({}, function () {
                self.close();
            });

            return popupDefer.promise;
        };

        return TPopup;
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/template-popup/template-popup.js.map
