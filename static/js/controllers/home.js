function HomeCtrl($scope, $location, $http, $modal, config) {
    $scope.projects = {};

    $scope.loadProjects = function(url) {
        $http.get(url).then(function(data) {
            $scope.projects = data.data;
        });
    };
    
    $scope.loadProjects(config.API_ROOT + '/projects');

    $scope.newProject = function(){
        var d = $modal.open({
            templateUrl: 'projects/new.html',
            controller: 'ProjectsNewCtrl',
            backdrop: false
        });
    };
}

HomeCtrl.$inject = ['$scope', '$location', '$http', '$modal', 'config'];
