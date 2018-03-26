(function () {
    'use strict';
    angular.module('ovpApp.product.otherWays', [
        'ovpApp.services.profileService',
        'ovpApp.product.productActionService',
        'ovpApp.product.button',
        'ovpApp.services.dateFormat',
        'ovpApp.dataDelegate',
        'ovpApp.directives.focus'])
    .constant('languageLabelMap', {
        'en': '',
        'sp': 'ESP',
        'es': 'ESP'
    })
    .component('otherWaysPopup', {
        bindings: {
            resolve: '<'
        },
        template: `
        <p id="ariaLabelledByText" class="sr-only">Other ways to watch {{$ctrl.resolve.asset.title}}, </p>
        <other-ways asset="$ctrl.resolve.asset" in-popup="true"/>`
    })
    .component('otherWays', {
        bindings: {
            asset: '<',
            inPopup: '<'
        },
        templateUrl: '/js/ovpApp/product/other-ways/other-ways.html',
        controller: class OtherWays {
            constructor(actionTypeMap, languageLabelMap, $filter,
                $rootScope, dateFormat, delegateUtils, profileService) {
                angular.extend(this, {actionTypeMap, languageLabelMap, $filter,
                    $rootScope, dateFormat, delegateUtils, profileService});
            }

            $onInit() {
                this.profileService.isCdvrEnabled().then(isEnabled => {
                    this.isCdvrEnabled = isEnabled;
                });
            }

            $onChanges(changes) {
                if (changes.asset) {
                    this.onAssetChanged();
                }
            }

            onAssetChanged() {
                this.activeTab = 'watchHere';

                if (this.asset && (!this.asset.watchHereActions || this.asset.watchHereActions.length === 0)) {
                    this.activeTab = 'watchOnTv';
                }

                const isOoh = !!(this.$rootScope.location && this.$rootScope.location.behindOwnModem === false);

                //Create a new item that contains some calculated data as well as all the
                //same existing fields as the 'item'
                const itemMapper = item => {
                    let out = {
                        label: this.getLabel(item.actionType),
                        timeAvailability: this.getTimeAvailability(item),
                        lang: this.getLanguageLabel(item),
                        network: this.getNetwork(item),
                        statusIcon: this.getStatusIcon(item),
                        ooh: isOoh,
                        streamProps: this.getStreamProperties(item),
                        chNumber: this.getChannelNumber(item),
                        callSign: this.getCallSign(item),
                        cdvrNotCompleted: this.cdvrNotCompleted(item),
                        isSeriesRecording: this.asset ? this.asset.isSeriesRecording : null
                    };
                    return Object.assign(out, item);
                };

                this.watchOnTvActions = this.asset ? this.asset.watchOnTvActions.map(itemMapper) : [];
                this.watchHereActions = this.asset ? this.asset.watchHereActions.map(itemMapper) : [];
            }

            setActiveTab(tab) {
                if (tab === 'watchHere' && this.watchHereActions && this.watchHereActions.length > 0) {
                    this.activeTab = tab;
                } else if (tab === 'watchOnTv' && this.watchOnTvActions && this.watchOnTvActions.length > 0) {
                    this.activeTab = tab;
                }
            }

            getLabel(actionType) {
                return this.actionTypeMap[actionType].otherWaysWatchOnTVLabel;
            }

            getTimeAvailability(item) {
                if (['futureAiring', 'scheduleRecording', 'watchLiveOnTv', 'watchLiveIP', 'cdvrScheduleRecording',
                     'cdvrCancelRecording', 'cdvrDeleteRecording', 'cdvrResumeRecording', 'cdvrPlayRecording']
                    .indexOf(this.actionTypeMap[item.actionType].id) > -1) {
                    let stream = this.asset.streamList[item.streamIndex];
                    let startDate = new Date(parseInt(stream.streamProperties.startTime));

                    return this.dateFormat.relative.expanded.atTime(startDate);
                } else if (['watchOnDemandOnTv', 'resumeOnDemandOnTv', 'watchOnDemandIP', 'resumeOnDemandIP']
                    .indexOf(this.actionTypeMap[item.actionType].id) > -1) {
                    let stream = this.asset.streamList[item.streamIndex];
                    let endTime = stream.streamProperties.tvodEntitlement ?
                        stream.streamProperties.tvodEntitlement.rentalEndTimeUtcSeconds * 1000 :
                        stream.streamProperties.endTime;
                    let endDate = new Date(parseInt(endTime));
                    return 'Available until ' + this.dateFormat.relative.short.atTime(endDate);
                }
                return '';
            }

            getNetwork(item) {
                let stream = this.asset.streamList[item.streamIndex];
                let callsign = '';
                let channel = '';
                if (stream.network && stream.network.callsign) {
                    callsign = stream.network.callsign;
                }
                if (stream.streamProperties.allChannelNumbers) {
                    channel = stream.streamProperties.allChannelNumbers[0];
                }
                return callsign + ((callsign && channel) ? ' | ' : '') + channel;
            }

            getChannelNumber(item) {
                let stream = this.asset.streamList[item.streamIndex];
                let channel = '';
                if (stream.streamProperties.allChannelNumbers) {
                    channel = stream.streamProperties.allChannelNumbers[0];
                }
                return channel;
            }

            getCallSign(item) {
                let stream = this.asset.streamList[item.streamIndex];
                let callsign = '';
                if (stream.network && stream.network.callsign) {
                    callsign = stream.network.callsign;
                }
                return callsign;
            }

            getLanguageLabel(item) {
                let language = this.asset.streamList[item.streamIndex].streamProperties.primaryAudioLanguage;
                return this.languageLabelMap[language];
            }

            getStatusIcon(item) {
                let stream = this.asset.streamList[item.streamIndex];

                if (!stream.isEntitled) {
                    return 'unentitled';
                } else {
                    return false;
                }
            }

            getStreamProperties(item) {
                let stream = this.asset.streamList[item.streamIndex];
                let properties = this.delegateUtils.getStreamProps(stream);
                properties.rating = stream.streamProperties.rating || '';
                return properties;
            }

            cdvrNotCompleted(item) {
                let stream = this.asset.streamList[item.streamIndex];
                return stream.cdvrNotCompleted;
            }

        }
    });
})();
