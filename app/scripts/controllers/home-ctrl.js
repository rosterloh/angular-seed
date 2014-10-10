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
