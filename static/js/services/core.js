grano.factory('core', ['$http', 'config', function($http, config) {
    var setTitle = function(name) {
        $('title').html(name + ' - ' + config.APP_NAME);
    };

    return {
        appName: appName,
        setTitle: setTitle
    };
}]);
