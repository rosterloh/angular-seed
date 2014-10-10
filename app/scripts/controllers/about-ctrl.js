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
