function HomeCtrl($scope, $location, $http, $modal, core) {
    $scope.projects = {};
    $scope.loadProject(null);

    $scope.loadProjects = function(url) {
        $http.get(url).then(function(data) {
            $scope.projects = data.data;
        });
    };

    $scope.loadProjects(core.call('/projects'));

    $scope.newProject = function(){
        var d = $modal.open({
            templateUrl: 'projects/new.html',
            controller: 'ProjectsNewCtrl',
            backdrop: false
        });
    };
}

HomeCtrl.$inject = ['$scope', '$location', '$http', '$modal', 'core'];
