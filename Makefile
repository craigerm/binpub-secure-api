MOCHA_OPTS =
REPORTER = list 

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
	--reporter $(REPORTER) \
	--bail \
	--ignore-leaks \
	$(MOCHA_OPTS)

.PHONY: test
