# Grano User Interface

[grano](http://grano.cc/) is a toolkit for building journalistic social network analysis applications on the web. This package contains an administrative user interface based on [AngularJS](http://angularjs.org/). The interface is intended for managing entities 
and analysis for advanced users, not as a general-purpose interface. 


## Installation

``grano-ui`` requires that you have installed and configured [grano](http://grano.cc/). Please refer to [grano's documentation](http://docs.grano.cc/) for further instructions. You'll also need to install these external (non-Python dependencies):

* Twitter's [bower](https://github.com/bower/bower) for installing JS dependencies.
* [UglifyJS](https://github.com/mishoo/UglifyJS/) for JS minification.
* [Less](http://lesscss.org/) for compiling the CSS resources.

To install the package from GitHub, you need to follow these steps from within the virtual environment in which ``grano`` has been installed:


```bash
git clone https://github.com/granoproject/grano-ui.git
cd [grano dir]
virtualenv env
source env/bin/activate
cd [grano-ui dir]
python setup.py develop
bower install (in docker, use --allow-root or su app -c "bower install")
```


After installing the package, you will still need to enable this plugin. Add the entry ``ui`` to the ``PLUGINS`` variable in your grano settings file. If you have no other plugins installed, try this:

```python
PLUGINS = ['ui']
```


## Configuration

By default, ``grano-ui`` will deploy itself to the web root of ``grano`` when it has been activated as a plugin. You can change that path by setting a ``UI_PREFIX``, starting with a forward slash. 

```python
UI_PREFIX = '/grano'
```

Further, asset compilation and minification can be enabled by setting the ``ASSETS_DEBUG`` variable to ``False``.
