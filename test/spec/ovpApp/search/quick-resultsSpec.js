/* globals inject */
/* jshint jasmine: true */

describe('search quick results', function () {
    'use strict';

    beforeEach(module('ovpApp.search.quickResults'));

    var quickResultCtrl;
    beforeEach(inject(function (_$controller_, $rootScope, _$componentController_, $compile) {
        let scope = $rootScope.$new(),
            element;

        scope.query = '';
        scope.results = {};

        element = angular.element('<quick-search-results query=scope.query results=scope.results></quick-search-results>');
        element = $compile(element)(scope);
        quickResultCtrl = _$componentController_('quickSearchResults', {
            columns: 4,
            $scope: scope,
            $element: element
        });
        quickResultCtrl.limit = 10;
    }));

    describe('calculateLayout', function () {
        it('should empty layout if results or results.results is undefined', function () {
            quickResultCtrl.results = undefined;
            quickResultCtrl.calculateLayout();
            expect(quickResultCtrl.layout).toEqual({categories: []});

            quickResultCtrl.results = {};
            quickResultCtrl.calculateLayout();
            expect(quickResultCtrl.layout).toEqual({categories: []});
        });

        it('should expand category top priority if able', function () {
            quickResultCtrl.results = {
                categories: [
                    {
                        title: 'a',
                        numResults: 100
                    },
                    {
                        title: 'b',
                        numResults: 100
                    },
                    {
                        title: 'c',
                        numResults: 100
                    }
                ]
            };
            quickResultCtrl.priorities = ['a'];
            quickResultCtrl.limit = 10;

            quickResultCtrl.calculateLayout();

            expect(quickResultCtrl.layout).toEqual({
                categories: [
                    {
                        title: 'a',
                        numResults: 100,
                        columns: 2,
                        class: 'search-results-group col-2',
                        resultsToshow: 20
                    },
                    {
                        title: 'b',
                        numResults: 100,
                        columns: 1,
                        class: 'search-results-group col-1',
                        resultsToshow: 10
                    },
                    {
                        title: 'c',
                        numResults: 100,
                        columns: 1,
                        class: 'search-results-group col-1',
                        resultsToshow: 10
                    }
                ]
            });
        });

        it('should expand multiple times if able', function () {
            quickResultCtrl.results = {
                categories: [
                    {
                        title: 'a',
                        numResults: 100
                    },
                    {
                        title: 'b',
                        numResults: 100
                    }
                ]
            };
            quickResultCtrl.priorities = ['a'];
            quickResultCtrl.limit = 10;

            quickResultCtrl.calculateLayout();

            expect(quickResultCtrl.layout).toEqual({
                categories: [
                    {
                        title: 'a',
                        numResults: 100,
                        columns: 3,
                        class: 'search-results-group col-3',
                        resultsToshow: 30
                    },
                    {
                        title: 'b',
                        numResults: 100,
                        columns: 1,
                        class: 'search-results-group col-1',
                        resultsToshow: 10
                    }
                ]
            });
        });

        it('should stop if every category has full representation', function () {
            quickResultCtrl.results = {
                categories: [
                    {
                        title: 'a',
                        numResults: 10
                    },
                    {
                        title: 'b',
                        numResults: 10
                    }
                ]
            };
            quickResultCtrl.priorities = ['a'];
            quickResultCtrl.limit = 10;

            quickResultCtrl.calculateLayout();
            expect(quickResultCtrl.layout).toEqual({
                categories: [
                    {
                        title: 'a',
                        numResults: 10,
                        columns: 1,
                        class: 'search-results-group col-1',
                        resultsToshow: 10
                    },
                    {
                        title: 'b',
                        numResults: 10,
                        columns: 1,
                        class: 'search-results-group col-1',
                        resultsToshow: 10
                    }
                ]
            });
        });
    });

    describe('need', function () {
        it('lots of need, no columns', function () {
            quickResultCtrl.limit = 10;
            var mockCategory = {
                numResults: 1000,
                columns: 0
            };
            var result = quickResultCtrl.need(mockCategory);
            expect(result).toEqual(1000);
        });

        it('lots of need, 1 column', function () {
            quickResultCtrl.limit = 10;
            var mockCategory = {
                numResults: 1000,
                columns: 1
            };
            var result = quickResultCtrl.need(mockCategory);
            expect(result).toEqual(990);
        });

        it('lots of need, 50 columns', function () {
            quickResultCtrl.limit = 10;
            var mockCategory = {
                numResults: 1000,
                columns: 50
            };
            var result = quickResultCtrl.need(mockCategory);
            expect(result).toEqual(500);
        });

        it('a little need, 0 columns', function () {
            quickResultCtrl.limit = 10;
            var mockCategory = {
                numResults: 2,
                columns: 0
            };
            var result = quickResultCtrl.need(mockCategory);
            expect(result).toEqual(2);
        });

        it('a little need, 1 column', function () {
            quickResultCtrl.limit = 10;
            var mockCategory = {
                numResults: 12,
                columns: 1
            };
            var result = quickResultCtrl.need(mockCategory);
            expect(result).toEqual(2);
        });

        it('a little need, 50 columns', function () {
            quickResultCtrl.limit = 10;
            var mockCategory = {
                numResults: 502,
                columns: 50
            };
            var result = quickResultCtrl.need(mockCategory);
            expect(result).toEqual(2);
        });

        it('no need, 0 columns', function () {
            quickResultCtrl.limit = 10;
            var mockCategory = {
                numResults: 0,
                columns: 0
            };
            var result = quickResultCtrl.need(mockCategory);
            expect(result).toEqual(0);
        });

        it('no need, 1 column', function () {
            quickResultCtrl.limit = 10;
            var mockCategory = {
                numResults: 10,
                columns: 1
            };
            var result = quickResultCtrl.need(mockCategory);
            expect(result).toEqual(0);
        });

        it('no need, 50 columns', function () {
            quickResultCtrl.limit = 10;
            var mockCategory = {
                numResults: 500,
                columns: 50
            };
            var result = quickResultCtrl.need(mockCategory);
            expect(result).toEqual(0);
        });

        it('negative need, 1 column', function () {
            quickResultCtrl.limit = 10;
            var mockCategory = {
                numResults: 2,
                columns: 1
            };
            var result = quickResultCtrl.need(mockCategory);
            expect(result).toEqual(-8);
        });

        it('negative need, 50 columns', function () {
            quickResultCtrl.limit = 10;
            var mockCategory = {
                numResults: 492,
                columns: 50
            };
            var result = quickResultCtrl.need(mockCategory);
            expect(result).toEqual(-8);
        });
    });

    describe('canExpand', function () {
        it('should return true if need > 0 and columns < max', function () {
            var mockCategory = {
                numResults: 11,
                columns: 1
            };
            var result = quickResultCtrl.canExpand(mockCategory);
            expect(result).toEqual(true);
        });
        it('should return false if need = 0', function () {
            var mockCategory = {
                numResults: 10,
                columns: 1
            };
            var result = quickResultCtrl.canExpand(mockCategory);
            expect(result).toEqual(false);
        });
        it('should return false if need < 0', function () {
            var mockCategory = {
                numResults: 9,
                columns: 1
            };
            var result = quickResultCtrl.canExpand(mockCategory);
            expect(result).toEqual(false);
        });
        it('should return false if columns >= max', function () {
            var mockCategory = {
                numResults: 10000,
                columns: 4
            };
            var result = quickResultCtrl.canExpand(mockCategory);
            expect(result).toEqual(false);
        });
    });

    describe('byPriority', function () {
        it('should expand highest priority category if able', function () {
            quickResultCtrl.priorities = ['a', 'b'];
            quickResultCtrl.limit = 10;

            var mockCategories = [
                {
                    title: 'a',
                    numResults: 11,
                    columns: 1
                },
                {
                    title: 'b',
                    numResults: 1000,
                    columns: 1
                }];

            var result = quickResultCtrl.byPriority(mockCategories);
            expect(result).toEqual(mockCategories[0]);

        });

        it('should expand second highest priority category if first is full', function () {
            quickResultCtrl.priorities = ['a', 'b'];
            quickResultCtrl.limit = 10;

            var mockCategories = [
                {
                    title: 'a',
                    numResults: 10,
                    columns: 1
                },
                {
                    title: 'b',
                    numResults: 1000,
                    columns: 1
                }];

            var result = quickResultCtrl.byPriority(mockCategories);
            expect(result).toEqual(mockCategories[1]);
        });

        it('should expand 2nd highest priority if first has used max columns', function () {
            quickResultCtrl.priorities = ['a', 'b'];
            quickResultCtrl.limit = 10;

            var mockCategories = [
                {
                    title: 'a',
                    numResults: 1000,
                    columns: 4
                },
                {
                    title: 'b',
                    numResults: 1000,
                    columns: 1
                }];

            var result = quickResultCtrl.byPriority(mockCategories);
            expect(result).toEqual(mockCategories[1]);
        });

        it('should return undefined if no columns match the priorities', function () {
            quickResultCtrl.priorities = ['y', 'z'];
            var mockCategories = [
                {
                    title: 'a',
                    numResults: 10,
                    columns: 1
                },
                {
                    title: 'b',
                    numResults: 1000,
                    columns: 1
                }];
            var result = quickResultCtrl.byPriority(mockCategories);
            expect(result).toEqual(undefined);
        });
    });

    describe('byNeed', function () {
        it('should select category with most undisplayed results', function () {
            var mockCategories = [
                {
                    name: 'a',
                    numResults: 99,
                    columns: 1
                },
                {
                    name: 'b',
                    numResults: 100,
                    columns: 1
                }
            ],

            category = quickResultCtrl.byNeed(mockCategories);
            expect(category).toBeDefined();
            expect(category.name).toEqual('b');

            mockCategories = [
                {
                    name: 'a',
                    numResults: 91,
                    columns: 1
                },
                {
                    name: 'b',
                    numResults: 100,
                    columns: 2
                }
            ];

            category = quickResultCtrl.byNeed(mockCategories);
            expect(category).toBeDefined();
            expect(category.name).toEqual('a');

        });

        it('should give ties to the first category in the array', function () {
            var mockCategories = [
                {
                    name: 'a',
                    numResults: 100,
                    columns: 1
                },
                {
                    name: 'b',
                    numResults: 100,
                    columns: 1
                }
            ],

            category = quickResultCtrl.byNeed(mockCategories);
            expect(category).toBeDefined();
            expect(category.name).toEqual('a');

            mockCategories = [
                {
                    name: 'a',
                    numResults: 90,
                    columns: 1
                },
                {
                    name: 'b',
                    numResults: 100,
                    columns: 2
                }
            ];

            category = quickResultCtrl.byNeed(mockCategories);
            expect(category).toBeDefined();
            expect(category.name).toEqual('a');
        });

        it('should not select a category if it already has 4 columns', function () {
            var mockCategories = [
                {
                    name: 'a',
                    numResults: 100,
                    columns: 4
                },
                {
                    name: 'b',
                    numResults: 15,
                    columns: 1
                }
            ],

            category = quickResultCtrl.byNeed(mockCategories);
            expect(category).toBeDefined();
            expect(category.name).toEqual('b');
        });

        it('should return undefined if all categories have full representation', function () {
            var mockCategories = [
                {
                    name: 'a',
                    numResults: 10,
                    columns: 1
                },
                {
                    name: 'b',
                    numResults: 10,
                    columns: 1
                }
            ],

            category = quickResultCtrl.byNeed(mockCategories);
            expect(category).toBeUndefined();

            mockCategories = [
                {
                    name: 'a',
                    numResults: 10,
                    columns: 1
                },
                {
                    name: 'b',
                    numResults: 20,
                    columns: 2
                }
            ];

            category = quickResultCtrl.byNeed(mockCategories);
            expect(category).toBeUndefined();
        });
    });

    describe('select', function () {
        xit('selected person quick result should launch person search', function () {
            throw 'not implemented';
        });

        xit('selected title quick result should launch product page', function () {
            throw 'not implemented';
        });
    });
});
