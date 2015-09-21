'use strict';

angular.module('stranded.controllers')
  .controller('SignUpCtrl', function ($scope, $state, $window, $ionicLoading, $ionicPopup, usersApi, localStorageService) {
    $scope.signUpData = {};
    $scope.doSignUp = function () {
      console.log('Doing signup', $scope.signUpData);

      $ionicLoading.show();

      // TODO: Authentication code here
      var user = usersApi.createUser($scope.signUpData).$promise.then(
        function (response) {
          $ionicLoading.hide();

          // Log the user in immediately
          $window.sessionStorage.auth_token = response.auth_token;
          localStorageService.set('toolBoxAnimated', false);
          $ionicPopup.alert({
            title: 'Successfully signed up!'
          }).then(function() {
            $state.go('home');
          });
        },
        function (error) {
          $ionicLoading.hide();
          console.log('Error:', error);
          var errors = 'Email ' + error.data.errors.email +
            ', Password ' + error.data.errors.password +
            ', Password Confirmation ' + error.data.errors.password_confirmation;
          $ionicPopup.alert({
            title: 'Error!',
            template: errors
          });
        }
      );
      console.log(user);
    };
  });
