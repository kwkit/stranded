'use strict';

angular.module('stranded.controllers')
  .controller('SignUpCtrl', function ($scope, $state, $window, $ionicLoading, $ionicPopup, session, usersApi, localStorageService) {
    $scope.signUpData = {};
    $scope.doSignUp = function (signUpForm) {
      console.log('Doing signup', $scope.signUpData);

      if (signUpForm.$valid) {
        $ionicLoading.show();
        usersApi.createUser($scope.signUpData).$promise.then(
          function (response) {
            $ionicLoading.hide();
            // Log the user in immediately;
            session.setAuthToken(response.auth_token);
            localStorageService.set('toolBoxAnimated', false);
            $ionicPopup.alert({
              title: 'Successfully signed up!'
            }).then(function () {
              $state.go('home');
            });
          },
          function (error) {
            $ionicLoading.hide();
            console.log('Error:', error);
            var errors = '';
            if (error.data.errors) {
              if (error.data.errors.email) {
                errors += 'Email ' + error.data.errors.email + '\n';
              }
              if (error.data.errors.password) {
                errors += 'Password ' + error.data.errors.password + '\n';
              }
              if (error.data.errors.password_confirmation) {
                errors += 'Password Confirmation  ' + error.data.errors.password_confirmation;
              }
            } else {
              errors = 'A network error occurred'
            }
            $ionicPopup.alert({
              title: 'Error!',
              template: errors
            });
          }
        );
      }
    };
  });
