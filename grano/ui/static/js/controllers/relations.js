
function RelationsViewCtrl($scope, $routeParams, $location, $http, $modal, core) {
    $scope.navSection = 'relations';

    $scope.loadProject($routeParams.slug);
    $scope.relation = {};

    $scope.reloadRelation = function(id) {
        $http.get(core.call('/relations/' + id)).then(function(res) {
            $scope.relation = res.data;
            core.setTitle(res.data.schema.label);
        });
    };

    $scope.reloadRelation($routeParams.id);
}

RelationsViewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', 'core'];


function RelationsEditCtrl($scope, $routeParams, $location, $http, $modal, core, metadata) {
    $scope.loadProject($routeParams.slug);
    $scope.schemata = [];
    $scope.schemaAttributes = [];
    $scope.isNew = !$routeParams.id;
    $scope.relation = {
        project: $routeParams.slug,
        properties: {}
    };

    $scope.save = function(form) {
        var data = $scope.relation;
        data.schema = data.schema.name;
        var url = core.call('/relations');
        if (!$scope.isNew) {
            url = $scope.relation.api_url;
        }
        var res = $http.post(url, data);
        res.success(function(data) {
            $location.path('/p/' + $scope.project.slug + '/relations/' + data.id);
        });
        res.error(grano.handleFormError(form));
    };

    $scope.canSave = function() {
        return $scope.relation.source && $scope.relation.source.id &&
               $scope.relation.target && $scope.relation.target.id;
    };

    $scope.$watch('relation.schema', function(s) {
        if (!s) return;
        var attributes = [];
        for (var i in s.attributes) {
            var attr = s.attributes[i];
            if (!attr.hidden) {
                attributes.push(attr);
            }
        }
        $scope.schemaAttributes = attributes.sort(attributeSorter);
    });

    metadata.getSchemata().then(function(ss) {
        var schemata = [];
        angular.forEach(ss, function(schema) {
            if (schema.obj == 'relation' && !schema.hidden) {
                schemata.push(schema);
            }
        })
        $scope.schemata = schemata;
        $scope.relation.schema = schemata[0];

        if (!$scope.isNew) {
            var res = $http.get(core.call('/relations/' + $routeParams.id));
            res.success(function(data) {
                var schema = null;
                for (var i in $scope.schemata) {
                    var schema = $scope.schemata[i];
                    if ($scope.schemata[i].name == data.schema.name) {
                        data.schema = $scope.schemata[i];
                    }
                }

                $scope.relation = data;
            });
        }
    });

    var query = $location.search();
    if (query.source) {
        var res = $http.get(core.call('/entities/' + query.source));
        res.success(function(data) {
            $scope.relation.source = data;
        });
    }
    if (query.target) {
        var res = $http.get(core.call('/entities/' + query.target));
        res.success(function(data) {
            $scope.relation.target = data;
        });
    }
}

RelationsEditCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', 'core', 'metadata'];


function RelationsDeleteCtrl($scope, $routeParams, $location, $http, $route, $modal, $modalInstance, relation) {
    $scope.relation = relation;

    $scope.cancel = function() {
        $modalInstance.close('cancel');
    };

    $scope.delete = function() {
        var url = '/p/' + $scope.relation.project.slug;
        var res = $http.delete($scope.relation.api_url);
        res.error(function(data) {
            $modalInstance.close('ok');
        });
    };
}

RelationsDeleteCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$route', '$modal', '$modalInstance', 'relation'];
