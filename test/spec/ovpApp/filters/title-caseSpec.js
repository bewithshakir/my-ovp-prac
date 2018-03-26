describe('title case filter', function () {
    'use strict';
    beforeEach(module('ovpApp.filters.titleCase'));

    describe('Filters', function () {
        var titleCase;

        beforeEach(inject(function (_titleCaseFilter_) {
            titleCase = _titleCaseFilter_;
        }));

        it('titleCase should convert to title case', function () {
            expect(titleCase('Hello')).toBe('Hello');
            expect(titleCase('hello')).toBe('Hello');
            expect(titleCase('HELLO')).toBe('Hello');
            expect(titleCase('hELLO')).toBe('Hello');
            expect(titleCase('hello world')).toBe('Hello World');
            expect(titleCase('HELLO WORLD')).toBe('Hello World');
        });
    });
});
