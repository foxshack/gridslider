# GridSlider

[**GridSlider**](https://foxshack.github.io/gridslider/) is a lightweight, modern JavaScript library for creating responsive, touch-friendly, and accessible slider/carousel components using CSS Grid. Built with modern web standards and best practices.

---

## ✨ Features

- 🎯 **Modern Architecture** - Uses data attributes for behavior, classes for styling
- 🚀 **Zero Dependencies** - Pure JavaScript, no framework required
- 📐 **CSS Grid Layout** - Leverages native CSS Grid for flexibility
- 📱 **Responsive** - Supports both media queries and container queries
- ♿ **Accessible** - Keyboard navigation, ARIA labels, semantic HTML
- 🎨 **Easy Theming** - CSS variables and SCSS for customization
- 🔄 **Multiple Instances** - Run multiple sliders on one page
- 📦 **Lightweight** - Small bundle size, tree-shakeable

---

## 🎯 Modern Pattern: Data Attributes

GridSlider follows modern best practices by using **data attributes for JavaScript hooks** and **CSS classes for styling**. This separation of concerns provides:

- **Maintainability** - Rename CSS classes without breaking JavaScript
- **Clarity** - Clear distinction between behavior and presentation
- **Flexibility** - Style changes don't affect functionality
- **Best Practice** - Follows 2026 web development standards

### Pattern Overview

```html
<!-- ✅ Data attributes = Behavior & State -->
<div data-glider>
  <div data-glider-grid>
    <div data-glider-item>Content</div>
  </div>
  <button data-glider-nav="prev">Previous</button>
  <button data-glider-nav="next">Next</button>
  <div data-glider-pager></div>
</div>

<!-- ✅ CSS classes = Styling & Variants -->
<div data-glider class="glider-mq">
  <!-- Styling class for media query variant -->
</div>
```

---

## 📦 Installation

The simplest way to get started is to include the CSS and JavaScript via CDN. For more control, you can install via npm and import into your build process.

### CDN

The CDN version includes the CSS and JavaScript in a single package for easy
setup. Just include these tags in your HTML:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/foxshack/gridslider@1.2.1/dist/theme.css">
<!-- Self instantiating version for simple install and setup -->
<script type="module" src="https://cdn.jsdelivr.net/gh/foxshack/gridslider@1.2.1/dist/gridslider.js"></script>
```

### Install from GitHub

```bash
npm install github:foxshack/gridslider#v1.2.1
```

You can also use a branch while iterating:

```bash
npm install github:foxshack/gridslider#main
```

Use tags (for example `#v1.2.1`) for reproducible builds, and branch refs (for example `#main`) for testing in-progress changes.

Then import in your JavaScript:
```
import initGlider from 'gridslider';
initGlider();
```

Add the CSS to your build process or include directly (or see CDN section above):
```
import 'gridslider/src/theme.css';
```

**Note: The `initGlider` function will automatically initialize all elements with the `data-glider` attribute. You can also pass a custom selector if needed.**

---

## 🚀 Quick Start

### Basic HTML Structure

```html
<div data-glider class="glider-mq">
  <div data-glider-grid>
    <div data-glider-item>Item 1</div>
    <div data-glider-item>Item 2</div>
    <div data-glider-item>Item 3</div>
    <!-- Add more items -->
  </div>
  <div data-glider-pager></div>
</div>
```

### Initialize in JavaScript



```js
import initGlider from './index.js';

// Initialize all sliders with default selector [data-glider]
initGlider();

// Or specify a custom selector
initGlider({ sliderSelector: '[data-glider]' });
```

---

## 📚 Usage Examples

### 1. Basic Slider

```html
<div data-glider class="glider-mq">
  <div data-glider-grid>
    <div data-glider-item>1</div>
    <div data-glider-item>2</div>
    <div data-glider-item>3</div>
  </div>
  <div data-glider-pager></div>
</div>
```

### 2. With Navigation Buttons

```html
<div data-glider class="glider-mq">
  <div data-glider-grid>
    <!-- items -->
  </div>

  <button data-glider-nav="start">⏮ First</button>
  <button data-glider-nav="prev">← Previous</button>
  <button data-glider-nav="next">Next →</button>
  <button data-glider-nav="end">Last ⏭</button>

  <div data-glider-pager></div>
</div>
```

Navigation buttons automatically disable at boundaries.

### 3. Container Query Variant

For component-based responsive behavior:

```html
<div data-glider class="glider-cq">
  <div data-glider-grid>
    <!-- items -->
  </div>
  <div data-glider-pager></div>
</div>
```

---

## 🎨 Theming & Styling

### CSS Variables

GridSlider uses a simplified variable model based on visible columns and visible gaps.
`grid-auto-columns` is derived automatically from these values:

`calc((100% - var(--gs-visible-gaps) * var(--gs-gap-spacing)) / var(--gs-visible-cols))`

```css
:root {
  --gs-gap-spacing: 1rem;

  --gs-visible-cols: 2;
  --gs-visible-cols-sm: 3.8;
  --gs-visible-cols-md: 3;
  --gs-visible-cols-lg: 4;
  --gs-visible-cols-xl: 6;

  --gs-pager-item-color: #d3d3d3;
}
```

At each breakpoint, update only `--gs-visible-cols*` and `--gs-visible-gaps*`.
Higher `--gs-visible-cols*` values show more items; lower values show fewer, larger items.

Example override:

```css
:root {
  --gs-visible-cols-md: 4;
  --gs-visible-gaps-md: 3;
}
```

If upgrading from older setups, remove legacy `--glider-*` layout variables, as layout now uses the `--gs-visible-*` model.

### Styling Variants

**Media Query Responsive:**
```html
<div data-glider class="glider-mq">...</div>
```

**Container Query Responsive:**
```html
<div data-glider class="glider-cq">...</div>
```

For container queries, set overrides on the same element that has `data-glider glider-cq`.
Then use a custom class (for example `glider-custom`) to scope per-instance values.

### Override Container Query Variables With a Custom Class

Use this pattern when you want one container-query slider to behave differently
from the defaults without changing all sliders globally.

```html
<div data-glider class="glider-cq glider-custom">
  <div data-glider-grid>
    <!-- items -->
  </div>
  <div data-glider-pager></div>
</div>
```

```css
[data-glider].glider-custom {
  --gs-pager-item-color: #e69e9e;
  --gs-gap-spacing: 0.5rem;

  --gs-cs-breakpoint-sm: 300px;
  --gs-cs-breakpoint-md: 450px;

  --gs-visible-cols: 1.33;
  --gs-visible-cols-sm: 2.33;
}
```

This works because the container-query variant (`.glider-cq`) reads these CSS
variables from the slider container and applies them inside the grid/container
query rules.

See Example 5 in `demo/index.html` for a complete working reference.

### Custom Styling

Style items using standard CSS:

```css
[data-glider-item] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  /* Your custom styles */
}
```

---

## 🔧 API Reference

### Initialization

```js
initGlider(options)
```

**Options:**
- `sliderSelector` (string) - CSS selector for glider containers
  - Default: `'[data-glider]'`

### Data Attributes

| Attribute                 | Element   | Description                     |
|-----------                |---------  |-------------                    |
| `data-glider`             | Container | Main slider container           |
| `data-glider-grid`        | Container | Grid wrapper for items          |
| `data-glider-item`        | Item      | Individual slider item          |
| `data-glider-pager`       | Container | Pagination dots container       |
| `data-glider-pager-item`  | Button    | Pagination dot (auto-generated) |
| `data-glider-nav="start"` | Button    | Navigate to first page          |
| `data-glider-nav="prev"`  | Button    | Navigate to previous page       |
| `data-glider-nav="next"`  | Button    | Navigate to next page           |
| `data-glider-nav="end"`   | Button    | Navigate to last page           |
| `data-state="active"`     | Element   | Active state indicator          |

### Instance Methods

Each glider instance exposes these methods:

```js
const glider = makeGlider(element);

glider.getNumberOfItems()              // Returns total item count
glider.getNumberOfItemsFullyVisible()  // Returns visible item count
glider.getNumberOfPages()              // Returns total page count
glider.getCurrentPage()                // Returns current page (0-indexed)
glider.updatePager()                   // Re-renders pagination
glider.updateActivePage()              // Updates active page indicator
glider.scrollToStart()                 // Scroll to first item
glider.scrollToEnd()                   // Scroll to last item
glider.scrollToNextPage()              // Scroll to next page
glider.scrollToPreviousPage()          // Scroll to previous page
```

---

## 🎯 CSS Classes vs Data Attributes

### When to Use Each

**Data Attributes** (for behaviour):
```html
<div data-glider>                    <!-- JS hook -->
  <div data-glider-grid>             <!-- JS hook -->
    <div data-glider-item>1</div>    <!-- JS hook -->
  </div>
  <button data-glider-nav="next">   <!-- JS hook + config -->
  <div data-state="active">          <!-- State management -->
</div>
```

**CSS Classes** (for styling):
```html
<div data-glider class="glider-mq">        <!-- Styling variant -->
<div data-glider class="glider-cq">        <!-- Different variant -->
<div data-glider class="my-custom-theme">  <!-- Custom styling -->
```

This pattern ensures:
- JavaScript functions remain stable when redesigning
- Styling classes can be renamed freely
- Clear separation of concerns
- Better team collaboration

---

## 🌐 Browser Support

- Chrome/Edge 88+ (container queries in .glider-cq variant)
- Firefox 110+ (container queries)
- Safari 16+ (container queries)
- All modern browsers (media query variant works universally)

Container query support is progressive - falls back gracefully to base styles.

---

## 🔨 Development

Build CSS from SCSS:

```bash
npm run build
```

Watch for changes:

```bash
npm run watch
```

---

## 📖 Demo

Check out the [live demo](./demo/index.html) to see all features in action, including:
- Basic responsive slider
- Navigation buttons
- Container queries
- Auto-hiding pager
- Multiple instances

---

## 📄 License

MIT © Fox Shack

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📝 Changelog

### v1.1.0 (2026-03-21) — ⚠️ Breaking changes
- 💥 **CSS variables renamed** — all layout and theming variables have moved to the `--gs-*` prefix (see migration guide below)
- 🎨 Simplified responsive track sizing to `--gs-visible-cols*`
- 📐 Container query variables now set at selector level for easier extension
- 🐛 Fixed last-page active state edge cases in `updateActivePage` and `getCurrentPage`

#### Migrating from v1.x

Replace any overrides of the old variables in your own CSS:

| Old variable | New variable |
|---|---|
| `--glider-spacing`  | `--gs-gap-spacing` |
| `--glider-mq-pc`    | `--gs-visible-cols` + `--gs-visible-gaps` |
| `--glider-mq-pc-sm` | `--gs-visible-cols-sm` + `--gs-visible-gaps-sm` |
| `--glider-mq-pc-md` | `--gs-visible-cols-md` + `--gs-visible-gaps-md` |
| `--glider-mq-pc-lg` | `--gs-visible-cols-lg` + `--gs-visible-gaps-lg` |
| `--glider-mq-pc-xl` | `--gs-visible-cols-xl` + `--gs-visible-gaps-xl` |
| `--glider-pager-item-color` | `--gs-pager-item-color` |

### v1.0.0 (2026)
- ✨ Refactored to use modern data attribute pattern
- 🎯 Separated behavior (data attributes) from styling (CSS classes)
- 📚 Improved documentation and demo
- ♿ Enhanced accessibility
- 🔧 Added comprehensive API methods
