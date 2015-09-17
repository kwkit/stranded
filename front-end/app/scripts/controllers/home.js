'use strict';

angular.module('stranded.controllers')
  .controller('HomeCtrl', function($scope, $rootScope, bottlesApi){
    console.log($rootScope.session);
    bottlesApi.fishBottle($rootScope.session.auth_token).$promise.then(
      function (response) {
        console.log(response);
      },
      function (error) {
        console.log('Error:', error);
      }
    );
  });
