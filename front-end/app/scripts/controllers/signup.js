'use strict';

angular.module('stranded.controllers')
  .controller('SignUpCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, usersApi) {
    $scope.signUpData = {};
    $scope.doSignUp = function () {
      console.log('Doing signup', $scope.signUpData);

      $ionicLoading.show();

      // TODO: Authentication code here
      var user = usersApi.createUser($scope.signUpData).$promise.then(
        function (response) {
          console.log(response);
          $ionicLoading.hide();

          $ionicPopup.alert({
            title: 'Successfully signed up!',
            template: 'Please proceed to log in.'
          }).then(function() {
            $state.go('login');
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
