'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', [
	'ui.bootstrap',
	'ui.router',
	'myApp.filters',
	'myApp.services',
	'myApp.directives',
	'myApp.controllers'
]);
//Setting up route
app.config(function($stateProvider, $urlRouterProvider) {
    // For unmatched routes:
    $urlRouterProvider.otherwise('/');

    // states for my app
    $stateProvider
        .state('about', {
            url: '/about',
            templateUrl: 'views/about.html'
        })
        .state('home', {
            url: '/',
            templateUrl: 'views/home.html'
        });
});
//Setting HTML5 Location Mode
app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);