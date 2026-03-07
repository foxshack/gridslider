# GridSlider

**GridSlider** is a lightweight, modern JavaScript library for creating responsive, touch-friendly, and accessible slider/carousel components using CSS Grid. Built with modern web standards and best practices.

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

Clone or download this repository:

```bash
git clone https://github.com/foxshack/gridslider.git
```

Include the files in your project:

```html
<link rel="stylesheet" href="path/to/theme.css">
<script type="module" src="path/to/index.js"></script>
```

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

Customize appearance via CSS variables:

```css
:root {
  --glider-spacing: 1rem;        /* Gap between items */
  --glider-peek: 0;              /* Peek amount for next item */
  --glider-grid-columns: 2;      /* Base columns */
}
```

### Styling Variants

**Media Query Responsive:**
```html
<div data-glider class="glider-mq">...</div>
```

**Container Query Responsive:**
```html
<div data-glider class="glider-cq">...</div>
```

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

| Attribute | Element | Description |
|-----------|---------|-------------|
| `data-glider` | Container | Main slider container |
| `data-glider-grid` | Container | Grid wrapper for items |
| `data-glider-item` | Item | Individual slider item |
| `data-glider-pager` | Container | Pagination dots container |
| `data-glider-pager-item` | Button | Pagination dot (auto-generated) |
| `data-glider-nav="start"` | Button | Navigate to first page |
| `data-glider-nav="prev"` | Button | Navigate to previous page |
| `data-glider-nav="next"` | Button | Navigate to next page |
| `data-glider-nav="end"` | Button | Navigate to last page |
| `data-state="active"` | Element | Active state indicator |

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

### v1.0.0 (2026)
- ✨ Refactored to use modern data attribute pattern
- 🎯 Separated behavior (data attributes) from styling (CSS classes)
- 📚 Improved documentation and demo
- ♿ Enhanced accessibility
- 🔧 Added comprehensive API methods
