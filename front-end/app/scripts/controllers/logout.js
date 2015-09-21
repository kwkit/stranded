'use strict';

angular.module('stranded.controllers')
  .controller('LogoutCtrl', function ($scope, $state, $ionicLoading, sessionsApi, localStorageService) {
    $scope.doLogout = function () {
      $ionicLoading.show();

      sessionsApi.destroySession().$promise.then(
        function () {
          $ionicLoading.hide();
          localStorageService.set('toolBoxAnimated', false);
          $state.go('home');
        },

        function (error) {
          console.log('Error:', error);
        }
      );
    };
  });
