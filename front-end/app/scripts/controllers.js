'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function() {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})

.controller('LoginCtrl', function($scope, $state, sessionsApi){
  $scope.loginData = {};
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    sessionsApi.createSession($scope.loginData).$promise.then(
        function(response){
          $scope.session = response;
          console.log($scope.session);
          $state.go('app.main');
        },
        function(error){
          console.log("Error:");
          console.log(error);
        }
    );
  };
})

.controller('SignUpCtrl', function($scope, usersApi){
  $scope.signUpData = {};
  $scope.doSignUp = function() {
    console.log('Doing signup', $scope.signUpData);

    // TODO: Authentication code here
    var user = usersApi.createUser($scope.signUpData);
    console.log(user);
  };
})

.controller('MainCtrl', function($scope){
  console.log($scope.session);
});
