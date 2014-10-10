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
