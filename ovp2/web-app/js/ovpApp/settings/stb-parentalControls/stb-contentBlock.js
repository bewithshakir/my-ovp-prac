(() => {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.contentBlock', [
        'ovpApp.components.ovp.ovpSwitch',
        'ovpApp.services.stbSettingsService',
        'ovpApp.directives.arrowNav'
    ])
    .component('stbContentBlock', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-contentBlock.html',
        bindings: {
            'stb': '<',
            'blockedContent': '<',
            'contentBlock': '<'
        },
        controller: class StbContentBlock {
            /* @ngInject */
            constructor(StbSettingsService) {
                angular.extend(this, {StbSettingsService});
            }

            $onInit() {
                this.alertmessage = '';
                this.blockedContent = this.blockedContent || [];
            }

            contentClicked(content) {
                let isBlocked = this.isContentBlocked(content);
                this.updateBlockedContent(content, !isBlocked);
                return this.StbSettingsService.updateBlockedContent(this.stb, this.blockedContent).catch(() => {
                    // Revert changes
                    this.updateBlockedContent(content, isBlocked);
                }).then(() => {
                    this.alertmessage = 'Content ' + content + (isBlocked ? ', unblocked' : ', blocked');
                });
            }

            /* Private method */
            updateBlockedContent(content, isBlocked) {
                if (isBlocked) {
                    this.blockedContent.push(content);
                } else {
                    this.blockedContent.splice(this.blockedContent.indexOf(content), 1);
                }
            }

            isContentBlocked(content) {
                return this.blockedContent.includes(content);
            }
        }
    });
})();
