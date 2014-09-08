grano.directive('gnPropertyView', ['core', '$http', '$sce', '$sanitize',
    function (core, $http, $sce, $sanitize) {
    return {
        restrict: 'E',
        scope: {
            'property': '=',
            'attribute': '='
        },
        templateUrl: 'directives/property_view.html',
        link: function (scope, element, attrs, model) {
            scope.display_value = null;
            scope.show = 'short';

            var update = function() {
                if (!scope.attribute) return;
                var value = scope.property ? scope.property.value : '';
                if (scope.attribute.datatype == 'string') {
                    value = $sanitize(value);
                    if (/^https?:\/\/.*/i.test(value)) {
                        name = value.replace(/^https?:\/\//i, '');
                        value = "<a class='auto' href='" + value + "' target='_blank'>" + name + "</a>";
                    } else if (value && value.length > 80) {
                        scope.long_value = value;
                        value = value.substring(0, 90).replace(/<[^>]+>/gm, '');
                    }
                } else if (scope.attribute.datatype == 'float') {
                    value = new Number(value).toFixed(2);
                } else if (scope.attribute.datatype == 'boolean') {
                    var icon = 'fa-square-o';
                    if (value) {
                        icon = 'fa-check-square-o'
                    }
                    value = '<i class="fa ' + icon + '"></i>';
                } else if (scope.attribute.datatype == 'datetime') {
                    value = moment(value).format('LL');
                } else {
                    value = value + ''
                }
                scope.display_value = $sce.trustAsHtml(value);
            }
            scope.$watch('attribute', update);
            scope.$watch('property', update);
        }
    };
}]);
