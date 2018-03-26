/* globals getJSONFixture */
describe('ovpApp.components.vast', function () {
    'use strict';
    var mockData, LegacyAdParser, VastParser;


    beforeEach(module('ovpApp.components.vast'));
    beforeEach(inject(function (_$rootScope_, _LegacyAdParser_, _VastParser_) {
        LegacyAdParser = _LegacyAdParser_;
        VastParser = _VastParser_;

        jasmine.getJSONFixtures().fixturesPath = 'base/test/fixtures';
        mockData = getJSONFixture('manifest.json');
    }));

    describe('Vast Parsers', function () {
        it('Should correctly parse vast manifest entries', function () {
            expect(VastParser).toBeDefined();

            let adBreaks = VastParser.parseAdBreaks(mockData.vastAdTags);
            expect(adBreaks).toBeDefined();
            expect(adBreaks.length).toBe(1);
        });

        it('Should correctly parse legacy manifest entries', function () {
            var breaks = LegacyAdParser.parseAdEvents(mockData.legacyAdTags);
            expect(breaks).toBeDefined();
            expect(breaks.length).toBe(1);
            expect(breaks[0].adArray[0].startTime).toBe(123);
            expect(breaks[0].adArray[0].duration).toBe(10);
        });

        it('Should parse the ad breaks even if the ad break end tag is missing', function () {
            var breaks = VastParser.parseAdBreaks(mockData.brokenVastAdTags);
            expect(breaks).toBeDefined();
            expect(breaks.length).toBe(2);
            expect(breaks[0].startTime).toBe(0);
            expect(breaks[0].endTime).toBe(60000);
            expect(breaks[0].duration).toBe(60000);
            expect(breaks[0].adArray.length).toBe(2);
        });

        it('Should sainly handle parsing ad-start / ad-break-start out of order circumstances', function () {
            var breaks = VastParser.parseAdBreaks(mockData.outOfOrderStart);
            expect(breaks).toBeDefined();
            expect(breaks.length).toBe(1);
            expect(breaks[0].startTime).toBe(0);
            expect(breaks[0].endTime).toBe(60000);
            expect(breaks[0].duration).toBe(60000);
            expect(breaks[0].adArray.length).toBe(2);
        });

        it('Should correctly format all the urls ', function () {
            let adBreaks = VastParser.parseAdBreaks(mockData.vastAdTags);
            let adInstance = adBreaks[0].adArray[1];
            adInstance.caid = 'caidcaid';
            adInstance.streamInfo = {
                type: 'VOD'
            };
            adInstance.startTime = 3003;
            let startEvent = adInstance.linear.trackingEvents[1];
            let firstQuartile = adInstance.linear.trackingEvents[2];
            let midpoint = adInstance.linear.trackingEvents[3];

            let parsed = VastParser.macroMapper(startEvent.url, {
                adInstance: adInstance
            });
            expect(parsed).toBe("https://services.timewarnercable.com/blackarrow/adrouter/vmap/psn?idt=TWC_ADM_VMAP&msgRef=7e0c650a-796f-4f9f-8a95-225655207c71&sess=c71f5869-e9ed-4b3c-8528-d717ca0bb8c3&st=CanoeNationalDAI-ADS-NoReg%7D%3A%7BODH_ENTOD%23nbcuniverso.com%40138-2526962-02A-I-IZms4BfTWC_cyJHZV9BGSW5fbs2Q%2FT88%7D%3A%7B03mf4bq-TQQTuXRkjbfvrHbw&ct=CanoeNationalDAI-ADS-NoReg%7D%3A%7BODH_ENTOD%23nbcuniverso.com%40138-2526962-02A-I-IZms4BfTWC_cyJHZV9BGSW5fbs2Q%2FT88%7D%3A%7B03dBOpi_xYRXCkN25bnPPkqw&aid=NBCU2016100400001001&cpid=nbcuni.com&type=start&status=0&note=null&prog=0&dur=PT30S");
            let firstParsed = VastParser.macroMapper(firstQuartile.url, {
                adInstance: adInstance
            });
            expect(firstParsed).toBe("https://services.timewarnercable.com/blackarrow/adrouter/vmap/psn?idt=TWC_ADM_VMAP&msgRef=7e0c650a-796f-4f9f-8a95-225655207c71&sess=c71f5869-e9ed-4b3c-8528-d717ca0bb8c3&st=CanoeNationalDAI-ADS-NoReg%7D%3A%7BODH_ENTOD%23nbcuniverso.com%40138-2526962-02A-I-IZms4BfTWC_cyJHZV9BGSW5fbs2Q%2FT88%7D%3A%7B03mf4bq-TQQTuXRkjbfvrHbw&ct=CanoeNationalDAI-ADS-NoReg%7D%3A%7BODH_ENTOD%23nbcuniverso.com%40138-2526962-02A-I-IZms4BfTWC_cyJHZV9BGSW5fbs2Q%2FT88%7D%3A%7B03dBOpi_xYRXCkN25bnPPkqw&aid=NBCU2016100400001001&cpid=nbcuni.com&type=firstQuartile&status=0&note=null&prog=0&dur=PT30S");
            let midParsed = VastParser.macroMapper(midpoint.url, {
                adInstance: adInstance
            });
            expect(midParsed).toBe("https://services.timewarnercable.com/blackarrow/adrouter/vmap/psn?idt=TWC_ADM_VMAP&msgRef=7e0c650a-796f-4f9f-8a95-225655207c71&sess=c71f5869-e9ed-4b3c-8528-d717ca0bb8c3&st=CanoeNationalDAI-ADS-NoReg%7D%3A%7BODH_ENTOD%23nbcuniverso.com%40138-2526962-02A-I-IZms4BfTWC_cyJHZV9BGSW5fbs2Q%2FT88%7D%3A%7B03mf4bq-TQQTuXRkjbfvrHbw&ct=CanoeNationalDAI-ADS-NoReg%7D%3A%7BODH_ENTOD%23nbcuniverso.com%40138-2526962-02A-I-IZms4BfTWC_cyJHZV9BGSW5fbs2Q%2FT88%7D%3A%7B03dBOpi_xYRXCkN25bnPPkqw&aid=NBCU2016100400001001&cpid=nbcuni.com&type=midpoint&status=0&note=null&prog=0&chead=00%3A00%3A03.000&dur=PT30S");
        });
    });

    describe('Vast Macro Replace', function () {
        it('should return the same url if no macros are present', function () {
            let url = 'http://testurlisathing.js?test=test&asdfasdf=asdf';
            let mappedUrl = VastParser.macroMapper(url, {
                adInstance: {}
            });
            expect(mappedUrl).toBe(url);
        });

        it('should generate a url that replaces cachebuster', function () {
            let url = 'https://testurl.js?cb=[CACHEBUSING]';
            let mappedUrl = VastParser.macroMapper(url, {
                adInstance: {}
            });
            expect(mappedUrl.indexOf('[CACHEBUSTING]')).toBe(-1);
        });

        it('should return a url that does not have any query parameters', function () {
            let url = 'https://testurl.js';
            let mappedUrl = VastParser.macroMapper(url, {});
            expect(mappedUrl).toBe(url);
        });

        it('should handle multiple replacements', function () {
            let url = 'https://testurl.js?somevar1=0&prog=[NPT]&playhead=[CONTENTPLAYHEAD]&status=[nothing]';
            let mappedUrl = VastParser.macroMapper(url, {
                adInstance: {
                    duration: 15000,
                    startTime: 3000,
                    streamInfo: {
                        type: 'notlive'
                    }
                },
                type: 'complete'
            });
            expect(mappedUrl).toBe('https://testurl.js?somevar1=0&prog=0&playhead=00%3A00%3A03.000&status=0');
        });

        it('should replace [ASSETURI] with the adInstance.caid', function () {
            let url = 'https://someurl.js?somevar1=0&somevar2=[NPT]&caid=[ASSETURI]';
            let mappedUrl = VastParser.macroMapper(url, {
                adInstance: {
                    caid: 123123123123123,
                    streamInfo: {
                        type: 'ONDEMAND'
                    }
                }
            });
            expect(mappedUrl).toBe('https://someurl.js?somevar1=0&somevar2=0&caid=123123123123123');
        });

        it('should replace [CONTENTPLAYHEAD] with the proper time, properly formatted', function () {
            let url = 'https://someurl.js?somevar1=9&caid=[ASSETURI]&startsAt=[CONTENTPLAYHEAD]';
            let mappedUrl = VastParser.macroMapper(url, {
                adInstance: {
                    startTime: 0,
                    caid: 12341234,
                    streamInfo: {
                        type: 'ONDEMAND'
                    }
                }
            });
            expect(mappedUrl).toBe('https://someurl.js?somevar1=9&caid=12341234&startsAt=00%3A00%3A00.000');
        });

        it('should replace prog with the duration in seconds', function () {
            let url = 'https://someurl.js?prog=0';
            let mappedUrl = VastParser.macroMapper(url, {
                adInstance: {
                    duration: 1500,
                    streamInfo: {
                        type: 'ONDEMAND'
                    }
                },
                type: 'complete'
            });
            expect(mappedUrl).toBe('https://someurl.js?prog=0');
        });
    });

});
