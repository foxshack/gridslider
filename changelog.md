# Changelog

## v1.3.0 — 2026-04-26

### Added
- Added a container-query variable override example in [demo/index.html](demo/index.html) (Example 5), showing per-instance theming via a custom slider class.

### Changed
- Updated [src/theme.scss](src/theme.scss) to derive `--gs-visible-gaps` from `--gs-visible-cols` with CSS `round()`, removing breakpoint-specific `--gs-visible-gaps-*` maintenance.
- Refined `.glider-cq` defaults in [src/theme.scss](src/theme.scss) by moving visible-column defaults to reusable CSS variables (`--gs-visible-cols-*`).
- Updated [Makefile](Makefile) `tag` behavior to guard against existing tags and commit only `dist/` artifacts during release tagging.
- Added and refined documentation for custom class variable overrides in [README.md](README.md) and [demo/index.html](demo/index.html).

### Fixed
- Added a browser fallback in [src/gridslider.js](src/gridslider.js) for environments without CSS `round()` support by computing `--gs-visible-gaps` in JavaScript.

## v1.2.2 — 2026-03-22

### Added
- Added [Makefile](Makefile) with project tasks for install, pre-commit, build/clean, release tagging, and package/tag version validation.

### Changed
- Updated [.github/workflows/release.yml](.github/workflows/release.yml) to use `make` targets for install, tag/version validation, and build steps.
- Updated [.pre-commit-config.yaml](.pre-commit-config.yaml) to exclude built assets/sourcemaps under `dist/` from hook processing.
- Bumped package version to `1.2.2` in [package.json](package.json).
- Refreshed built outputs in [dist/gridslider.js](dist/gridslider.js), [dist/gridslider.mjs](dist/gridslider.mjs), and sourcemaps.

### Fixed
- Improved rotation handling in [src/gridslider.js](src/gridslider.js) by refreshing layout on `orientationchange`.

## v1.2.1 — 2026-03-21

### Added
- Added distributable assets to source control in [dist/gridslider.js](dist/gridslider.js), [dist/gridslider.mjs](dist/gridslider.mjs), and [dist/theme.css](dist/theme.css) (plus sourcemaps) so CDN consumers can install directly from GitHub tags.

### Changed
- Updated [.gitignore](.gitignore) to allow tracked `dist/` outputs.
- Updated install/version examples in [README.md](README.md) to reference `v1.2.1`.
- Bumped package version to `1.2.1` in [package.json](package.json).

## v1.2.0 — 2026-03-21

### Added
- Added GitHub Pages deployment workflow in [.github/workflows/pages.yml](.github/workflows/pages.yml), including build, artifact packaging, and deploy steps for publishing the demo and distributables.
- Added tag-driven GitHub release workflow in [.github/workflows/release.yml](.github/workflows/release.yml), including tag validation, package-version checks, build, and artifact upload.

### Changed
- Updated installation guidance in [README.md](README.md) to use GitHub package references (`github:foxshack/gridslider#...`) instead of the previous install example.
- Expanded [README.md](README.md) with branch-based install guidance and reproducibility notes for tag pinning.
- Bumped package version to `1.2.0` in [package.json](package.json).

## v1.1.0 — 2026-03-21

### Breaking Changes
- **CSS variables renamed** to the `--gs-*` prefix. Any overrides of the old `--glider-*` variables must be updated:

  | Old variable | New variable |
  |---|---|
  | `--glider-spacing` | `--gs-gap-spacing` |
  | `--glider-mq-pc` | `--gs-visible-cols` + `--gs-visible-gaps` |
  | `--glider-mq-pc-sm` | `--gs-visible-cols-sm` + `--gs-visible-gaps-sm` |
  | `--glider-mq-pc-md` | `--gs-visible-cols-md` + `--gs-visible-gaps-md` |
  | `--glider-mq-pc-lg` | `--gs-visible-cols-lg` + `--gs-visible-gaps-lg` |
  | `--glider-mq-pc-xl` | `--gs-visible-cols-xl` + `--gs-visible-gaps-xl` |
  | `--glider-pager-item-color` | `--gs-pager-item-color` |

---

## 2026-03-21

### Changed
- Updated layout configuration docs to reflect the simplified variable model using `--gs-visible-cols*` and `--gs-visible-gaps*`.
- Documented container-query configuration at selector level (`.glider-cq [data-glider-grid]`) to support easy extension via extra classes and custom breakpoints.

### Fixed
- Improved active pager detection in `glider.updateActivePage` to reliably set the last page as active when scrolled to the end.
- Added an empty-item guard in `glider.updateActivePage` to avoid invalid page-state updates when no items are present.
- Prioritized `isAtEnd()` before last-item viewport checks in `glider.updateActivePage` to reduce edge-case failures caused by sub-pixel rounding and partial clipping.
- Aligned `glider.getCurrentPage` with the same end-of-scroll and empty-state logic so navigation methods and pager state remain consistent.
