var config = {
    'APP_NAME': "{{app_name}}",
    'APP_VERSION': "{{app_version}}",
    'UI_ROOT': "{{ui_root}}",
    'API_ROOT': "{{api_root}}"
};

angular.module('grano.config', [])
    .constant('config',config);
