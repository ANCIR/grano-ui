
function QueryCtrl($scope, $timeout, $routeParams, $http, $q, core, metadata) {
  $scope.loadProject($routeParams.slug);
  $scope.loading = false;

  var queries = {};

  $scope.$on('querySet', function(event, name, query) {
    if (!angular.equals(query, queries[name])) {
      queries[name] = query;
      var params = {'query': angular.toJson(query)};
      $timeout(function() {
        $scope.$broadcast('queryUpdate', name, query);  
      });
      $scope.loading = true;
      var res = $http.get(core.call('/projects/' + $routeParams.slug + '/query'), {'params': params});
      res.then(function(rd) {
        $scope.$broadcast('queryResult', name, rd.data);
        $scope.loading = false;
      });
    }
  });
  
  $scope.$broadcast('querySet', 'root', [{
    'id': null,
    'schemata': null,
    'properties': {'name': null}
  }]);

};

QueryCtrl.$inject = ['$scope', '$timeout', '$routeParams', '$http', '$q', 'core', 'metadata'];
