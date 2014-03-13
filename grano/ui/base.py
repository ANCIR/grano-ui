from flask import url_for

from flask.ext.assets import Environment
from flask.ext.assets import ManageAssets

from grano.core import app
from grano.interface import Startup
from grano.ui.view import blueprint, STATIC_PATH, UI_PREFIX


assets = Environment(app)

@app.before_request
def configure_assets():
    assets.url = url_for('ui.static', filename='')
    

class Installer(Startup):

    def configure(self, manager):
        assets.directory = STATIC_PATH
        assets.url = UI_PREFIX + '/static'
        manager.add_command("assets", ManageAssets(assets))
        app.register_blueprint(blueprint, url_prefix=UI_PREFIX)
        


