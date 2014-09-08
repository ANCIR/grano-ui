grano.directive('gnPropertyMultiEdit', ['core', '$http', '$sce', function (core, $http, $sce) {
    return {
        restrict: 'E',
        scope: {
            'obj': '=',
            'attributes': '='
        },
        templateUrl: 'directives/property_multiedit.html',
        link: function (scope, element, attrs, model) {
            scope.newProperty = {ready: false, value: null};
            
            scope.$watch('attributes', function() {
                if (!scope.newProperty.attribute) {
                    scope.newProperty.attribute = scope.attributeChoices()[0];    
                }
            });

            scope.$on('save', function(e) {
                if (scope.newProperty.value) {
                    scope.addProperty();
                }
            });

            scope.addProperty = function() {
                prop = scope.newProperty;
                prop.name = prop.attribute.name;
                scope.obj.properties[prop.name] = prop;
                scope.newProperty = {
                    attribute: scope.attributeChoices()[0],
                    ready: false
                };
            };

            scope.changeAttribute = function() {
                scope.newProperty.value = null;
            };

            scope.removeProperty = function(property) {
                delete scope.obj.properties[property.name];
            };

            scope.hasAttributes = function() {
                return scope.attributeChoices().length > 0;
            };

            scope.canRemoveProperty = function(property) {
                return property.name != 'name';
            }
            
            scope.attributeChoices = function() {
                var attributes = [];
                angular.forEach(scope.attributes, function(a, n) {
                    if (_.keys(scope.obj.properties).indexOf(n) == -1) {
                        attributes.push(a);
                    }
                });
                return attributes;
            };
        }
    };
}]);
