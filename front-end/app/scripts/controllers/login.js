'use strict';

angular.module('stranded.controllers')
  .controller('LoginCtrl', function ($scope, $rootScope, $state, $window, $ionicLoading, $ionicPopup, authService, localStorageService) {
    $scope.loginData = {};
    $scope.doLogin = function (logInForm) {
      console.log('Doing login', $scope.loginData);

      if (logInForm.$valid) {
        $ionicLoading.show();
        authService.logIn($scope.loginData).then(
          function (response) {
            $ionicLoading.hide();
            console.log('login.js response', response);

            localStorageService.set('toolBoxAnimated', false);
            $state.go('home');
          },
          function (error) {
            $ionicLoading.hide();
            console.log('login.js error', error);
            $ionicPopup.alert({
              title: 'Error!',
              template: error.data ? error.data.errors : 'A network error occurred'
            });
            console.log('Error:', error);
          }
        );
      }
    };
  });
