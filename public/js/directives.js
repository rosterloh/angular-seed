'use strict';

/* Directives */

angular.module('myApp.directives', []).
	directive('appVersion', ['version', function(version) {
    	//return function(scope, elm, attrs) {
    	return function(scope, elm) {
			elm.text(version);
    	};
  	}]);