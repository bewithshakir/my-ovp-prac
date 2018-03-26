describe('ovpApp.playerControls.miniGuideData', function () {

    let miniGuideData, allChannelsFilter, channelNumberSort, azSort;

    beforeEach(module('ovpApp.playerControls.miniGuideData'));

    beforeEach(module(function($provide) {
        $provide.value('playerStorageKeys', {});
        $provide.value('PlayerMigrationService', {});
    }));

    beforeEach(inject(function (_miniGuideData_, ALL_CHANNELS_FILTER, CHANNEL_NUMBER_SORT, AZ_SORT) {
        miniGuideData = _miniGuideData_;
        allChannelsFilter = ALL_CHANNELS_FILTER;
        channelNumberSort = CHANNEL_NUMBER_SORT;
        azSort = AZ_SORT;
    }));

    describe('sortAndfilter', function () {
        it('should sort by channel number', function () {
            let mockChannels = [{
                localChannelNumber: 5,
                localChannelNumbers: [5]
            }, {
                localChannelNumber: 2,
                localChannelNumbers: [2]
            }];

            let mockThis = {};

            let sorted = miniGuideData._private.sortAndFilter({
                channels: mockChannels, 
                selectedFilter: allChannelsFilter, 
                selectedSort: channelNumberSort
            });
            expect(sorted[0]).toEqual(mockChannels[1]);
            expect(sorted[1]).toEqual(mockChannels[0]);
        });

        it('should duplicate when sorting by channel number', function () {
            let mockChannels = [{
                localChannelNumber: 5,
                localChannelNumbers: [5, 1],
                somethingToIdentityWith: 'a',
            }, {
                localChannelNumber: 2,
                localChannelNumbers: [2],
                somethingToIdentityWith: 'b',
            }];

            let sorted = miniGuideData._private.sortAndFilter({
                channels: mockChannels, 
                selectedFilter: allChannelsFilter, 
                selectedSort: channelNumberSort
            });
            expect(sorted.length).toEqual(3);
            expect(sorted[0]).not.toEqual(mockChannels[0]);
            expect(sorted[0].localChannelNumber).toEqual(1);
            expect(sorted[0].localChannelNumbers).toEqual([5, 1]);
            expect(sorted[0].somethingToIdentityWith).toEqual('a');
            expect(sorted[1]).toEqual(mockChannels[1]);
            expect(sorted[2]).toEqual(mockChannels[0]);
        });

        it('should sort by network', function () {
            let mockChannels = [{
                localChannelNumber: 1,
                localChannelNumbers: [1],
                networkName: 'beta'
            }, {
                localChannelNumber: 2,
                localChannelNumbers: [2],
                networkName: 'alpha'
            }];

            let sorted = miniGuideData._private.sortAndFilter({
                channels: mockChannels, 
                selectedFilter: allChannelsFilter, 
                selectedSort: azSort
            });
            expect(sorted[0]).toEqual(mockChannels[1]);
            expect(sorted[1]).toEqual(mockChannels[0]);
        });

        it('should not duplicate when sorting by network', function () {
            let mockChannels = [{
                localChannelNumber: 5,
                localChannelNumbers: [5, 1],
                somethingToIdentityWith: 'a',
                networkName: 'beta'
            }, {
                localChannelNumber: 2,
                localChannelNumbers: [2],
                somethingToIdentityWith: 'b',
                networkName: 'alpha'
            }];

            let sorted = miniGuideData._private.sortAndFilter({
                channels: mockChannels, 
                selectedFilter: allChannelsFilter, 
                selectedSort: azSort
            });
            expect(sorted.length).toEqual(2);
            expect(sorted[0]).toEqual(mockChannels[1]);
            expect(sorted[1]).toEqual(mockChannels[0]);
        });
    });
});
