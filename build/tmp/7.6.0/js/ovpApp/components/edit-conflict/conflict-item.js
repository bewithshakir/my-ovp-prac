'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    /**
     * conflictItem
     * Represents a recording in conflict
     *
     * Example Usage:
     * <conflict-item recording="someInputValue" on-state-changed="someCallback"></conflict-item>
     *
     * Bindings:
     *    recording: (object) recording to display
     *    state:  (string) 'save', 'delete', 'undecided'
     *    onStateChanged: (function) callback when the user changes the selection state
     */
    angular.module('ovpApp.components.conflictItem', []).component('conflictItem', {
        bindings: {
            recording: '<',
            state: '<',
            onStateChanged: '&'
        },
        templateUrl: '/js/ovpApp/components/edit-conflict/conflict-item.html',
        controller: (function () {
            /* @ngInject */

            ConflictItem.$inject = ["OvpSrcService", "rdvrService", "stbService"];
            function ConflictItem(OvpSrcService, rdvrService, stbService) {
                _classCallCheck(this, ConflictItem);

                angular.extend(this, { OvpSrcService: OvpSrcService, rdvrService: rdvrService, stbService: stbService });
            }

            _createClass(ConflictItem, [{
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.state && this.state === undefined) {
                        this.state = 'undecided';
                    }

                    if (changes.recording) {
                        this.genre = this.recording.genres[0] || '';
                        this.startTime = this.stbService.formatUnix(this.recording.startTime, 'h:nn a');
                    }
                }
            }, {
                key: 'toggleSelection',
                value: function toggleSelection() {
                    if (this.state !== 'save') {
                        this.state = 'save';
                    } else {
                        this.state = 'delete';
                    }

                    this.onStateChanged({ recording: this.recording, state: this.state });
                }
            }, {
                key: 'isMovie',
                value: function isMovie() {
                    return this.rdvrService.isMovie(this.recording.tmsProgramId);
                }
            }, {
                key: 'checkboxImage',
                value: function checkboxImage() {
                    var path = undefined;
                    if (this.state === 'save') {
                        path = '/images/rdvr_checkBoxes_check.png';
                    } else if (this.state === 'delete') {
                        path = '/images/rdvr_checkBoxes_x.png';
                    } else {
                        path = '/images/rdvr_checkBoxes_justbox.png';
                    }

                    return this.OvpSrcService.versionPath(path);
                }
            }]);

            return ConflictItem;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/edit-conflict/conflict-item.js.map
