
function ImportIndexCtrl($scope, $rootScope, $routeParams, $location, $http,
    $modal, $interval, core, session) {

    var pipelinesUrl = core.call('/pipelines'),
        pipelinesParams = {
            'project': $routeParams.slug,
            'operation': 'import',
            'limit': 10
        };

    $scope.loadProject($routeParams.slug);
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
    $modal, $timeout, core, metadata) {

    $scope.loadProject($routeParams.slug);
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
            'relationSchema': $scope.relationSchema,
            'sourceSchema': $scope.sourceSchema,
            'targetSchema': $scope.targetSchema,
            'entitySchema': $scope.entitySchema
        });
        $location.path('/p/' + $scope.project.slug + '/import/mapping');
    };

    $scope.canRelationsMode = function() {
        return $scope.relationSchemaOptions.length > 0;
    };

    metadata.getSchemata().then(function(schemata) {
        var entitySchemata = [], relationSchemata = [];

        angular.forEach(schemata, function(s) {
            if (!s.hidden) {
                if (s.obj=='relation') {
                    relationSchemata.push(s);
                } else {
                    entitySchemata.push(s);
                }
            }
        });
        $scope.relationSchemaOptions = relationSchemata;
        $scope.entitySchemaOptions = entitySchemata;
        var search = $location.search();
        $scope.relationSchema = search.relationSchema || relationSchemata[0].name;
        $scope.sourceSchema = $location.search().sourceSchema || entitySchemata[0].name;
        $scope.targetSchema = $location.search().targetSchema || entitySchemata[0].name;
        $scope.entitySchema = $location.search().entitySchema || entitySchemata[0].name;
    });

    var url = core.call('/files/' + $location.search().file + '/_table?limit=0');
    var res = $http.get(url).then(function(data) {
        $scope.validData = !data.data.status || data.data.status!='error';
    });
}

ImportModesCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', '$http',
    '$modal', '$timeout', 'core', 'metadata'];


function ImportMappingCtrl($scope, $rootScope, $routeParams, $location, $http,
    $modal, $timeout, $filter, $q, core, metadata) {
    $scope.loadProject($routeParams.slug);

    $scope.truncate = $filter('truncate');

    var relationAttributes = [],
        entityAttributes = [],
        sourceAttributes = [],
        targetAttributes = [],
        selectBase = [{name: '', label: "Don't import"},
                      {name: '_source_url', label: "Source URL (for this data)"}];

    $scope.mode = $location.search().mode;
    $scope.editMode = $scope.mode == 'relations' ? 'object' : 'attribute';
    $scope.request = {source_url: null};
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
        $scope.request.mode = $scope.mode;
        $scope.request.relation_schema = $location.search().relationSchema;
        $scope.request.source_schema = $location.search().sourceSchema;
        $scope.request.target_schema = $location.search().targetSchema;
        $scope.request.entity_schema = $location.search().entitySchema;
        $scope.request.file = $location.search().file
        $scope.request.mapping = {}
        angular.forEach($scope.mapping, function(v, k) {
            if (v.attribute.length > 0) {
                $scope.request.mapping[k] = v;
            }
        });
        var url = core.call('/projects/' + $scope.project.slug + '/_import');
        var res = $http.post(url, $scope.request);
        res.then(function(data) {
            $location.path('/p/' + $scope.project.slug + '/import');
            $location.search({});
        });
    };

    $scope.attributeChoices = function(header) {
        if ($scope.mode=='aliases') {
            var options = [
                {name: 'alias', label: 'Alternate name'},
                {name: 'canonical', label: 'Preferred name'}
            ]
            return selectBase.concat(options);
        } else if ( $scope.mode == 'entities' ) {
            return selectBase.concat(entityAttributes);
        } else if ( $scope.mapping[header].object != 'source' ) {
            return selectBase.concat(sourceAttributes);
        } else if ( $scope.mapping[header].object != 'target' ) {
            return selectBase.concat(targetAttributes);
        }
        return selectBase.concat(relationAttributes);
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
        var search = $location.search();
        metadata.getSchemata().then(function(schemata) {
            angular.forEach(schemata, function(s) {
                var attrs = s.attributes.sort(attributeSorter);
                if (s.name == search.entitySchema) {
                    entityAttributes = attrs;
                }
                if (s.name == search.sourceSchema) {
                    sourceAttributes = attrs;
                }
                if (s.name == search.targetSchema) {
                    targetAttributes = attrs;
                }
                if (s.name == search.relationSchema) {
                    relationAttributes = attrs;
                }
            });
        });
    };

    init();
}

ImportMappingCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', '$http',
    '$modal', '$timeout', '$filter', '$q', 'core', 'metadata'];
