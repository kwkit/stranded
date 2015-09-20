'use strict';

angular.module('stranded.controllers')
  .controller('LoginCtrl', function ($scope, $rootScope, $state, $ionicLoading, sessionsApi, localStorageService) {
    $scope.loginData = {};
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      $ionicLoading.show();

      sessionsApi.createSession($scope.loginData).$promise.then(
        function (response) {
          $ionicLoading.hide();

          $rootScope.session = response;
          localStorageService.set('toolBoxAnimated', false);
          console.log($scope.session);
          $state.go('home');
        },
        function (error) {
          console.log('Error:', error);
        }
      );
    };
  });
