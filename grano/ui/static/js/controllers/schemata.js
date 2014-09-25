
function SchemataIndexCtrl($scope, $routeParams, $location, $http, $modal, $timeout, core, metadata) {
    $scope.loadProject($routeParams.slug);
    $scope.entity_schemata = [];
    $scope.relation_schemata = [];

    metadata.getSchemata().then(function(schemata) {
        var rs = [], es = [];
        angular.forEach(schemata, function(e) {
            if (e.obj == 'entity') {
                es.push(e);    
            } else {
                rs.push(e);
            }
        });
        $scope.entity_schemata = es;
        $scope.relation_schemata = rs;
    });
}

SchemataIndexCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', '$timeout', 'core', 'metadata'];


function SchemataViewCtrl($scope, $routeParams, $location, $http, $route, $modal, $timeout, metadata, core) {
    $scope.loadProject($routeParams.slug);
    $scope.schema = {};

    $scope.newAttributeBase = {fresh: true, datatype: 'string'};
    $scope.newAttribute = angular.copy($scope.newAttributeBase);

    if ($routeParams.name) {
        $http.get(core.call('/projects/' + $routeParams.slug + '/schemata/' + $routeParams.name)).then(function(res) {
            $scope.schema = res.data;
            core.setTitle($scope.schema.label);
        });    
    } else {
        $scope.schema = {
            obj: $routeParams.obj,
            attributes: [],
            fresh: true,
            api_url: core.call('/projects/' + $routeParams.slug + '/schemata')
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
            metadata.reset();
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
            resolve: {
                schema: function () { return $scope.schema; }
            }
        });
    }

}

SchemataViewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$route', '$modal', '$timeout', 'metadata', 'core'];


function SchemataDeleteCtrl($scope, $location, $modalInstance, $http, metadata, schema) {
    $scope.schema = schema;

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function() {
        var res = $http.delete($scope.schema.api_url);
        res.error(function(data) {
            $modalInstance.dismiss('ok');
            metadata.reset();
            $location.path('/p/' + $scope.schema.project.slug + '/schemata');
        });
    };
}

SchemataDeleteCtrl.$inject = ['$scope', '$location', '$modalInstance', '$http', 'metadata', 'schema'];


