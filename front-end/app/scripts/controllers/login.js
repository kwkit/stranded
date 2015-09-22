'use strict';

angular.module('stranded.controllers')
  .controller('LoginCtrl', function ($scope, $state, $window, $ionicLoading, $ionicPopup, sessionsApi, localStorageService) {
    $scope.loginData = {};
    $scope.doLogin = function (logInForm) {
      console.log('Doing login', $scope.loginData);

      if (logInForm.$valid) {
        $ionicLoading.show();
        sessionsApi.createSession($scope.loginData).$promise.then(
          function (response) {
            $ionicLoading.hide();

            $window.sessionStorage.auth_token = response.auth_token;
            localStorageService.set('toolBoxAnimated', false);
            $state.go('home');
          },
          function (error) {
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'Error!',
              template: error.data.errors
            });
            console.log('Error:', error);
            console.log('Error:', error.data.errors);
          }
        );
      }
    };
  });
