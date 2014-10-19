var config = {
    "APP_NAME": "{{app_name}}",
    "APP_VERSION": "{{app_version}}",
    "UI_ROOT": "{{ui_root}}",
    "STATIC_ROOT": "{{static_root}}",
    "API_ROOT": "{{api_root}}",
    "PLUGINS": {{plugins}},
    "DATA_TYPES": {{data_types}},
    "SCHEMA_OBJS": {{schema_objs}}
};

angular.module('grano.config', [])
    .constant('config',config);
