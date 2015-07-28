//window.jQuery = window.$ = require('jquery');
window._ = require('lodash');

require('angular-material');
require('angular-ui-router');
require('lodash');

module.exports = angular.module('common',
    [
        'ngMaterial',
        'ui.router',
        require('./elements/header').name,
        require('./elements/footer').name,
        require('./constants').name,
        require('./directives').name,
        require('./services').name
    ]);
