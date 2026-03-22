/**
 * Need to following functions:
 * - total number of items in the collection
 * - total number of items fully visible in the viewport
 * - calculate number of 'pages'
 * - generate links for pages
 *
 */

const throttle = function (func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// debounce function
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Normalise the scroll event across browsers
 *
 * @param {HTMLElement} element
 * @param {Function} func
 * @param  {...any} args
 */
const onScrollEnd = function (element, func, ...args) {
  const context = this;
  if ("onscrollend" in window) {
    element.addEventListener("scrollend", () => {
      func.apply(context, args);
    });
  } else {
    // fall back to scroll listener with timeout for browsers
    // that don't support scrollend
    element.addEventListener("scroll", (event) => {
      clearTimeout(window.scrollEndTimer);
      window.scrollEndTimer = setTimeout(() => {
        func.apply(context, args);
      }, 50);
    });
  }
};

/**
 * Check whether an element is in the viewport based on it's position
 * relative to the parent element. We are comparing the right edge of the
 * element to the right edge of the parent element and the left edge of the
 * element to the left edge of the parent element.
 *
 * The offset is used to add a buffer to the comparison on the left edge of the
 * parent element only.
 *
 * @param {*} element - html element
 * @param {*} parent - html element
 * @param {*} offset - number
 */
const withinViewport = (element, parent, offset) => {
  offset = offset || 0;
  const elementRect = element.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  return (
    elementRect.left >= parentRect.left - offset &&
    elementRect.right <= parentRect.right
  );
};

/**
 * Check whether an element is past a certain point in the viewport, we are
 * comparing the left edge of the element to the left edge of the parent
 * element.
 *
 * @param {*} element - html element
 * @param {*} parent
 * @param {*} offset
 * @returns
 */
const itemLeftOfParent = (element, parent, offset) => {
  offset = offset || 0;
  const elementRect = element.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  return elementRect.left <= parentRect.left + offset;
};

/**
 * Declare our glider object
 *
 */
const glider = {};

/**
 * Object passed to the init function to initialise the glider object
 * includes options for the glider object and selectors for the pager and grid
 * and grid items.
 * @param {*} element
 */
glider.init = function ({
  element,
  gridSelector = "[data-glider-grid]",
  pagerSelector = "[data-glider-pager]",
  itemSelector = "[data-glider-item]",
  nextButtonSelector = '[data-glider-nav="next"]',
  prevButtonSelector = '[data-glider-nav="prev"]',
  startButtonSelector = '[data-glider-nav="start"]',
  endButtonSelector = '[data-glider-nav="end"]',
} = {}) {
  this.glider = element;
  this.grid = this.glider.querySelector(gridSelector);
  this.pager = this.glider.querySelector(pagerSelector);

  this.nextButtonSelector = nextButtonSelector;
  this.prevButtonSelector = prevButtonSelector;
  this.startButtonSelector = startButtonSelector;
  this.endButtonSelector = endButtonSelector;

  // TODO what if elements are added dynaically to the collection
  // how do we detect this (would we need mutation observer)
  this.items = this.grid.querySelectorAll(itemSelector);

  this.pagerItemSelector = "[data-glider-pager-item]";

  this.initPager();
  this.initButtons();
  this.initScroll();
};

glider.getNumberOfItems = function () {
  return this.items.length;
};

glider.refreshLayout = function () {
  this.updatePager();
  this.updateActivePage();
  this.updateButtonStates();
};

/**
 * Calculate the number of displayed elements that should be visible in
 * the viewport at this point.
 */
glider.getNumberOfItemsFullyVisible = function () {
  const computedStyle = getComputedStyle(this.grid);
  const gapSize = parseInt(computedStyle.gap, 10);
  const itemWidth = this.items[0].offsetWidth + gapSize;
  const containerWidth = this.grid.offsetWidth;
  return Math.floor((containerWidth + gapSize) / itemWidth);
};

glider.getNumberOfPages = function () {
  const totalItems = this.getNumberOfItems();
  const itemsFullyVisible = this.getNumberOfItemsFullyVisible();
  return Math.ceil(totalItems / itemsFullyVisible);
};

/**
 * This function returns a javascript array of elements which are a
 * set number of items apart based on the number of elements which are
 * currently visible in the viewport.
 *
 * TODO: clarify this section
 * The benefit of this is that the last index item might be an element which
 * will never be fully to the left in the viewport but attempting to scroll
 * to that position still works
 *
 * @returns array
 */
glider.calculateScrollIndex = function () {
  const numberOfPages = this.getNumberOfPages();
  let scrollIndex = [];
  for (let i = 0; i < numberOfPages; i++) {
    scrollIndex.push(i * this.getNumberOfItemsFullyVisible());
  }
  return scrollIndex;
};

glider.populatePager = function () {
  this.pager.innerHTML = "";
  const pagerLinks = this.generatePagerLinks();
  // if we only have one page, don't show the pager
  if (pagerLinks.length === 1) {
    return;
  }

  pagerLinks.forEach((link) => {
    this.pager.appendChild(link);
  });
};

glider.generatePagerLinks = function () {
  const numberOfPages = this.getNumberOfPages();
  let pagerLinks = [];
  let scrollIndex = this.calculateScrollIndex();
  for (let i = 0; i < numberOfPages; i++) {
    pagerLinks.push(this.generatePagerLink(i, scrollIndex[i]));
  }
  return pagerLinks;
};

glider.generatePagerLink = function (pageNumber, itemNumber) {
  const btn = document.createElement("button");
  btn.setAttribute("data-glider-pager-item", "");
  btn.setAttribute("aria-label", `Page ${pageNumber + 1}`);
  btn.setAttribute("data-page", pageNumber);
  btn.setAttribute("data-item", itemNumber);
  return btn;
};

glider.updatePager = function () {
  const that = this;
  this.populatePager();

  // TODO: potentially refactor this out?
  // once we've populate the pager we need to add the event listeners
  // TODO could we not add the actual scroll position to the button when we
  // are setting it rather than calculate it here, so we can just get the
  // position that we need to scroll to???
  const pagerItems = this.pager.querySelectorAll(this.pagerItemSelector);
  pagerItems.forEach((item) => {
    item.addEventListener("click", function () {
      const i = item.getAttribute("data-item");
      const left = that.items[i].offsetLeft;
      const parent = that.items[i].parentElement;
      parent.scrollTo({
        left: left,
        behavior: "smooth",
      });
    });
  });
};

glider.updateActivePage = function () {
  if (!this.items.length) {
    return;
  }

  const scrollIndex = this.calculateScrollIndex();
  const lastPage = scrollIndex.length - 1;

  // Prioritise scroll-position based detection for end-of-track edge cases
  // (sub-pixel rounding, gaps and partial clipping of the final item).
  if (this.isAtEnd()) {
    this.setActivePage(lastPage);
    return;
  }

  // if the last element is in view, set the active page to the last page
  if (withinViewport(this.items[this.items.length - 1], this.grid, 16)) {
    this.setActivePage(lastPage);
    return;
  }

  // set active page to 0
  let activePage = 0;

  // loop through our scrollIndex and check each one to see if it is to the
  // left of the parent element (or within the buffer zone)
  for (let i = 0; i < scrollIndex.length; i++) {
    if (itemLeftOfParent(this.items[scrollIndex[i]], this.grid, 16)) {
      activePage = i;
    }
  }
  this.setActivePage(activePage);
};

glider.setActivePage = function (pageNumber) {
  const pagerItems = this.pager.querySelectorAll(this.pagerItemSelector);

  if (pagerItems.length > 0) {
    pagerItems.forEach((item) => {
      item.removeAttribute("data-state");
    });
    pagerItems[pageNumber].setAttribute("data-state", "active");
  }
};

/**
 * Initialise the pager
 */
glider.initPager = function () {
  const that = this;

  // attach event listener for resize event
  window.addEventListener(
    "resize",
    debounce(function () {
      that.refreshLayout();
    }, 250),
  );

  // attach event listener for orientation change
  window.addEventListener("orientationchange", function () {
    that.refreshLayout();
  });

  this.refreshLayout();
  this.onScrollEnd();
};

glider.initButtons = function () {
  const nextButton = this.glider.querySelector(this.nextButtonSelector);
  const prevButton = this.glider.querySelector(this.prevButtonSelector);
  const startButton = this.glider.querySelector(this.startButtonSelector);
  const endButton = this.glider.querySelector(this.endButtonSelector);

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      this.scrollToNextPage();
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      this.scrollToPreviousPage();
    });
  }

  if (startButton) {
    startButton.addEventListener("click", () => {
      this.scrollToStart();
    });
  }

  if (endButton) {
    endButton.addEventListener("click", () => {
      this.scrollToEnd();
    });
  }

  // Set initial button states
  this.updateButtonStates();
};

