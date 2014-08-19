
function RelationsViewCtrl($scope, $routeParams, $location, $http, $modal, core, session) {
    $scope.navSection = 'relations';

    $scope.loadProject($routeParams.slug);
    $scope.relation = {};

    $scope.reloadRelation = function(id) {
        $http.get(core.call('/relations/' + id)).then(function(res) {
            $scope.relation = res.data;
            core.setTitle(res.data.schema.label);
        });
    };

    $scope.deleteRelation = function() {
        var after = '/p/' + $scope.relation.project.slug + '/entities/' + $scope.relation.source.id;
        var d = $modal.open({
            templateUrl: 'relations/delete.html',
            controller: 'RelationsDeleteCtrl',
            resolve: {
                relation: function () { return $scope.relation; }
            }
        });
        d.result.then(function(result) {
            if (result == 'ok') {
                $location.path(after);
            } 
        });
    };

    $scope.reloadRelation($routeParams.id);
}

RelationsViewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', 'core', 'session'];


function RelationsNewCtrl($scope, $routeParams, $modalInstance, $location, $http, core,
        schemata, project, source, target) {
    $scope.relation = {
        project: project,
        source: angular.copy(source),
        target: angular.copy(target)
    };
    $scope.project = project;
    $scope.source = source;
    $scope.target = target;

    //console.log($scope.relation);

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.create = function(form) {
        var res = $http.post(core.call('/relations'), $scope.relation);
        res.success(function(data) {
            $modalInstance.dismiss('ok');
            $location.path('/p/' + data.project.slug + '/relations/' + data.id);
        });
        res.error(grano.handleFormError(form));
    };

    schemata.get(project.slug).then(function(ss) {
        $scope.schemata = [];
        angular.forEach(ss, function(s) {
            if (s.obj == 'relation') {
                $scope.schemata.push(s);
            }
        });
    });
}

RelationsNewCtrl.$inject = ['$scope', '$routeParams', '$modalInstance', '$location', '$http', 'core',
    'schemata', 'project', 'source', 'target'];


function RelationsDeleteCtrl($scope, $routeParams, $location, $http, $route, $modal, $modalInstance, session, relation) {
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

RelationsDeleteCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$route', '$modal', '$modalInstance', 'session', 'relation'];
