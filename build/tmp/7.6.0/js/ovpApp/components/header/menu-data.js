'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

(function () {
    'use strict';

    menuData.$inject = ["rxhttp", "entryService", "$q", "config", "homePage", "CAPABILITIES", "CAPABILITIES_ERROR_CODES", "profileService", "$timeout", "messages", "$log", "$rootScope", "$state", "OauthService", "rx", "$transitions", "errorCodesService"];
    angular.module('ovpApp.components.header.data', ['ovpApp.services.homePage', 'ovpApp.messages', 'ovpApp.services.errorCodes', 'ovpApp.services.profileService', 'ovpApp.oauth', 'rx']).factory('menuData', menuData);

    /* @ngInject */
    function menuData(rxhttp, entryService, $q, config, homePage, CAPABILITIES, CAPABILITIES_ERROR_CODES, profileService, $timeout, messages, $log, $rootScope, $state, OauthService, rx, $transitions, errorCodesService) {
        var service = {
            getMainMenuItems: getMainMenuItems,
            _private: {
                // exposed for unit testing
                authorizeTab: authorizeTab
            }
        };

        var models = {};
        var activeState = '';

        activate();

        return service;

        ////////////////

        function activate() {
            initModels();
            trackActiveState();
        }

        function initModels() {
            models = {
                watchTv: {
                    id: 'livetv',
                    link: 'ovp.livetv',
                    disabledMessage: function disabledMessage() {
                        return errorCodesService.getMessageForCode('WUC-1112');
                    },
                    disabledTitle: function disabledTitle() {
                        return 'Live TV is not available';
                    },
                    requires: CAPABILITIES.LIVE,
                    isSelected: function isSelected() {
                        return activeState.toLowerCase().startsWith('ovp.livetv');
                    }
                },
                guide: {
                    id: 'guide',
                    link: 'ovp.guide',
                    code: -1,
                    disabledMessage: function disabledMessage() {
                        if (this.code && (this.code === CAPABILITIES_ERROR_CODES.STB_NONE || this.code === CAPABILITIES_ERROR_CODES.STB_UNREACHABLE)) {
                            return errorCodesService.getMessageForCode('WCM-1006');
                        } else {
                            return errorCodesService.getMessageForCode('WGE-1002');
                        }
                    },
                    disabledTitle: function disabledTitle() {
                        if (this.code && (this.code === CAPABILITIES_ERROR_CODES.STB_NONE || this.code === CAPABILITIES_ERROR_CODES.STB_UNREACHABLE)) {
                            return 'Guide unavailable';
                        } else {
                            return 'Feature Not Available';
                        }
                    },
                    requires: CAPABILITIES.GUIDE
                },
                vodPortal: {
                    id: 'ondemand',
                    link: 'ovp.ondemand',
                    disabledMessage: function disabledMessage() {
                        return errorCodesService.getMessageForCode('WGE-1002');
                    },
                    disabledTitle: function disabledTitle() {
                        return 'Feature Not Available';
                    },
                    requires: CAPABILITIES.ONDEMAND,
                    isSelected: function isSelected() {
                        return activeState.startsWith('ovp.ondemand') && !activeState.startsWith('ovp.ondemand.rent');
                    }
                },
                dvr: {
                    id: 'dvr',
                    link: 'ovp.dvr',
                    code: -1,
                    disabledMessage: function disabledMessage() {
                        if (this.code && (this.code === CAPABILITIES_ERROR_CODES.RDVR_DISABLED || this.code === CAPABILITIES_ERROR_CODES.RDVR_UNREACHABLE || this.code === CAPABILITIES_ERROR_CODES.RDVR_NONE)) {
                            return errorCodesService.getMessageForCode('WCM-1008');
                        } else {
                            return errorCodesService.getMessageForCode('WCM-1006');
                        }
                    },
                    disabledTitle: function disabledTitle() {
                        if (this.code && (this.code === CAPABILITIES_ERROR_CODES.RDVR_DISABLED || this.code === CAPABILITIES_ERROR_CODES.RDVR_UNREACHABLE || this.code === CAPABILITIES_ERROR_CODES.RDVR_NONE)) {
                            return 'DVR Not Found';
                        } else {
                            return 'Feature Not Available';
                        }
                    },
                    requires: CAPABILITIES.RDVR
                },
                cdvr: {
                    id: 'watchAnytime',
                    link: 'ovp.cdvr',
                    disabledMessage: function disabledMessage() {
                        return errorCodesService.getMessageForCode('WGE-1002');
                    },
                    disabledTitle: function disabledTitle() {
                        return 'Feature Not Available';
                    },
                    requires: CAPABILITIES.CDVR
                },
                watchLater: {
                    id: 'watchLater',
                    link: 'ovp.watchLater',
                    disabledMessage: function disabledMessage() {
                        return errorCodesService.getMessageForCode('WGE-1002');
                    },
                    disabledTitle: function disabledTitle() {
                        return 'Feature Not Available';
                    },
                    requires: CAPABILITIES.ONDEMAND
                },
                vodStore: {
                    id: 'store',
                    link: 'ovp.store',
                    linkParams: {
                        category: null,
                        page: undefined
                    },
                    disabledMessage: function disabledMessage() {
                        return messages.getMessageForCode('MSG-9104');
                    },
                    disabledTitle: function disabledTitle() {
                        return messages.getHeaderForCode('MSG-9104');
                    },
                    requires: CAPABILITIES.TVOD,
                    isSelected: function isSelected() {
                        return activeState.startsWith('ovp.store') || activeState.startsWith('ovp.ondemand.rent');
                    }
                },
                autoComplete: {
                    id: 'search',
                    link: 'search.recent',
                    title: '\xa0',
                    requires: CAPABILITIES.SEARCH,
                    isSelected: function isSelected() {
                        return activeState.startsWith('search');
                    },
                    disabledMessage: function disabledMessage() {
                        return errorCodesService.getMessageForCode('WGE-1002');
                    },
                    disabledTitle: function disabledTitle() {
                        return 'Feature Not Available';
                    }
                },
                settings: {
                    id: 'settings',
                    link: 'ovp.settings'
                }
            };

            // Create default isSelected functions

            var _loop = function (m) {
                if (models.hasOwnProperty(m) && angular.isUndefined(models[m].isSelected)) {
                    models[m].isSelected = function () {
                        return activeState.startsWith(models[m].link);
                    };
                }
            };

            for (var m in models) {
                _loop(m);
            }
        }

        function getMainMenuItems() {
            return OauthService.isAuthenticated().then(function (authenticated) {
                if (authenticated) {
                    return $q.all([homePage(), authorizeTabs()]).then(function (resolved) {
                        var modelArray = [];
                        resolved[0].forEach(function (item) {
                            var model = models[item.application];
                            if (model) {
                                angular.extend(model, item);
                                model.label = model.title;
                                if (item.application === 'autoComplete') {
                                    // We show an icon for search, so we need to override any text,
                                    // lest it look weird
                                    model.title = '\xa0';
                                    // Update label for accessibility
                                    model.label = 'Search';
                                } else if (model.id === 'livetv') {
                                    // STVWEB-1430: for accessible user
                                    model.label = 'Live TV and Mini Guide';
                                }
                                model.index = modelArray.length + 1;
                                modelArray[modelArray.length] = model;
                            } else {
                                $log.warn('Unrecognized menu item: "' + item.title + '". Omitting.');
                            }
                        });
                        return modelArray;
                    }, function () {
                        $log.error('failed to load menu');
                        return $q.reject('failed to load menu');
                    });
                } else {
                    return $q.reject('Not logged in');
                }
            });
        }

        function trackActiveState() {
            rx.Observable.create(function (observer) {
                var dispose = $transitions.onSuccess({}, function (transition) {
                    observer.onNext(transition);
                });

                return dispose;
            }).map(function (transition) {
                return transition.to();
            }).startWith($state.current).filter(onlyHighlightableStates).subscribe(function (toState) {
                return activeState = toState.name;
            });
        }

        // Strips out states which should not update the menu highlight
        function onlyHighlightableStates(toState) {
            return (toState.name.startsWith('ovp') || toState.name.startsWith('search')) && !toState.name.startsWith('ovp.ondemand.playEpisodeWithDetails') && !toState.name.startsWith('ovp.ondemand.playProduct') && !toState.name.startsWith('ovp.ondemand.playCdvr');
        }

        function authorizeTabs() {
            var promises = [];
            for (var m in models) {
                if (models.hasOwnProperty(m)) {
                    promises[promises.length] = authorizeTab(models[m]);
                }
            }
            return $q.all(promises);
        }

        function authorizeTab(model) {
            var capability = model.requires;
            // If the model does not have a require capability then auto enable it.
            if (!capability) {
                model.enabled = true;
                return $q.resolve(true);
            }

            return $q.all([profileService.hasCapability(capability), profileService.isHidden(capability)]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2);

                var isEnabled = _ref2[0];
                var isHidden = _ref2[1];

                model.enabled = isEnabled;
                model.hidden = isHidden;

                if (!isEnabled) {
                    return profileService.getCode(capability).then(function (code) {
                        model.code = code;
                    });
                }
            });
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/header/menu-data.js.map
