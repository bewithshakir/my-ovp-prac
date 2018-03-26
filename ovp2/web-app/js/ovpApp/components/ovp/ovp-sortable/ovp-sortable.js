(function () {
    'use strict';

    angular.module('ovpApp.components.ovp.sortable', [])
        .directive('ovpSortable', ovpSortable)
        .directive('ovpSortableHandle', ovpSortableHandle);

    /* @ngInject */
    function ovpSortable() {
        return {
            restrict: 'A',
            scope: {
                ovpSortable: '=ovpSortable'
            },
            compile: function () {
                return function ngEventHandler(scope, elem) {

                    var startList;

                    elem.addClass('ovp-sortable');

                    // Utilizes jQuery UI 'sortable'
                    // jquery-ui-1.8.16.custom.min.js
                    elem.sortable({
                        containment: elem,
                        axis: 'y',
                        distance: 1,
                        items: '> li',
                        tolerance: 'pointer',
                        placeholder: 'ovp-sortable-placeholder',
                        scrollSensitivity: 150,
                        scrollSpeed: 100,
                        // move the helper before the
                        // placeholder for the CSS counter
                        change: function (event, ui) {
                            ui.helper.insertBefore(ui.placeholder);
                        },
                        start: function () {
                            startList = elem.find('> :not(li.ovp-sortable-placeholder)').toArray();
                        },
                        stop: function (event, ui) {
                            var stopList = elem.find('> :not(li.ovp-sortable-placeholder)').toArray(),
                                listChanged = false,
                                newSortable,
                                i, length;

                            for (i = 0, length = startList.length; i < length; i++) {
                                if (startList[i] !== stopList[i]) {
                                    listChanged = true;
                                    break;
                                }
                            }

                            if (listChanged) {

                                newSortable = [];

                                angular.forEach(stopList, function (listElement) {
                                    newSortable.push(scope.ovpSortable[startList.indexOf(listElement)]);
                                });

                                // Remove every item from the list and update angular
                                scope.ovpSortable.splice(0, scope.ovpSortable.length);
                                scope.$apply();

                                // Add the new order to the list and update angular
                                Array.prototype.push.apply(scope.ovpSortable, newSortable);
                                scope.$apply();

                                scope.$emit('ovp-sortable:order-change', {
                                    movedUp: ui.position.top < ui.originalPosition.top
                                });
                            }
                        }
                    });

                };
            }
        };
    }

    /* @ngInject */
    function ovpSortableHandle() {
        return {
            restrict: 'E',
            templateUrl: '/js/ovpApp/components/ovp/ovp-sortable/ovp-sortable-handle.html'
        };
    }
}());
