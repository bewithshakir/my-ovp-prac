(function () {
    'use strict';

    angular.module('ovpApp.components.bulkRowMap', [])

    .factory('BulkRowMap', Brm);

    /* @ngInject */
    function Brm() {

        function BulkRowMap($scope, property) {
            this.getMapped = function () {
                return $scope[property];
            };
        }

        BulkRowMap.prototype.clear = function () {
            var keys = Object.keys(this);
            angular.forEach(keys, function (value) {
                if (!angular.isFunction(this[value])) {
                    delete this[value];
                }
            }, this);
        };

        BulkRowMap.prototype.selectRow = function (index) {
            this[index] = true;
        };

        BulkRowMap.prototype.unSelectRow = function (index) {
            this[index] = false;
        };

        BulkRowMap.prototype.getSelectedCount = function () {
            var count = 0;
            angular.forEach(this, function (value) {
                if (value === true) {
                    count++;
                }
            });
            return count;
        };

        BulkRowMap.prototype.removeSelected = function () {
            var markedIndices = [],
                mapped = this.getMapped(),
                i, length;

            angular.forEach(this, function (value, key) {
                if (value === true) {
                    markedIndices.push(parseInt(key));
                }
            });

            markedIndices.sort(function (a, b) {
                return a - b;
            });

            for (i = 0, length = markedIndices.length; i < length; i++) {
                mapped.splice(markedIndices[i] - i, 1);
            }

        };

        BulkRowMap.prototype.isRowSelected = function () {
            for (var key in this) {
                if (this[key] === true) {
                    return true;
                }
            }
            return false;
        };

        BulkRowMap.prototype.getSelected = function () {
            var selected = [],
                mapped = this.getMapped();
            angular.forEach(this, function (value, key) {
                if (value === true) {
                    selected.push(mapped[parseInt(key)]);
                }
            }, this);
            return selected;
        };

        return BulkRowMap;
    }
}());
