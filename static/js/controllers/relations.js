
function RelationsViewCtrl($scope, $routeParams, $location, $http, $modal, core, session) {
    $scope.navSection = 'relations';

    $scope.loadProject($routeParams.slug);
    $scope.relation = {};

    $scope.reloadRelation = function(id) {
        $http.get(core.call('/relations/' + id)).then(function(res) {
            $scope.relation = res.data;
            console.log($scope.relation);
            core.setTitle(res.data.schema.label);
        });    
    };

    $scope.reloadRelation($routeParams.id);
    
}

RelationsViewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', 'core', 'session'];
