# Changelog

## 2026-03-21

### Changed
- Updated layout configuration docs to reflect the simplified variable model using `--gs-visible-cols*` and `--gs-visible-gaps*`.
- Documented container-query configuration at selector level (`.glider-cq [data-glider-grid]`) to support easy extension via extra classes and custom breakpoints.

### Fixed
- Improved active pager detection in `glider.updateActivePage` to reliably set the last page as active when scrolled to the end.
- Added an empty-item guard in `glider.updateActivePage` to avoid invalid page-state updates when no items are present.
- Prioritized `isAtEnd()` before last-item viewport checks in `glider.updateActivePage` to reduce edge-case failures caused by sub-pixel rounding and partial clipping.
- Aligned `glider.getCurrentPage` with the same end-of-scroll and empty-state logic so navigation methods and pager state remain consistent.
