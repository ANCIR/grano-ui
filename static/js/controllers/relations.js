
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
        var d = $modal.open({
            templateUrl: 'relations/delete.html',
            controller: 'RelationsDeleteCtrl',
            resolve: {
                relation: function () { return $scope.relation; }
            }
        });
    };

    $scope.reloadRelation($routeParams.id);
    
}

RelationsViewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', 'core', 'session'];


function RelationsDeleteCtrl($scope, $routeParams, $location, $http, $route, $modal, $modalInstance, session, relation) {
    $scope.relation = relation;

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function() {
        var url = '/p/' + $scope.relation.project.slug;
        var res = $http.delete($scope.relation.api_url);
        res.error(function(data) {
            $modalInstance.dismiss('ok');
            $location.path(url);
        });
    };
}

RelationsDeleteCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$route', '$modal', '$modalInstance', 'session', 'relation'];
