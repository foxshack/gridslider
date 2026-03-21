# Changelog

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
