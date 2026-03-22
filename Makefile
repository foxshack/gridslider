.PHONY: install install-pre-commit pre-commit build clean tag validate-version

$PACKAGE := 'gridslider' $(shell node -p "require('./package.json').name")

# Install npm dependencies
install:
	npm ci

# Install the pre-commit tool (requires Python/pip)
install-pre-commit:
	pipx install pre-commit
	pre-commit install

# Run pre-commit against all files
pre-commit:
	pre-commit run --all-files

# Run pre-commit against all staged files
pre-commit-staged:
	pre-commit run

# Build dist/ assets (used in CI)
build:
	npm run build

# Remove built output
clean:
	npm run clean

tag:
	@VERSION=$$(node -p "require('./package.json').version"); \
	if git rev-parse "v$$VERSION" >/dev/null 2>&1; then \
		echo "Tag v$$VERSION already exists. Aborting."; \
		exit 1; \
	fi; \
	npm run clean; \
	npm run build; \
	git add -f dist/; \
	git commit -m "Build dist for v$$VERSION"; \
	git tag -a "v$$VERSION" -m "Release v$$VERSION"; \
	git push origin main "v$$VERSION"

# Validate package.json version matches a given git tag (usage: make validate-version TAG=v1.2.3)
validate-version:
	@TAG_VERSION="$(TAG)"; \
	TAG_VERSION="$${TAG_VERSION#v}"; \
	PKG_VERSION=$$(node -p "require('./package.json').version"); \
	if [ "$$TAG_VERSION" != "$$PKG_VERSION" ]; then \
		echo "Tag version ($$TAG_VERSION) does not match package.json version ($$PKG_VERSION)."; \
		exit 1; \
	fi

# Full CI pipeline: install deps, lint, build
ci: install pre-commit build
