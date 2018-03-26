/* globals inject */
/* jshint jasmine: true */

describe('search service', function () {
    'use strict';

    var searchService, $httpBackend, $q;

    beforeEach(module('ovpApp.services.errorCodes'));
    beforeEach(module('ovpApp.services.entry'));
    beforeEach(module('ovpApp.search.searchService'));

    beforeEach(inject(function (_searchService_, _$httpBackend_, _$q_) {
        searchService = _searchService_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
    }));

    describe('entry service', function () {
        var entryService;

        beforeEach(inject(function (_entryService_) {
            entryService = _entryService_;

            var defer = $q.defer();
            defer.resolve({
                componentSearch: {
                    searchString: () => 'fakeurl'
                },
                similarTo: {
                    tmsProviderProgramID: () => 'fakeurl',
                    tmsSeriesID: () => 'fakeurl'
                }
            })

            spyOn(entryService, 'forDefaultProfile').and.returnValue(defer.promise);
        }));

        it('getComponentResults calls entry point', function () {
            $httpBackend.expectGET('fakeurl');
            searchService.getComponentResults('something');

            expect(entryService.forDefaultProfile).toHaveBeenCalled();
        });

        it('getRelatedByTmsProgramId calls entry point', function () {
            $httpBackend.expectGET('fakeurl');
            searchService.getRelatedByTmsProgramId(123123);

            expect(entryService.forDefaultProfile).toHaveBeenCalled();
        });

        it('getRelatedByTmsSeriesId calls entry point', function () {
            $httpBackend.expectGET('fakeurl');
            searchService.getRelatedByTmsSeriesId(123132);

            expect(entryService.forDefaultProfile).toHaveBeenCalled();
        });

        it('should not call entry point if getRelatedByTmsSeriesId is called with a null id', function (done) {
            $httpBackend.expectGET('fakeurl');
            searchService.getRelatedByTmsSeriesId()
                .subscribe(
                    () => expect(false).toEqual(true, 'should not have succeeded'),
                    done
                );
        });

        it('should not call entry point if getRelatedByTmsProgramId is called with a null id', function (done) {
            $httpBackend.expectGET('fakeurl');
            searchService.getRelatedByTmsProgramId()
                .subscribe(
                    () => expect(false).toEqual(true, 'should not have succeeded'),
                    done
                );
        });
    });

    describe('stripInvalidCharacters', function () {
        it('passes through all lowercase english letters', function () {
            var value = searchService.stripInvalidCharacters('abcdefghijklmnopqrstuvwxyz');
            expect(value).toEqual('abcdefghijklmnopqrstuvwxyz');
        });

        it('converts all uppercase english letters to lowercase', function () {
            var value = searchService.stripInvalidCharacters('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
            expect(value).toEqual('abcdefghijklmnopqrstuvwxyz');
        });

        it('passes through all numbers', function () {
            var value = searchService.stripInvalidCharacters('0123456789');
            expect(value).toEqual('0123456789');
        });

        xit('passes through all lowercase extended latin letters', function () {
            throw 'not implemented';
        });

        xit('converts all upper case extended latin letters to lowercase', function () {
            throw 'not implemented';
        });

        it('omits all symbols, whitespace (except space), and punctuation (except hyphen)', function () {
            var value = searchService.stripInvalidCharacters(' \n\t\b\f\\\'!@#$%^&*()_+{}|:"<>?~,./-');
            expect(value).toEqual(' &-');
        });

        it('Samuel L. Jackson', function () {
            var value = searchService.stripInvalidCharacters('Samuel L. Jackson');
            expect(value).toEqual('samuel l jackson');
        });

        it('Wayne "Butch" Gilliam', function () {
            var value = searchService.stripInvalidCharacters('Wayne "Butch" Gilliam');
            expect(value).toEqual('wayne butch gilliam');
        });

        it('Chloë Sevigne', function () {
            var value = searchService.stripInvalidCharacters('Chloë Sevigne');
            expect(value).toEqual('chloë sevigne');
        });

        it('Renée Zellweger', function () {
            var value = searchService.stripInvalidCharacters('Renée Zellweger');
            expect(value).toEqual('renée zellweger');
        });

        it('Željko Ivanek', function () {
            var value = searchService.stripInvalidCharacters('Željko Ivanek');
            expect(value).toEqual('željko ivanek');
        });

        it('Bjørn Sundquist', function () {
            var value = searchService.stripInvalidCharacters('Bjørn Sundquist');
            expect(value).toEqual('bjørn sundquist');
        });

        it('Hafþór Júlíus Björnsson', function () {
            var value = searchService.stripInvalidCharacters('Hafþór Júlíus Björnsson');
            expect(value).toEqual('hafþór júlíus björnsson');
        });

        it('2001: A Space Odyssey (1968)', function () {
            var value = searchService.stripInvalidCharacters('2001: A Space Odyssey (1968)');
            expect(value).toEqual('2001 a space odyssey 1968');
        });

        it('Ant-Man (2015)', function () {
            var value = searchService.stripInvalidCharacters('Ant-Man (2015)');
            expect(value).toEqual('ant-man 2015');
        });

        it('Chicago P.D.', function () {
            var value = searchService.stripInvalidCharacters('Chicago P.D.');
            expect(value).toEqual('chicago pd');
        });

        it('Fútbol Español Primera División', function () {
            var value = searchService.stripInvalidCharacters('Fútbol Español Primera División');
            expect(value).toEqual('fútbol español primera división');
        });

        it('Kobe Bryant 1-on-1', function () {
            var value = searchService.stripInvalidCharacters('Kobe Bryant 1-on-1');
            expect(value).toEqual('kobe bryant 1-on-1');
        });

        it('¿Qué Culpa Tiene Fatmagül?', function () {
            var value = searchService.stripInvalidCharacters('¿Qué Culpa Tiene Fatmagül?');
            expect(value).toEqual('qué culpa tiene fatmagül');
        });
    });

    xdescribe('recent searches', function () {
    });
});
