'use strict';

angular.module('starter')
  .controller('LoginCtrl', function ($scope, $rootScope, $state, sessionsApi) {
    $scope.loginData = {};
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      sessionsApi.createSession($scope.loginData).$promise.then(
        function (response) {
          $rootScope.session = response;
          console.log($scope.session);
          $state.go('home');
        },
        function (error) {
          console.log('Error:', error);
        }
      );
    };
  });
