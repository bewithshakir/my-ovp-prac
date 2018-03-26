(function () {
    'use strict';

    angular
        .module('ovpApp.components.header.data', [
            'ovpApp.services.homePage',
            'ovpApp.messages',
            'ovpApp.services.errorCodes',
            'ovpApp.services.profileService',
            'ovpApp.oauth',
            'rx'
        ])
        .factory('menuData', menuData);

    /* @ngInject */
    function menuData(rxhttp, entryService, $q, config, homePage, CAPABILITIES, CAPABILITIES_ERROR_CODES,
        profileService, $timeout, messages, $log, $rootScope, $state, OauthService, rx, $transitions,
        errorCodesService) {
        let service = {
            getMainMenuItems,
            _private: {
                // exposed for unit testing
                authorizeTab
            }
        };

        let models = {};
        let activeState = '';

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
                    disabledMessage: function () {
                        return errorCodesService.getMessageForCode('WUC-1112');
                    },
                    disabledTitle: function () {
                        return 'Live TV is not available';
                    },
                    requires: CAPABILITIES.LIVE,
                    isSelected: () => activeState.toLowerCase().startsWith('ovp.livetv')
                },
                guide: {
                    id: 'guide',
                    link: 'ovp.guide',
                    code: -1,
                    disabledMessage: function () {
                        if (this.code &&
                            (this.code === CAPABILITIES_ERROR_CODES.STB_NONE ||
                                this.code === CAPABILITIES_ERROR_CODES.STB_UNREACHABLE)) {
                            return errorCodesService.getMessageForCode('WCM-1006');
                        } else {
                            return errorCodesService.getMessageForCode('WGE-1002');
                        }
                    },
                    disabledTitle: function () {
                        if (this.code &&
                            (this.code === CAPABILITIES_ERROR_CODES.STB_NONE ||
                                this.code === CAPABILITIES_ERROR_CODES.STB_UNREACHABLE)) {
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
                    disabledMessage: function () {
                        return errorCodesService.getMessageForCode('WGE-1002');
                    },
                    disabledTitle: function () {
                        return 'Feature Not Available';
                    },
                    requires: CAPABILITIES.ONDEMAND,
                    isSelected: () => activeState.startsWith('ovp.ondemand') &&
                        !activeState.startsWith('ovp.ondemand.rent')
                },
                dvr: {
                    id: 'dvr',
                    link: 'ovp.dvr',
                    code: -1,
                    disabledMessage: function () {
                        if (this.code && (this.code === CAPABILITIES_ERROR_CODES.RDVR_DISABLED ||
                            this.code === CAPABILITIES_ERROR_CODES.RDVR_UNREACHABLE ||
                            this.code === CAPABILITIES_ERROR_CODES.RDVR_NONE)) {
                            return errorCodesService.getMessageForCode('WCM-1008');
                        } else {
                            return errorCodesService.getMessageForCode('WCM-1006');
                        }
                    },
                    disabledTitle: function () {
                        if (this.code && (this.code === CAPABILITIES_ERROR_CODES.RDVR_DISABLED ||
                            this.code === CAPABILITIES_ERROR_CODES.RDVR_UNREACHABLE ||
                            this.code === CAPABILITIES_ERROR_CODES.RDVR_NONE)) {
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
                    disabledMessage: function () {
                        return errorCodesService.getMessageForCode('WGE-1002');
                    },
                    disabledTitle:  function () {
                        return 'Feature Not Available';
                    },
                    requires: CAPABILITIES.CDVR
                },
                watchLater: {
                    id: 'watchLater',
                    link: 'ovp.watchLater',
                    disabledMessage: function () {
                        return errorCodesService.getMessageForCode('WGE-1002');
                    },
                    disabledTitle:  function () {
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
                    disabledMessage: function () {
                        return messages.getMessageForCode('MSG-9104');
                    },
                    disabledTitle: function () {
                        return messages.getHeaderForCode('MSG-9104');
                    },
                    requires: CAPABILITIES.TVOD,
                    isSelected: () => activeState.startsWith('ovp.store') ||
                        activeState.startsWith('ovp.ondemand.rent')
                },
                autoComplete: {
                    id: 'search',
                    link: 'search.recent',
                    title: '\xa0',
                    requires: CAPABILITIES.SEARCH,
                    isSelected: () => activeState.startsWith('search'),
                    disabledMessage: function () {
                        return errorCodesService.getMessageForCode('WGE-1002');
                    },
                    disabledTitle: function () {
                        return 'Feature Not Available';
                    }
                },
                settings: {
                    id: 'settings',
                    link: 'ovp.settings'
                }
            };

            // Create default isSelected functions
            for (let m in models) {
                if (models.hasOwnProperty(m) && angular.isUndefined(models[m].isSelected)) {
                    models[m].isSelected = () => activeState.startsWith(models[m].link);
                }
            }
        }


        function getMainMenuItems() {
            return OauthService.isAuthenticated().then(authenticated => {
                if (authenticated) {
                    return $q.all([homePage(), authorizeTabs()])
                        .then(resolved => {
                            let modelArray = [];
                            resolved[0].forEach(item => {
                                let model = models[item.application];
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
                                    $log.warn(`Unrecognized menu item: "${item.title}". Omitting.`);
                                }
                            });
                            return modelArray;
                        }, () => {
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
                    const dispose = $transitions.onSuccess({}, function (transition) {
                        observer.onNext(transition);
                    });

                    return dispose;
                })
                .map(transition => transition.to())
                .startWith($state.current)
                .filter(onlyHighlightableStates)
                .subscribe(toState => activeState = toState.name);
        }

        // Strips out states which should not update the menu highlight
        function onlyHighlightableStates(toState) {
            return (toState.name.startsWith('ovp') || toState.name.startsWith('search')) &&
                !toState.name.startsWith('ovp.ondemand.playEpisodeWithDetails') &&
                !toState.name.startsWith('ovp.ondemand.playProduct') &&
                !toState.name.startsWith('ovp.ondemand.playCdvr');
        }

        function authorizeTabs() {
            let promises = [];
            for (let m in models) {
                if (models.hasOwnProperty(m)) {
                    promises[promises.length] = authorizeTab(models[m]);
                }
            }
            return $q.all(promises);
        }

        function authorizeTab(model) {
            let capability = model.requires;
            // If the model does not have a require capability then auto enable it.
            if (!capability) {
                model.enabled = true;
                return $q.resolve(true);
            }

            return $q.all([profileService.hasCapability(capability),
                profileService.isHidden(capability)]).then(function ([isEnabled, isHidden]) {
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
}());
