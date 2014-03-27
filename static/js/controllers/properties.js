
function PropertiesEditCtrl($scope, $location, $modalInstance, $http, $route, session, obj, attribute) {
    $scope.attribute = attribute;
    $scope.obj = obj;

    //console.log(attribute);
    $scope.property = obj.properties[attribute.name];

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.update = function(form) {
        $scope.obj.properties[attribute.name] = $scope.property;
        var res = $http.post($scope.obj.api_url, $scope.obj);
        res.success(function(data) {
            $modalInstance.dismiss('ok');
            $route.reload();
        });
        res.error(grano.handleFormError(form));
    };
    
}

PropertiesEditCtrl.$inject = ['$scope', '$location', '$modalInstance', '$http', '$route', 'session', 'obj', 'attribute'];
