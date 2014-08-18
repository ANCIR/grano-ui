import os
from json import dumps

from flask import Blueprint, render_template
from flask import make_response, url_for

from grano.core import app, app_name, app_version
from grano.model.schema import ENTITY_DEFAULT_SCHEMA


UI_PREFIX = app.config.get('UI_PREFIX', '')
STATIC_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__),
                              'static'))

blueprint = Blueprint('ui', __name__, template_folder=STATIC_PATH,
                      static_folder=STATIC_PATH)


def angular_templates():
    partials_dir = os.path.join(STATIC_PATH, 'templates')
    for (root, dirs, files) in os.walk(partials_dir):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            with open(file_path, 'rb') as fh:
                file_name = file_path[len(partials_dir)+1:]
                yield (file_name, fh.read().decode('utf-8'))


@blueprint.route('/')
def index(**kw):
    return render_template('layout.html',
                           angular_templates=angular_templates())


@blueprint.route('/config.js')
def config(**kw):
    api_root = url_for('base_api.status', _external=True)
    res = render_template('js/config.js', ui_root=url_for('ui.index'),
                          data_types=dumps(app.config['DATA_TYPES']),
                          schema_objs=dumps(app.config['SCHEMA_OBJS']),
                          plugins=dumps(app.config['PLUGINS']),
                          entity_default_schema=ENTITY_DEFAULT_SCHEMA,
                          api_root=api_root,
                          app_name=app_name,
                          app_version=app_version)
    res = make_response(res)
    res.headers['Content-Type'] = 'application/javascript'
    return res
