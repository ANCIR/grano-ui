from flask import url_for

from flask_assets import Environment
from flask_assets import ManageAssets

from grano.core import app
from grano.interface import Startup
from grano.ui.view import blueprint, UI_PREFIX
from grano.ui.view import STATIC_PATH, STATIC_URL


assets = Environment(app)


@app.before_request
def configure_assets():
    assets.url = url_for('ui.static', filename='')


class Installer(Startup):

    def configure(self, manager):
        assets.directory = STATIC_PATH
        assets.url = STATIC_URL
        manager.add_command("assets", ManageAssets(assets))
        prefix = None if UI_PREFIX == '/' else UI_PREFIX
        app.register_blueprint(blueprint, url_prefix=prefix)
