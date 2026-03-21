(() => {
  let t = function (t, e) {
      let i;
      return function () {
        let r = arguments;
        i || (t.apply(this, r), (i = !0), setTimeout(() => (i = !1), e));
      };
    },
    e = function (t, e, ...i) {
      let r = this;
      "onscrollend" in window
        ? t.addEventListener("scrollend", () => {
            e.apply(r, i);
          })
        : t.addEventListener("scroll", (t) => {
            (clearTimeout(window.scrollEndTimer),
              (window.scrollEndTimer = setTimeout(() => {
                e.apply(r, i);
              }, 50)));
          });
    },
    i = (t, e, i) => {
      i = i || 0;
      let r = t.getBoundingClientRect(),
        l = e.getBoundingClientRect();
      return r.left >= l.left - i && r.right <= l.right;
    },
    r = (t, e, i) => {
      i = i || 0;
      let r = t.getBoundingClientRect(),
        l = e.getBoundingClientRect();
      return r.left <= l.left + i;
    },
    l = {};
  ((l.init = function ({
    element: t,
    gridSelector: e = "[data-glider-grid]",
    pagerSelector: i = "[data-glider-pager]",
    itemSelector: r = "[data-glider-item]",
    nextButtonSelector: l = '[data-glider-nav="next"]',
    prevButtonSelector: s = '[data-glider-nav="prev"]',
    startButtonSelector: n = '[data-glider-nav="start"]',
    endButtonSelector: o = '[data-glider-nav="end"]',
  } = {}) {
    ((this.glider = t),
      (this.grid = this.glider.querySelector(e)),
      (this.pager = this.glider.querySelector(i)),
      (this.nextButtonSelector = l),
      (this.prevButtonSelector = s),
      (this.startButtonSelector = n),
      (this.endButtonSelector = o),
      (this.items = this.grid.querySelectorAll(r)),
      (this.pagerItemSelector = "[data-glider-pager-item]"),
      this.initPager(),
      this.initButtons(),
      this.initScroll());
  }),
    (l.getNumberOfItems = function () {
      return this.items.length;
    }),
    (l.refreshLayout = function () {
      (this.updatePager(), this.updateActivePage(), this.updateButtonStates());
    }),
    (l.getNumberOfItemsFullyVisible = function () {
      let t = parseInt(getComputedStyle(this.grid).gap, 10),
        e = this.items[0].offsetWidth + t;
      return Math.floor((this.grid.offsetWidth + t) / e);
    }),
    (l.getNumberOfPages = function () {
      return Math.ceil(
        this.getNumberOfItems() / this.getNumberOfItemsFullyVisible(),
      );
    }),
    (l.calculateScrollIndex = function () {
      let t = this.getNumberOfPages(),
        e = [];
      for (let i = 0; i < t; i++)
        e.push(i * this.getNumberOfItemsFullyVisible());
      return e;
    }),
    (l.populatePager = function () {
      this.pager.innerHTML = "";
      let t = this.generatePagerLinks();
      1 !== t.length &&
        t.forEach((t) => {
          this.pager.appendChild(t);
        });
    }),
    (l.generatePagerLinks = function () {
      let t = this.getNumberOfPages(),
        e = [],
        i = this.calculateScrollIndex();
      for (let r = 0; r < t; r++) e.push(this.generatePagerLink(r, i[r]));
      return e;
    }),
    (l.generatePagerLink = function (t, e) {
      let i = document.createElement("button");
      return (
        i.setAttribute("data-glider-pager-item", ""),
        i.setAttribute("aria-label", `Page ${t + 1}`),
        i.setAttribute("data-page", t),
        i.setAttribute("data-item", e),
        i
      );
    }),
    (l.updatePager = function () {
      let t = this;
      (this.populatePager(),
        this.pager.querySelectorAll(this.pagerItemSelector).forEach((e) => {
          e.addEventListener("click", function () {
            let i = e.getAttribute("data-item"),
              r = t.items[i].offsetLeft;
            t.items[i].parentElement.scrollTo({ left: r, behavior: "smooth" });
          });
        }));
    }),
    (l.updateActivePage = function () {
      if (!this.items.length) return;
      let t = this.calculateScrollIndex(),
        e = t.length - 1;
      if (this.isAtEnd() || i(this.items[this.items.length - 1], this.grid, 16))
        return void this.setActivePage(e);
      let l = 0;
      for (let e = 0; e < t.length; e++)
        r(this.items[t[e]], this.grid, 16) && (l = e);
      this.setActivePage(l);
    }),
    (l.setActivePage = function (t) {
      let e = this.pager.querySelectorAll(this.pagerItemSelector);
      e.length > 0 &&
        (e.forEach((t) => {
          t.removeAttribute("data-state");
        }),
        e[t].setAttribute("data-state", "active"));
    }),
    (l.initPager = function () {
      var t, e;
      let i,
        r = this;
      (window.addEventListener(
        "resize",
        ((t = function () {
          r.refreshLayout();
        }),
        function () {
          let r = this,
            l = arguments,
            s = e && !i;
          (clearTimeout(i),
            (i = setTimeout(function () {
              ((i = null), e || t.apply(r, l));
            }, 250)),
            s && t.apply(r, l));
        }),
      ),
        this.refreshLayout(),
        this.onScrollEnd());
    }),
    (l.initButtons = function () {
      let t = this.glider.querySelector(this.nextButtonSelector),
        e = this.glider.querySelector(this.prevButtonSelector),
        i = this.glider.querySelector(this.startButtonSelector),
        r = this.glider.querySelector(this.endButtonSelector);
      (t &&
        t.addEventListener("click", () => {
          this.scrollToNextPage();
        }),
        e &&
          e.addEventListener("click", () => {
            this.scrollToPreviousPage();
          }),
        i &&
          i.addEventListener("click", () => {
            this.scrollToStart();
          }),
        r &&
          r.addEventListener("click", () => {
            this.scrollToEnd();
          }),
        this.updateButtonStates());
    }),
    (l.initScroll = function () {
      let e = this,
        i = t(function () {
          e.updateActivePage();
        }, 50);
      this.grid.addEventListener("scroll", i);
    }),
    (l.onScrollEnd = function () {
      let t = this;
      e(this.grid, () => {
        (t.updateActivePage(), t.updateButtonStates());
      });
    }),
    (l.scrollToStart = function () {
      this.grid.scrollTo({ left: 0, behavior: "smooth" });
    }),
    (l.scrollToEnd = function () {
      let t = this.items[this.items.length - 1],
        e = t.offsetLeft + t.offsetWidth - this.grid.offsetWidth;
      this.grid.scrollTo({ left: Math.max(0, e), behavior: "smooth" });
    }),
    (l.scrollToNextPage = function () {
      let t = this.calculateScrollIndex(),
        e = this.getCurrentPage();
      if (e < t.length - 1) {
        let i = t[e + 1],
          r = this.items[i].offsetLeft;
        this.grid.scrollTo({ left: r, behavior: "smooth" });
      } else this.scrollToEnd();
    }),
    (l.scrollToPreviousPage = function () {
      let t = this.calculateScrollIndex(),
        e = this.getCurrentPage();
      if (e > 0) {
        let i = t[e - 1],
          r = this.items[i].offsetLeft;
        this.grid.scrollTo({ left: r, behavior: "smooth" });
      } else this.scrollToStart();
    }),
    (l.getCurrentPage = function () {
      if (!this.items.length) return 0;
      let t = this.calculateScrollIndex(),
        e = t.length - 1;
      if (this.isAtEnd() || i(this.items[this.items.length - 1], this.grid, 16))
        return e;
      let l = 0;
      for (let e = 0; e < t.length; e++)
        r(this.items[t[e]], this.grid, 16) && (l = e);
      return l;
    }),
    (l.isAtStart = function () {
      return this.grid.scrollLeft <= 10;
    }),
    (l.isAtEnd = function () {
      return (
        this.grid.scrollLeft + this.grid.offsetWidth >=
        this.grid.scrollWidth - 1
      );
    }),
    (l.updateButtonStates = function () {
      let t = this.glider.querySelector(this.nextButtonSelector),
        e = this.glider.querySelector(this.prevButtonSelector),
        i = this.glider.querySelector(this.startButtonSelector),
        r = this.glider.querySelector(this.endButtonSelector),
        l = this.isAtStart(),
        s = this.isAtEnd();
      (e && (e.disabled = l),
        i && (i.disabled = l),
        t && (t.disabled = s),
        r && (r.disabled = s));
    }));
  let s = function (t) {
    let e = Object.create(l);
    return (e.init({ element: t }), e);
  };
  var n = function ({ sliderSelector: t = "[data-glider]" } = {}) {
    document.querySelectorAll(t).forEach((t) => {
      s(t);
    });
  };
  window.addEventListener("DOMContentLoaded", () => {
    n();
  });
})();
//# sourceMappingURL=gridslider.js.map
