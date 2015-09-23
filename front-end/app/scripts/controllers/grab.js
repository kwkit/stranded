'use strict';

angular.module('stranded.controllers')
  .controller('GrabCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, bottlesApi) {
    $scope.newMessageData = {};
    $scope.locationEnable = true;

    $scope.locations = [];
    $scope.paths = [[]]; // this is a hack

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
          console.log($scope.currentBottle);

          if ($scope.currentBottle) {
            $scope.setLocation($scope.locationEnable);
          }

          // map modal
          if ($scope.currentBottle.latitude) {
            $scope.paths.push([
              parseFloat($scope.currentBottle.latitude),
              parseFloat($scope.currentBottle.longitude)
            ]);
            $scope.locations.push($scope.currentBottle.latitude + ', ' + $scope.currentBottle.longitude);
          }

          $scope.currentBottle.messages.forEach(function(message) {
            if (message.latitude) {
              $scope.paths.push([
                parseFloat(message.latitude),
                parseFloat(message.longitude)
              ]);
              $scope.locations.push(message.latitude + ', ' + message.longitude);
            }
          });

          function distanceBetween(lng1, lat1, lng2, lat2) {
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
          }

          $scope.distance = 0;
          for (var i = 2; i < $scope.paths.length - 1; i++) {
            // this is a hack
            var location1 = $scope.paths[i];
            var location2 = $scope.paths[i - 1];
            $scope.distance += distanceBetween(location1[1], location1[0], location2[1], location2[0]);
          }

          console.log($scope.distance);
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
            console.log(response);
          },
          function (error) {
            console.log('Error:', error.errors);
          }
        );
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

    $scope.starMessage = function (message) {
      console.log(message);
      if(!message.starred) {
        $ionicLoading.show();
        bottlesApi.starMessage(message.id).$promise.then(
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
      }
    };

    $scope.starBottle = function (bottle) {
      console.log(bottle);
      if(!bottle.starred) {
        $ionicLoading.show();
        bottlesApi.starBottle(bottle.id).$promise.then(
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
      }
    };
  });
