
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
                if (e.name != 'base') {
                    $scope.entity_schemata.push(e);    
                }
            } else {
                $scope.relation_schemata.push(e);
            }
        });
    });

}

SchemataIndexCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', '$timeout', 'core', 'session'];


function SchemataViewCtrl($scope, $routeParams, $location, $http, $route, $modal, $timeout, schemata, core, session) {
    $scope.navSection = 'schemata';
    $scope.project = {};
    $scope.schema = {};

    $scope.newAttributeBase = {fresh: true, datatype: 'string'};
    $scope.newAttribute = angular.copy($scope.newAttributeBase);
    
    $http.get('/api/1/projects/' + $routeParams.slug).then(function(res) {
        $scope.project = res.data;
    });

    if ($routeParams.name) {
        $http.get('/api/1/projects/' + $routeParams.slug + '/schemata/' + $routeParams.name).then(function(res) {
            $scope.schema = res.data;
            core.setTitle($scope.schema.label);
        });    
    } else {
        $scope.schema = {
            obj: $routeParams.obj,
            attributes: [],
            fresh: true,
            api_url: '/api/1/projects/' + $routeParams.slug + '/schemata'
        };
        core.setTitle("New Schema");
    }
    

    $scope.addAttribute = function() {
        $scope.schema.attributes.push($scope.newAttribute);
        $scope.newAttribute = angular.copy($scope.newAttributeBase);
    };

    $scope.removeAttribute = function(attribute) {
        var index = $scope.schema.attributes.indexOf(attribute);
        if (index > -1) {
            $scope.schema.attributes.splice(index, 1);
        }
    };

    $scope.update = function(form) {
        var res = $http.post($scope.schema.api_url, $scope.schema);
        res.success(function(res) {
            schemata.reset();
            if ($scope.schema.fresh) {
                $location.path('/p/' + $routeParams.slug + '/schemata/' + res.name);
            } else {
                $route.reload();
            }
        });
        res.error(grano.handleFormError(form));
    };

    $scope.reset = function() { 
        $route.reload();
    }

    $scope.deleteSchema = function() {
        var d = $modal.open({
            templateUrl: 'schemata/delete.html',
            controller: 'SchemataDeleteCtrl',
            backdrop: false,
            resolve: {
                schema: function () { return $scope.schema; }
            }
        });
    }

}

SchemataViewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$route', '$modal', '$timeout', 'schemata', 'core', 'session'];


function SchemataDeleteCtrl($scope, $location, $modalInstance, $http, session, schema) {
    $scope.schema = schema;
    
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function() {
        var res = $http.delete($scope.schema.api_url);
        res.error(function(data) {
            $modalInstance.dismiss('ok');
            $location.path('/p/' + $scope.schema.project.slug + '/schemata');
        });
    };
    
}

SchemataDeleteCtrl.$inject = ['$scope', '$location', '$modalInstance', '$http', 'session', 'schema'];


