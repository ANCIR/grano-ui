
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

        if (!angular.isUndefined($scope.obj.schemata)) {
            $scope.obj.schemata.push(attr.schema.name);
        };

        $scope.obj.properties[attr.name] = $scope.property;

        var res = $http.post($scope.obj.api_url, $scope.obj);
        res.success(function(data) {
            $modalInstance.dismiss('ok');
        });
        res.error(grano.handleFormError(form));
    };

    if (attribute) {
        $scope.property = obj.properties[attribute.name] || {};
        $scope.property.attribute = attribute;
    } else {
        var obj_type = $scope.obj.schema ? 'relation' : 'entity';
        // TODO: for relations, we need to fix the schema here.
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
