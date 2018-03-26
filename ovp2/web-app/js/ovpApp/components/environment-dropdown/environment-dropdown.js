(() => {
    'use strict';

    function setVisualizerVisibility($uiRouter, visible) {
        const visualizer = $uiRouter.getPlugin('visualizer');
        if (!visualizer) {
            // Visualizer doesn't exist in production builds, so this is expected
            return;
        }
        const method = visible ? 'addClass' : 'removeClass';
        angular.element(visualizer.stateVisualizerEl)[method]('show');
        angular.element(visualizer.transitionVisualizerEl)[method]('show');
    }

    angular.module('ovpApp.components.environmentDropdown', [
        'ovpApp.directives.dropdownList',
        'ovpApp.version',
        'ovpApp.services.nns',
        'ui.router',
        'ovpApp.config',
        'ovpApp.services.ovpStorage',
        'ovpApp.legacy.httpUtil'
        ])
        .constant('FEATURE_FLAGS', [
            {
                label: 'SpecU',
                config: {
                    specU: {
                        enabled: true //Spec U auto access enabled
                    }
                }
            },
            {
                label: 'Bulk MDU',
                config: {
                    bulkMDU: {
                        enabled: true
                    }
                }
            },
            {
                label: 'Bulk MDU (SpecU NNS config)',
                config: {
                    bulkMDU: {
                        enabled: true
                    },
                    nns: {
                        'bulkMDUConfig': 'ovp_specu_v1'
                    }
                }
            },
            {
                label: 'Enable AdBlocker Check',
                config: {
                    adBlockerDetection: { // Check to see if user has an ad blocker installed
                        enabled: true
                    }
                }
            },
            {
                label: 'Masquerade Integration',
                config: {
                    masqueradeEnabled: true
                }
            },
            {
                label: 'Stream Plus',
                config: {
                    streamPlus: {
                        enabled: true,
                        buyFlowEnabled: true
                    }
                }
            },
            {
                label: 'SSO from Spectrum.net',
                config: {
                    ssoEnabled: true
                }
            },
            {
                label: 'STB Settings',
                config: {
                    stbSettingsEnabled: true
                }
            }
        ])
        .constant('FIGARO_CONFIGS', [
            {
                label: 'SpecU',
                config: {
                    feature: 'SpecU',
                    environment: 'figaro-prod',
                    oauth: {
                        'username': '2dvrtest',
                        'password': 'password1',
                        'uniqueId': '328947294723947238472834723',
                        'action': '',
                        'role': 'hoh',
                        'ipaddress': '',
                        'accountType': 'specu',
                        'streamPlusEligible': false,
                        'streamPlusDenied': false
                    },
                    capabilities: {
                        'enableoverride': true,
                        'watchlive': true,
                        'watchondemand': true,
                        'viewguide': true,
                        'dvroperations': true,
                        'tvod': true,
                        'cdvr': true,
                        'accessibility': true,
                        'sppmembership': true,
                        'iptvpackage': false,
                        'parentalcontrols': false,
                        'search': true,
                        'outofhome': false
                    }
                }
            },
            {
                label: 'Bulk MDU',
                config: {
                    feature: 'Bulk MDU',
                    environment: 'figaro-prod',
                    oauth: {
                        'username': '2dvrtest',
                        'password': 'password1',
                        'uniqueId': '328947294723947238472834723',
                        'action': '',
                        'role': 'hoh',
                        'ipaddress': '',
                        'accountType': 'bulk',
                        'streamPlusEligible': false,
                        'streamPlusDenied': false
                    },
                    //TODO: check whether these are the right capabiliites. I just copy/pasted from specU
                    capabilities: {
                        'enableoverride': true,
                        'watchlive': true,
                        'watchondemand': true,
                        'viewguide': true,
                        'dvroperations': false,
                        'tvod': false,
                        'cdvr': false,
                        'accessibility': false,
                        'sppmembership': true,
                        'iptvpackage': false,
                        'parentalcontrols': false,
                        'search': true,
                        'outofhome': false
                    }
                }
            },
            {
                label: 'Bulk MDU (SpecU NNS config)',
                config: {
                    feature: 'Bulk MDU (SpecU NNS config)',
                    environment: 'figaro-prod',
                    oauth: {
                        'username': 'mystro_smn',
                        'password': 'Th@nky0u',
                        'uniqueId': '328947294723947238472834723',
                        'action': '',
                        'role': 'hoh',
                        'ipaddress': '',
                        'accountType': 'bulk',
                        'streamPlusEligible': false,
                        'streamPlusDenied': false
                    },
                    //TODO: check whether these are the right capabiliites. I just copy/pasted from specU
                    capabilities: {
                        'enableoverride': true,
                        'watchlive': true,
                        'watchondemand': true,
                        'viewguide': true,
                        'dvroperations': false,
                        'tvod': false,
                        'cdvr': false,
                        'accessibility': false,
                        'sppmembership': true,
                        'iptvpackage': false,
                        'parentalcontrols': false,
                        'search': true,
                        'outofhome': false
                    }
                }
            },
            {
                label: 'Stream Plus',
                config: {
                    feature: 'Stream Plus',
                    environment: 'figaro-prod',
                    oauth: {
                        'username': 'citruscounty1',
                        'password': 'password1',
                        'uniqueId': '328947294723947238472834723',
                        'action': '',
                        'role': 'hoh',
                        'ipaddress': '',
                        'accountType': '',
                        'streamPlusEligible': true,
                        'streamPlusDenied': false
                    },
                    capabilities: {
                        'enableoverride': true,
                        'watchlive': false,
                        'watchondemand': false,
                        'viewguide': false,
                        'dvroperations': false,
                        'tvod': false,
                        'cdvr': false,
                        'accessibility': false,
                        'sppmembership': false,
                        'iptvpackage': false,
                        'parentalcontrols': false,
                        'search': false,
                        'outofhome': false
                    }
                }
            }
        ])
        .run(function ($uiRouter, ovpStorage, storageKeys) {
            //Setup the visualizer, so that it can be on screen before the dropdown is even launched
            const visible = ovpStorage.getItem(storageKeys.visualizerEnabled);
            setVisualizerVisibility($uiRouter, visible);
        })
        .component('environmentDropdown', {
            bindings: {
                modalInstance: '<'
            },
            templateUrl: '/js/ovpApp/components/environment-dropdown/environment-dropdown.html',
            controller: class EnvironmentDropdown {
                constructor(version, $state, NNSService, $uiRouter, $window, config,
                    FEATURE_FLAGS, FIGARO_CONFIGS, ovpStorage, storageKeys, httpUtil, $http) {
                    angular.extend(this, {version, $state, NNSService, $uiRouter, $window, config,
                        FEATURE_FLAGS, FIGARO_CONFIGS, ovpStorage, storageKeys, httpUtil, $http});
                }
                $onInit() {
                    this.configValue = this.ovpStorage.getItem(this.storageKeys.configOverride) || {};
                    this.configValueString = JSON.stringify(this.configValue, null, 2);
                    this.httpOverrideValue = this.ovpStorage.getItem(this.storageKeys.httpOverride) ||
                        [{url: '', response: {status: 200, statusText: '', data: ''}}];
                    this.bulkMDUOverrideEnabled = this.ovpStorage.getItem(this.storageKeys.bulkMDUOverrideEnabled) ||
                        false;
                    this.httpOverrideValueString = JSON.stringify(this.httpOverrideValue, null, 2);
                    this.figaroConfigValue = this.ovpStorage.getItem(this.storageKeys.figaroOverride) || {};
                    this.figaroConfigValueString = JSON.stringify(this.figaroConfigValue, null, 2);
                    this.features = this.FEATURE_FLAGS;
                    this.figaroConfigs = this.FIGARO_CONFIGS;
                    this.environments = this.config.environmentMap;
                    this.currentEnvironmentKey = this.config.environmentKey;
                    this.visualizerEnabled = this.ovpStorage.getItem(this.storageKeys.visualizerEnabled);
                    this.updateVisualizer();
                    this.tdcsLink = `http://54.203.63.82:9090/#/ip/client/${this.config.deviceId.toUpperCase()}`;
                    this.buildInfo = `/${this.config.version}/build-stats.html`;

                    // Update NNS version
                    if (this.$state.current.name.startsWith('login')) {
                        this.nnsVersion = '(login to find out!)';
                    } else {
                        this.NNSService.getVersion().then(nnsVersion => {
                            this.nnsVersion = nnsVersion;
                        });
                    }
                }

                applyFeature() {
                    if (this.selectedFeature) {
                        this.configValue = angular.extend(this.configValue, this.selectedFeature.config);
                        this.configValueString = JSON.stringify(this.configValue, null, 2);
                        this.selectedFeature = null;
                    }
                }

                searchConfig() {
                    let keys = Object.keys(this.config)
                        .filter(ele => ele.match(new RegExp(this.configSearchText, 'gi')));
                    if (keys.length > 0) {
                        let val = {};
                        keys.forEach(key => val[key] = this.config[key]);
                        this.configValueString = JSON.stringify(val, null, 2);
                    }
                }

                updateEnvironment() {
                    // Clear Oauth
                    this.httpUtil.cleanUp();
                    // Change environment
                    this.config.storeEnvironmentKey(this.currentEnvironmentKey);
                    this.$window.location.reload();
                }

                // Private method
                updateEnvironmentAndFeature() {
                    // Update environment
                    this.currentEnvironmentKey = this.figaroConfigValue.environment;
                    // Update feature
                    this.configValue = {};
                    this.selectedFeature =
                        this.features.find(feature => feature.label === this.figaroConfigValue.feature);
                    this.applyFeature();
                }

                applyFigaroConfig() {
                    if (this.selectedFigaroConfig) {
                        this.figaroConfigValue =
                            angular.extend(this.figaroConfigValue, this.selectedFigaroConfig.config);
                        // Attach deviceid
                        this.figaroConfigValue.oauth.deviceId = this.$window.localStorage.device_id.replace(/\"/g, '');
                        this.figaroConfigValueString = JSON.stringify(this.figaroConfigValue, null, 2);
                        this.selectedFigaroConfig = null;
                        // Update Env & Feature
                        this.updateEnvironmentAndFeature();
                    }
                }

                updateHttpOverride() {
                    try {
                        let tmpStr = this.httpOverrideValueString
                            .replace(/\s+/g, ' ').replace(/[“”]/g, '"');
                        this.httpOverrideValue = JSON.parse(tmpStr);
                        this.httpOverrideValueString = JSON.stringify(this.httpOverrideValue, null, 2);
                        this.httpOverrideError = null;
                    } catch (e) {
                        this.httpOverrideError = e.message;
                    }
                }

                resetHttpOverride() {
                    this.httpOverrideError = null;
                    this.httpOverrideValue = [{url: '', response: {status: 200, statusText: '', data: ''}}];
                    this.httpOverrideValueString = JSON.stringify(this.httpOverrideValue, null, 2);
                    this.applyHttpOverride();
                }

                applyHttpOverride() {
                    this.ovpStorage.setItem(this.storageKeys.httpOverride, this.httpOverrideValue);
                }

                updateBulkMDUOverride() {
                    this.ovpStorage.setItem(this.storageKeys.bulkMDUOverrideEnabled, this.bulkMDUOverrideEnabled);
                    // Clear Oauth
                    this.httpUtil.cleanUp();
                    this.$window.localStorage.removeItem('autoAuthSignOutTime');
                }

                updateFigaroConfig() {
                    try {
                        this.figaroConfigValue = JSON.parse(this.figaroConfigValueString);
                        this.figaroConfigError = null;
                        // Update Env & Feature
                        this.updateEnvironmentAndFeature();
                    } catch (e) {
                        this.figaroConfigError = e.message;
                    }
                }

                registerDeviceWithFigaroAndRestart() {
                    // Clear Oauth
                    this.httpUtil.cleanUp();
                    this.$window.localStorage.removeItem('autoAuthSignOutTime');
                    // Feature config
                    this.ovpStorage.removeItem(this.storageKeys.configOverride);
                    this.ovpStorage.setItem(this.storageKeys.configOverride, this.configValue);
                    // Environment
                    this.config.storeEnvironmentKey(this.currentEnvironmentKey);
                    // Store figaro config
                    this.ovpStorage.setItem(this.storageKeys.figaroOverride, this.figaroConfigValue);

                    this.$http({
                        method: 'PUT',
                        url: 'https://stva.figaro.spectrumtoolbox.com/auth/oauth/auto/authorize/authorization',
                        data: this.figaroConfigValue.oauth,
                        bypassRefresh: true
                    }).then(() => {
                        return this.$http({
                            method: 'PUT',
                            url: 'https://stva.figaro.spectrumtoolbox.com/ipvs/capabilities/device/' +
                                this.$window.localStorage.device_id.replace(/\"/g, ''),
                            'data': this.figaroConfigValue.capabilities,
                            bypassRefresh: true
                        }).then(() => {
                            this.clearAuthAndReload();
                        });
                    }).catch(err => {
                        this.$window.alert(err);
                    });
                }

                clearStorageAndReload() {
                    this.$window.localStorage.clear();
                    this.$window.sessionStorage.clear();
                    this.$window.location.reload();
                }

                clearAuthAndReload() {
                    this.httpUtil.cleanUp();
                    this.$window.localStorage.removeItem('autoAuthSignOutTime');
                    this.$window.location.reload();
                }

                clearConfigValues() {
                    this.ovpStorage.removeItem(this.storageKeys.configOverride);
                    this.configValue = null;
                    this.configValueString = '';
                    this.$window.location.reload();
                }

                updateConfig() {
                    try {
                        this.configValue = JSON.parse(this.configValueString);
                        this.configError = null;
                    } catch (e) {
                        this.configError = e.message;
                    }
                }

                updateConfigValue() {
                    if (this.configValue) {
                        this.ovpStorage.setItem(this.storageKeys.configOverride, this.configValue);
                        this.$window.location.reload();
                    }
                }

                updateVisualizer() {
                    this.ovpStorage.setItem(this.storageKeys.visualizerEnabled, this.visualizerEnabled);
                    setVisualizerVisibility(this.$uiRouter, this.visualizerEnabled);
                }
            }
        })
        .config(function ($httpProvider) {
            $httpProvider.interceptors.unshift(['$q', '$window', function ($q, $window) {
                return {
                    request: function (request) {
                        let responseArray = JSON.parse($window.sessionStorage.getItem('httpOverride') || '{}');
                        for (let i = 0; i < responseArray.length; i = i + 1) {
                            if (responseArray[i].url &&
                                request.url.indexOf(responseArray[i].url) > -1) {
                                return $q.reject(angular.extend({
                                    headers: (arg) => {
                                        return (arg === 'x-trace-id') ? 'fake-x-trace-id-ignore-it' : '';
                                    }
                                }, responseArray[i].response));
                            }
                        }
                        return request;
                    }
                };
            }]);
            $httpProvider.interceptors.push(['$q', '$window', function ($q, $window) {
                let ovpStorage = $window.sessionStorage;
                return {
                    response: function (response) {
                        let bulkMDUOverrideEnabled = JSON.parse(ovpStorage.getItem('bulkMDUOverrideEnabled') || false);
                        if (bulkMDUOverrideEnabled) {
                            let url = response.config.url;
                            if (url.indexOf('/auto/authorize') >= 0 &&
                                response.data.xoauth_account_type === 'SPECU') {
                                response.data = angular.extend(response.data, {
                                    'xoauth_account_type': 'BULK',
                                    'xoauth_classification': 'MDU_BULK_MASTER'
                                });
                            }
                        }
                        return response;
                    }
                };
            }]);
        });
})();
