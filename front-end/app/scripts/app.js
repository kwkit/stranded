'use strict';

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'stranded' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'stranded.controllers' is found in app.js
angular.module('stranded', ['ionic', 'stranded.controllers', 'stranded.services', 'ngResource', 'config', 'LocalStorageModule'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('landing', {
    url: '/landing',
    templateUrl: 'templates/landing.html',
    controller: 'LandingCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignUpCtrl'
  })

  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  })

  .state('track', {
    url: '/track',
    templateUrl: 'templates/track.html',
    controller: 'TrackCtrl'
  })

  .state('view', {
    url: '/view/:bottle_id',
    templateUrl: 'templates/view.html',
    controller: 'ViewCtrl'
  })
//  .state('app', {
//    url: '/app',
//    abstract: true,
//    templateUrl: 'templates/app.html',
//    controller: 'AppCtrl'
//  })

  .state('grab', {
    url: '/grab',
//    views: {
//      'tab-grab': {
        templateUrl: 'templates/grab.html',
        controller: 'GrabCtrl'
//      }
//    }
  })

  .state('throw', {
    url: '/throw',
//    views: {
//      'tab-throw': {
        templateUrl: 'templates/throw.html',
        controller: 'ThrowCtrl'
//      }
//    }
  })

  .state('message', {
    url: '/message',
//    views: {
//      'tab-message': {
        templateUrl: 'templates/message.html',
        controller: 'MessageCtrl'
//      }
//    }
  })

  .state('settings', {
    url: '/settings',
//    views: {
//      'tab-settings': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingCtrl'
//      }
//    }
  })

  .state('profile', {
    url: '/profile',
//    views: {
//      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
//      }
//    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/landing');
});
