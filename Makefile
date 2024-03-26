.PHONY: _checkNodeVersion
_checkNodeVersion:
	node --version

.PHONY: checkNodeVersion
checkNodeVersion:
	docker compose run --rm node-local make _checkNodeVersion

###

.PHONY: _deps
_deps:
	npm install

.PHONY: deps
deps:
	docker compose run --rm node-local make _deps

###

.PHONY: _depsAdd
_depsAdd:
	npm install $(packages)

.PHONY: depsAdd
depsAdd:
	docker compose run --rm node-local make _depsAdd packages="$(packages)"

###

.PHONY: _depsRemove
_depsRemove:
	npm uninstall $(packages)

.PHONY: depsRemove
depsRemove:
	docker compose run --rm node-local make _depsRemove packages="$(packages)"

###

.PHONY: _format
_format:
	npm run format

.PHONY: format
format:
	docker compose run --rm node-local make _format

###

.PHONY: stop
stop:
	docker compose down

###

.PHONY: startDb
startDb: .env
	docker compose up -d --wait postgres

###

.PHONY: _startDev
_startDev:
	npm run develop

.PHONY: startDev
startDev: .env node_modules
	docker compose run --rm --service-ports node-local npm run develop

