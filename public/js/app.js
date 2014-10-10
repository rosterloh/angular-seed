/**
 * angular-seed - A framework for my embedded AngularJS projects
 * @version v0.0.1 (c) 2014
 * @author Richard Osterloh <richard.osterloh@gmail.com>
 * @link https://github.com/rosterloh/angular-seed
 */
(function() {
/**
 * @ngdoc module
 * @name seed
 * @module seed
 * @requires ui.bootstrap
 * @requires ui.router
 * @description
 * Angular seed
 */
angular.module('seed', ['ui.bootstrap', 'ui.router']);

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

/**
 * @ngdoc service
 * @name ng.service:Settings
 * @requires $window
 * @description
 * Settings Service backed by localstorage
 */
angular.module('seed')
.factory('Settings', [
  '$window',
function($window) {
  'use strict';

  var defaultSettings = [];
  var settings = [];

  return {
    all: function() {
      settings = JSON.parse($window.localStorage.getItem('settings'));
      if(settings === null) {
        settings = defaultSettings;
        $window.localStorage.setItem('settings', JSON.stringify(settings));
      }
      return settings;
    },
    get: function(id) {
      // Simple index lookup
      return settings[id];
    },
    save: function(settings) {
      $window.localStorage.setItem('settings', JSON.stringify(settings));
    },
    remove: function() {
      $window.localStorage.removeItem('settings');
    },
    clear: function() {
      $window.localStorage.clear();
    }
  };

}]);

/**
 * @ngdoc controller
 * @name ng.controller:AboutCtrl
 * @requires $scope
 * @description
 * About Controller
 */
angular.module('seed')
.controller('AboutCtrl', [
  '$scope',
function ($scope) {
  'use strict';

  $scope.header = 'About';
}]);

/**
 * @ngdoc controller
 * @name ng.controller:HomeCtrl
 * @requires $scope
 * @description
 * Main Controller
 */
angular.module('seed')
.controller('HomeCtrl', [
  '$scope',
function ($scope) {
  'use strict';

  $scope.header = 'Home';
}]);

/**
 * @ngdoc directive
 * @name ng.directive:ngLoading
 * @description
 * Loading Directive
 * @see http://tobiasahlin.com/spinkit/
 */
angular.module('seed')
.directive('ngLoading', [
function() {
  'use strict';

  var directive = {
    restrict: 'AE',
    template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
  };
  return directive;
}]);

})();