'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    /**
     * infoPanel
     *
     * Displays information about the currently playing program in the player controls
     *
     * Example Usage:
     * <info-panel asset="$ctrl.someMovieOrTvShow"></info-panel>
     *
     * Bindings:
     *    asset: ([type]) The program to display information about
     */
    angular.module('ovpApp.playerControls').component('infoPanel', {
        bindings: {
            asset: '<'
        },
        templateUrl: '/js/ovpApp/components/player/info-panel.html',
        controller: (function () {
            /* @ngInject */

            InfoPanel.$inject = ["$timeout", "version", "config", "rx", "createObservableFunction"];
            function InfoPanel($timeout, version, config, rx, createObservableFunction) {
                _classCallCheck(this, InfoPanel);

                angular.extend(this, { $timeout: $timeout, version: version, config: config, rx: rx, createObservableFunction: createObservableFunction });
            }

            _createClass(InfoPanel, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.onFocus = this.createObservableFunction();
                    this.onMouseOver = this.createObservableFunction();
                    this.onMouseLeave = this.createObservableFunction();
                    this.togglePopup = this.createObservableFunction();

                    this.showInfoPanel = false;

                    var INFO_PANEL_TIMEOUT = parseInt(this.config.playerParameters.infoPopupTimeoutMs);

                    this.onMouseOver.subscribe(function () {
                        return _this.hovered = true;
                    });
                    this.onMouseLeave.subscribe(function () {
                        return _this.hovered = false;
                    });

                    var userInteracting = this.onFocus.merge(this.onMouseOver).map(function () {
                        return true;
                    });
                    var userNotInteracting = this.onMouseLeave.map(function () {
                        return false;
                    });

                    this.togglePopup.subscribe(function () {
                        _this.showInfoPanel = !_this.showInfoPanel;
                        if (_this.showInfoPanel) {
                            var minimumTime = _this.rx.Observable.timer(INFO_PANEL_TIMEOUT);

                            // Wait until 500 ms elapse with the user not hovering or focussing
                            userNotInteracting.merge(userInteracting).debounce(500).filter(function (val) {
                                return !val;
                            }).takeUntil(_this.togglePopup).zip(minimumTime).first().subscribe(function () {
                                return _this.showInfoPanel = false;
                            });
                        }
                    });
                }
            }, {
                key: 'getDirectors',
                value: function getDirectors() {
                    return this.asset && this.asset.directors && this.asset.directors.map(function (director) {
                        return director.name;
                    }).join(' ');
                }
            }, {
                key: 'getActors',
                value: function getActors() {
                    return this.asset && this.asset.actors && this.asset.actors.map(function (actor) {
                        return actor.name;
                    }).join(', ');
                }
            }, {
                key: 'image',
                value: function image() {
                    var suffix = this.hovered || this.showInfoPanel ? '-active.svg' : '.svg';
                    return this.version.appVersion + '/images/info-circle' + suffix;
                }
            }]);

            return InfoPanel;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/info-panel.js.map
