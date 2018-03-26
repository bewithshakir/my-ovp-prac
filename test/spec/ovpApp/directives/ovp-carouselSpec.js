describe('ovpApp.directives.carousel', function () {
    'use strict';

    let controller, $scope;

    beforeEach(module('ovpApp.directives.carousel'));

    beforeEach(inject(function ($rootScope, $componentController) {
        let $element = angular.element('<ovp-carousel></ovp-carousel>');
        $scope = $rootScope.$new();
        controller = $componentController('ovpCarousel', {$scope, $element});
    }));

    describe('controller', function () {
        it('should exist', function () {
            expect(controller).toBeDefined();
        });

        describe('nextIndex', function () {
            describe('fixed width', function () {
                describe('viewport fits exactly 4 items', function () {
                    it('should go (full page - 1), first time', function () {
                        let itemWidths = Array(20).fill(200);
                        let viewportWidth = 800;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(3);
                    });

                    it('should go (full page - 1), second time', function () {
                        let itemWidths = Array(20).fill(200);
                        let viewportWidth = 800;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 3);
                        expect(result).toEqual(6);
                    });

                    it('should scroll just enough to bring end of list onto screen', function () {
                        let itemWidths = Array(20).fill(200);
                        let viewportWidth = 800;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 15);
                        expect(result).toEqual(16);
                    });

                    it('should not scroll if everything fits in one page', function () {
                        let itemWidths = Array(4).fill(200);
                        let viewportWidth = 800;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(0);
                    });

                    it('should not scroll if everything easily fits in one page', function () {
                        let itemWidths = Array(1).fill(200);
                        let viewportWidth = 800;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(0);
                    });
                });

                describe('viewport fits slightly more than 4 items', function () {
                    it('should go (full page - 1), first time', function () {
                        let itemWidths = Array(20).fill(200);
                        let viewportWidth = 820;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(3);
                    });

                    it('should go (full page - 1), second time', function () {
                        let itemWidths = Array(20).fill(200);
                        let viewportWidth = 820;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 3);
                        expect(result).toEqual(6);
                    });

                    it('should scroll just enough to bring end of list onto screen', function () {
                        let itemWidths = Array(20).fill(200);
                        let viewportWidth = 820;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 15);
                        expect(result).toEqual(16);
                    });

                    it('should not scroll if everything fits in one page', function () {
                        let itemWidths = Array(4).fill(200);
                        let viewportWidth = 820;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(0);
                    });

                    it('should not scroll if everything easily fits in one page', function () {
                        let itemWidths = Array(1).fill(200);
                        let viewportWidth = 800;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(0);
                    });
                });
            });

            describe('variable width', function () {
                describe('viewport fits exactly 4 items', function () {
                    it('should scroll (full page - 1) items', function () {
                        let itemWidths = [
                            100, 150, 200, 250, 300, 350, 400, 450, 500,
                        ];
                        let viewportWidth = 700;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(3);
                    });

                    it('should scroll just enough to bring end of list onto screen', function () {
                        let itemWidths = [
                            100, 150, 200, 250, 300, 250, 200, 150, 100, 50
                        ];

                        let viewportWidth = 700;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 5);
                        expect(result).toEqual(6);
                    });

                    it('should not scroll if everything fits in one page', function () {
                        let itemWidths = [100, 150, 200, 250]
                        let viewportWidth = 700;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(0);
                    });

                    it('should not scroll if everything easily fits in one page', function () {
                        let itemWidths = [100]
                        let viewportWidth = 700;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(0);
                    });
                });

                describe('viewport fits slightly more than 4 items', function () {
                    it('should scroll (full page - 1) items', function () {
                        let itemWidths = [
                            100, 150, 200, 250, 300, 350, 400, 450, 500,
                        ];
                        let viewportWidth = 720;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(3);
                    });

                    it('should scroll just enough to bring end of list onto screen', function () {
                        let itemWidths = [
                            100, 150, 200, 250, 300, 250, 200, 150, 100, 50
                        ];

                        let viewportWidth = 720;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 5);
                        expect(result).toEqual(6);
                    });

                    it('should not scroll if everything fits in one page', function () {
                        let itemWidths = [100, 150, 200, 250]
                        let viewportWidth = 720;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(0);
                    });

                    it('should not scroll if everything easily fits in one page', function () {
                        let itemWidths = [100]
                        let viewportWidth = 720;

                        let result = controller.nextIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(0);
                    });
                });
            });
        });

        describe('prevIndex', function () {
            describe('fixed width', function () {
                describe('viewport fits exactly 4 items', function () {
                    it('should go (full page - 1), first time', function () {
                        let itemWidths = Array(20).fill(200);
                        let viewportWidth = 800;

                        let result = controller.prevIndex(itemWidths, viewportWidth, 16);
                        expect(result).toEqual(13);
                    });

                    it('should go (full page - 1), second time', function () {
                        let itemWidths = Array(20).fill(200);
                        let viewportWidth = 800;

                        let result = controller.prevIndex(itemWidths, viewportWidth, 13);
                        expect(result).toEqual(10);
                    });

                    it('should scroll just enough to bring end of list onto screen', function () {
                        let itemWidths = Array(20).fill(200);
                        let viewportWidth = 800;

                        let result = controller.prevIndex(itemWidths, viewportWidth, 1);
                        expect(result).toEqual(0);
                    });

                    it('should not scroll if everything fits in one page', function () {
                        let itemWidths = Array(4).fill(200);
                        let viewportWidth = 800;

                        let result = controller.prevIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(0);
                    });

                    it('should not scroll if everything easily fits in one page', function () {
                        let itemWidths = Array(1).fill(200);
                        let viewportWidth = 800;

                        let result = controller.prevIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(0);
                    });
                });

                describe('viewport fits slightly more than 4 items', function () {
                    it('should go (full page - 1), first time', function () {
                        let itemWidths = Array(20).fill(200);
                        let viewportWidth = 820;

                        let result = controller.prevIndex(itemWidths, viewportWidth, 16);
                        expect(result).toEqual(13);
                    });

                    it('should go (full page - 1), second time', function () {
                        let itemWidths = Array(20).fill(200);
                        let viewportWidth = 820;

                        let result = controller.prevIndex(itemWidths, viewportWidth, 13);
                        expect(result).toEqual10;
                    });

                    it('should scroll just enough to bring end of list onto screen', function () {
                        let itemWidths = Array(20).fill(200);
                        let viewportWidth = 820;

                        let result = controller.prevIndex(itemWidths, viewportWidth, 1);
                        expect(result).toEqual(0);
                    });

                    it('should not scroll if everything fits in one page', function () {
                        let itemWidths = Array(4).fill(200);
                        let viewportWidth = 820;

                        let result = controller.prevIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(0);
                    });

                    it('should not scroll if everything easily fits in one page', function () {
                        let itemWidths = Array(1).fill(200);
                        let viewportWidth = 800;

                        let result = controller.prevIndex(itemWidths, viewportWidth, 0);
                        expect(result).toEqual(0);
                    });
                });
            });
            
            describe('variable width', function () {
                describe('viewport fits exactly 4 items', function () {
                    
                });

                describe('viewport fits slightly more than 4 items', function () {
                    
                });
            });
        });

        describe('onKeydown', function () {
            describe('left/up', function () {
               xit('should scroll if exceeding viewport', function () {
                   
               });
            });

            describe('right/down', function () {
                xit('should scroll if exceeding viewport', function () {
                    
                });
            });
        });
    });
});
