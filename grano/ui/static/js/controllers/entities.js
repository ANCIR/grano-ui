
function EntitiesIndexCtrl($scope, $rootScope, $routeParams, $location, $http, $modal, $timeout, core, session) {
    var params = {project: $routeParams.slug, 'limit': 25},
        filterTimeout = null;

    $scope.loadProject($routeParams.slug);
    $scope.query = {value: $location.search().q};
    $scope.project = {};
    $scope.entities = {};
    $scope.previewEntity = null;

    $http.get(core.call('/projects/' + $routeParams.slug)).then(function(res) {
        $scope.project = res.data;
        core.setTitle($scope.project.label);
    });

    $scope.updateFilter = function() {
        if (filterTimeout) {
            $timeout.cancel(filterTimeout);
        }

        filterTimeout = $timeout(function() {
            $location.search('q', $scope.query.value);
            $scope.updateSearch();
        }, 500);
    };

    $scope.updateSearch = function() {
        var fparams = angular.copy(params);
        angular.extend(fparams, $location.search());
        $scope.loadEntities(core.call('/entities'), fparams);
    };

    $rootScope.$on('updateSearch', $scope.updateSearch);

    $scope.loadEntities = function(url, params) {
        $scope.showEntityPreview(null);
        $http.get(url, {params: params}).then(function(res) {
            $scope.entities = res.data;
        });
    };

    $scope.showEntityPreview = function(entity) {
        if (entity && $scope.previewEntity != null && $scope.previewEntity.id == entity.id) {
            $scope.previewEntity = null;
            $location.search('preview', null);
            core.setTitle($scope.project.label);
            return;
        }
        if (entity && $location.search().preview != entity.id) {
            $location.search('preview', entity.id);        
        }
        $scope.previewEntity = entity;
    };

    $scope.uploadFile = function() {
        var d = $modal.open({
            templateUrl: 'imports/upload.html',
            controller: 'ImportUploadCtrl',
            resolve: {
                project: function() { return $scope.project; }
            }
        });
    };

    $scope.updateSearch();

    if ($location.search().preview) {
        $scope.showEntityPreview({'id': $location.search().preview});
    }
}

EntitiesIndexCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', '$http', '$modal', '$timeout', 'core', 'session'];


function EntitiesViewCtrl($scope, $routeParams, $location, $http, $modal, core, session) {
    $scope.loadProject($routeParams.slug);
    $scope.entity = {};

    $scope.reloadEntity = function(id) {
        $http.get(core.call('/entities/' + id)).then(function(res) {
            $scope.entity = res.data;
            core.setTitle(res.data.properties.name.value);
        });    
    };

    $scope.deleteEntity = function() {
        var d = $modal.open({
            templateUrl: 'entities/delete.html',
            controller: 'EntitiesDeleteCtrl',
            resolve: {
                entity: function () { return $scope.entity; }
            }
        });
    };

    $scope.reloadEntity($routeParams.id);
    
}

EntitiesViewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', 'core', 'session'];


function EntitiesEditCtrl($scope, $routeParams, $location, $http, $modal, core, metadata) {
    $scope.loadProject($routeParams.slug);
    $scope.schemata = [];
    $scope.schemaAttributes = [];
    $scope.isNew = !$routeParams.id;
    $scope.entity = {
        project: $routeParams.slug,
        properties: {name: {value: null, datatype: 'string', name: 'name'}}
    };

    $scope.save = function(form) {
        var data = angular.copy($scope.entity);
        data.schema = data.schema.name;
        $scope.$broadcast('save', $scope.entity);
        var url = core.call('/entities');
        if (!$scope.isNew) {
            url = $scope.entity.api_url;
        }
        var res = $http.post(url, data);
        res.success(function(data) {
            $location.path('/p/' + $scope.project.slug + '/entities/' + data.id);
        });
        res.error(grano.handleFormError(form));
    };

    $scope.canSave = function() {
        return $scope.entity.properties.name.value;
    };

    $scope.$watch('entity.schema', function(s) {
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
            if (schema.obj == 'entity' && !schema.hidden) {
                schemata.push(schema);
            }
        })
        $scope.schemata = schemata;
        $scope.entity.schema = schemata[0];

        if (!$scope.isNew) {
            var res = $http.get(core.call('/entities/' + $routeParams.id));
            res.success(function(data) {
                var schema = null;
                for (var i in $scope.schemata) {
                    var schema = $scope.schemata[i];
                    if ($scope.schemata[i].name == data.schema.name) {
                        data.schema = $scope.schemata[i];
                    }
                }

                $scope.entity = data;
            });
        }
    });
}

EntitiesEditCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', 'core', 'metadata'];


function EntitiesDeleteCtrl($scope, $routeParams, $location, $http, $route, $modal, $modalInstance, session, entity) {
    $scope.entity = entity;

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function() {
        var res = $http.delete($scope.entity.api_url);
        res.error(function(data) {
            $modalInstance.dismiss('ok');
            $location.search('preview', null);
            $route.reload();
        });
    };
}

EntitiesDeleteCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$route', '$modal', '$modalInstance', 'session', 'entity'];


function EntitiesMergeCtrl($scope, $routeParams, $location, $http, $route, $modal, $modalInstance, core, orig) {
    $scope.merge = {'orig': orig, 'dest': null};
    $scope.project = orig.project;

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function(form) {
        var res = $http.post(core.call('/entities/_merge'), $scope.merge);
        res.success(function(data) {
            $location.path('/p/' + data.project.slug + '/entities/' + data.id);
            $modalInstance.dismiss('ok');
        });
        res.error(grano.handleFormError(form));
    };
}

EntitiesMergeCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$route', '$modal', '$modalInstance', 'core', 'orig'];
