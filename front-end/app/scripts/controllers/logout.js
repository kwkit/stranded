'use strict';

angular.module('stranded.controllers')
  .controller('LogoutCtrl', function ($scope, $rootScope, $state, $ionicLoading, sessionsApi, localStorageService) {
    $scope.doLogout = function () {
      $ionicLoading.show();

      sessionsApi.destroySession().$promise.then(
        function () {
          $ionicLoading.hide();
          $rootScope.session = null;
          localStorageService.set('ToolBoxAnimated', false);
          $state.go('home');
        },

        function (error) {
          console.log('Error:', error);
        }
      );
    };
  });
