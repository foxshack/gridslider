.PHONY: install install-pre-commit pre-commit build clean validate-version

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
