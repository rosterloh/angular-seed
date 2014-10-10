/**
 * @ngdoc object
 * @name RouteConfig
 * @module seed
 * @requires $stateProvider
 * @requires $urlRouterProvider
 * @requires $locationProvider
 * @description
 * Route configuration for the module.
 */
angular.module('seed')
.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
function($stateProvider, $urlRouterProvider, $locationProvider) {
  'use strict';
  
  // Application routes
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home.html',
      controller: 'HomeCtrl'
    })
    .state('about', {
      url: '/about',
      templateUrl: 'login.html',
      controller: 'LoginCtrl'
    });

  $urlRouterProvider.otherwise('/');

  // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
  $urlRouterProvider.rule(function ($injector, $location) {
    var path = $location.url();

    // check to see if the path has a trailing slash
    if ('/' === path[path.length - 1]) {
      return path.replace(/\/$/, '');
    }

    if (path.indexOf('/?') > 0) {
      return path.replace('/?', '?');
    }

    return false;
  });

  $locationProvider.html5Mode(true);
}]);
