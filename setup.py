import os
from setuptools import setup, find_packages

VERSION = os.path.join(os.path.dirname(__file__), 'VERSION')
VERSION = open(VERSION, 'r').read().strip()

README = os.path.join(os.path.dirname(__file__), 'README.md')
README = open(README, 'r').read().strip()

setup(
    name='grano-ui',
    version=VERSION,
    description="An entity and social network tracking software for news applications (Admin UI)",
    long_description=README,
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Operating System :: OS Independent",
        "Programming Language :: Python",
        ],
    keywords='sql graph sna networks journalism ddj entities',
    author='Code for Africa',
    author_email='support@codeforafrica.org',
    url='http://granoproject.org',
    license='MIT',
    packages=find_packages(exclude=['ez_setup', 'examples', 'tests']),
    package_data={'grano': ['ui/static/layout.html']},
    namespace_packages=[],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'grano',
        'cssmin==0.1.4',
        'Flask-Assets==0.12',
        'jsmin>=2.0.9'
    ],
    dependency_links=[
        'https://github.com/CodeForAfrica/grano/tarball/master#egg=grano'
    ],
    entry_points={
        'grano.startup': [
            'ui = grano.ui.base:Installer'
        ]
    },
    tests_require=[]
)
