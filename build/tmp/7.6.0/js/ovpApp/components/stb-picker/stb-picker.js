'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    /**
     * Dialog for selecting a set top box
     *
     * bindings:
     *   resolve: {
     *     title: title of the dialog
     *     stbs: list of set top boxes
     *     onSelect: callback to execute when the stb is selected.
     *               If this takes time, a loading spinner will display
     *   }
     *
     */
    angular.module('ovpApp.stbPicker', []).component('stbPicker', {
        templateUrl: '/js/ovpApp/components/stb-picker/stb-picker.html',
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controller: (function () {
            /* @ngInject */

            StbPicker.$inject = ["stbService", "version", "promiseTracker"];
            function StbPicker(stbService, version, promiseTracker) {
                _classCallCheck(this, StbPicker);

                angular.extend(this, {
                    stbService: stbService,
                    version: version,
                    promiseTracker: promiseTracker
                });
            }

            _createClass(StbPicker, [{
                key: '$onInit',
                value: function $onInit() {
                    this.loadingTracker = this.promiseTracker();
                }
            }, {
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.resolve) {
                        this.title = this.resolve.title;
                        this.stbs = this.resolve.stbs;
                        this.callback = this.resolve.callback;
                        this.ariaDescription = this.resolve.ariaDescription;
                    }
                }
            }, {
                key: 'closeIcon',
                value: function closeIcon() {
                    return this.version.appVersion + '/images/close-x' + (this.activeCloseIcon ? '-active' : '') + '.svg';
                }
            }, {
                key: 'onSelect',
                value: function onSelect(stb) {
                    var _this = this;

                    if (angular.isFunction(this.callback)) {
                        var promise = this.$q.when(this.callback(stb)).then(function () {
                            return _this.modalInstance.close(stb);
                        }, function (error) {
                            return _this.modalInstance.dismiss({ error: error, stb: stb });
                        });

                        this.loadingTracker.addPromise(promise);
                    } else {
                        this.modalInstance.close(stb);
                    }
                }
            }]);

            return StbPicker;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/stb-picker/stb-picker.js.map
