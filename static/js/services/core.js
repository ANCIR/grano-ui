grano.factory('core', ['$http', '$rootScope', '$location', 'config', function($http, $rootScope, $location, config) {
    var setTitle = function(name) {
        $('title').html(name + ' - ' + config.APP_NAME);
    };

    var call = function(path) {
        return config.API_ROOT + path;
    }

    return {
        setTitle: setTitle,
        call: call
    };
}]);
