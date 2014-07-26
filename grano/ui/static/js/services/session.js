grano.factory('session', ['$http', 'core', function($http, core) {
    var dfd = $http.get(core.call('/sessions'));

    return {
        get: dfd.success
    };
}]);
