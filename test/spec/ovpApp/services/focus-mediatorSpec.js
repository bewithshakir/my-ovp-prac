describe('ovpApp.services.focusMediator', function () {
    'use strict';

    let focusMediator, $rootScope, $timeout;

    beforeEach(module('ovpApp.services.focusMediator'));

    beforeEach(inject(function (_focusMediator_, _$rootScope_, _$timeout_) {
        focusMediator = _focusMediator_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
    }));

    describe('request focus', function () {
        it('should work with only one request', function () {
            focusMediator.requestFocus(focusMediator.lowPriority)
                .then(
                    () => {
                        expect(true);
                    },
                    err => expect(false).toEqual(true, 'should not have been rejected')
                )

            $timeout.flush();
        });

        it('should work with two requests of different prioriites', function () {
            let results = [];
            focusMediator.requestFocus(focusMediator.lowPriority)
                .then(
                    () => {
                        expect(false).toEqual(true, 'low priority should not have been permitted');
                    },
                    err => {
                        results.push(true);
                        expect(results.length).toBe(2);
                    }
                );

            focusMediator.requestFocus(focusMediator.highPriority)
                .then(
                    () => {
                        results.push(true);
                        expect(results.length).toBe(1);
                    },
                    err => {
                        expect(false).toEqual(true, 'high priority should not have been rejected');
                    }
                );

            $timeout.flush();
        });
    });
});
