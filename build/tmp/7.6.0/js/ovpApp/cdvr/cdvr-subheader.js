'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.cdvr').component('cdvrSubheader', {
        templateUrl: '/js/ovpApp/cdvr/cdvr-sub-header.html',
        controller: (function () {
            /* @ngInject */

            CdvrSubheader.$inject = ["$state"];
            function CdvrSubheader($state) {
                _classCallCheck(this, CdvrSubheader);

                angular.extend(this, { $state: $state });
            }

            _createClass(CdvrSubheader, [{
                key: '$onInit',
                value: function $onInit() {
                    this.menuItems = [{
                        enabled: function enabled() {
                            return true;
                        },
                        'class': '',
                        badges: function badges() {
                            return false;
                        },
                        description: 'My Recordings lists all recordings stored in the Cloud DVR',
                        state: 'ovp.cdvr.recorded',
                        title: 'My Recordings'
                    }, {
                        enabled: function enabled() {
                            return true;
                        },
                        'class': '',
                        badges: function badges() {
                            return false;
                        },
                        description: 'Scheduled Cloud DVR Recordings',
                        state: 'ovp.cdvr.scheduled',
                        title: 'Scheduled'
                    }];
                }
            }]);

            return CdvrSubheader;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/cdvr/cdvr-subheader.js.map
