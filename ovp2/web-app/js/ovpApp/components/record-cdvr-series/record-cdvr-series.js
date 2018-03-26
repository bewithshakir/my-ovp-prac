(function () {
    'use strict';

    angular.module('ovpApp.components.recordCdvrSeries', [
        'ovpApp.components.ovp.channel',
        'ovpApp.messages',
        'ovpApp.components.alert',
        'ovpApp.components.ovp.button',
        'ovpApp.components.ovp.selectBox',
        'ovpApp.components.ovp.clickConfirm',
        'ovpApp.services.dateFormat',
        'ovpApp.directives.dropdownList',
        'ovpApp.services.cdvr',
        'ajoslin.promise-tracker'
    ])

    .component('recordCdvrSeries', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/components/record-cdvr-series/record-cdvr-series.html',
        controller: class RecordCdvrSeries {
            constructor (promiseTracker, $rootScope, cdvrService, ChannelService, $q,
                $element, $timeout, $log, errorCodesService) {
                angular.extend(this, {promiseTracker, $rootScope, cdvrService, ChannelService,
                    $q, $element, $timeout, $log, errorCodesService});
            }

            $onInit() {
                this.asset = this.resolve.asset;
                this.action = this.resolve.action;
                this.preferredTmsGuideId = this.resolve.preferredTmsGuideId;
                this.settings = {
                    recordOnlyNew: true,
                    tmsGuideId: this.preferredTmsGuideId
                };

                this.loadingTracker = this.promiseTracker();

                this.channels = [];
                this.getChannels()
                    .then(channels => {
                        this.channels.splice(0, this.channels.length, ...channels);

                        this.initForm();

                        this.setSelectedChannel();
                    });

                // Options use same property names as settings to help link the form
                // entry fields of the dialog to the settings we save.
                this.options = {
                    recordOnlyNew: [
                        {label: 'All Episodes', value: false},
                        {label: 'New Episodes', value: true}
                    ],
                    tmsGuideId: this.channels
                };
            }

            $postLink() {
                this.$timeout(() => {
                    this.$element.find('ovp-dropdown-list button:visible')[0].focus();
                }, 0, false);
            }

            onSelect(key) {
                return (item) => {
                    this.form[key] = this.options[key].findIndex((opt) => opt.value === item.value);
                    angular.forEach(this.form, (val, key) => {
                        this.settings[key] = this.options[key][val].value;
                    });

                    if (key === 'tmsGuideId') {
                        this.setSelectedChannel();
                    }
                };
            }

            confirm() {

                // Analytics
                this.$rootScope.$emit('Analytics:select', {
                    context: 'cdvr',
                    featureType: 'cdvrRequestToRecord',
                    featureCurrentStep: 3,
                    featureNumberOfSteps: 100,
                    elementStandardizedName: 'confirm',
                    operationType: 'buttonClick',
                    modalName: 'cdvrConfirmRecord',
                    modalType: 'options',
                    asset: this.asset,
                    cdvrSettings: this.settings
                });

                const promise = this.cdvrService.scheduleSeriesRecording(this.action, this.settings)
                    .then(() => {
                        this.$rootScope.$broadcast('update-dvr',
                            {} /* no schedule options at this point */,
                            this.asset, this.action);
                        this.$rootScope.$broadcast('message:growl',
                            'Recording for ' + this.asset.title + ' successfully set');
                        this.modalInstance.close('success');

                        // Analytics
                        this.$rootScope.$emit('Analytics:cdvr-schedule-series-recording',
                            this.asset,
                            this.action,
                            {
                                recordOnlyNew: this.settings.recordOnlyNew,
                                tmsGuideId: this.settings.tmsGuideId
                            }
                        );

                    }, (error) => {
                        this.$log.error(error);
                        this.modalInstance.dismiss('error');
                        // UNISTR - CDVR_ERROR_RECORDING_FAIL
                        this.$rootScope.$broadcast('message:growl',
                            'We’re sorry, we were unable to schedule your recording. Please try again later.');

                        // Analytics
                        this.$rootScope.$emit('Analytics:cdvr-record-failed',
                            this.asset,
                            this.action,
                            {
                                recordOnlyNew: this.settings.recordOnlyNew,
                                tmsGuideId: this.settings.tmsGuideId
                            },
                            {
                                error: error,
                                errorCode: 'WCD-1400',
                                errorMessage: this.errorCodesService.getMessageForCode('WCD-1400', {
                                    TITLE: this.asset.title
                                })
                            }
                        );
                    });

                this.loadingTracker.addPromise(promise);
            }

            cancel() {

                // Analytics
                this.$rootScope.$emit('Analytics:select', {
                    context: 'cdvr',
                    featureType: 'cdvrRequestToRecord',
                    featureCurrentStep: 3,
                    featureNumberOfSteps: 4,
                    modalName: 'cdvrConfirmRecord',
                    modalType: 'options',
                    elementStandardizedName: 'cancel',
                    operationType: 'buttonClick',
                    asset: this.asset,
                    cdvrSettings: this.settings
                });

                this.modalInstance.dismiss('cancelled');
            }

            getChannels() {
                let promises = this.asset.cdvrChannelPickerTmsGuideIds
                    .map((guideId) => {
                        return this.ChannelService.getChannelByTmsId(guideId)
                            .then((chanInfo) => {
                                if (chanInfo && chanInfo.channels) {
                                    // Create drop up list item for channel
                                    let channel = {
                                        callSign: chanInfo.callsign,
                                        // Default to first channel number in array
                                        chanNum: chanInfo.channels.includes(this.asset.displayChannel) ?
                                            this.asset.displayChannel : chanInfo.channels[0],
                                        value: chanInfo.tmsGuideId
                                    };
                                    channel.label = chanInfo.callsign + ' | ' + channel.chanNum;
                                    return channel;
                                }
                            });
                    });

                const byCallsign = (a, b) => {
                    const callSignA = a.callSign.toUpperCase();
                    const callSignB = b.callSign.toUpperCase();

                    if (callSignA < callSignB) {
                        return -1;
                    }

                    if (callSignA > callSignB) {
                        return 1;
                    }
                    return 0;
                };

                return this.$q.all(promises)
                    .then(channels => {
                        return channels.filter(channel => !!channel)
                            .sort(byCallsign);
                    });
            }

            initForm() {
                this.form = {};
                angular.forEach(this.settings, (val, key)=> {
                    if (this.options[key]) {
                        this.form[key] = this.options[key].findIndex(opt => opt.value == val);
                    }
                });
            }

            setSelectedChannel() {
                this.displayChannel = this.channels[this.form.tmsGuideId].chanNum;
                this.tmsGuideId = this.channels[this.form.tmsGuideId].value;
            }
        }
    });
}());
