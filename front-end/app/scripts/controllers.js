'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $state, sessionsApi) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.doLogout = function() {
    console.log('Doing logout');
    console.log($rootScope.session);
    sessionsApi.destroySession($rootScope.session).$promise.then(
        function(response){
          console.log(response);
          $state.go('app.landing');
        },
        function(error){
          console.log('Error:', error);
        }
    );
  };
})

.controller('LoginCtrl', function($scope, $rootScope, $state, sessionsApi){
  $scope.loginData = {};
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    sessionsApi.createSession($scope.loginData).$promise.then(
        function(response){
          $rootScope.session = response;
          console.log($scope.session);
          $state.go('app.main');
        },
        function(error){
          console.log('Error:', error);
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
})

.controller('ProfileCtrl', function($scope, $rootScope){
  console.log('Session', $rootScope.session);
  $scope.email = $rootScope.session.email;
});
