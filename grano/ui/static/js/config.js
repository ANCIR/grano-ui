var config = {
    'APP_NAME': "{{app_name}}",
    'APP_VERSION': "{{app_version}}",
    'UI_ROOT': "{{ui_root}}",
    'API_ROOT': "{{api_root}}",
    'DATA_TYPES': {{data_types}},
    'SCHEMA_OBJS': {{schema_objs}}
};

angular.module('grano.config', [])
    .constant('config',config);
