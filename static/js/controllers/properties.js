
function PropertiesEditCtrl($scope, $location, $modalInstance, $http, $route, schemata, obj, attribute) {
    $scope.obj = obj;
    $scope.property = {fresh: true, attribute: attribute};
    $scope.attributeChoices = [];

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.update = function(form) {
        var attr = $scope.property.attribute;
        delete $scope.property.attribute;
        $scope.obj.properties[attr.name] = $scope.property;

        var res = $http.post($scope.obj.api_url, $scope.obj);
        res.success(function(data) {
            $modalInstance.dismiss('ok');
            $route.reload();
        });
        res.error(grano.handleFormError(form));
    };

    if (attribute) {
        $scope.property = obj.properties[attribute.name] || {};
        $scope.property.attribute = attribute;
    } else {
        var obj_type = $scope.obj.schema ? 'relation' : 'entity';
        schemata.attributes(obj.project.slug, obj_type).then(function(as) {
            angular.forEach(as, function(k, v) {
                if (angular.isUndefined($scope.obj.properties[v])) {
                    $scope.attributeChoices.push(k);
                }
            });
        });
    }
}

PropertiesEditCtrl.$inject = ['$scope', '$location', '$modalInstance', '$http', '$route', 'schemata', 'obj', 'attribute'];
