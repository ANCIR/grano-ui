
function QueryCtrl($scope, $timeout, $routeParams, $location, $http, core, metadata) {
  $scope.loadProject($routeParams.slug);
  $scope.loading = false;

  var queries = {},
      defaultQuery = [{
        'id': null,
        'schemata': null,
        'properties': {'name': null}
      }];

  $scope.$on('querySet', function(event, name, query) {
    if (!angular.equals(query, queries[name])) {
      queries[name] = query;
      $location.search('queries', angular.toJson(queries));
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
  
  var search = $location.search();
  console.log(search);
  if (!search.queries) {
    $scope.$broadcast('querySet', 'root', defaultQuery);
  } else {
    var qs = angular.fromJson(search.queries);
    angular.forEach(qs, function(v, k) {
      $scope.$broadcast('querySet', k, v);
    });
  }
};

QueryCtrl.$inject = ['$scope', '$timeout', '$routeParams', '$location', '$http', 'core', 'metadata'];
