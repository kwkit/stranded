'use strict';

angular.module('starter')
  .controller('SignUpCtrl', function ($scope, usersApi) {
    $scope.signUpData = {};
    $scope.doSignUp = function () {
      console.log('Doing signup', $scope.signUpData);

      // TODO: Authentication code here
      var user = usersApi.createUser($scope.signUpData);
      console.log(user);
    };
  });
