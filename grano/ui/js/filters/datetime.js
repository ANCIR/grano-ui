grano.filter('datetime', ['$sanitize', '$sce', function($sanitize, $sce) {
    return function(input) {
        if (!input) return '-';
        return moment(input).format('LLL');
    };
}]);