glider.initScroll = function () {
  const that = this;
  const throttledScrollHandler = throttle(function () {
    that.updateActivePage();
  }, 50);
  this.grid.addEventListener("scroll", throttledScrollHandler);
};

glider.onScrollEnd = function () {
  const that = this;

  const handleScrollEnd = () => {
    that.updateActivePage();
    that.updateButtonStates();
  };

  onScrollEnd(this.grid, handleScrollEnd);
};

/**
 * Scroll to the start of the grid
 */
glider.scrollToStart = function () {
  this.grid.scrollTo({
    left: 0,
    behavior: "smooth",
  });
};

/**
 * Scroll to the end of the grid
 */
glider.scrollToEnd = function () {
  const lastItem = this.items[this.items.length - 1];
  const scrollPosition =
    lastItem.offsetLeft + lastItem.offsetWidth - this.grid.offsetWidth;
  this.grid.scrollTo({
    left: Math.max(0, scrollPosition),
    behavior: "smooth",
  });
};

/**
 * Scroll to the next page
 */
glider.scrollToNextPage = function () {
  const scrollIndex = this.calculateScrollIndex();
  const currentPage = this.getCurrentPage();

  if (currentPage < scrollIndex.length - 1) {
    const nextPageItemIndex = scrollIndex[currentPage + 1];
    const left = this.items[nextPageItemIndex].offsetLeft;
    this.grid.scrollTo({
      left: left,
      behavior: "smooth",
    });
  } else {
    // If we're on the last page, scroll to end
    this.scrollToEnd();
  }
};

