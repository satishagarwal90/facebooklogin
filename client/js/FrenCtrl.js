angular.module('FrenCtrl', []).controller('FriendController', ['$scope','$http','$routeParams',function($scope, $http, $routeParams) {
  /*$http.get('https://graph.facebook.com/'+$routeParams.friendID+'/picture').success(function(data, status, headers, config) {
      $scope.profilePic = data;
      console.log(data);
  }).error(function(data, status, headers, config) {
      console.log('Error:'+ data);
  });*/
  $scope.image = 'https://graph.facebook.com/'+$routeParams.friendID.substring(1)+'/picture';
  console.log($scope.image);
  $scope.$apply();
}]);