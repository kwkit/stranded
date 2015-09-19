'use strict';

angular.module('stranded.controllers')
  .controller('LandingCtrl', function ($scope, $interval) {
    $scope.slogans = [
      'What if you were stranded on an island?',
      'What if your only means of communication was sending messages in a bottle to strangers?',
      'Log in and experience a whole new type of anonymous messaging!'
    ];

    let i = 0;
    $scope.slogan = $scope.slogans[0];
    $interval(function () {
      i = (++ i) % 3;
      $scope.slogan = $scope.slogans[i];
    }, 3000);

  });
