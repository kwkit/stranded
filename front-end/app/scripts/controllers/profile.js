'use strict';

angular.module('stranded.controllers')
  .controller('ProfileCtrl', function($scope, $rootScope){
    console.log('Session', $rootScope.session);
    $scope.email = $rootScope.session.email;
  });
