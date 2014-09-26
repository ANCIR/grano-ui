grano.directive('gnPropertyList', ['core', '$http', '$sce', '$modal', 'metadata',
    function (core, $http, $sce, $modal, metadata) {
    return {
        restrict: 'E',
        scope: {
            'obj': '=',
            'refresh': '&'
        },
        templateUrl: 'directives/property_list.html',
        link: function (scope, element, attrs, model) {
            scope.attributes = {};
            
            scope.getProperties = function() {
                var properties = [];
                angular.forEach(scope.obj.properties, function(p, k) {
                    p.name = k;
                    properties.push(p);
                });
                return properties.sort(function(a, b) {
                    if (a.name == 'name') return -1; 
                    if (b.name == 'name') return 1;
                    if (a.name > b.name) return 1;
                    if (a.name < b.name) return -1;
                    return 0;
                });
            }

            scope.editProperty = function(attribute) {
                var d = $modal.open({
                    templateUrl: 'properties/edit.html',
                    controller: 'PropertiesEditCtrl',
                    //backdrop: false,
                    resolve: {
                        obj: function () { return scope.obj; },
                        attribute: function () { return attribute; }
                    }
                });
                d.result.finally(function() {
                    scope.refresh({id: scope.obj.id});
                });
            };

            scope.canDisable = function(attribute) {
                if (scope.obj && scope.obj.schemata &&
                    attribute && attribute.name == 'name') {
                    return false;
                }
                return true;
            };

            scope.canCreate = function() {
                return _.keys(scope.attributes).length > _.keys(scope.obj.properties).length;
            };

            scope.disableProperty = function(attribute) {
                delete scope.obj.properties[attribute.name];
                $http.post(scope.obj.api_url, scope.obj).then(function(res) {
                    scope.obj = res.data;
                });
            };

            scope.$watch('obj', function(o) {
                if (!o || !o.id) return;
                scope.project = o.project;

                metadata.getSchema(o.schema.name).then(function(schema) {
                    scope.attributes = {};
                    angular.forEach(schema.attributes, function(attr) {
                        attr.schema = schema;
                        scope.attributes[attr.name] = attr;
                    });
                });

            });
        }
    };
}]);
