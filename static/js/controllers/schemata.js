
function SchemataIndexCtrl($scope, $routeParams, $location, $http, $modal, $timeout, core, session) {
    $scope.navSection = 'schemata';
    $scope.project = {};
    $scope.entity_schemata = [];
    $scope.relation_schemata = [];
    
    $http.get('/api/1/projects/' + $routeParams.slug).then(function(res) {
        $scope.project = res.data;
        core.setTitle($scope.project.label);
    });

    $http.get('/api/1/projects/' + $routeParams.slug + '/schemata', {params: {limit: 1000}}).then(function(res) {
        angular.forEach(res.data.results, function(e) {
            if (e.obj == 'entity') {
                $scope.entity_schemata.push(e);
            } else {
                $scope.relation_schemata.push(e);
            }
        });
    });

}

SchemataIndexCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', '$timeout', 'core', 'session'];


function SchemataViewCtrl($scope, $routeParams, $location, $http, $route, $modal, $timeout, core, session) {
    $scope.navSection = 'schemata';
    $scope.project = {};
    $scope.schema = {};
    
    $http.get('/api/1/projects/' + $routeParams.slug).then(function(res) {
        $scope.project = res.data;
    });

    $http.get('/api/1/projects/' + $routeParams.slug + '/schemata/' + $routeParams.name).then(function(res) {
        $scope.schema = res.data;
        core.setTitle($scope.schema.label);
    });

    $scope.update = function(form) {
        var res = $http.post($scope.schema.api_url, $scope.schema);
        res.success(function(res) {
            $route.reload();
        });
        res.error(grano.handleFormError(form));
    };

    $scope.reset = function() { 
        $route.reload();
    }

}

SchemataViewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$route', '$modal', '$timeout', 'core', 'session'];

