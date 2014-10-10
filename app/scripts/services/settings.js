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
