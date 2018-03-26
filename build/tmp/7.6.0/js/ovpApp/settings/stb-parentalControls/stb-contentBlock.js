'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.contentBlock', ['ovpApp.components.ovp.ovpSwitch', 'ovpApp.services.stbSettingsService', 'ovpApp.directives.arrowNav']).component('stbContentBlock', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-contentBlock.html',
        bindings: {
            'stb': '<',
            'blockedContent': '<',
            'contentBlock': '<'
        },
        controller: (function () {
            /* @ngInject */

            StbContentBlock.$inject = ["StbSettingsService"];
            function StbContentBlock(StbSettingsService) {
                _classCallCheck(this, StbContentBlock);

                angular.extend(this, { StbSettingsService: StbSettingsService });
            }

            _createClass(StbContentBlock, [{
                key: '$onInit',
                value: function $onInit() {
                    this.alertmessage = '';
                    this.blockedContent = this.blockedContent || [];
                }
            }, {
                key: 'contentClicked',
                value: function contentClicked(content) {
                    var _this = this;

                    var isBlocked = this.isContentBlocked(content);
                    this.updateBlockedContent(content, !isBlocked);
                    return this.StbSettingsService.updateBlockedContent(this.stb, this.blockedContent)['catch'](function () {
                        // Revert changes
                        _this.updateBlockedContent(content, isBlocked);
                    }).then(function () {
                        _this.alertmessage = 'Content ' + content + (isBlocked ? ', unblocked' : ', blocked');
                    });
                }

                /* Private method */
            }, {
                key: 'updateBlockedContent',
                value: function updateBlockedContent(content, isBlocked) {
                    if (isBlocked) {
                        this.blockedContent.push(content);
                    } else {
                        this.blockedContent.splice(this.blockedContent.indexOf(content), 1);
                    }
                }
            }, {
                key: 'isContentBlocked',
                value: function isContentBlocked(content) {
                    return this.blockedContent.includes(content);
                }
            }]);

            return StbContentBlock;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/settings/stb-parentalControls/stb-contentBlock.js.map
