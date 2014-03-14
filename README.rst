Grano User Interface
====================

`grano <http://grano.cc/>`_ is a toolkit for building journalistic social network analysis applications on the web. This package contains an administrative user interface based on `AngularJS <http://angularjs.org/>`_. The interface is intended for managing entities 
and analysis for advanced users, not as a general-purpose interface. 


Installation
------------

``grano-ui`` requires that you have installed and configured `grano <http://grano.cc/>`_. Please refer to `grano's documentation <http://docs.grano.cc/>`_ for further instructions. Afterwards, install the ``grano-ui`` package (from PyPI or source) into the same virtual environment. 

You'll also need to install these external (non-Python dependencies):

* Twitter's `bower <https://github.com/bower/bower>`_ for installing JS dependencies.
* `UglifyJS <https://github.com/mishoo/UglifyJS/>`_ for JS minification.
* `Less <http://lesscss.org/>`_ for compiling the CSS resources.


Configuration
-------------

By default, ``grano-ui`` will deploy itself to the web root of any running instance of ``grano`` in the same virtual 
environment. You can change that path by setting a ``UI_PREFIX`` in the grano settings file, starting with a forward
slash. 

Further, asset compilation and minification can be enabled by setting the ``ASSETS_DEBUG`` variable to ``False``.

