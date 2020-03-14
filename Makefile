default: build start

install: clean
	npm install

build: install
	npm run compile

start: build
	npm start

watch: build
	npm run watch

smoke: build
	npm run smoke

test: build
	npm test

clean:
	rm -rf build lib pub node_modules

lambda-zip:
	zip

lambda-deploy: clean install build test
	npm ci --ignore-scripts --production
	zip -r function.zip . -i package\*.json -i config.json -i build/src/\*.js -i node_modules/\*