grano.factory('schemata', ['$http', '$rootScope', '$location', '$q', 'core',
    function($http, $rootScope, $location, $q, core) {

    var schemata = {};

    var reset = function(slug) {
        schemata[slug] = null;
    }

    var get = function(slug) {
        var dfd = $q.defer();

        if(schemata[slug]) {
            dfd.resolve(schemata[slug]); 
        } else {
            var url = core.call('/projects/' + slug + '/schemata');
            $http.get(url, {params: {limit: 1000, full: true}}).then(function(res) {
                schemata[slug] = res.data.results;
                dfd.resolve(schemata[slug]);
            })
        }
        return dfd.promise;
    }

    var attributes = function(slug, obj) {
        var dfd = $q.defer();
        get(slug).then(function(schemata) {
            var attributes = {};
            angular.forEach(schemata, function(s) {
                if (!obj || s.obj == obj) {
                    angular.forEach(s.attributes, function(a) {
                        a.schema = s;
                        attributes[a.name] = a;
                    });
                }
            });
            dfd.resolve(attributes);
        });
        return dfd.promise;
    }

    return {
        get: get,
        reset: reset,
        attributes: attributes
    };
}]);
