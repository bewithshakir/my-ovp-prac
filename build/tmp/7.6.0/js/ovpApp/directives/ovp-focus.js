'use strict';

(function () {
    'use strict';

    findElement.$inject = ["type", "ele", "attr"];
    focusWhen.$inject = ["$timeout"];
    focusOn.$inject = ["$timeout", "$rootScope", "$parse"];
    focusOnce.$inject = ["$timeout"];
    focusNext.$inject = ["$timeout"];
    focusPrevious.$inject = ["$timeout"];
    angular.module('ovpApp.directives.focus', []).directive('focusWhen', focusWhen).directive('focusOn', focusOn).directive('focusOnce', focusOnce).directive('focusNext', focusNext).directive('focusPrevious', focusPrevious);

    /* @ngInject */
    function findElement(type, ele, attr) {
        var maxLevel = arguments.length <= 3 || arguments[3] === undefined ? 20 : arguments[3];
        // Private method for focus next / previous
        var nextEle = undefined,
            container = ele[0].parentElement;
        var attribute = type === 'next' ? attr.focusNext : attr.focusPrevious;

        if (attribute === undefined || attribute === '') {
            return;
        }

        while (maxLevel > 0 && container && !nextEle) {
            nextEle = angular.element(container).find(attribute)[0];
            container = container.parentElement;
            maxLevel = maxLevel - 1;
        }
        return nextEle;
    }

    function focusNext($timeout) {
        return {
            restrict: 'A',
            link: function link(scope, ele, attr) {
                var target;
                $timeout(function () {
                    angular.element(ele[0]).on('keydown', function (event) {
                        target = findElement('next', ele, attr);
                        if (event.keyCode === 9 && !event.shiftKey && target) {
                            target.focus();
                            event.preventDefault();
                        }
                    });
                }, 0, false);
            }
        };
    }

    function focusPrevious($timeout) {
        return {
            restrict: 'A',
            link: function link(scope, ele, attr) {
                var target;
                $timeout(function () {
                    angular.element(ele[0]).on('keydown', function (event) {
                        target = findElement('prev', ele, attr);
                        if (event.keyCode === 9 && event.shiftKey && target) {
                            target.focus();
                            event.preventDefault();
                        }
                    });
                }, 0, false);
            }
        };
    }

    /* @ngInject */
    function focusWhen($timeout) {
        // Usage: <input focus-when="vm.foo"/>
        //
        // Creates: Installs a $watch, that will give the element focus when the expression
        //    evaluates to true.
        //
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.$watch(attrs.focusWhen, function (value) {
                if (value === true) {
                    $timeout(function () {
                        return element[0].focus();
                    }, 0, false);
                }
            });
        }
    }

    /* @ngInject */
    function focusOn($timeout, $rootScope, $parse) {
        // Usage: <input focus-on="hello"/>
        // <input focus-on="{event: 'hello'}"/>
        // <input focus-on="{event: 'hello', predicate: vm.someFunction}"
        //
        // Creates: Installs a $rootScope event listener, that will give the element focus
        //
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('focusOn', function (val) {
                var focusOn = $parse(val)(scope);
                var always = true;
                var predicate = undefined;
                var event = undefined;

                if (angular.isString(focusOn)) {
                    event = focusOn;
                    always = true;
                } else {
                    event = focusOn.event;
                    predicate = focusOn.predicate;
                    if (focusOn.predicate) {
                        predicate = focusOn.predicate;
                        always = false;
                    } else {
                        always = true;
                    }
                }

                var unsubscribe = $rootScope.$on(event, function (e, data) {
                    if (always || predicate && $parse(predicate)(scope, { $event: e, $data: data })) {
                        $timeout(function () {
                            return element[0].focus();
                        }, 0, false);
                    }
                });

                scope.$on('$destroy', unsubscribe);
            });
        }
    }

    /* @ngInject */
    function focusOnce($timeout) {
        // Usage: <input focus-once/> or <div focus-once="selector"><input/></div>
        //
        // Focus once on create
        // Use the attribute value to focus the first child that matches the selector
        // Note: http://api.jquery.com/find/
        //
        return {
            restrict: 'A',
            link: function link($scope, $element, attrs) {
                var currentValue;
                if (!$scope.disabled) {
                    $timeout(function () {
                        if (attrs.focusOnce) {
                            angular.element($element[0]).find(attrs.focusOnce)[0].focus();
                        } else {
                            $element[0].focus();
                        }

                        if ($element.is('input[type=text]')) {
                            // For Firefox, we need to clear the value and then set it back.
                            // This is needed because FF does not automatically place the cursor
                            // on the end of the input string if the input is auto-filled
                            currentValue = $element.val();
                            $element.val('');
                            $element.val(currentValue);
                            // adding a click because otherwise the screen reader does
                            // not read the aria-describedby
                            $element[0].click();
                        }
                    }, 0, false);
                }
            }
        };
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/directives/ovp-focus.js.map
