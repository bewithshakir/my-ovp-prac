(function () {
    'use strict';

    angular.module('ovpApp.buyFlow.collapsedStep', [

    ])
    .component('collapsedStep', {
        bindings: {
            stepNumber: '<',
            stepNumberClass: '<',
            itemBodyClass: '<',
            title: '<stepTitle',
            regularCaption: '<',
            boldCaption: '<',
            price: '<',
            onTitleClick: '&'
        },

        templateUrl: '/js/ovpApp/buyFlow/collapsed-step.html',
        controller: class CollapsedStep {
            /* @ngInject */
            constructor() {
                angular.extend(this, {});
            }
        }
    });
})();
