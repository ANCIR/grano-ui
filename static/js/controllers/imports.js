
function ImportIndexCtrl($scope, $rootScope, $routeParams, $location, $http,
    $modal, $interval, core, session) {

    var pipelinesUrl = core.call('/pipelines'),
        pipelinesParams = {
            'project': $routeParams.slug,
            'operation': 'import',
            'limit': 10
        };

    $scope.loadProject($routeParams.slug);
    $scope.setSection('import');
    $scope.pipelines = {};


    $scope.loadPipelines = function(url) {
        pipelinesUrl = url;
        $http.get(url, {params: pipelinesParams}).then(function(data) {
            $scope.pipelines = data.data;
        });
    };
    $scope.loadPipelines(pipelinesUrl);

    $scope.uploadFile = function() {
        var d = $modal.open({
            templateUrl: 'imports/upload.html',
            controller: 'ImportUploadCtrl',
            resolve: {
                project: function() { return $scope.project; }
            }
        });
    };
}

ImportIndexCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', '$http',
    '$modal', '$interval', 'core', 'session'];


function ImportUploadCtrl($scope, $rootScope, $routeParams, $location, $http,
    $modalInstance, $timeout, $upload, core, project) {
    $scope.file = null;
    $scope.uploadProgress = null;
    
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.upload = function() {
        $scope.uploadProgress = 1;
        $scope.upload = $upload.upload({
            url: core.call('/files'),
            data: {project: project.slug},
            file: $scope.file,
        }).progress(function(evt) {
            $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function(data, status, headers, config) {
            $modalInstance.dismiss('ok');
            $location.search({'file': data.id});
            $location.path('/p/' + project.slug + '/import/modes');
            $scope.uploadProgress = null;
        });
    };

    $scope.onFileSelect = function($files) {
        if ($files.length > 0) {
            $scope.file = $files[0];
        };
    };
}

ImportUploadCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', '$http',
    '$modalInstance', '$timeout', '$upload', 'core', 'project'];


function ImportModesCtrl($scope, $rootScope, $routeParams, $location, $http,
    $modal, $timeout, core, schemata) {

    $scope.loadProject($routeParams.slug);
    $scope.setSection('import');
    $scope.validFile = true;
    $scope.relationSchema = null;
    $scope.relationSchemaOptions = [];

    $scope.data = {mode: $location.search().mode};

    $scope.uploadFile = function() {
        var d = $modal.open({
            templateUrl: 'imports/upload.html',
            controller: 'ImportUploadCtrl',
            resolve: {
                project: function() { return $scope.project; }
            }
        });
    };

    $scope.defineMapping = function() {
        $location.search({
            'file': $location.search().file,
            'mode': $scope.data.mode,
            'schema': $scope.relationSchema
        });
        $location.path('/p/' + $scope.project.slug + '/import/mapping');
    };


    schemata.get($routeParams.slug).then(function(schemata) {
        angular.forEach(schemata, function(s) {
            if (s.obj=='relation') {
                $scope.relationSchemaOptions.push(s);
            }
        });
        $scope.relationSchema = $scope.relationSchemaOptions[0].name;
        if ($location.search().schema) {
            $scope.relationSchema = $location.search().schema;
        }
    });

    var url = core.call('/files/' + $location.search().file + '/_table?limit=0');
    var res = $http.get(url).then(function(data) {
        $scope.validData = !data.data.status || data.data.status!='error';
    });
}

ImportModesCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', '$http',
    '$modal', '$timeout', 'core', 'schemata'];


function ImportMappingCtrl($scope, $rootScope, $routeParams, $location, $http,
    $modal, $timeout, $filter, $q, core, schemata) {
    $scope.loadProject($routeParams.slug);
    $scope.setSection('import');

    $scope.truncate = $filter('truncate');

    var relationAttributes = [],
        entityAttributes = [];

    $scope.mode = $location.search().mode;
    $scope.editMode = $scope.mode == 'relations' ? 'object' : 'attribute';
    $scope.mapping = {};
    
    var url = core.call('/files/' + $location.search().file + '/_table?limit=3');
    var res = $http.get(url).then(function(data) {
        $scope.sampleData = data.data;
        angular.forEach($scope.sampleData.headers, function(header) {
            $scope.mapping[header] = {'attribute': '', 'object': ''};
        });
    });

    $scope.defineMapping = function() {
        $location.path('/p/' + $scope.project.slug + '/import/modes');
    };

    $scope.beginImport = function() {
        var request = {
            'mode': $scope.mode,
            'relation_schema': $location.search().schema,
            'file': $location.search().file,
            'mapping': {}
        };
        angular.forEach($scope.mapping, function(v, k) {
            if (v.attribute.length > 0) {
                request.mapping[k] = v;
            }
        });
        var res = $http.post(core.call('/projects/' + $scope.project.slug + '/_import'), request);
        res.then(function(data) {
            $location.path('/p/' + $scope.project.slug + '/import');
        });
    };

    $scope.attributeChoices = function(header) {
        if ($scope.mode=='aliases') {
            return [
                {name: '', label: "Don't import"},
                {name: 'alias', label: 'Alternate name'},
                {name: 'canonical', label: 'Preferred name'}
            ];
        } else if ($scope.mode=='entities' ||
            $scope.mapping[header].object!='relation') {
            return entityAttributes;
        }
        return relationAttributes;
    };

    $scope.validateObjects = function() {
        var source = false, target = false;
        angular.forEach($scope.mapping, function(v) {
            if (v.object=='source') source = true;
            if (v.object=='target') target = true;
        });
        return source && target;
    };

    $scope.validateAttributes = function() {
        var required = [{o: '', a: 'alias'}, {o: '', a: 'canonical'}];
        if ($scope.mode == 'entities') {
            required = [{o: '', a: 'name'}];
        } else if ($scope.mode == 'relations') {
            required = [{o: 'source', a: 'name'}, {o: 'target', a: 'name'}];
        }
        var matches = 0;
        angular.forEach($scope.mapping, function(v) {
            angular.forEach(required, function(r) {
                if (v.attribute == r.a && v.object == r.o) matches++;
            });
        });
        return matches == required.length;
    };

    var init = function() {
        schemata.attributes($routeParams.slug, 'entity').then(function(attributes) {
            entityAttributes = [{name: '', label: "Don't import"}];
            angular.forEach(attributes, function(a) {
                a.label = $scope.truncate(a.label, 20);
                entityAttributes.push(a);
            });
        });

        schemata.attributes($routeParams.slug, 'relation').then(function(attributes) {
            relationAttributes = [{name: '', label: "Don't import"}];
            angular.forEach(attributes, function(a) {
                if (a.schema.name==$location.search().schema) {
                    a.label = $scope.truncate(a.label, 20);
                    relationAttributes.push(a);    
                }
            });
        });
    };

    init();
}

ImportMappingCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', '$http',
    '$modal', '$timeout', '$filter', '$q', 'core', 'schemata'];
