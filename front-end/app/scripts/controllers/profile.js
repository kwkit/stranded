'use strict';

angular.module('starter')
  .controller('ProfileCtrl', function($scope, $rootScope){
    console.log('Session', $rootScope.session);
    $scope.email = $rootScope.session.email;
  });
