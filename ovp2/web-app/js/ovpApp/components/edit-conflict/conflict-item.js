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
    angular.module('ovpApp.components.conflictItem', [])
        .component('conflictItem', {
            bindings: {
                recording: '<',
                state: '<',
                onStateChanged: '&'
            },
            templateUrl: '/js/ovpApp/components/edit-conflict/conflict-item.html',
            controller: class ConflictItem {
                /* @ngInject */
                constructor(OvpSrcService, rdvrService, stbService) {
                    angular.extend(this, {OvpSrcService, rdvrService, stbService});
                }

                $onChanges(changes) {
                    if (changes.state && this.state === undefined) {
                        this.state = 'undecided';
                    }

                    if (changes.recording) {
                        this.genre = this.recording.genres[0] || '';
                        this.startTime = this.stbService.formatUnix(this.recording.startTime, 'h:nn a');
                    }
                }

                toggleSelection() {
                    if (this.state !== 'save') {
                        this.state = 'save';
                    } else {
                        this.state = 'delete';
                    }

                    this.onStateChanged({recording: this.recording, state: this.state});
                }

                isMovie() {
                    return this.rdvrService.isMovie(this.recording.tmsProgramId);
                }

                checkboxImage() {
                    let path;
                    if (this.state === 'save') {
                        path = '/images/rdvr_checkBoxes_check.png';
                    } else if (this.state === 'delete') {
                        path = '/images/rdvr_checkBoxes_x.png';
                    } else {
                        path = '/images/rdvr_checkBoxes_justbox.png';
                    }

                    return this.OvpSrcService.versionPath(path);
                }
            }
        });
})();
