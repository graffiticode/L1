default: build start

build:
	npm run build

start: build
	npm start

watch: build
	npm run watch

smoke: build
	npm run smoke

test: build
	npm run test
