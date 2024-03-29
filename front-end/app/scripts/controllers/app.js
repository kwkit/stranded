'use strict';

angular.module('stranded.controllers', ['ngMessages'])

.controller('AppCtrl', function($scope, $rootScope, $state, sessionsApi) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.doLogout = function() {
    // console.log('Doing logout');
    sessionsApi.destroySession().$promise.then(
        function() {
          // console.log(response);
          $state.go('landing');
        },
        function(error){
          console.log('Error:', error);
        }
    );
  };
});
