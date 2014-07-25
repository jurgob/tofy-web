var toFiWeb = angular.module('tofiweb', []);

toFiWeb.controller('ToDoList', ['$scope', '$http', function($scope, $http ) {
	var restBaseUrl = 'http://tofy.herokuapp.com/api/v1'
	var errorsMsg = {
		"400": "Bad request (wrong syntax).",
		"401": "Unauthorised (wrong password).",
		"404": "Not found (list or item does not exist).",
		"409": "Conflict (adding existing item/list).",
		"412": "Precondition failed (list does not exist when an item is addes).",
		"423": "Locked (trying to delete a list locked by another user [not yet implemented]).",
		"200": "Ok."
	}

	$scope.list = null;
	$scope.listName = null;
	$scope.error = null;

	function updateError(status){
		if(status != 200)
        	$scope.error = errorsMsg[status.toString()]
        else
        	$scope.error = null;
	}//end updateError()

	$scope.getList = function(){
		if($scope.listPasswordQuery != '')
			$http.defaults.headers.common['password'] = btoa($scope.listPasswordQuery);
		$http.get(restBaseUrl + '/list/'+$scope.listNameQuery).
		    success(function(data) {
		        $scope.list = data.data;
		        $scope.listName = $scope.listNameQuery;
		        updateError(data.status)
		    });
	}//end getList()

	$scope.addList = function(){
		if($scope.listPasswordQuery != '')
			$http.defaults.headers.common['password'] = btoa($scope.listPasswordQuery);
		$http.put(restBaseUrl + '/list/'+$scope.listNameQuery).
		    success(function(data) {
		        $scope.list = data.data;
		        $scope.listName = $scope.listNameQuery;
		        updateError(data.status)
		    });
	}//end addList()	

	$scope.deleteList = function(){
		$http.delete(restBaseUrl + '/list/'+$scope.listName).
		    success(function(data) {
		        $scope.list = null;
		        $scope.listName = null;
		        updateError(data.status)
		    });
	}//end deleteList()

	$scope.addItem = function(){
		$http.put(restBaseUrl + '/list/'+$scope.listName+'/item/'+$scope.itemname).
		    success(function(data) {
		        $scope.list = data.data;
		        updateError(data.status)
		    });
	}//end addItem()

	$scope.deleteItem = function(itemName){
		$http.delete(restBaseUrl + '/list/'+$scope.listName+'/item/'+itemName).
		    success(function(data) {
		        $scope.list = data.data;
		        updateError(data.status)
		    });
	}//end addItem()

}]);//end toFiWeb.controller



