
function GraphBrowserCtrl($scope, $routeParams, $location, $http, $modal,
        $timeout, core, session, metadata) {
    $scope.loadProject($routeParams.slug);

    var query = [{
                    'properties': {'name': null},
                    'schemata': [{'name': null}],
                    'relations': [{
                        'reverse': null,
                        'schema': {'name': null},
                        'other': {
                            'schemata': [{'name': null}],
                            'properties': {'name': null}
                        }
                    }]
                }];

    console.log(JSON.stringify(query));
    query = {'query': JSON.stringify(query)};
    var res = $http.get(core.call('/projects/' + $routeParams.slug + '/query'), {'params': query});
    res.then(function(r) {
        //console.log(r.data);
        $scope.$broadcast('queryUpdate', r.data);
    });
}

GraphBrowserCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal',
    '$timeout', 'core', 'session', 'metadata'];
