grano.factory('metadata', ['$http', '$rootScope', '$location', '$q', 'core',
    function($http, $rootScope, $location, $q, core) {

    var project = null,
        schemata = null;

    var reset = function() {
        schemata = null;
        project = null;
        core.setTitle('Welcome');
    };

    var setProject = function(slug) {
        if (!slug) {
          reset();
          $rootScope.$broadcast('setProject', null);
          return;
        }
        if (!project || project.slug != slug) {
            var url = core.call('/projects/' + slug);
            reset();
            project = {'slug': slug};
            $http.get(url).then(function(res) {
                project = res.data;
                core.setTitle(project.label);
                $rootScope.$broadcast('setProject', project);
            });
        }
    };

    var getSchemata = function() {
        var dfd = $q.defer();

        if (!project.slug) {
            console.warn('Cannot load schemata, no project context!');
            dfd.resolve([]);
        }

        if(!schemata) {
            var url = core.call('/projects/' + project.slug + '/schemata');
            schemata = $http.get(url, {params: {limit: 1000, full: true}});
        }
        schemata.then(function(res) {
            dfd.resolve(res.data.results);
        });
        return dfd.promise;
    };

    var getSchema = function(name) {
        var dfd = $q.defer();
        getSchemata().then(function(schemata) {
            angular.forEach(schemata, function(schema) {
                if (schema.name==name) {
                    dfd.resolve(schema);
                }
            });
        });
        return dfd.promise;
    };

    var getAttributes = function(obj) {
        var dfd = $q.defer();
        getSchemata().then(function(schemata) {
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
    };

    return {
        setProject: setProject,
        getSchemata: getSchemata,
        getAttributes: getAttributes,
        getSchema: getSchema,
        getProject: function() { return project; },
        reset: reset
    };
}]);
