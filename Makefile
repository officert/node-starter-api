MOCHA = node_modules/mocha/bin/mocha
ESLINT = node_modules/eslint/bin/eslint.js

default:
	 npm install;

post-install:
	cd node_modules; \
	ln -nsf ../src; \
	ln -nsf ../src/api; \
	ln -nsf ../src/app; \
	ln -nsf ../src/data; \
	ln -nsf ../src/errors; \
	ln -nsf ../src/modules; \
	ln -nsf ../config; \
	ln -nsf ../tests; \

test: eslint test-int test-unit

test-int:
	@NODE_ENV=test \
	$(MOCHA) tests/int/**/*-test.js

test-unit:
	@NODE_ENV=test \
	$(MOCHA) tests/unit/**/*-test.js

eslint:
	$(ESLINT) "src/**/*.js" \
	$(ESLINT) "tests/**/*.js" \

dev: eslint
	node index.js;
