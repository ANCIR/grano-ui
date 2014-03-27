grano.factory('session', ['$http', 'config', function($http, config) {
    var dfd = $http.get(config.API_ROOT + '/sessions');

    return {
        get: dfd.success
    };
}]);
