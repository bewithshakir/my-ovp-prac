(() => {
    'use strict';

    angular.module('ovpApp.renameStb', [])
        .component('renameStb', {
            templateUrl: '/js/ovpApp/rdvr/rdvr-toolbar/rename-stb.html',
            bindings: {
                resolve: '<',
                modalInstance: '<'
            },
            controller: class RenameStb {
                /* @ngInject */
                constructor(stbService, version) {
                    angular.extend(this, {stbService, version});
                }

                $onChanges(changes) {
                    if (changes.resolve) {
                        this.stb = this.resolve.stb;
                    }
                }

                closeIcon() {
                    return this.version.appVersion + '/images/close-x' +
                        (this.activeCloseIcon ? '-active' : '') + '.svg';
                }

                inputChanged() {
                    // filter out special characters
                    this.newName = this.newName.replace(/\W/g, '');
                }

                save() {
                    if (this.newName !== this.stb.name) {
                        this.stb.name = this.newName;
                        this.stbService.postStbName(this.stb, this.newName);
                        this.modalInstance.close();
                    }
                }
            }
        });
})();
