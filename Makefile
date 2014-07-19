all: install assets

assets:
	grano assets --parse-templates build

install:
	bower install
