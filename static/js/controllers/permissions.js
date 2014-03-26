
function PermissionsIndexCtrl($scope, $routeParams, $location, $http, $modal, $timeout, core, session) {
    $scope.url = '/api/1/projects/'+$routeParams.slug+'/permissions';
    $scope.navSection = 'permissions';
    $scope.permissions = {};
    
    $http.get('/api/1/projects/' + $routeParams.slug).then(function(res) {
        $scope.project = res.data;
        core.setTitle($scope.project.label);
    });

    $scope.loadPermissions = function(url) {
        $http.get(url).then(function(res) {
            $scope.url = url;
            $scope.permissions = res.data;
        });
    };

    $scope.save = function(permission) {
        
        if (!permission.reader) permission.editor = false;
        if (!permission.editor) permission.admin = false;
        var res = $http.post(permission.api_url, permission);
    };

    $scope.loadPermissions($scope.url);
}

PermissionsIndexCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', '$timeout', 'core', 'session'];
