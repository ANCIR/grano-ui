import os
from json import dumps

from flask import Blueprint, render_template
from flask import make_response, url_for as flask_url_for

from grano.core import app, app_name, app_version


UI_PREFIX = app.config.get('UI_PREFIX', '/')
if not len(UI_PREFIX):
    UI_PREFIX = '/'

STATIC_URL = '/ui/static' if UI_PREFIX == '/' else '/static'
STATIC_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__),
                              'static'))

blueprint = Blueprint('ui', __name__,
                      template_folder=STATIC_PATH,
                      static_folder=STATIC_PATH,
                      static_url_path=STATIC_URL)


def angular_templates():
    partials_dir = os.path.join(STATIC_PATH, 'templates')
    for (root, dirs, files) in os.walk(partials_dir):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            with open(file_path, 'rb') as fh:
                file_name = file_path[len(partials_dir) + 1:]
                yield (file_name, fh.read().decode('utf-8'))


@blueprint.route('/')
def index(**kw):
    return render_template('layout.html',
                           angular_templates=angular_templates())


@blueprint.route('/config.js')
def config(**kw):
    api_root = url_for('base_api.status', _external=True)
    res = render_template('js/config.js',
                          ui_root=url_for('ui.index'),
                          static_root=url_for('ui.static', filename=''),
                          data_types=dumps(app.config['DATA_TYPES']),
                          schema_objs=dumps(app.config['SCHEMA_OBJS']),
                          plugins=dumps(app.config['PLUGINS']),
                          api_root=api_root,
                          app_name=app_name,
                          app_version=app_version)
    res = make_response(res)
    res.headers['Content-Type'] = 'application/javascript'
    return res


def url_for(*a, **kw):
    """Generate external URLs with HTTPS (if configured)."""
    try:
        kw['_external'] = True
        if app.config.get('PREFERRED_URL_SCHEME'):
            kw['_scheme'] = app.config.get('PREFERRED_URL_SCHEME')
        return flask_url_for(*a, **kw)
    except RuntimeError:
        return None
