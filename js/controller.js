var toFiWeb = angular.module('tofiweb', ['ngCookies']);

toFiWeb.controller('ToDoList', ['$scope', '$http','$location', '$cookies', function($scope, $http, $location ,$cookies ) {
	//CONSTANT
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

	//STATE VARIABLE
	$scope.list = null;
	$scope.error = null;
	var startPath = $location.path().split('/')

	function updateError(status){
		if(status != 200)
        	$scope.error = errorsMsg[status.toString()]
        else
        	$scope.error = null;
	}//end updateError()

	function isStatusError(status){
		return (status != 200)
	}//end isStatusError()

	function retriveListSuccess(data){
		if(!isStatusError(data.status)){
        	$scope.list = data.data;
        	$location.path($scope.list.list_name);
        	$cookies['list_'+$scope.list.list_name] = $http.defaults.headers.common['password'];
        }
        updateError(data.status)
	}//end retriveListSuccess()

	$scope.encrypt = function(value){
		return btoa(value);
	}

	$scope.getList = function(listname, listpass){
		if(listpass != ''){
			$http.defaults.headers.common['password'] = listpass;
		}
		$http.get(restBaseUrl + '/list/'+listname).
		    success(retriveListSuccess);
	}//end getList()

	$scope.addList = function(){
		if($scope.listPasswordQuery != '')
			$http.defaults.headers.common['password'] = btoa($scope.listPasswordQuery);

		$http.defaults.headers.common['Content-Type'] = 'application/json';
		$http.defaults.headers.put['Content-Type'] = 'application/json';

		$http.put(restBaseUrl + '/list/'+$scope.listNameQuery).
		    success(retriveListSuccess);
	}//end addList()	

	$scope.deleteList = function(){
		$http.delete(restBaseUrl + '/list/'+$scope.listName).
		    success(function(data) {
		        $scope.list = null;
		        $scope.listName = null;
		        updateError(data.status)
		        $location.path('');
		    });
	}//end deleteList()

	$scope.addItem = function(){
		$http.put(restBaseUrl + '/list/'+$scope.list.list_name+'/item/'+$scope.itemname).
		    success(function(data) {
		        if(!isStatusError(data.status))
		        	$scope.list = data.data;
		        updateError(data.status)
		    });
		$scope.itemname = null;
	}//end addItem()

	$scope.deleteItem = function(itemName){
		$http.delete(restBaseUrl + '/list/'+$scope.list.list_name+'/item/'+itemName).
		    success(function(data) {
		        if(!isStatusError(data.status))
		        	$scope.list = data.data;
		        updateError(data.status)
		    });
	}//end addItem()
	$scope.removeList = function(){
		delete( $http.defaults.headers.common['password'] )
		$scope.list = null;
		$scope.error = null;
		$location.path('');
	}//$scope.removeList()

	$scope.getVisitedLists = function(){
		var _res = [];
		Object.keys($cookies).forEach(function(key){
			if( key.match(/^list_/) )
				_res.push( key.replace('list_', ''))
		});
		return _res;
	}

	$scope.getVisitedListPass = function(listname){
		return $cookies['list_'+listname]
	}

	//START APP

	if( startPath.length > 1 ){
		var listName = startPath[1];
		var listPass = $cookies['list_'+listName];
		console.log('start listPass: '+listPass)
		if(typeof(listPass) != 'string')
			$scope.listNameQuery = listName;
		else
			$scope.getList(listName, listPass);
		console.log('listPass cookie: '+listPass)
	}

	$scope.getVisitedLists();

}]);//end toFiWeb.controller



