from setuptools import setup, find_packages

setup(
    name='grano-ui',
    version='0.3.2',
    description="An entity and social network tracking software for news applications (Admin UI)",
    long_description=open('README.md').read(),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Operating System :: OS Independent",
        "Programming Language :: Python",
        ],
    keywords='sql graph sna networks journalism ddj entities',
    author='Friedrich Lindenberg',
    author_email='friedrich@pudo.org',
    url='http://docs.grano.cc',
    license='MIT',
    packages=find_packages(exclude=['ez_setup', 'examples', 'tests']),
    namespace_packages=[],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'grano>=0.3.1',
        'cssmin==0.1.4',
        'Flask-Assets==0.10',
        'jsmin>=2.0.9'
    ],
    entry_points={
        'grano.startup': [
            'ui = grano.ui.base:Installer'
        ]
    },
    tests_require=[]
)
