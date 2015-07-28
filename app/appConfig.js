// This config file does not define any routes.
// For module-level route definitions, use the *Routes.js files found in the module folders.

'use strict';

function appConfig($urlRouterProvider, $locationProvider, $mdThemingProvider, $mdIconProvider) {

    // Add hashbang prefix for SEO and HTML5 mode to remove #! from the URL.
    // Html5 mode requires server-side configuration. See http://bit.ly/1qLuJ0v
    $locationProvider.html5Mode(true).hashPrefix('!');
    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise('/');

    $mdIconProvider
      .defaultIconSet('./assets/svg/avatars.svg', 128)
      .icon('menu'       , './assets/svg/menu.svg'        , 24)
      .icon('share'      , './assets/svg/share.svg'       , 24)
      .icon('google_plus', './assets/svg/google_plus.svg' , 512)
      .icon('hangouts'   , './assets/svg/hangouts.svg'    , 512)
      .icon('twitter'    , './assets/svg/twitter.svg'     , 512)
      .icon('phone'      , './assets/svg/phone.svg'       , 512);

    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('deep-purple');

}

appConfig.$inject = ['$urlRouterProvider', '$locationProvider', '$mdThemingProvider', '$mdIconProvider'];
module.exports = appConfig;
