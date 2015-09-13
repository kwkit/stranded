'use strict';

angular.module('starter')
  .controller('LandingCtrl', function ($scope, $ionicSideMenuDelegate) {
     $ionicSideMenuDelegate.canDragContent(false);
  });
