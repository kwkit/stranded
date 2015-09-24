'use strict';

angular.module('stranded.controllers')
  .controller('HomeCtrl', function($scope, localStorageService, $timeout, $ionicModal, sessionsApi, $ionicLoading, $state) {
    $scope.unbind = localStorageService.bind($scope, 'toolBoxAnimated');
    $scope.pageLoaded = false;
    $scope.$watch('$viewContentLoaded', function() {
      $timeout(function (){
        $scope.pageLoaded = true;
      }, 500);

      if (!$scope.toolBoxAnimated) {
        $timeout(function () {
          $scope.toolBoxAnimated = true;
        }, 2100);
      }
    });

    $ionicModal.fromTemplateUrl('help-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.logout = function() {
      $ionicLoading.show();

      sessionsApi.destroySession().$promise.then(
        function () {
          $ionicLoading.hide();
          localStorageService.set('toolBoxAnimated', false);
          $state.go('landing');
        },

        function (error) {
          console.log('Error:', error);
        }
      );
    };
  });