/**
 * Scroll to the previous page
 */
glider.scrollToPreviousPage = function () {
  const scrollIndex = this.calculateScrollIndex();
  const currentPage = this.getCurrentPage();

  if (currentPage > 0) {
    const prevPageItemIndex = scrollIndex[currentPage - 1];
    const left = this.items[prevPageItemIndex].offsetLeft;
    this.grid.scrollTo({
      left: left,
      behavior: "smooth",
    });
  } else {
    // If we're on the first page, scroll to start
    this.scrollToStart();
  }
};

/**
 * Get the current page number (0-indexed)
 * Helper function for navigation methods
 */
glider.getCurrentPage = function () {
  if (!this.items.length) {
    return 0;
  }

  const scrollIndex = this.calculateScrollIndex();
  const lastPage = scrollIndex.length - 1;

  if (this.isAtEnd()) {
    return lastPage;
  }

  // if the last element is in view, return the last page
  if (withinViewport(this.items[this.items.length - 1], this.grid, 16)) {
    return lastPage;
  }

  // set active page to 0
  let activePage = 0;

  // loop through our scrollIndex and check each one to see if it is to the
  // left of the parent element (or within the buffer zone)
  for (let i = 0; i < scrollIndex.length; i++) {
    if (itemLeftOfParent(this.items[scrollIndex[i]], this.grid, 16)) {
      activePage = i;
    }
  }

  return activePage;
};

/**
 * Check if we're at the start of the grid
 * @returns {boolean}
 */
glider.isAtStart = function () {
  return this.grid.scrollLeft <= 10;
};

/**
 * Check if we're at the end of the grid
 * @returns {boolean}
 */
glider.isAtEnd = function () {
  const tolerance = 1;
  return (
    this.grid.scrollLeft + this.grid.offsetWidth >=
    this.grid.scrollWidth - tolerance
  );
};

/**
 * Update navigation button states based on scroll position
 * Disables prev/start buttons at the start, next/end buttons at the end
 */
glider.updateButtonStates = function () {
  const nextButton = this.glider.querySelector(this.nextButtonSelector);
  const prevButton = this.glider.querySelector(this.prevButtonSelector);
  const startButton = this.glider.querySelector(this.startButtonSelector);
  const endButton = this.glider.querySelector(this.endButtonSelector);

  const atStart = this.isAtStart();
  const atEnd = this.isAtEnd();

  if (prevButton) {
    prevButton.disabled = atStart;
  }

  if (startButton) {
    startButton.disabled = atStart;
  }

  if (nextButton) {
    nextButton.disabled = atEnd;
  }

  if (endButton) {
    endButton.disabled = atEnd;
  }
};

/**
 * Creates a pager object with the given slider.
 *
 * Pass the slider object to the pager object to create the pager.
 *
 * @param {Object} slider - The slider object to create the pager for.
 * @return {Pager} - The pager object.
 */
const makeGlider = function (element) {
  const obj = Object.create(glider);
  obj.init({ element });
  return obj;
};

const initGlider = function ({ sliderSelector = "[data-glider]" } = {}) {
  const els = document.querySelectorAll(sliderSelector);

  els.forEach((el) => {
    makeGlider(el);
  });
};

export default initGlider;
export { makeGlider };
