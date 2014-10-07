angular.module('appRoutes', [])

	.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		.when('/friends/:friendID', {
		    templateUrl:'friendList.html',
			controller:'FriendController'
		})

	$locationProvider.html5Mode(true);

}]);