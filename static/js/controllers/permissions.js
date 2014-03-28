
function PermissionsIndexCtrl($scope, $routeParams, $location, $http, $modal, $q, $timeout, core, session) {
    $scope.url = core.call('/projects/'+$routeParams.slug+'/permissions');
    $scope.navSection = 'permissions';
    $scope.permissions = {};
    $scope.newPermission = {'reader': true};
    
    $http.get(core.call('/projects/' + $routeParams.slug)).then(function(res) {
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
        res.then(function(res) {
            permission.reader = res.data.reader;
            permission.editor = res.data.editor;
            permission.admin = res.data.admin;
        });
    };

    $scope.sanify = function() {
        if ($scope.newPermission.admin) $scope.newPermission.editor = true;
        if ($scope.newPermission.editor) $scope.newPermission.reader = true;
    };

    $scope.create = function() {
        var url = core.call('/projects/' + $routeParams.slug + '/permissions'),
            res = $http.post(url, $scope.newPermission);

        res.then(function(res) {
            $scope.loadPermissions($scope.url);
            $scope.newPermission = {'reader': true};
        });
    };

    $scope.loadAccounts = function(query) {
        var res = $http.get(core.call('/accounts/_suggest'), {params: {q: query}});
        return res.then(function(res) {
            return res.data.results;
        });
    };

    $scope.loadPermissions($scope.url);
}

PermissionsIndexCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', '$q', '$timeout', 'core', 'session'];
