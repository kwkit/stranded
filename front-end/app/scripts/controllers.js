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

.controller('LoginCtrl', function($scope, sessionsApi){
  $scope.loginData = {};
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $scope.session = sessionsApi.createSession($scope.signUpData);
    console.log($scope.session);
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

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
  console.log($stateParams);
});
