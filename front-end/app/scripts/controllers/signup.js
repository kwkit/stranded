'use strict';

angular.module('stranded.controllers')
  .controller('SignUpCtrl', function ($scope, $state, $ionicPopup, usersApi) {
    $scope.signUpData = {};
    $scope.doSignUp = function () {
      console.log('Doing signup', $scope.signUpData);

      // TODO: Authentication code here
      var user = usersApi.createUser($scope.signUpData).$promise.then(
        function (response) {
          console.log(response);
          var alertPopup = $ionicPopup.alert({
            title: 'Successfully signed up!',
            template: 'Please proceed to log in.'
          });
          alertPopup.then(function() {
            $state.go('login');
          });
        },
        function (error) {
          console.log('Error:', error);
        }
      );
      console.log(user);
    };
  });
