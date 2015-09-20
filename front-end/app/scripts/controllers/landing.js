'use strict';

angular.module('stranded.controllers')
  .controller('LandingCtrl', function ($scope, $interval, $timeout) {
    $scope.slogans = [
      'What if you were stranded on an island?',
      'What if you can only send messages in a bottle to strangers?',
      'Log in and experience a whole new type of anonymous messaging!'
    ];

    var i = 0;
    $scope.showSlogan = true;
    $scope.slogan = $scope.slogans[0];
    $interval(function () {
      i = (++ i) % 3;
      $scope.showSlogan = false;
      $timeout(function () {
        $scope.slogan = $scope.slogans[i];
        $scope.showSlogan = true;
      }, 500);
    }, 3000);

  });
