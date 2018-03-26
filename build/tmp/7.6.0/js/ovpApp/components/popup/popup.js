'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

(function () {
    'use strict';

    run.$inject = ["$transitions", "popUpService"];
    popUpService.$inject = ["$uibModal", "$templateRequest", "$compile", "$log", "$document", "$rootScope", "$timeout", "$q"];
    PopupController.$inject = ["popUpService"];
    angular.module('ovpApp.components.popup', ['ui.bootstrap', 'ui.router']).factory('popUpService', popUpService).controller('PopupController', PopupController).run(run);

    /* @ngInject */
    function run($transitions, popUpService) {
        // Hide the popup while navigating away from a page(e.g; backbutton navigation)
        $transitions.onSuccess({}, function () {
            popUpService.hide({ all: true });
        });
    }

    /**
     * Service to show/hide uibModal popup.
     *
     * DEPRECATED -- Use modal.js instead. Once popup.js is no longer being used, it should be
     * deleted.
     *
     * @param {$uibModal} - bootstrap uibModal service
     *        {$document} - angualr document service
     *        {$templateRequest} - angular template request service
     *        {$compile} -  angular's template compile service
     *
     * @return {Object} - service Object that contains show and hide methods
     */
    /* @ngInject */
    function popUpService($uibModal, $templateRequest, $compile, $log, $document, $rootScope, $timeout, $q) {
        var service = undefined,
            alertModalInstance = undefined,
            alertModalOptionsArray = [],
            modalInstance = undefined,
            modalInstanceArray = [],
            previousActiveElementList = [];

        service = {
            show: show,
            addClass: addClass,
            removeClass: removeClass,
            hide: hide,
            close: hide
        };

        return service;

        /////////////

        function addClass(className) {
            $document.find('.window-splash').addClass(className);
        }

        function removeClass(className) {
            $document.find('.window-splash').removeClass(className);
        }

        // Open uibModal Instance
        function show(attrs, passedScope) {
            $log.warn('popup.js is deprecated. Migrate this dialog over to modal.js');
            // Ui Modal Popup must be provided a parent scope
            // that contains template to be appended to the content div
            var scope = passedScope || $rootScope.$new();

            angular.extend(scope, attrs);

            // Wait until we fetch the base template and container
            // to which the popup needs to append.
            $q.all([scope.parentContainer(), $templateRequest('/js/ovpApp/components/popup/popup.html')]).then(function (result) {
                var _result = _slicedToArray(result, 2);

                var parentContainer = _result[0];
                var template = _result[1];

                var modalOptions = {
                    scope: scope, // scope containing the attributes passed for configuring the popup
                    windowClass: '',
                    appendTo: parentContainer || angular.element('body'),
                    openedClass: 'popup-open', //This is to differentiate it from 'modal-open' used by modals
                    windowTemplateUrl: '/js/ovpApp/components/popup/window-frame.html',
                    backdrop: false, // do not show backdrop
                    keyboard: false, // set to false, since we have defined custom handler for key events
                    controller: 'PopupController as vm'
                };

                var element = $compile(template)(scope);
                element.find('.content').append(scope.template);
                modalOptions.template = element[0];
                modalOptions.windowClass += ' ' + scope.className;
                // Initially popups must be kept hidden and
                // Dom elements have been positioned centrally, to avoid visual flickers
                modalOptions.scope.isVisible = 'hidden';
                modalOptions.scope.popupCss = 'defaultPosition';

                previousActiveElementList.push($document[0].activeElement);

                if (scope.config && scope.config.type === 'ALERT') {
                    if (alertModalOptionsArray.length === 0) {
                        alertModalInstance = $uibModal.open(modalOptions);
                        alertModalInstance.scope = scope;
                    }
                    alertModalOptionsArray.push(modalOptions);
                } else if (!scope.config || !scope.config.type) {
                    modalInstance = $uibModal.open(modalOptions);
                    modalInstance.scope = scope;
                    modalInstanceArray.push(modalInstance);
                }

                $timeout(function () {
                    setUpBackgroundFramePosition();
                    modalOptions.scope.popupCss = 'default';
                    modalOptions.scope.isVisible = 'visible';
                });
            });

            // key evt handler.
            $document.on('keyup', handleEvent);
            $document.on('click', handleEvent);

            return service;
        }

        // centrally position the background-frame for all popups.
        function setUpBackgroundFramePosition() {
            $document.find('.background-frame').css({
                left: Math.abs(($document.find('body').outerWidth() - $document.find('#alertBox').outerWidth()) / 2),
                top: Math.abs(($document.find('body').outerHeight() - $document.find('#alertBox').outerHeight()) / 2)
            });
        }

        // Perform evt validations before closing popup.
        function handleEvent(evt) {
            if (modalInstanceArray.length === 0 && !alertModalInstance) {
                return;
            }

            var lastArrayIndex = modalInstanceArray.length - 1,
                validTarget = evt.target && angular.isFunction(evt.target.className.search);

            // Do not register click for HTML elements that do not have classNames as String.
            // E.g; svg icons.
            if (!validTarget) {
                return;
            }

            // Return if the none of the below mentioned events occurred:
            // 1) user has clicked on ok button on an alertModal.
            // 2) user has clicked outside the alertModal/popUpModal.
            // 3) user has clicked outside a popUp and overlayClick
            //    for popUp is set as true[ovp-click-confirm sets overlayClick as false]
            // 4) user has pressed the ESC key
            if (validTarget && evt.keyCode !== 27 && evt.target.className.search('popUp popupHolder') < 0 || modalInstanceArray.length > 0 && modalInstanceArray[lastArrayIndex].scope && !modalInstanceArray[lastArrayIndex].scope.overlayClickClosesPopup) {
                return;
            }

            hide();
        }

        // Close the Modal Popup.
        function hide(options) {
            if (alertModalInstance) {
                alertModalInstance.close();

                if (alertModalInstance.scope && alertModalInstance.scope.deferred) {
                    if (options && options.all) {
                        alertModalInstance.scope.deferred.reject();
                        alertModalOptionsArray = [];
                    } else {
                        alertModalInstance.scope.deferred.resolve();
                    }
                }

                var oldConfig = alertModalInstance.scope && alertModalInstance.scope.config;
                alertModalInstance = null;
                alertModalOptionsArray.splice(0, 1);

                if (alertModalOptionsArray.length > 0 && !angular.equals(oldConfig, alertModalOptionsArray[0].scope.config)) {
                    alertModalOptionsArray[0].scope.isVisible = 'hidden';
                    // we need to add this timeout so we always have
                    // the correct alertModalInstance reference.
                    $timeout(function () {
                        alertModalInstance = $uibModal.open(alertModalOptionsArray[0]);
                        alertModalInstance.scope = alertModalOptionsArray[0].scope;
                        // we need to wait for the popup to openup
                        // before modifying the positions/css
                        $timeout(function () {
                            setUpBackgroundFramePosition();
                            alertModalOptionsArray[0].scope.isVisible = 'visible';
                        });
                    }, 0);
                }
            } else {
                //close only the topMost modalInstance.
                var currentModalInstance = modalInstanceArray[modalInstanceArray.length - 1];
                if (currentModalInstance) {
                    currentModalInstance.close();
                    if (currentModalInstance.scope && currentModalInstance.scope.deferred) {
                        currentModalInstance.scope.deferred.resolve();
                    }
                    modalInstanceArray.pop();
                }
            }
            if (previousActiveElementList.length > 0) {
                angular.element(previousActiveElementList[previousActiveElementList.length - 1]).focus();
                previousActiveElementList.pop();
            }
            cleanup();
        }

        // Cleanup Modal Instance and other cleanup operations
        function cleanup() {
            if (!alertModalInstance && modalInstanceArray.length === 0) {
                $document.off('keyup', handleEvent);
                $document.off('click', handleEvent);
            }
        }
    }

    /* @ngInject */
    function PopupController(popUpService) {
        var vm = this;

        vm.hide = function () {
            popUpService.hide();
        };

        return vm;
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/popup/popup.js.map
