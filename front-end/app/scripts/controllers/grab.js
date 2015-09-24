'use strict';

angular.module('stranded.controllers')
  .controller('GrabCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, bottlesApi, $anchorScroll, $location) {
    $scope.newMessageData = {};
    $scope.locationEnable = true;

    $scope.distanceBetween = function(lng1, lat1, lng2, lat2) {
      function toRad(number) {
        return number * Math.PI / 180;
      }

      var radius = 6371000; // metres
      var phi1 = toRad(lat1);
      var phi2 = toRad(lat2);
      var deltaPhi = toRad((lat2 - lat1));
      var deltaLamda = toRad((lng2 - lng1));

      var a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLamda / 2) * Math.sin(deltaLamda / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return radius * c;
    };

    $scope.setLocation = function (locationEnable) {
      $scope.locationEnable = locationEnable;
      if ($scope.locationEnable && $scope.currentBottle) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              $scope.newMessageData.latitude = position.coords.latitude;
              $scope.newMessageData.longitude = position.coords.longitude;
            },
            function (error) {
              $scope.$apply(function () {
                $scope.locationEnable = false;
              });
              switch(error.code) {
                case error.PERMISSION_DENIED:
                  console.log('User denied the request for Geolocation.');
                  break;
                case error.POSITION_UNAVAILABLE:
                  console.log('Location information is unavailable.');
                  break;
                case error.TIMEOUT:
                  console.log('The request to get user location timed out.');
                  break;
                case error.UNKNOWN_ERROR:
                  console.log('An unknown error occurred.');
                  break;
              }
            }
          );
        } else {
          console.log('Geolocation is not supported by this browser.');
          $scope.$apply(function () {
            $scope.locationEnable = false;
          });
        }
      } else {
        $scope.newMessageData.latitude = null;
        $scope.newMessageData.longitude = null;
      }
    };
    $scope.getCurrentBottle = function() {
      bottlesApi.getCurrentBottle().$promise.then(
        function (response) {
          $scope.currentBottle = response.bottle ? response.bottle : null;

          if ($scope.currentBottle) {
            $scope.setLocation($scope.locationEnable);
            $scope.getBottleMapData();
          }
        },
        function (error) {
          console.log('Error:', error.errors);
        }
      );
    };

    $scope.getCurrentBottle();

    $scope.grabBottle = function () {
      console.log('grabbing bottle');
      if ($scope.currentBottle) {
        console.log('you already have a bottle, this function shouldn\'t be called');
      } else {
        $ionicLoading.show();
        bottlesApi.fishBottle().$promise.then(
          function (response) {
            $ionicLoading.hide();
            $scope.currentBottle = response.bottle;
            $scope.setLocation($scope.locationEnable);
            $scope.getBottleMapData();
          },
          function (error) {
            console.log('Error:', error.errors);
          }
        );
      }
    };

    $scope.getBottleMapData = function () {
      $scope.currentBottle.locations = [];
      $scope.currentBottle.paths = [[]]; // this is a hack
      
      if ($scope.currentBottle.latitude) {
        $scope.currentBottle.paths.push([
          parseFloat($scope.currentBottle.latitude),
          parseFloat($scope.currentBottle.longitude)
        ]);
        $scope.currentBottle.locations.push($scope.currentBottle.latitude + ', ' + $scope.currentBottle.longitude);
      }

      $scope.currentBottle.messages.forEach(function(message) {
        if (message.latitude) {
          $scope.currentBottle.paths.push([
            parseFloat(message.latitude),
            parseFloat(message.longitude)
          ]);
          $scope.currentBottle.locations.push(message.latitude + ', ' + message.longitude);
        }
      });

      $scope.currentBottle.distance = 0;
      $scope.currentBottle.shouldShowMap = false;

      if($scope.currentBottle.paths.length >= 2) {
        $scope.currentBottle.shouldShowMap = true;
      }

      for (var i = 2; i <= $scope.currentBottle.paths.length - 1; i++) {
        // this is a hack
        var location1 = $scope.currentBottle.paths[i];
        var location2 = $scope.currentBottle.paths[i - 1];
        $scope.currentBottle.distance += $scope.distanceBetween(location1[1], location1[0], location2[1], location2[0]);
      }
    };

    $scope.replyBottle = function (replyBottleForm) {
      console.log('replying bottle');

      if (!$scope.currentBottle) {
        console.log('you don\'t have a bottle to reply, this function shouldn\'t be called');
      } else if (replyBottleForm.$valid) {
        $ionicLoading.show();
        bottlesApi.replyCurrentBottle($scope.newMessageData).$promise.then(
          function (response) {
            console.log(response);
            $ionicLoading.hide();

            $ionicPopup.alert({
              title: 'Reply successful!',
              template: 'Bottle thrown back into the sea.'
            }).then(function() {
              $scope.currentBottle = null;
              $scope.newMessageData = {};
              $state.go('home');
            });
          },
          function (error) {
            console.log('Error:', error.errors);
          }
        );
      }
    };

    $scope.releaseBottle = function () {
      console.log('releasing bottle');

      if (!$scope.currentBottle) {
        console.log('you don\'t have a bottle to release, this function shouldn\'t be called');
      } else {
        $ionicLoading.show();
        bottlesApi.releaseBottle().$promise.then(
          function (response) {
            console.log(response);
            $ionicLoading.hide();

            $ionicPopup.alert({
              title: 'Return successful!',
              template: 'Bottle thrown back into the sea without a new reply.'
            }).then(function() {
              $scope.currentBottle = null;
              $scope.newMessageData = {};
              $state.go('home');
            });
          },
          function (error) {
            console.log('Error:', error.errors);
          }
        );
      }
    };

    $scope.toggleStarMessage = function (message) {
      console.log(message);
      var request;
      $ionicLoading.show();
      if (!message.starred) {
        request = bottlesApi.starMessage(message.id);
      } else {
        request = bottlesApi.unstarMessage(message.id);
      }

      request.$promise.then(
        function (response) {
          $ionicLoading.hide();
          message.stars = response.message.stars;
          message.starred = response.message.starred;
        },
        function (error) {
          $ionicLoading.hide();
          console.log('Error:', error.errors);
        }
      );
    };

    $scope.toggleStarBottle = function (bottle) {
      console.log(bottle);
      var request;
      $ionicLoading.show();
      if (!bottle.starred) {
        request = bottlesApi.starBottle(bottle.id);
      } else {
        request = bottlesApi.unstarBottle(bottle.id);
      }
      request.$promise.then(
        function (response) {
          $ionicLoading.hide();
          bottle.stars = response.bottle.stars;
          bottle.starred = response.bottle.starred;
        },
        function (error) {
          $ionicLoading.hide();
          console.log('Error:', error.errors);
        }
      );
    };

    $scope.goReply = function () {
      $location.hash('reply-form');
      $anchorScroll();
    };
  });
