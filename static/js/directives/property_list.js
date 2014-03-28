grano.directive('gnPropertyList', ['core', '$http', '$sce', '$modal', 'schemata',
    function (core, $http, $sce, $modal, schemata) {
    return {
        restrict: 'E',
        scope: {
            'obj': '=',
            'refresh': '&'
        },
        templateUrl: 'directives/property_list.html',
        link: function (scope, element, attrs, model) {
            scope.attributes = {};
            //scope.obj_type = null;

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
                    scope.refresh(scope.entity.id);
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
                delete scope.entity.properties[attribute.name];
                $http.post(scope.entity.api_url, scope.entity).then(function(res) {
                    scope.entity = res.data;
                });
            };

            scope.$watch('obj', function(o) {
                if (!o || !o.id) return;
                scope.project = o.project;

                if (o.schemata) {
                    //scope.obj_type = 'entity';
                    schemata.attributes(o.project.slug, 'entity').then(function(attributes) {
                        scope.attributes = attributes;
                    });
                } else if (o.schema) {
                    //scope.obj_type = 'relation';
                    schemata.byName(o.project.slug, o.schema.name).then(function(schema) {
                        scope.attributes = {};
                        angular.forEach(schema.attributes, function(attr) {
                            attr.schema = schema;
                            scope.attributes[attr.name] = attr;
                        });
                        //scope.attributes = schema.attributes;
                    });
                }
            });
        }
    };
}]);
