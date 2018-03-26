'use strict';

(function () {
    'use strict';

    GuideSubheaderController.$inject = ["$scope", "$log", "GuideService", "$rootScope", "ovpStorage", "storageKeys", "messages", "alert", "$state", "favoritesService", "loadingDefer", "$timeout", "profileService", "$q", "modal", "CONFIRM_BUTTON_TYPE", "errorCodesService"];
    angular.module('ovpApp.guide').controller('GuideSubheaderController', GuideSubheaderController);

    /* @ngInject */
    function GuideSubheaderController($scope, $log, GuideService, $rootScope, ovpStorage, storageKeys, messages, alert, $state, favoritesService, loadingDefer, $timeout, profileService, $q, modal, CONFIRM_BUTTON_TYPE, errorCodesService) {
        var vm = this;

        vm.goToNow = goToNow;
        vm.setPresetFilter = setPresetFilter;
        vm.showDate = false;

        vm.guideTime = null;
        vm.timeIndex = 0;

        var FILTER = {
            QAM: function QAM() {
                return true;
            },
            IP: function IP() {
                return true;
            },
            FAVORITES_QAM: function FAVORITES_QAM(channel) {
                return channel.favorite;
            },
            HD_QAM: function HD_QAM(channel) {
                return channel.hd;
            },
            SUBSCRIBED_IP: function SUBSCRIBED_IP(channel) {
                return channel.subscribed !== false;
            },
            TWCTV_QAM: function TWCTV_QAM(channel) {
                return channel.twcTvEntitled;
            },
            FAVORITES_IP: function FAVORITES_IP(channel) {
                return channel.favorite;
            },
            HD_IP: function HD_IP(channel) {
                return channel.hd;
            },
            RECORDABLE_IP: function RECORDABLE_IP(channel) {
                return channel.cdvrRecordable;
            }
        };

        var TEST = {
            FAVORITES: function FAVORITES() {
                var fave = favoritesService.getFavorites();
                if (!fave || fave.length === 0) {
                    // This will remove the loading spinner from the screen which
                    // gets invoked when we come to the Guide state.
                    if (loadingDefer && loadingDefer.promise.$$state.pending) {
                        loadingDefer.resolve();
                    }
                    var options = {
                        preOkMessage: errorCodesService.getMessageForCode('WFV-1000'),
                        okLabel: CONFIRM_BUTTON_TYPE.OK,
                        cancelLabel: CONFIRM_BUTTON_TYPE.CANCEL,
                        okAction: function okAction() {
                            $state.go('ovp.settings.favorites');
                        },
                        cancelAction: function cancelAction() {
                            setPresetFilter(vm.presets[0]);
                        },
                        showCloseIcon: false,
                        overlayClickClosesPopup: false,
                        ariaLabel: 'Favorites',
                        ariaDescription: messages.getMessageForCode('MSG-9102')
                    };

                    modal.open({
                        showCloseIcon: false,
                        component: 'confirm',
                        ariaDescribedBy: 'descriptionBlockText',
                        ariaLabelledBy: 'labelText',
                        resolve: {
                            options: options
                        }
                    });

                    return false;
                }
                return true;
            }
        };

        var LABEL = {
            ALL: 'All Channels',
            FAVORITES: 'Favorites',
            HD: 'HD',
            ON_PC: 'On PC',
            SUBSCRIBED: 'Subscribed',
            RECORDABLE: 'Recordable'
        };

        var ID = {
            ALL: 'all',
            FAVORITES: 'favorites',
            HD: 'hd',
            ON_PC: 'onpc',
            SUBSCRIBED: 'subscribed',
            RECORDABLE: 'recordable'
        };

        var TITLE = {
            ALL: 'View all your channels',
            FAVORITES: 'View your favorite channels',
            HD: 'View only HD channels',
            ON_PC: 'View only streaming channels',
            SUBSCRIBED: 'View only subscribed channels',
            RECORDABLE: 'View only recordable channels'
        };

        vm.presets = [];

        vm.filters = {
            text: '',
            preset: null
        };

        initFilterMenu();

        vm.onDateToggle = onDateToggle;
        vm.jumpToDay = jumpToDay;

        $scope.$watch(function () {
            return GuideService.times;
        }, function (nv) {
            vm.times = nv;
        });

        $scope.$watch('vm.channelSearch', function (nv) {
            vm.filters.text = '';
            var isValidNv = /^[a-z\d]*$/i.test(nv);
            if (nv && isValidNv) {
                if (isFinite(nv) && !profileService.isSpecU()) {
                    searchChannel(nv);
                } else {
                    vm.filters.text = nv;
                }
            } else if (vm.filters.text && isValidNv) {
                vm.filters.text = nv;
            }
        });

        function searchChannel(nv) {
            //Let us put a timeout before sending guide:channelSearch so that grid is updated
            //before searching the channel number.
            $timeout(function () {
                $rootScope.$broadcast('guide:channelSearch', nv);
            });
        }

        $scope.$watch('vm.filters.text', function (nv, ov) {
            if (nv != ov) {
                $rootScope.$broadcast('guide:updateFilter', vm.filters);
            }
        });

        $rootScope.$on('guide:timeScroll', function (event, hoursPastStart) {
            vm.timeIndex = 2 * Math.floor(hoursPastStart);
            if (vm.times && vm.times[vm.timeIndex]) {
                vm.guideTime = vm.times[vm.timeIndex];
                $scope.$apply();
            }
        });

        function getFilterPreset() {
            var id = ovpStorage.getItem(storageKeys.guideFilter),
                preset = undefined;
            if (id) {
                preset = vm.presets.find(function (preset) {
                    return preset.id === id;
                });
            }
            return preset || vm.presets[0];
        }

        function onDateToggle(val) {
            vm.showDate = val;
        }

        function jumpToDay(time) {
            $rootScope.$broadcast('guide:timejump', time);
        }

        function goToNow() {
            $rootScope.$broadcast('guide:timejump', vm.times[0]);
            $rootScope.$broadcast('guide:updateTodaysDate');
        }

        function setPresetFilter(preset) {
            var evt = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

            if (!preset || preset.test && !preset.test()) {
                return false;
            }
            vm.filters.preset = preset;
            ovpStorage.setItem(storageKeys.guideFilter, preset.id);
            $rootScope.$broadcast('guide:updateFilter', vm.filters);

            // Analytics
            if (evt !== null) {
                $rootScope.$broadcast('Analytics:guide:updateFilter', {
                    filter: preset,
                    triggeredBy: evt === null ? 'application' : 'user'
                });
            }

            //After updating the filter if there was an existing search on,
            //we need to search again
            if (isFinite(vm.channelSearch)) {
                searchChannel(vm.channelSearch);
            }
            return preset;
        }

        /**
         * Initialize the filters menue based on the capabilities.
         */
        function initFilterMenu() {
            profileService.isIpOnlyEnabled().then(function (isIpEnabled) {
                var isSpecU = profileService.isSpecU();

                if (isIpEnabled) {
                    // This is an IP only service. Only entitled IP channels are sent.
                    // Omit the "On PC"
                    addFilter(ID.ALL, TITLE.ALL, LABEL.ALL, FILTER.IP);
                    addFilter(ID.FAVORITES, TITLE.FAVORITES, LABEL.FAVORITES, FILTER.FAVORITES_IP, TEST.FAVORITES);
                } else {
                    addFilter(ID.ALL, TITLE.ALL, LABEL.ALL, FILTER.QAM);
                    addFilter(ID.FAVORITES, TITLE.FAVORITES, LABEL.FAVORITES, FILTER.FAVORITES_QAM, TEST.FAVORITES);
                    if (!isSpecU) {
                        //HD and ON PC filters do not apply for SpecU
                        addFilter(ID.HD, TITLE.HD, LABEL.HD, FILTER.HD_QAM);
                        addFilter(ID.ON_PC, TITLE.ON_PC, LABEL.ON_PC, FILTER.TWCTV_QAM);
                    }
                }

                setPresetFilter(getFilterPreset());
            });
        }

        /**
         * Add the filter to the presets
         * @param id The ID of the filter
         * @param title The filter title
         * @param label The filter label
         * @param filter The filter method
         */
        function addFilter(id, title, label, filter, test) {
            vm.presets.push({
                id: id,
                title: title,
                label: label,
                filter: filter,
                test: test
            });
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/guide/guide-subheader-controller.js.map
