/* global ResizeObserver, MutationObserver */ /**
 * CSS round() function polyfill
 *
 * Detects if the browser supports the CSS round() function.
 * If not, provides a fallback by calculating values in JavaScript.
 *
 * @returns {boolean} - True if CSS round() is supported, false otherwise
 */ function $d48e1cd1057d96ba$var$supportsCSSSRound() {
    const testElement = document.createElement("div");
    testElement.style.setProperty("--test", "calc(round(up, 1, 1))");
    return getComputedStyle(testElement).getPropertyValue("--test").length > 0;
}
/**
 * Polyfill for CSS round() function
 *
 * If the browser doesn't support CSS round(), this function calculates
 * the --gs-visible-gaps CSS custom property based on --gs-visible-cols.
 *
 * The formula used is: round(up, cols, 1) - 1
 * Which calculates the number of gaps between visible columns.
 *
 * @param {HTMLElement} element - The glider element to apply the polyfill to
 */ function $d48e1cd1057d96ba$var$polyfillCSSRound(element) {
    if ($d48e1cd1057d96ba$var$supportsCSSSRound()) return; // Browser supports CSS round(), no polyfill needed
    const updateGaps = ()=>{
        const computedStyle = getComputedStyle(element);
        const visibleCols = parseFloat(computedStyle.getPropertyValue("--gs-visible-cols"));
        if (!isNaN(visibleCols)) {
            // Calculate: round(up, visibleCols, 1) - 1
            // This rounds up to the nearest integer, then subtracts 1
            const roundedCols = Math.ceil(visibleCols);
            const visibleGaps = roundedCols - 1;
            element.style.setProperty("--gs-visible-gaps", visibleGaps);
        }
    };
    // Initial calculation
    updateGaps();
    // Watch for changes using ResizeObserver or MutationObserver
    if (window.ResizeObserver) {
        const observer = new ResizeObserver(()=>{
            updateGaps();
        });
        observer.observe(element);
    } else {
        // Fallback to MutationObserver for older browsers
        const observer = new MutationObserver(()=>{
            updateGaps();
        });
        observer.observe(element, {
            attributes: true,
            attributeFilter: [
                "style"
            ],
            subtree: false
        });
    }
}
/**
 * Need to following functions:
 * - total number of items in the collection
 * - total number of items fully visible in the viewport
 * - calculate number of 'pages'
 * - generate links for pages
 *
 */ const $d48e1cd1057d96ba$var$throttle = function(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(()=>inThrottle = false, limit);
        }
    };
};
// debounce function
function $d48e1cd1057d96ba$var$debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
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
 */ const $d48e1cd1057d96ba$var$onScrollEnd = function(element, func, ...args) {
    const context = this;
    if ("onscrollend" in window) element.addEventListener("scrollend", ()=>{
        func.apply(context, args);
    });
    else // fall back to scroll listener with timeout for browsers
    // that don't support scrollend
    element.addEventListener("scroll", ()=>{
        clearTimeout(window.scrollEndTimer);
        window.scrollEndTimer = setTimeout(()=>{
            func.apply(context, args);
        }, 50);
    });
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
 */ const $d48e1cd1057d96ba$var$withinViewport = (element, parent, offset)=>{
    offset = offset || 0;
    const elementRect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    return elementRect.left >= parentRect.left - offset && elementRect.right <= parentRect.right;
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
 */ const $d48e1cd1057d96ba$var$itemLeftOfParent = (element, parent, offset)=>{
    offset = offset || 0;
    const elementRect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    return elementRect.left <= parentRect.left + offset;
};
/**
 * Declare our glider object
 *
 */ const $d48e1cd1057d96ba$var$glider = {};
/**
 * Object passed to the init function to initialise the glider object
 * includes options for the glider object and selectors for the pager and grid
 * and grid items.
 * @param {*} element
 */ $d48e1cd1057d96ba$var$glider.init = function({ element: element, gridSelector: gridSelector = "[data-glider-grid]", pagerSelector: pagerSelector = "[data-glider-pager]", itemSelector: itemSelector = "[data-glider-item]", nextButtonSelector: nextButtonSelector = '[data-glider-nav="next"]', prevButtonSelector: prevButtonSelector = '[data-glider-nav="prev"]', startButtonSelector: startButtonSelector = '[data-glider-nav="start"]', endButtonSelector: endButtonSelector = '[data-glider-nav="end"]' } = {}) {
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
$d48e1cd1057d96ba$var$glider.getNumberOfItems = function() {
    return this.items.length;
};
$d48e1cd1057d96ba$var$glider.refreshLayout = function() {
    this.updatePager();
    this.updateActivePage();
    this.updateButtonStates();
};
/**
 * Calculate the number of displayed elements that should be visible in
 * the viewport at this point.
 */ $d48e1cd1057d96ba$var$glider.getNumberOfItemsFullyVisible = function() {
    const computedStyle = getComputedStyle(this.grid);
    const gapSize = parseInt(computedStyle.gap, 10);
    const itemWidth = this.items[0].offsetWidth + gapSize;
    const containerWidth = this.grid.offsetWidth;
    return Math.floor((containerWidth + gapSize) / itemWidth);
};
$d48e1cd1057d96ba$var$glider.getNumberOfPages = function() {
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
 */ $d48e1cd1057d96ba$var$glider.calculateScrollIndex = function() {
    const numberOfPages = this.getNumberOfPages();
    let scrollIndex = [];
    for(let i = 0; i < numberOfPages; i++)scrollIndex.push(i * this.getNumberOfItemsFullyVisible());
    return scrollIndex;
};
$d48e1cd1057d96ba$var$glider.populatePager = function() {
    this.pager.innerHTML = "";
    const pagerLinks = this.generatePagerLinks();
    // if we only have one page, don't show the pager
    if (pagerLinks.length === 1) return;
    pagerLinks.forEach((link)=>{
        this.pager.appendChild(link);
    });
};
$d48e1cd1057d96ba$var$glider.generatePagerLinks = function() {
    const numberOfPages = this.getNumberOfPages();
    let pagerLinks = [];
    let scrollIndex = this.calculateScrollIndex();
    for(let i = 0; i < numberOfPages; i++)pagerLinks.push(this.generatePagerLink(i, scrollIndex[i]));
    return pagerLinks;
};
$d48e1cd1057d96ba$var$glider.generatePagerLink = function(pageNumber, itemNumber) {
    const btn = document.createElement("button");
    btn.setAttribute("data-glider-pager-item", "");
    btn.setAttribute("aria-label", `Page ${pageNumber + 1}`);
    btn.setAttribute("data-page", pageNumber);
    btn.setAttribute("data-item", itemNumber);
    return btn;
};
$d48e1cd1057d96ba$var$glider.updatePager = function() {
    const that = this;
    this.populatePager();
    // TODO: potentially refactor this out?
    // once we've populate the pager we need to add the event listeners
    // TODO could we not add the actual scroll position to the button when we
    // are setting it rather than calculate it here, so we can just get the
    // position that we need to scroll to???
    const pagerItems = this.pager.querySelectorAll(this.pagerItemSelector);
    pagerItems.forEach((item)=>{
        item.addEventListener("click", function() {
            const i = item.getAttribute("data-item");
            const left = that.items[i].offsetLeft;
            const parent = that.items[i].parentElement;
            parent.scrollTo({
                left: left,
                behavior: "smooth"
            });
        });
    });
};
$d48e1cd1057d96ba$var$glider.updateActivePage = function() {
    if (!this.items.length) return;
    const scrollIndex = this.calculateScrollIndex();
    const lastPage = scrollIndex.length - 1;
    // Prioritise scroll-position based detection for end-of-track edge cases
    // (sub-pixel rounding, gaps and partial clipping of the final item).
    if (this.isAtEnd()) {
        this.setActivePage(lastPage);
        return;
    }
    // if the last element is in view, set the active page to the last page
    if ($d48e1cd1057d96ba$var$withinViewport(this.items[this.items.length - 1], this.grid, 16)) {
        this.setActivePage(lastPage);
        return;
    }
    // set active page to 0
    let activePage = 0;
    // loop through our scrollIndex and check each one to see if it is to the
    // left of the parent element (or within the buffer zone)
    for(let i = 0; i < scrollIndex.length; i++)if ($d48e1cd1057d96ba$var$itemLeftOfParent(this.items[scrollIndex[i]], this.grid, 16)) activePage = i;
    this.setActivePage(activePage);
};
$d48e1cd1057d96ba$var$glider.setActivePage = function(pageNumber) {
    const pagerItems = this.pager.querySelectorAll(this.pagerItemSelector);
    if (pagerItems.length > 0) {
        pagerItems.forEach((item)=>{
            item.removeAttribute("data-state");
        });
        pagerItems[pageNumber].setAttribute("data-state", "active");
    }
};
/**
 * Initialise the pager
 */ $d48e1cd1057d96ba$var$glider.initPager = function() {
    const that = this;
    // attach event listener for resize event
    window.addEventListener("resize", $d48e1cd1057d96ba$var$debounce(function() {
        that.refreshLayout();
    }, 250));
    // attach event listener for orientation change
    window.addEventListener("orientationchange", function() {
        that.refreshLayout();
    });
    this.refreshLayout();
    this.onScrollEnd();
};
$d48e1cd1057d96ba$var$glider.initButtons = function() {
    const nextButton = this.glider.querySelector(this.nextButtonSelector);
    const prevButton = this.glider.querySelector(this.prevButtonSelector);
    const startButton = this.glider.querySelector(this.startButtonSelector);
    const endButton = this.glider.querySelector(this.endButtonSelector);
    if (nextButton) nextButton.addEventListener("click", ()=>{
        this.scrollToNextPage();
    });
    if (prevButton) prevButton.addEventListener("click", ()=>{
        this.scrollToPreviousPage();
    });
    if (startButton) startButton.addEventListener("click", ()=>{
        this.scrollToStart();
    });
    if (endButton) endButton.addEventListener("click", ()=>{
        this.scrollToEnd();
    });
    // Set initial button states
    this.updateButtonStates();
};
$d48e1cd1057d96ba$var$glider.initScroll = function() {
    const that = this;
    const throttledScrollHandler = $d48e1cd1057d96ba$var$throttle(function() {
        that.updateActivePage();
    }, 50);
    this.grid.addEventListener("scroll", throttledScrollHandler);
};
$d48e1cd1057d96ba$var$glider.onScrollEnd = function() {
    const that = this;
    const handleScrollEnd = ()=>{
        that.updateActivePage();
        that.updateButtonStates();
    };
    $d48e1cd1057d96ba$var$onScrollEnd(this.grid, handleScrollEnd);
};
/**
 * Scroll to the start of the grid
 */ $d48e1cd1057d96ba$var$glider.scrollToStart = function() {
    this.grid.scrollTo({
        left: 0,
        behavior: "smooth"
    });
};
/**
 * Scroll to the end of the grid
 */ $d48e1cd1057d96ba$var$glider.scrollToEnd = function() {
    const lastItem = this.items[this.items.length - 1];
    const scrollPosition = lastItem.offsetLeft + lastItem.offsetWidth - this.grid.offsetWidth;
    this.grid.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth"
    });
};
/**
 * Scroll to the next page
 */ $d48e1cd1057d96ba$var$glider.scrollToNextPage = function() {
    const scrollIndex = this.calculateScrollIndex();
    const currentPage = this.getCurrentPage();
    if (currentPage < scrollIndex.length - 1) {
        const nextPageItemIndex = scrollIndex[currentPage + 1];
        const left = this.items[nextPageItemIndex].offsetLeft;
        this.grid.scrollTo({
            left: left,
            behavior: "smooth"
        });
    } else // If we're on the last page, scroll to end
    this.scrollToEnd();
};
/**
 * Scroll to the previous page
 */ $d48e1cd1057d96ba$var$glider.scrollToPreviousPage = function() {
    const scrollIndex = this.calculateScrollIndex();
    const currentPage = this.getCurrentPage();
    if (currentPage > 0) {
        const prevPageItemIndex = scrollIndex[currentPage - 1];
        const left = this.items[prevPageItemIndex].offsetLeft;
        this.grid.scrollTo({
            left: left,
            behavior: "smooth"
        });
    } else // If we're on the first page, scroll to start
    this.scrollToStart();
};
/**
 * Get the current page number (0-indexed)
 * Helper function for navigation methods
 */ $d48e1cd1057d96ba$var$glider.getCurrentPage = function() {
    if (!this.items.length) return 0;
    const scrollIndex = this.calculateScrollIndex();
    const lastPage = scrollIndex.length - 1;
    if (this.isAtEnd()) return lastPage;
    // if the last element is in view, return the last page
    if ($d48e1cd1057d96ba$var$withinViewport(this.items[this.items.length - 1], this.grid, 16)) return lastPage;
    // set active page to 0
    let activePage = 0;
    // loop through our scrollIndex and check each one to see if it is to the
    // left of the parent element (or within the buffer zone)
    for(let i = 0; i < scrollIndex.length; i++)if ($d48e1cd1057d96ba$var$itemLeftOfParent(this.items[scrollIndex[i]], this.grid, 16)) activePage = i;
    return activePage;
};
/**
 * Check if we're at the start of the grid
 * @returns {boolean}
 */ $d48e1cd1057d96ba$var$glider.isAtStart = function() {
    return this.grid.scrollLeft <= 10;
};
/**
 * Check if we're at the end of the grid
 * @returns {boolean}
 */ $d48e1cd1057d96ba$var$glider.isAtEnd = function() {
    const tolerance = 1;
    return this.grid.scrollLeft + this.grid.offsetWidth >= this.grid.scrollWidth - tolerance;
};
/**
 * Update navigation button states based on scroll position
 * Disables prev/start buttons at the start, next/end buttons at the end
 */ $d48e1cd1057d96ba$var$glider.updateButtonStates = function() {
    const nextButton = this.glider.querySelector(this.nextButtonSelector);
    const prevButton = this.glider.querySelector(this.prevButtonSelector);
    const startButton = this.glider.querySelector(this.startButtonSelector);
    const endButton = this.glider.querySelector(this.endButtonSelector);
    const atStart = this.isAtStart();
    const atEnd = this.isAtEnd();
    if (prevButton) prevButton.disabled = atStart;
    if (startButton) startButton.disabled = atStart;
    if (nextButton) nextButton.disabled = atEnd;
    if (endButton) endButton.disabled = atEnd;
};
/**
 * Creates a pager object with the given slider.
 *
 * Pass the slider object to the pager object to create the pager.
 *
 * @param {Object} slider - The slider object to create the pager for.
 * @return {Pager} - The pager object.
 */ const $d48e1cd1057d96ba$export$5c49591af2a4b68b = function(element) {
    // Apply CSS round() polyfill if needed
    $d48e1cd1057d96ba$var$polyfillCSSRound(element);
    const obj = Object.create($d48e1cd1057d96ba$var$glider);
    obj.init({
        element: element
    });
    return obj;
};
const $d48e1cd1057d96ba$var$initGlider = function({ sliderSelector: sliderSelector = "[data-glider]" } = {}) {
    const els = document.querySelectorAll(sliderSelector);
    els.forEach((el)=>{
        $d48e1cd1057d96ba$export$5c49591af2a4b68b(el);
    });
};
var $d48e1cd1057d96ba$export$2e2bcd8739ae039 = $d48e1cd1057d96ba$var$initGlider;


export {$d48e1cd1057d96ba$export$5c49591af2a4b68b as makeGlider, $d48e1cd1057d96ba$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=gridslider.mjs.map
