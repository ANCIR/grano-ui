grano.factory('session', ['$http', '$q', 'core', function($http, $q, core) {
    var dfd = null;

    var reset = function() {
        dfd = null;
    }

    var get = function(cb) {
        if (dfd === null) {
            var dt = new Date();
            var config = {cache: false, params: {'_': dt.getTime()}};
            dfd = $http.get(core.call('/sessions'), config);
        }
        dfd.success(cb);
    };

    return {
        get: get,
        reset: reset
    };
}]);
