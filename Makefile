MOCHA_OPTS =
REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
	--reporter $(REPORTER) \
	--bail \
	$(MOCHA_OPTS)

.PHONY: test
