grano.filter('truncate', ['$sanitize', '$sce', function($sanitize, $sce) {
    return function(input, len) {
        if (input.length <= len) {
            return input;
        }
        cleaned = $sanitize(input)
        cleaned = cleaned.substring(0, len) + '…';
        //cleaned = '<span tooltip="' + input + '">' + cleaned + '</span>';
        return $sce.trustAsHtml(cleaned);
    };
}]);
