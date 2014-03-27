grano.directive('gnPropView', ['core', '$http', '$sce', 'schemata', function (core, $http, $sce, schemata) {
    return {
        restrict: 'E',
        scope: {
            'property': '=',
            'attribute': '='
        },
        templateUrl: 'directives/propview.html',
        link: function (scope, element, attrs, model) {
            scope.display_value = null;
            var update = function() {
                if (!scope.attribute) return;
                var value = scope.property ? scope.property.value : '';
                if (scope.attribute.datatype == 'string') {
                    if (/https?:\/\/.*/i.test(value)) {
                        name = value.replace(/^https?:\/\/(www\.)?/i, '');
                        value = "<a href='" + value + "' target='_blank'>" + name + "</a>";
                    }
                } else if (scope.attribute.datatype == 'float') {
                        value = value.toFixed(2);
                } else if (scope.attribute.datatype == 'datetime') {
                        value = moment(value).format('LLL');
                }
                scope.display_value = $sce.trustAsHtml(value);
            }
            scope.$watch('attribute', update);
            scope.$watch('property', update);
        }
    };
}]);
