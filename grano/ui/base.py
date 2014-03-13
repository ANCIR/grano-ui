from flask.ext.assets import Environment
from flask.ext.assets import ManageAssets

from grano.core import app
from grano.interface import Startup
from grano.ui.view import blueprint


assets = Environment(app)


class Installer(Startup):

    def configure(self, manager):
        manager.add_command("assets", ManageAssets(assets))
        app.register_blueprint(blueprint)
        


