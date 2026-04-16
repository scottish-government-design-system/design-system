function M(i = document) {
  [].slice.call(i.querySelectorAll('[data-module="ds-accordion"]:not(.js-instantiated)')).forEach((h) => new f.components.Accordion(h).init()), [].slice.call(i.querySelectorAll('[data-module="ds-back-to-top"]:not(.js-instantiated)')).forEach((h) => new f.components.BackToTop(h).init()), [].slice.call(i.querySelectorAll('[data-module="ds-character-count"]:not(.js-instantiated)')).forEach((h) => new f.components.CharacterCount(h).init()), [].slice.call(i.querySelectorAll('[data-module="ds-checkboxes"]:not(.js-instantiated)')).forEach((h) => new f.components.Checkboxes(h).init()), [].slice.call(document.querySelectorAll('[data-module="ds-cookie-notification"]:not(.js-instantiated)')).forEach((h) => new f.components.CookieNotification(h).init()), [].slice.call(document.querySelectorAll('[data-module="ds-datepicker"]:not(.js-instantiated)')).forEach((h) => new f.components.DatePicker(h).init()), [].slice.call(document.querySelectorAll('[data-module="ds-details"]:not(.js-instantiated)')).forEach((h) => new f.components.Details(h).init()), [].slice.call(i.querySelectorAll(".ds_hide-page")).forEach((h) => new f.components.HideThisPage(h).init()), [].slice.call(i.querySelectorAll('[data-module="ds-mobile-navigation-menu"]:not(.js-instantiated)')).forEach((h) => new f.components.SiteNavigation(h).init()), [].slice.call(i.querySelectorAll('[data-module="ds-notification"]:not(.js-instantiated)')).forEach((h) => new f.components.NotificationBanner(h).init()), [].slice.call(i.querySelectorAll('[data-module="ds-side-navigation"]:not(.js-instantiated)')).forEach((h) => new f.components.SideNavigation(h).init()), f.components.skipLinks.init(), [].slice.call(i.querySelectorAll('[data-module="ds-step-navigation"]:not(.js-instantiated)')).forEach((h) => new f.components.StepNavigation(h).init()), [].slice.call(i.querySelectorAll("table[data-smallscreen]")).forEach((h) => new f.components.MobileTable(h).init()), [].slice.call(document.querySelectorAll('[data-module="ds-tabs"]:not(.js-instantiated)')).forEach((h) => new f.components.Tabs(h).init()), [].slice.call(document.querySelectorAll('[data-module="ds-tabs-navigation"]:not(.js-instantiated)')).forEach((h) => new f.components.TabsNavigation(h).init()), f.base.tools.tracking.init();
}
function A() {
  return window.DS = window.DS || {}, window.DS.elementIdModifier = window.DS.elementIdModifier || 0, window.DS.elementIdModifier += 1, `ds${window.DS.elementIdModifier}`;
}
const w = function(i, t = "GET") {
  const e = new XMLHttpRequest();
  return new Promise((s, n) => {
    e.onreadystatechange = () => {
      e.readyState === 4 && (e.status >= 200 && e.status < 300 ? s(e) : n({
        status: e.status,
        statusText: e.statusText
      }));
    }, e.open(t, i, !0), e.send();
  });
}, p = {
  /**
   * Sets a storage item (local, session, or cookie)
   *
   * Usage example:
   * storage.set({type: 'cookie', category: 'necessary', name: 'somethinganalyticsy', value: 1, expires: 7}})
   *
   * @param {object} obj
   *   - {string} type (accepted values: 'cookie', 'local', 'session')
   *   - {string} category - used to determine whether user has given permission to store this
   *   - {string} name
   *   - {string} value
   *   - {number} expires - days to remember a cookie for (only relevant to cookies)
   * @returns {void}
   */
  set: function(i) {
    if (p.hasPermission(i.category)) {
      if (i.type === "cookie")
        return p.cookie.set(i.name, i.value, i.expiresDays);
      i.type === "local" ? localStorage.setItem(i.name, i.value) : i.type === "session" && sessionStorage.setItem(i.name, i.value);
    }
  },
  /**
   * Gets a storage item (local, session, or cookie)
   *
   * Usage example:
   * storage.get({type: 'session', name: 'remembertabs'})
   *
   * @param {object} obj
   *   - {string} storage (accepted values: 'cookie', 'local', 'session')
   *   - {string} name
   *
   * @returns {string} value of the storage item
   */
  get: function(i) {
    let t = "";
    return i.type === "cookie" ? t = p.cookie.get(i.name) : i.type === "local" ? t = localStorage.getItem(i.name) : i.type === "session" && (t = sessionStorage.getItem(i.name)), t || "";
  },
  /**
   * removes a storage item (local, session, or cookie)
   *
   * Usage example:
   * storage.remove({type: 'cookie', name: 'somethinganalyticsy'}})
   *
   * @param {object} obj
   *   - {string} type (accepted values: 'cookie', 'local', 'session')
   *   - {string} name
   * @returns {void}
   */
  remove: function(i) {
    i.type === "cookie" ? p.cookie.remove(i.name) : i.type === "local" ? localStorage.removeItem(i.name) : i.type === "session" && sessionStorage.removeItem(i.name);
  },
  /**
   * Sets a cookie if permission for this category of storage is given
   * - more direct method than storage.set({})
   *
   * @param {string} category - the category of the cookie
   * @param {string} name - the name of the cookie
   * @param {string} value - the value of the cookie
   * @param {number} expiresDays - the number of days to expire the cookie after
   * @returns {void}
   */
  setCookie: function(i, t, e, s) {
    p.hasPermission(i) && p.cookie.set(t, e, s);
  },
  /**
   * Sets a local storage item if permission for this category of storage is given
   * - more direct method than storage.set({})
   *
   * @param {CategoryArgs} category - the category of the cookie
   * @param {string} name - the name of the cookie
   * @param {string} value - the value of the cookie
   * @returns {void}
   */
  setLocalStorage: function(i, t, e) {
    p.hasPermission(i) && localStorage.setItem(t, e);
  },
  /**
   * Sets a session storage item if permission for this category of storage is given
   * - more direct method than storage.set({})
   *
   * @param {CategoryArgs} category - the category of the cookie
   * @param {string} name - the name of the cookie
   * @param {string} value - the value of the cookie
   * @returns {void}
   */
  setSessionStorage: function(i, t, e) {
    p.hasPermission(i) && sessionStorage.setItem(t, e);
  },
  /**
   * Get a cookie value
   * - more direct method than get({type: 'cookies', name: foo})
   *
   * @param {string} name - the name of the cookie
   * @returns {string | null}
   */
  getCookie: function(i) {
    return p.cookie.get(i);
  },
  /**
   * Get a localStorage value
   * - more direct method than get({type: 'localStorage', name: foo})
   *
   * @param {string} name - the name of the localStorage item
   * @returns {string | null}
   */
  getLocalStorage: function(i) {
    return localStorage.getItem(i);
  },
  /**
   * Get a sessionStorage value
   * - more direct method than get({type: 'sessionStorage', name: foo})
   *
   * @param {string} name - the name of the sessionStorage item
   * @returns {string | null}
   */
  getSessionStorage: function(i) {
    return sessionStorage.getItem(i);
  },
  /**
   * Remove a cookie
   * - more direct method than remove({type: 'cookies', name: foo}
   *
   * @param {string} name - the name of the cookie
   * @returns {void}
   */
  removeCookie: function(i) {
    return p.cookie.remove(i);
  },
  /**
   * Remove a localStorage item
   * - more direct method than remove({type: 'localStorage', name: foo}
   *
   * @param {string} name - the name of the localStorage item
   * @returns {void}
   */
  removeLocalStorage: function(i) {
    return localStorage.removeItem(i);
  },
  /**
   * Remove a sessionStorage item
   * - more direct method than remove({type: 'sessionStorage', name: foo}
   *
   * @param {string} name - the name of the sessionStorage item
   * @returns {void}
   */
  removeSessionStorage: function(i) {
    return sessionStorage.removeItem(i);
  },
  /**
   * Cookie handling methods
   */
  cookie: {
    /**
     * Set a cookie
     * - encodes value in base64
     *
     * @param {string} name - the name of the cookie
     * @param {string} value - the value of the cookie
     * @param {number} expiresDays - the number of days until expiration
     * @returns {CookieDataArgs}
     */
    set: function(i, t, e) {
      t = window.btoa(t);
      const s = {
        name: i,
        value: t
      };
      if (e) {
        const a = /* @__PURE__ */ new Date();
        a.setTime(a.getTime() + e * 24 * 60 * 60 * 1e3), s.expires = a.toUTCString();
      }
      let n = i + "=" + t + "; ";
      return s.expires && (n += "expires=" + s.expires + "; "), n += "path=/", document.cookie = n, s;
    },
    /**
     * Get a cookie value
     * - searches document.cookie for a matching name
     * - decodes base64 encoded values
     *
     * @param {string} name - the name of the cookie
     * @returns {string | null} - the cookie value, or null if no matching cookie found
     */
    get: function(i) {
      const t = i + "=", e = document.cookie.split(";");
      for (let s = 0, n = e.length; s < n; s++) {
        let a = e[s];
        for (; a.charAt(0) === " "; )
          a = a.substring(1, a.length);
        if (a.indexOf(t) === 0) {
          const o = a.substring(t.length, a.length);
          return /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(o) ? window.atob(o) : o;
        }
      }
      return null;
    },
    /**
     * Remove a cookie
     * - indiscriminately hit no domain, domain, and .domain
     * - tries to cover all bases
     *
     * @param {string} name - the name of the cookie
     * @param {Window} _window - the window object to use
     * @returns {void}
     */
    remove: function(i, t = window) {
      const e = t.location.host.split(".");
      let s;
      for (p.unsetCookieWithDomain(i); e.length > 1; )
        s = e.join("."), p.unsetCookieWithDomain(i, s), p.unsetCookieWithDomain(i, `.${s}`), e.shift();
    }
  },
  /**
   * Check if permission has been given to set a storage item for a given category
   *
   * @param {CategoryArgs} category - the category to check
   * @returns {boolean}
   */
  hasPermission(i) {
    const t = p.get({
      type: "cookie",
      name: "cookiePermissions"
    }) || "";
    let e = {};
    return p.getIsJsonString(t) && (e = JSON.parse(t)), i === "necessary" || e[i] === !0;
  },
  /**
   * Check if a string is valid JSON
   *
   * @param {string} string - the string to check
   * @returns {boolean}
   */
  getIsJsonString: function(i) {
    try {
      JSON.parse(i);
    } catch (t) {
      return this.error = t, !1;
    }
    return !0;
  },
  /**
   * Unset a cookie for a given domain
   *
   * @param {string} name - the name of the cookie
   * @param {string} domain - the domain of the cookie
   * @returns {void}
   */
  unsetCookieWithDomain: function(i, t) {
    const e = t ? `domain=${t};` : "";
    document.cookie = `${i}=;path=/;${e};expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  }
};
window.storage = p;
function S(i) {
  i.tabIndex = -1, i.addEventListener("focusout", () => {
    i.removeAttribute("tabindex");
  }), i.focus();
}
class D {
  tokens;
  /**
   * TokenList is a rough equivalent of DOMTokenList for managing a space-separated list of strings.
   *
   * @param {string} tokens
   */
  constructor(t) {
    t && t.trim().length > 0 ? this.tokens = t.replace(/\s+/g, " ").split(" ") : this.tokens = [];
  }
  /**
   * Add one or more strings to the token list
   *
   * @param {string | Array<string>} itemsToAdd - space-separated list or array of strings to add
   * @returns {string} - updated value of the token list
   */
  add(t) {
    return typeof t == "string" && (t = t.replace(/\s+/g, " ").split(" ")), t.forEach((e) => {
      this.tokens.includes(e) || this.tokens.push(e);
    }), this.value;
  }
  /**
   * Remove one or more strings from the token list
   *
   * @param {string} tokens - space-separated list of strings to remove
   * @returns {string} - updated value of the token list
   */
  remove(t) {
    return t.replace(/\s+/g, " ").split(" ").forEach((s) => {
      this.tokens.includes(s) && this.tokens.splice(this.tokens.indexOf(s), 1);
    }), this.value;
  }
  /**
   * Check if the token list contains a specific string
   *
   * @param {string} token - string to check for
   * @returns {boolean}
   */
  contains(t) {
    return this.tokens.includes(t);
  }
  /**
   * Get the current value of the token list as a space-separated string
   *
   * @returns {string}
   */
  get value() {
    return this.tokens.join(" ").trim();
  }
}
const x = "v4.0.0";
function E(i) {
  return i = String(i), i.trim().toLowerCase().replace(/['"’‘”“`]/g, "").replace(/[\W|_]+/g, "-").replace(/^-+|-+$/g, "");
}
function C(i) {
  const t = [];
  if (i.parentElement) {
    const e = [].slice.call(i.parentElement.children);
    for (let s = 0, n = e.length; s < n && e[s] !== i; s++)
      t.push(e[s]);
  }
  return t;
}
function $(i, t, e) {
  i.reverse();
  for (let s = 0, n = i.length; s < n; s++) {
    if (i[s].matches(t))
      return i[s];
    if (i[s].matches(e) && i[s].querySelector(t))
      return i[s].querySelector(t);
  }
  return null;
}
const r = {
  hasAddedCanonicalUrl: !1,
  hasAddedClickTracking: !1,
  hasAddedPrefersColorScheme: !1,
  hasAddedVersion: !1,
  /**
   * Initialize tracking
   *
   * @param {HTMLElement} scope - the element to initialize tracking on
   * @returns {void}
   */
  init: function(i = document.documentElement) {
    let t;
    for (t in r.add)
      r.add[t](i);
  },
  /**
   * Gather elements by class name
   *
   * @param {string} className - the class name to gather elements for
   * @param {HTMLElement} scope - the element to search within
   * @returns {HTMLElement[]}
   */
  gatherElements: function(i, t) {
    const e = [].slice.call(t.querySelectorAll(`.${i}`));
    return t.classList && t.classList.contains(i) && e.push(t), e;
  },
  /**
   * Get the type of click (left/middle/right + modifier keys)
   *
   * @param {MouseEvent} event
   * @returns {string | undefined} - click type
   */
  getClickType: function(i) {
    switch (i.type) {
      case "click":
        return i.ctrlKey ? "ctrl click" : i.metaKey ? "command/win click" : i.shiftKey ? "shift click" : "primary click";
      case "auxclick":
        return "middle click";
      case "contextmenu":
        return "secondary click";
    }
  },
  /**
   * Get the nearest section header element for an element
   * - skips certain exceptions such as navigation elements
   * - looks for certain special cases such as page headers
   * - recursively checks parent elements if none found in previous siblings
   * - returns undefined if in an exception element
   *
   * @param {HTMLElement} element - the element to find the nearest section header for
   * @returns {Element | undefined} - nearest section header element
   */
  getNearestSectionHeader: function(i) {
    const t = "nav,.ds_metadata,.ds_summary-card__header,.ds_card__content-header", e = "h1,h2,h3,h4,h5,h6,.ds_details__summary", s = ".ds_page-header,.ds_layout__header,.ds_accordion-item__header";
    if (typeof i.closest == "function" && i.closest(t))
      return;
    const n = $(C(i), e, s);
    let a;
    return n ? a = n : i.parentElement && (a = r.getNearestSectionHeader(i.parentElement)), a;
  },
  /**
   * Push data to the dataLayer
   *
   * @param data
   * @returns {void}
   */
  pushToDataLayer: function(i) {
    window.dataLayer = window.dataLayer || [], window.dataLayer.push(i);
  },
  /**
   * Add various tracking features
   */
  add: {
    /**
     * Add click tracking
     * - listens for click, auxclick and contextmenu events
     * - pushes click type to dataLayer
     * - only adds listeners once
     *
     * @param {HTMLElement} scope - the element to add click tracking to
     * @returns {void}
     */
    clicks: function(i = document.documentElement) {
      r.hasAddedClickTracking || (i.addEventListener("click", (t) => {
        r.pushToDataLayer({
          method: r.getClickType(t)
        });
      }), i.addEventListener("auxclick", (t) => {
        (t.button === 1 || t.buttons === 4) && r.pushToDataLayer({
          method: r.getClickType(t)
        });
      }), i.addEventListener("contextmenu", (t) => {
        r.pushToDataLayer({
          method: r.getClickType(t)
        });
      }), r.hasAddedClickTracking = !0);
    },
    /**
     * Add canonical URL to dataLayer
     * - only adds once
     *
     * @returns {void}
     */
    canonicalUrl: () => {
      const i = document.querySelector('link[rel="canonical"]');
      i && i.href && (r.hasAddedCanonicalUrl || (r.pushToDataLayer({
        canonicalUrl: i.href
      }), r.hasAddedCanonicalUrl = !0));
    },
    /**
     * Add prefers color scheme to dataLayer
     * - only adds once
     *
     * @returns {void}
     */
    prefersColorScheme: function() {
      if (!window.matchMedia)
        return;
      const i = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      r.hasAddedPrefersColorScheme || (r.pushToDataLayer({
        prefersColorScheme: i
      }), r.hasAddedPrefersColorScheme = !0);
    },
    /**
     * Add version to dataLayer
     * - only adds once
     *
     * @returns {void}
     */
    version: function() {
      r.hasAddedVersion || (r.pushToDataLayer({
        version: x
      }), r.hasAddedVersion = !0);
    },
    /**
     * Sets data-navigation="accordion-link" on links in accordion panels
     * Sets data-accordion="accordion-[NAME]-[open/close]-all" on accordion open/close all buttons
     * Sets data-accordion="accordion-[NAME]-[open/close]-[INDEX+1]" on accordion header buttons
     * Adds event listeners to toggle the open/close state used in those attributed
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    accordions: function(i = document.documentElement) {
      r.gatherElements("ds_accordion", i).forEach((e) => {
        let s = "";
        if (e.dataset.name && (s = e.dataset.name), !e.classList.contains("js-initialised"))
          return;
        [].slice.call(e.querySelectorAll("a:not(.ds_button)")).forEach((u) => {
          u.getAttribute("data-navigation") || u.setAttribute("data-navigation", "accordion-link");
        });
        const a = e.querySelector(".js-open-all"), o = [].slice.call(e.querySelectorAll(".ds_accordion-item"));
        function l() {
          const u = e.querySelectorAll(".ds_accordion-item--open").length;
          return o.length === u;
        }
        function c(u) {
          u && (l() ? u.setAttribute("data-accordion", `accordion-${s.length ? s + "-" : s}close-all`) : u.setAttribute("data-accordion", `accordion-${s.length ? s + "-" : s}open-all`));
        }
        function m(u, g) {
          const d = u.querySelector(".ds_accordion-item__button"), _ = u.querySelector(".ds_accordion-item__control");
          d.setAttribute("data-accordion", `accordion-${s.length ? s + "-" : s}${_.checked ? "close" : "open"}-${g + 1}`);
        }
        c(a), o.forEach((u, g) => {
          m(u, g);
        }), a && a.addEventListener("click", () => {
          o.forEach((u, g) => {
            m(u, g);
          }), c(a);
        }), o.forEach((u, g) => {
          const d = u.querySelector(".ds_accordion-item__button"), _ = u.querySelector(".ds_accordion-item__control");
          d.addEventListener("click", () => {
            d.setAttribute("data-accordion", `accordion-${s.length ? s + "-" : s}${_.checked ? "close" : "open"}-${g + 1}`), c(a);
          });
        });
      });
    },
    /**
     * Sets data-navigation="link-related-[INDEX+1]" to article aside components
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    asides: function(i = document.documentElement) {
      r.gatherElements("ds_article-aside", i).forEach((e) => {
        [].slice.call(e.querySelectorAll("a:not(.ds_button)")).forEach((n, a) => {
          n.getAttribute("data-navigation") || n.setAttribute("data-navigation", `link-related-${a + 1}`);
        });
      });
    },
    /**
     * Adds an event listener to push autocomplete data to the datalayer on click and keydown
     *
     * Pushed data:
     * - {string} event
     * - {string} searchText
     * - {string} clickText
     * - {number} resultsCount
     * - {string} clickedResults
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    autocompletes: function(i = document.documentElement) {
      function t(s, n) {
        r.pushToDataLayer({
          event: "autocomplete",
          searchText: s,
          clickText: n.dataset.autocompletetext,
          resultsCount: parseInt(n.dataset.autocompletecount),
          clickedResults: `result ${n.dataset.autocompleteposition} of ${n.dataset.autocompletecount}`
        }), delete n.dataset.autocompletetext, delete n.dataset.autocompletecount, delete n.dataset.autocompleteposition;
      }
      r.gatherElements("ds_autocomplete", i).forEach((s) => {
        const n = s.querySelector(".js-autocomplete-input"), a = document.querySelector("#" + n.getAttribute("aria-owns") + " .ds_autocomplete__suggestions-list");
        let o = n.value;
        n.addEventListener("keydown", (l) => {
          l.key === "Enter" && n.dataset.autocompletetext && t(o, n), o = n.value;
        }), a?.addEventListener("mousedown", () => {
          t(o, n);
        });
      });
    },
    /**
     * Sets data-navigation="backtotop" on back to top components
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    backToTop: function(i = document.documentElement) {
      r.gatherElements("ds_back-to-top__button", i).forEach((e) => {
        e.setAttribute("data-navigation", "backtotop");
      });
    },
    /**
     * Sets data-navigation="breadcrumb-[INDEX+1]" on breadcrumb item components
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    breadcrumbs: function(i = document.documentElement) {
      r.gatherElements("ds_breadcrumbs", i).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_breadcrumbs__link")).forEach((n, a) => {
          n.getAttribute("data-navigation") || n.setAttribute("data-navigation", `breadcrumb-${a + 1}`);
        });
      });
    },
    /**
     * Sets data-button="button-[TEXT]" on button components
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    buttons: function(i = document.documentElement) {
      [].slice.call(i.querySelectorAll('.ds_button, input[type="button"], input[type="submit"], button')).forEach((e) => {
        e.getAttribute("data-button") || e.setAttribute("data-button", `button-${E(e.textContent)}`);
      });
    },
    /**
     * Sets data-navigation="card-[INDEX+1]" on cards that are links
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    cards: function(i = document.documentElement) {
      r.gatherElements("ds_card__link--cover", i).forEach((s, n) => {
        s.getAttribute("data-navigation") || s.setAttribute("data-navigation", `card-${n + 1}`);
      }), r.gatherElements("ds_card", i).forEach((s, n) => {
        [].slice.call(s.querySelectorAll('.ds_button, input[type="button"], input[type="submit"], button')).forEach((l) => {
          l.getAttribute("data-section") || l.setAttribute("data-section", `card-${n + 1}`);
        }), [].slice.call(s.querySelectorAll("a:not(.ds_card__link)")).forEach((l) => {
          l.getAttribute("data-section") || l.setAttribute("data-section", `card-${n + 1}`);
        });
      });
    },
    /**
     * Sets data-navigation="category-item-[INDEX+1]" on category item components
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    categoryLists: function(i = document.documentElement) {
      r.gatherElements("ds_category-list", i).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_category-item__link")).forEach((n, a) => {
          n.getAttribute("data-navigation") || n.setAttribute("data-navigation", `category-item-${a + 1}`);
        });
      });
    },
    /**
     * Sets data-form="checkbox-[ID]" on unchecked checkboxes
     * Sets data-form="checkbox-[ID]-checked" on checked checkboxes
     * Sets data-value="[ID]" on checkboxes
     * Adds an event listener to toggle that checked state on change
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    checkboxes: function(i = document.documentElement) {
      r.gatherElements("ds_checkbox__input", i).forEach((e) => {
        let s = e.getAttribute("data-form") || "";
        !s && e.id ? s = `checkbox-${e.id}` : s = s.replace(/-checked/g, ""), e.checked && (s = s + "-checked"), e.setAttribute("data-form", s), e.id && !e.getAttribute("data-value") && e.setAttribute("data-value", `${e.id}`);
        const n = i.querySelector(`[for=${e.id}]`);
        n && !e.classList.contains("js-has-tracking-event") && (n.addEventListener("click", () => {
          e.dataset.form = `checkbox-${e.id}-${e.checked ? "unchecked" : "checked"}`;
        }), e.classList.add("js-has-tracking-event"));
      });
    },
    /**
     * Sets data-navigation="confirmation-link" on links in confirmation message components
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    confirmationMessages: function(i = document.documentElement) {
      r.gatherElements("ds_confirmation-message", i).forEach((e) => {
        [].slice.call(e.querySelectorAll("a:not(.ds_button)")).forEach((n) => {
          n.setAttribute("data-navigation", "confirmation-link");
        });
      });
    },
    /**
     * Sets data-navigation="contact-details-[TEXT]" on social media links in contact details blocks
     * Sets data-navigation="contact-details-email" on email links in contact details blocks
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    contactDetails: function(i = document.documentElement) {
      r.gatherElements("ds_contact-details", i).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_contact-details__social-link")).forEach((a) => {
          a.getAttribute("data-navigation") || a.setAttribute("data-navigation", `contact-details-${E(a.textContent)}`);
        }), [].slice.call(e.querySelectorAll('a[href^="mailto"]')).forEach((a) => {
          a.getAttribute("data-navigation") || a.setAttribute("data-navigation", "contact-details-email");
        });
      });
    },
    /**
     * Sets data-navigation="contentsnav-[INDEX+1]" on contents nav links
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    contentNavs: function(i = document.documentElement) {
      r.gatherElements("ds_contents-nav", i).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_contents-nav__link")).forEach((n, a) => {
          n.getAttribute("data-navigation") || n.setAttribute("data-navigation", `contentsnav-${a + 1}`);
        });
      });
    },
    /**
     * Sets data-accordion="details-[STATE]" on the details summary element
     * Sets data-navigation="details-link" on links in details content
     * Adds an event listener to toggle the STATE value used in the data-accordion attribute
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    details: function(i = document.documentElement) {
      r.gatherElements("ds_details", i).forEach((e) => {
        const s = e.querySelector(".ds_details__summary");
        s.setAttribute("data-accordion", `detail-${e.open ? "close" : "open"}`), s.addEventListener("click", () => {
          s.setAttribute("data-accordion", `detail-${e.open ? "open" : "close"}`);
        }), [].slice.call(e.querySelectorAll("a:not(.ds_button)")).forEach((a) => {
          a.getAttribute("data-navigation") || a.setAttribute("data-navigation", "details-link");
        });
      });
    },
    /**
     * Sets data-form="error-[NAME]" on error messages
     * NAME refers to the erroring field
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    errorMessages: function(i = document.documentElement) {
      r.gatherElements("ds_question__error-message", i).forEach((e, s) => {
        if (typeof e.closest == "function" && e.closest(".ds_question")) {
          const a = e.closest(".ds_question")?.querySelector(".js-validation-group, .ds_input, .ds_select, .ds_checkbox__input, .ds_radio__input");
          let o = (s + 1).toString();
          if (a)
            if (a.classList.contains("js-validation-group")) {
              const l = function(m, u, g) {
                return g.indexOf(m) === u;
              };
              o = [].slice.call(a.querySelectorAll(".ds_input, .ds_select, .ds_checkbox__input, .ds_radio__input")).map((m) => m.type === "radio" ? m.name : m.id).filter(l).join("-");
            } else a.type === "radio" ? o = a.name : o = a.id;
          e.getAttribute("data-form") || e.setAttribute("data-form", `error-${o}`);
        }
      });
    },
    /**
     * Sets data-form="error-[NAME]" to links in error summary components
     * NAME is derived fro the fragment identifier in the link's href
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    errorSummaries: function(i = document.documentElement) {
      r.gatherElements("ds_error-summary", i).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_error-summary__list a")).forEach((n) => {
          !n.getAttribute("data-form") && n.href && n.setAttribute("data-form", `error-${n.href.substring(n.href.lastIndexOf("#") + 1)}`);
        });
      });
    },
    /**
     * Sets data-navigation="link-external" to external links
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    externalLinks: function(i = document.documentElement) {
      [].slice.call(i.querySelectorAll("a")).filter((e) => {
        let s = window.location.hostname;
        return window.location.port && (s += ":" + window.location.port), !new RegExp("/" + s + "/?|^tel:|^mailto:|^/").test(e.href);
      }).forEach((e) => {
        e.setAttribute("data-navigation", "link-external");
      });
    },
    /**
     * Sets data-navigation="hide-this-page" on hide this page links
     * Adds an event listener to push 'esc' presses the data layer
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    hideThisPage: function(i = document.documentElement) {
      r.gatherElements("ds_hide-page", i).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_hide-page__button")).forEach((n) => {
          n.setAttribute("data-navigation", "hide-this-page"), document.addEventListener("keyup", (a) => {
            a.key === "Esc" && r.pushToDataLayer({ event: "hide-this-page-keyboard" });
          });
        });
      });
    },
    /**
     * Sets data-navigation="inset-link" on links in inset text components
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    insetTexts: function(i = document.documentElement) {
      r.gatherElements("ds_inset-text", i).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_inset-text__text a:not(.ds_button)")).forEach((n) => {
          n.getAttribute("data-navigation") || n.setAttribute("data-navigation", "inset-link");
        });
      });
    },
    /**
     * Sets data-section="[SECTIONNAME]" on links
     * SECIONNAME is determined by seeking the closest heading (or headinglike) element to the link
     */
    // todo: @returns, should this have scope?
    links: function() {
      [].slice.call(document.querySelectorAll("a")).forEach((t) => {
        const e = r.getNearestSectionHeader(t);
        e && (t.getAttribute("data-section") || t.setAttribute("data-section", e.textContent.trim()));
      });
    },
    /**
     * Sets data-navigation="[NAME]-[INDEX+1]" on links in metadata items
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    metadataItems: function(i = document.documentElement) {
      r.gatherElements("ds_metadata__item", i).forEach((e, s) => {
        const n = e.querySelector(".ds_metadata__key");
        let a;
        n ? a = n.textContent.trim() : a = `metadata-${s}`, [].slice.call(e.querySelectorAll(".ds_metadata__value a")).forEach((l, c) => {
          l.getAttribute("data-navigation") || l.setAttribute("data-navigation", `${E(a)}-${c + 1}`);
        });
      });
    },
    /**
     * Sets data-banner="banner-[NAME]-link" on links in notification banners
     * Sets data-banner="banner-[NAME]-[BUTTONTEXT]" on buttons in notification banners
     * Sets data-banner="banner-[NAME]-close" on notification banner close buttons
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    notifications: function(i = document.documentElement) {
      r.gatherElements("ds_notification", i).forEach((e, s) => {
        const n = e.id || (s + 1).toString();
        [].slice.call(e.querySelectorAll("a:not(.ds_button)")).forEach((c) => {
          c.getAttribute("data-banner") || c.setAttribute("data-banner", `banner-${n}-link`);
        }), [].slice.call(e.querySelectorAll(".ds_button:not(.ds_notification__close)")).forEach((c) => {
          c.getAttribute("data-banner") || c.setAttribute("data-banner", `banner-${n}-${E(c.textContent)}`);
        });
        const l = e.querySelector(".ds_notification__close");
        l && !l.getAttribute("data-banner") && l.setAttribute("data-banner", `banner-${n}-close`);
      });
    },
    /**
     * Sets data-search="pagination-more" on "load more" links
     * Sets data-search="pagination-[LINKTEXT]" on pagination links
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    pagination: function(i = document.documentElement) {
      r.gatherElements("ds_pagination", i).forEach((e) => {
        const s = e.querySelector(".ds_pagination__load-more button");
        s && !s.getAttribute("data-search") && s.setAttribute("data-search", "pagination-more"), [].slice.call(e.querySelectorAll("a.ds_pagination__link")).forEach((a) => {
          a.getAttribute("data-search") || a.setAttribute("data-search", `pagination-${E(a.textContent)}`);
        });
      });
    },
    /**
     * Sets data-banner="banner-[NAME]-link" on links in phase banners
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    phaseBanners: function(i = document.documentElement) {
      r.gatherElements("ds_phase-banner", i).forEach((e) => {
        const s = e.querySelector(".ds_tag"), n = s ? s.textContent.trim() : "phase";
        [].slice.call(e.querySelectorAll("a")).forEach((o) => {
          o.getAttribute("data-banner") || o.setAttribute("data-banner", `banner-${E(n)}-link`);
        });
      });
    },
    /**
     * Sets data-form="radio-[NAME]-[ID]" on radio buttons
     * Sets data-value="[ID]" on radio buttons
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    radios: function(i = document.documentElement) {
      r.gatherElements("ds_radio__input", i).forEach((e) => {
        !e.getAttribute("data-form") && e.name && e.id && e.setAttribute("data-form", `radio-${e.name}-${e.id}`), e.id && !e.getAttribute("data-value") && e.setAttribute("data-value", `${e.id}`);
      });
    },
    /**
     * Sets data-button="button-filter-[SLUG]-remove" on search facet buttons
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    searchFacets: function(i = document.documentElement) {
      r.gatherElements("ds_facet__button", i).forEach((e) => {
        e.setAttribute("data-button", `button-filter-${e.dataset.slug}-remove`);
      });
    },
    /**
     * Sets data-search="search-promoted-[INDEX+1]/[TOTALPROMOTED]" on promoted results
     * Sets data-search="search-result-[INDEX+1]" on search results
     * Sets data-search="search-image-[INDEX+1]" on images in search results
     * Sets data-search="search-parent-link-[INDEX+1]" on search result context links
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    searchResults: function(i = document.documentElement) {
      r.gatherElements("ds_search-results", i).forEach((e) => {
        const s = e.querySelector(".ds_search-results__list");
        if (!s)
          return;
        const n = [].slice.call(e.querySelectorAll(".ds_search-result")), a = [].slice.call(e.querySelectorAll(".ds_search-result--promoted")), o = +(s.getAttribute("start") || "1");
        n.forEach((l, c) => {
          const m = l.querySelector(".ds_search-result__link"), u = l.querySelector(".ds_search-result__media-link"), g = l.querySelector(".ds_search-result__context a");
          if (l.classList.contains("ds_search-result--promoted")) {
            const d = `search-promoted-${c + 1}/${a.length}`;
            m.setAttribute("data-search", d);
          } else {
            let d;
            s.getAttribute("data-total") && (d = s.getAttribute("data-total"));
            let _ = `search-result-${o + c - a.length}`;
            const y = `search-image-${o + c - a.length}`;
            let v = `search-parent-link-${o + c - a.length}`;
            d && (_ += `/${d}`, v += `/${d}`), m.setAttribute("data-search", _), u && u.setAttribute("data-search", y), g && g.setAttribute("data-search", v);
          }
        });
      });
    },
    /**
     * Sets data-search="suggestion-result=[INDEX+1]/[TOTALSUGGESTIONS]" on search suggestions
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    searchSuggestions: function(i = document.documentElement) {
      r.gatherElements("ds_search-suggestions", i).forEach((e) => {
        const s = [].slice.call(e.querySelectorAll(".ds_search-suggestions a"));
        s.forEach((n, a) => {
          n.setAttribute("data-search", `suggestion-result-${a + 1}/${s.length}`);
        });
      });
    },
    /**
     * Sets data-search="search-related-[INDEX+1]/[TOTALLINKS]" on related search items
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    searchRelated: function(i = document.documentElement) {
      r.gatherElements("ds_search-results__related", i).forEach((e) => {
        const s = [].slice.call(e.querySelectorAll(".ds_search-results__related a"));
        s.forEach((n, a) => {
          n.setAttribute("data-search", `search-related-${a + 1}/${s.length}`);
        });
      });
    },
    /**
     * Sets data-form="select=[ID]" on select components
     * Sets data-form="select-[ID]-[value]" on options
     * Adds an event listener to push change events to the data layer
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    selects: function(i = document.documentElement) {
      r.gatherElements("ds_select", i).forEach((e) => {
        !e.getAttribute("data-form") && e.id && e.setAttribute("data-form", `select-${e.id}`), [].slice.call(e.querySelectorAll("option")).forEach((n) => {
          let a = "null";
          n.value && (a = E(n.value)), n.setAttribute("data-form", `${e.getAttribute("data-form")}-${a}`);
        }), e.classList.contains("js-has-tracking-event") || (e.addEventListener("change", (n) => {
          const o = n.target.querySelector(":checked");
          r.pushToDataLayer({ event: String(o.dataset.form) });
        }), e.classList.add("js-has-tracking-event"));
      });
    },
    /**
     * Sets data-navigation="sequential-previous" on previous links
     * Sets data-navigation="sequential-previous" on next links
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    sequentialNavs: function(i = document.documentElement) {
      r.gatherElements("ds_sequential-nav", i).forEach((e) => {
        const s = e.querySelector(".ds_sequential-nav__item--prev > .ds_sequential-nav__button "), n = e.querySelector(".ds_sequential-nav__item--next > .ds_sequential-nav__button ");
        s && !s.getAttribute("data-navigation") && s.setAttribute("data-navigation", "sequential-previous"), n && !n.getAttribute("data-navigation") && n.setAttribute("data-navigation", "sequential-next");
      });
    },
    /**
     * Sets data-navigation="navigation-[STATE]" on the side nav open/close button
     * Sets data-navigation="sidenav-[COMPLICATEDINDEX]" on side nav links where
     *   COMPLICATEDINDEX represents the link's location in the tree
     *
     * e.g.
     * - foo (sidenav-1)
     * - bar (sidenav-2)
     *   - baz (sidenav-2-1)
     *   - qux (sidenav-2-2)
     *
     * etc
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    sideNavs: function(i = document.documentElement) {
      r.gatherElements("ds_side-navigation", i).forEach((e) => {
        const s = e.querySelector(".ds_side-navigation__list"), n = e.querySelector(".js-side-navigation-button"), a = e.querySelector(".js-toggle-side-navigation");
        function o() {
          n?.setAttribute("data-navigation", `navigation-${a.checked ? "close" : "open"}`);
        }
        function l(c, m = "") {
          [].slice.call(c.children).forEach((u, g) => {
            [].slice.call(u.children).forEach((d) => {
              d.classList.contains("ds_side-navigation__list") ? l(d, `${m}-${g + 1}`) : d.setAttribute("data-navigation", `sidenav${m}-${g + 1}`);
            });
          });
        }
        l(s), n && (o(), n.addEventListener("click", () => {
          o();
        }));
      });
    },
    /**
     * Sets data-header="header-logo" on brand/logo link
     * Sets data-header="header-title" on site title link
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    siteBranding: function(i = document.documentElement) {
      r.gatherElements("ds_site-branding", i).forEach((e) => {
        const s = e.querySelector(".ds_site-branding__logo");
        s && !s.getAttribute("data-header") && s.setAttribute("data-header", "header-logo");
        const n = e.querySelector(".ds_site-branding__title");
        n && !n.getAttribute("data-header") && n.setAttribute("data-header", "header-title");
      });
    },
    /**
     * Sets data-footer="footer-logo" on footer org logo link(s)
     * Sets data-footer="footer-copyright" on footer copyright link(s)
     * Sets data-footer="footer-link-[INDEX+1]" on footer utility links
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    siteFooter: function(i = document.documentElement) {
      r.gatherElements("ds_site-footer", i).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_site-footer__org-link")).forEach((o) => {
          o.getAttribute("data-footer") || o.setAttribute("data-footer", "footer-logo");
        }), [].slice.call(e.querySelectorAll(".ds_site-footer__copyright a")).forEach((o) => {
          o.getAttribute("data-footer") || o.setAttribute("data-footer", "footer-copyright");
        }), [].slice.call(e.querySelectorAll(".ds_site-items__item a:not(.ds_button)")).forEach((o, l) => {
          o.getAttribute("data-footer") || o.setAttribute("data-footer", `footer-link-${l + 1}`);
        });
      });
    },
    /**
     * Sets data-device attribute on site nav links, value either 'mobile' and 'desktop'
     * Sets data-header="header-link-[INDEX+1]" on site nav links
     * Sets data-header="header-menu-toggle" on the site nav open/close button
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    siteNavigation: function(i = document.documentElement) {
      r.gatherElements("ds_site-navigation", i).forEach((s) => {
        [].slice.call(s.querySelectorAll(".ds_site-navigation__link")).forEach((a, o) => {
          a.getAttribute("data-device") || (typeof a.closest == "function" && a.closest(".ds_site-navigation--mobile") ? a.setAttribute("data-device", "mobile") : a.setAttribute("data-device", "desktop")), a.getAttribute("data-header") || a.setAttribute("data-header", `header-link-${o + 1}`);
        });
      }), r.gatherElements("ds_site-navigation--mobile", i).forEach((s) => {
        const n = s.parentNode?.querySelector(".js-toggle-menu");
        n && n.setAttribute("data-header", "header-menu-toggle");
      });
    },
    /**
     * Sets data-navigation="skip-link-[INDEX+1]" on links in skip links components
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    skipLinks: function(i = document.documentElement) {
      [].slice.call(i.querySelectorAll(".ds_skip-links__link")).forEach((e, s) => {
        e.getAttribute("data-navigation") || e.setAttribute("data-navigation", `skip-link-${s + 1}`);
      });
    },
    /**
     * Sets data-navigation="partof-sidebar" on stepnav sidebar links
     * Sets data-navigation="partof-header" on stepnav header links
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    stepNavigation: function(i = document.documentElement) {
      r.gatherElements("ds_step-navigation", i).forEach((s) => {
        [].slice.call(s.querySelectorAll(".ds_step-navigation__title-link")).forEach((a) => {
          a.setAttribute("data-navigation", "partof-sidebar");
        });
      }), r.gatherElements("ds_step-navigation-top", i).forEach((s) => {
        [].slice.call(s.querySelectorAll("a")).forEach((a) => {
          a.setAttribute("data-navigation", "partof-header");
        });
      });
    },
    /**
     * Sets data attributes on action links/buttons in summary cards
     * - data-navigation for links
     * - data-button for buttons
     *
     * The value of the attribute is derived from the element's text and the surrounding context.
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    summaryCard: function(i = document.documentElement) {
      r.gatherElements("ds_summary-card", i).forEach((e, s) => {
        [].slice.call(e.querySelectorAll(".ds_summary-card__actions-list")).forEach((a) => {
          const o = [].slice.call(a.querySelectorAll("button")), l = [].slice.call(a.querySelectorAll("a"));
          o.forEach((c) => {
            c.setAttribute("data-button", `button-${E(c.textContent)}-${s + 1}`);
          }), l.forEach((c) => {
            c.setAttribute("data-navigation", `navigation-${E(c.textContent)}-${s + 1}`);
          });
        });
      });
    },
    /**
     * Sets data attributes on action links/buttons in summary lists
     * - data-navigation for links
     * - data-button for buttons
     *
     * The value of the attribute is derived from the element's text and the surrounding context.
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    summaryList: function(i = document.documentElement) {
      r.gatherElements("ds_summary-list__actions", i).forEach((e) => {
        [].slice.call(e.querySelectorAll("button, a")).forEach((n) => {
          const a = n.tagName === "BUTTON" ? "button" : "navigation", o = n.closest(".ds_summary-list__item")?.querySelector(".ds_summary-list__key"), l = "-" + E(o.textContent);
          n.setAttribute(`data-${a}`, `${a}-${E(n.textContent)}${l}`);
        });
      });
    },
    /**
     * Sets data-navigation="tab-link-[TABSET]-[LINKINDEX+1]" on tabs
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    tabs: function(i = document.documentElement) {
      const t = r.gatherElements("ds_tabs", i);
      let e = 1;
      t.forEach((s) => {
        [].slice.call(s.querySelectorAll(".ds_tabs__tab-link")).forEach((a, o) => {
          a.getAttribute("data-navigation") || a.setAttribute("data-navigation", `tab-link-${e}-${o + 1}`);
        }), e++;
      });
    },
    /**
     * Sets data-navigation="tasklist" on links in task lists
     * Sets data-navigation="tasklist-skip" on skip links in task lists
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    taskList: function(i = document.documentElement) {
      r.gatherElements("ds_task-list__task-link", i).forEach((s) => {
        s.getAttribute("data-navigation") || s.setAttribute("data-navigation", "tasklist");
      }), r.gatherElements("js-task-list-skip-link", i).forEach((s) => {
        s.getAttribute("data-navigation") || s.setAttribute("data-navigation", "tasklist-skip");
      });
    },
    /**
     * Sets data-form="[TYPE]input-[ID]" on text input components
     * e.g. data-form="textinput-foo", data-form="numberinput-bar"
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    textInputs: function(i = document.documentElement) {
      [].slice.call(i.querySelectorAll("input.ds_input")).forEach((e) => {
        if (!e.getAttribute("data-form") && e.id) {
          const s = e.type;
          e.setAttribute("data-form", `${s}input-${e.id}`);
        }
      });
    },
    /**
     * Sets data-form="textarea-[ID]" on textarea components
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    textareas: function(i = document.documentElement) {
      [].slice.call(i.querySelectorAll("textarea.ds_input")).forEach((e) => {
        !e.getAttribute("data-form") && e.id && e.setAttribute("data-form", `textarea-${e.id}`);
      });
    },
    /**
     * Sets data-navigation="warning-link" attributes on links within warning text components
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    warningTexts: function(i = document.documentElement) {
      r.gatherElements("ds_warning-text", i).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_warning-text a:not(.ds_button)")).forEach((n) => {
          n.setAttribute("data-navigation", "warning-link");
        });
      });
    }
  }
}, B = {
  idModifier: A,
  PromiseRequest: w,
  storage: p,
  temporaryFocus: S,
  TokenList: D,
  tracking: r
};
function k(i) {
  const t = document.createElement("div");
  t.classList.add("ds_breakpoint-check"), t.classList.add("ds_breakpoint-check--" + i), document.body.appendChild(t);
  const e = window.getComputedStyle(t, null).display === "block";
  return t.parentNode?.removeChild(t), e;
}
const I = {
  breakpointCheck: k
}, T = {
  tools: B,
  utilities: I
};
class b {
  #t;
  #e = !1;
  constructor(t) {
    this.#t = t, this.#t && this.#t.classList.add("js-instantiated"), this.#e = !1;
  }
  set isInitialised(t) {
    this.#e = t, t ? this.#t.classList.add("js-initialised") : this.#t.classList.remove("js-initialised");
  }
  get isInitialised() {
    return this.#e;
  }
}
class N extends b {
  accordion;
  items;
  openAllButton;
  /**
   * Creates an accordion component
   *
   * @param {HTMLElement} accordion - the accordion element
   */
  constructor(t) {
    super(t), this.accordion = t, this.items = [].slice.call(t.querySelectorAll(".ds_accordion-item")), this.openAllButton = t.querySelector(".js-open-all");
  }
  /**
   * Initialize the accordion
   * - initialize each accordion item
   * - initialize the open all button if present
   *
   * @returns {void}
   */
  init() {
    this.isInitialised || (this.items.forEach((t) => this.initAccordionItem(t)), this.openAllButton && this.initOpenAll(), this.isInitialised = !0);
  }
  /**
   * Initialize an accordion item
   * - transform markup to button-driven version
   * - attach event listener
   * - set aria attributes
   *
   * @param {HTMLElement} item - the accordion item to initialize
   * @returns {void}
   */
  initAccordionItem(t) {
    const e = t.querySelector(".ds_accordion-item__body"), s = t.querySelector(".ds_accordion-item__control"), n = t.querySelector(".ds_accordion-item__header"), a = t.querySelector(".ds_accordion-item__indicator"), o = t.querySelector(".ds_accordion-item__label span"), l = n.querySelector(".ds_accordion-item__title");
    let c = !1;
    if (window.location.hash)
      try {
        t.querySelector(window.location.hash) && (c = !0, s.checked = !0);
      } catch {
      }
    const m = s.checked, u = document.createElement("button");
    l.classList.add("ds_accordion-item__title--button"), u.classList.add("ds_accordion-item__button"), u.classList.add("js-accordion-button"), u.id = l.id + "-button", u.type = "button", s.classList.remove("visually-hidden"), s.classList.add("fully-hidden"), s.setAttribute("tabindex", "-1"), u.innerHTML = l.innerHTML, a.setAttribute("aria-hidden", "true"), l.innerHTML = "", l.insertBefore(u, l.firstChild), u.appendChild(a), o.classList.add("fully-hidden");
    const g = A();
    t.id = t.id || `accordion-item-${g}`, e.id = e.id || `accordion-item-${g}-body`, m && (t.classList.add("ds_accordion-item--open"), this.openAllButton && this.setOpenAllButton(this.checkAllOpen()), c && t.scrollIntoView()), u.setAttribute("aria-expanded", m.toString()), u.setAttribute("aria-controls", e.id), u.addEventListener("click", (d) => {
      d.preventDefault(), this.toggleAccordionItem(t);
    });
  }
  /**
   * Initialize the open all button
   * - attach event listener
   * - set aria attributes
   *
   * @returns {void}
   */
  initOpenAll() {
    this.openAllButton.addEventListener("click", () => {
      function t(a) {
        return a.closest(".ds_accordion-item");
      }
      const e = !this.checkAllOpen(), s = [].slice.call(this.accordion.querySelectorAll(".js-accordion-button"));
      let n;
      e ? n = s.filter((a) => !t(a).classList.contains("ds_accordion-item--open")) : n = s.filter((a) => t(a).classList.contains("ds_accordion-item--open")), n.forEach((a) => {
        this.toggleAccordionItem(t(a));
      }), this.setOpenAllButton(e);
    }), this.openAllButton.setAttribute("aria-controls", this.items.map((t) => t.id).join(" ")), this.openAllButton.setAttribute("aria-expanded", "false");
  }
  /**
   * Toggle an accordion item
   * - set aria attribute
   * - set 'open' attribute
   *
   * @param {HTMLElement} item - the accordion item to toggle
   * @returns {void}
   */
  toggleAccordionItem(t) {
    const e = t.querySelector(".js-accordion-button"), s = t.querySelector(".ds_accordion-item__control"), n = t.classList.contains("ds_accordion-item--open");
    n ? t.classList.remove("ds_accordion-item--open") : t.classList.add("ds_accordion-item--open"), e.setAttribute("aria-expanded", (!n).toString()), s.checked = !n, this.openAllButton && this.setOpenAllButton(this.checkAllOpen());
  }
  /**
   * Set the open all button text and aria-expanded attribute
   *
   * @param {boolean} isOpen - true if all items are open, false otherwise
   */
  setOpenAllButton(t) {
    t ? this.openAllButton.innerHTML = 'Close all <span class="visually-hidden">sections</span>' : this.openAllButton.innerHTML = 'Open all <span class="visually-hidden">sections</span>', this.openAllButton.setAttribute("aria-expanded", t.toString());
  }
  /**
   * Check if all accordion items are open
   *
   * @returns {boolean} - true if all items are open, false otherwise
   */
  checkAllOpen() {
    const t = this.accordion.querySelectorAll(".ds_accordion-item--open").length;
    return this.items.length === t;
  }
}
function P(i, t, e) {
  e = Object.assign({}, {
    className: ""
  }, e);
  function n(o, l) {
    if (!o.data || l === "")
      return !1;
    let c, m;
    const g = new RegExp(l, "i").exec(o.data);
    return g && (m = document.createElement("MARK"), e.className && (m.className = e.className), c = o.splitText(g.index), c.splitText(g[0].length), m.appendChild(c.cloneNode(!0)), o.parentNode?.replaceChild(m, c)), !!g;
  }
  function a(o) {
    let l;
    for (let m = 0; m < o.childNodes.length; m++)
      l = o.childNodes[m], l.nodeType === 3 ? m += n(l, t) ? 1 : 0 : a(l);
  }
  a(i);
}
class H extends b {
  activeSuggestion;
  endpointUrl;
  inputElement;
  keypressTimeout;
  listBoxElement;
  minLength;
  PromiseRequest;
  selectedSuggestion;
  statusElement;
  statusTimeout;
  suggestions;
  suggestionMappingFunction;
  tempToggleCharacter;
  throttleDelay;
  /**
   * Creates an autocomplete component
   *
   * @param {HTMLElement} element - the autocomplete element
   * @param {string} endpointUrl - the URL of the autocomplete suggestions endpoint
   * @param {AutocompleteOptionsArgs} options - the autocomplete options
   */
  constructor(t, e, s = {}) {
    super(t), this.inputElement = t.querySelector(".js-autocomplete-input"), this.endpointUrl = e, this.suggestionMappingFunction = s.suggestionMappingFunction || ((n) => n), this.throttleDelay = s.throttleDelay || 100, this.minLength = s.minLength || 3, this.tempToggleCharacter = "", this.PromiseRequest = w, this.statusElement = document.querySelector("#autocomplete-status");
  }
  /**
   * Initialise the autocomplete component
   * - bind event listeners to the input element
   * - fetch and display suggestions
   * - manage selection and acceptance of suggestions
   * - update status for screen readers
   * - handle keyboard and mouse interactions
   *
   * @returns {void}
   */
  init() {
    !this.inputElement || !this.endpointUrl || (this.listBoxElement = document.getElementById(this.inputElement.getAttribute("aria-owns")).querySelector(".ds_autocomplete__suggestions-list"), this.inputElement.addEventListener("keydown", (t) => {
      t.key === "ArrowDown" ? (t.preventDefault(), this.selectSuggestion(typeof this.selectedSuggestion > "u" ? 0 : this.selectedSuggestion + 1)) : t.key === "ArrowUp" ? (t.preventDefault(), this.selectSuggestion(typeof this.selectedSuggestion > "u" ? -1 : this.selectedSuggestion - 1)) : t.key === "Esc" ? this.clearSearch() : t.key === "Enter" && this.activeSuggestion && (t.preventDefault(), this.acceptSelectedSuggestion());
    }), this.inputElement.addEventListener("input", () => {
      window.clearTimeout(this.keypressTimeout);
      const t = this.inputElement.value.trim();
      t.length >= this.minLength ? this.keypressTimeout = window.setTimeout(() => {
        this.fetchSuggestions(t).then((e) => {
          this.suggestions = e, this.showSuggestions(this.suggestions), this.updateStatus(this.suggestions.length, 1500);
        });
      }, this.throttleDelay) : this.clearSuggestions();
    }), this.inputElement.addEventListener("focus", () => {
      this.inputElement.value && (this.suggestions ? (this.showSuggestions(this.suggestions), this.updateStatus(this.suggestions.length, 1500)) : this.fetchSuggestions(this.inputElement.value.trim()));
    }), this.inputElement.addEventListener("blur", () => {
      this.clearSuggestions();
    }), this.listBoxElement.addEventListener("mousedown", (t) => {
      t.preventDefault();
      const e = t.target, s = e.classList.contains("ds_autocomplete__suggestion") ? e : e.closest(".ds_autocomplete__suggestion");
      if (s) {
        const n = s.parentElement, a = Array.from(n.children).indexOf(s);
        this.selectSuggestion(a), this.acceptSelectedSuggestion();
      }
    }), this.isInitialised = !0);
  }
  /**
   * Accept the selected suggestion
   * - updates the input element value
   * - sets data attributes for tracking
   * - clears the suggestions
   *
   * @returns {void}
   */
  acceptSelectedSuggestion() {
    const t = document.querySelector("#" + this.inputElement.getAttribute("aria-activedescendant"));
    this.inputElement.value = t.querySelector(".js-suggestion-text").textContent.trim(), this.inputElement.dataset.autocompletetext = this.inputElement.value, this.inputElement.dataset.autocompletecount = this.suggestions.length.toString(), this.inputElement.dataset.autocompleteposition = String([].slice.call(this.listBoxElement.querySelectorAll("li")).indexOf(t) + 1), this.clearSuggestions();
  }
  /**
   * Build the HTML for a suggestion
   * - creates a span element with the suggestion text
   *
   * @param {string} suggestionHtml - the HTML content for the suggestion
   * @returns {string} - the HTML string for the suggestion
   */
  buildSuggestionHtml(t) {
    return `<span aria-hidden="true" class="ds_autocomplete__suggestion__text  js-suggestion-text">${t}</span>
                <span class="visually-hidden">${t}</span>`;
  }
  /**
   * Clear the search input
   * - clears the suggestions
   *
   * @returns {void}
   */
  clearSearch() {
    this.inputElement.value = "", this.clearSuggestions();
  }
  /**
   * Clear the suggestions
   * - removes all suggestions from the list box
   * - resets the input element state
   * - updates the status element
   * - clears the active suggestion
   *
   * @returns {void}
   */
  clearSuggestions() {
    delete this.activeSuggestion, delete this.selectedSuggestion, this.listBoxElement.innerHTML = "", this.inputElement.removeAttribute("aria-activedescendant"), this.inputElement.classList.remove("js-has-suggestions"), this.statusElement.innerHTML = "", this.suggestions && this.suggestions.filter((t) => t.isActive).forEach((t) => {
      t.isActive = !1;
    });
  }
  /**
   * Fetch suggestions from the endpoint
   * - sends a request to the endpoint with the search term
   * - maps the results using the suggestion mapping function
   *
   * @param {string}searchTerm - the term to search for
   * @returns {Promise<void | SuggestionArgs[]>} - a promise that resolves to an array of suggestions
   */
  fetchSuggestions(t) {
    return this.PromiseRequest(this.endpointUrl + encodeURIComponent(t)).then((e) => this.suggestionMappingFunction(e)).catch((e) => (console.log("fetch failed", e), this.suggestionMappingFunction([])));
  }
  /**
   * Select a suggestion
   * - highlights the suggestion at the given index
   * - updates the input element state
   * - updates the active suggestion
   *
   * @param {number} selectionIndex - the index of the suggestion to select
   * @returns {void}
   */
  selectSuggestion(t) {
    this.selectedSuggestion = t, this.suggestions.forEach((e, s) => {
      s === this.modulo(t, this.suggestions.length) ? (e.isActive = !0, this.activeSuggestion = e, this.inputElement.setAttribute("aria-activedescendant", "suggestion-" + s)) : delete e.isActive;
    }), this.showSuggestions(this.suggestions);
  }
  /**
   * Show the suggestions
   * - renders the suggestions into the list box
   * - highlights matching text
   * - updates the input element state
   *
   * @param {SuggestionArgs[]} suggestions - the suggestions to show
   * @returns {void}
   */
  showSuggestions(t) {
    if (this.listBoxElement.innerHTML = "", t.length) {
      for (let a = 0, o = t.length; a < o; a++) {
        const l = t[a], c = document.createElement("li");
        c.id = "suggestion-" + a, c.classList.add("ds_autocomplete__suggestion"), c.setAttribute("role", "option"), document.createElement("span").classList.add("js-suggestion-text"), l.isActive && c.classList.add("active"), c.innerHTML = this.buildSuggestionHtml(l.displayText);
        const u = c.querySelector(".js-suggestion-text");
        P(u, this.inputElement.value, {}), this.listBoxElement.appendChild(c);
      }
      this.inputElement.classList.add("js-has-suggestions");
      const e = this.listBoxElement.querySelector("li:last-child"), s = this.listBoxElement.parentElement, n = window.visualViewport;
      for (; n.height < s.offsetHeight + this.inputElement.offsetHeight + 16; )
        e.parentNode?.removeChild(e), t = t.splice(t.length - 1);
    } else
      this.clearSuggestions();
  }
  /**
   * Update the status
   * - Throttle updates to avoid overwhelming screen readers
   *
   * @param {number} suggestionCount - the number of suggestions
   * @param {number} delay - the delay in milliseconds
   * @returns {void}
   */
  updateStatus(t, e = 100) {
    if (this.statusElement) {
      this.statusTimeout && window.clearTimeout(this.statusTimeout);
      const s = `There ${t === 1 ? "is" : "are"} ${t} ${t === 1 ? "option" : "options"}`;
      this.statusTimeout = window.setTimeout(() => {
        this.updateStatusText(s);
      }, e);
    }
  }
  /**
   * Update the status text
   *
   * @param {string} text - the text to update the status with
   * @returns {void}
   */
  updateStatusText(t) {
    this.tempToggleCharacter.length ? this.tempToggleCharacter = "" : this.tempToggleCharacter = ".", this.statusElement.textContent = t + this.tempToggleCharacter;
  }
  /**
   * Simple modulo function that handles negative numbers correctly
   *
   * @param {number} a - the dividend
   * @param {number} b - the divisor
   * @returns {number} - the result of a mod b
   */
  modulo(t, e) {
    return (t % e + e) % e;
  }
}
class O extends b {
  backToTopElement;
  backToTopOffset;
  footerEl;
  window;
  /**
   * Creates a back to top component
   *
   * @param {HTMLElement} element - the back to top element
   * @param {Window} _window - the window object
   * @param {BTTOptionsArgs} options - the back to top options
   */
  constructor(t, e = window, s = {}) {
    super(t);
    const n = document.createElement("div");
    s.footerElSelector ? this.footerEl = document.querySelector(s.footerElSelector) : this.footerEl = document.querySelector(".ds_site-footer") || n, this.backToTopElement = t, this.window = e;
  }
  /**
   * Initialise the back to top component
   * - check whether to show or hide the back to top button
   * - adjust the position of the back to top button based on the footer height
   *
   * @returns {void}
   */
  init() {
    if (!this.backToTopElement)
      return;
    const t = this.backToTopElement.querySelector(".ds_back-to-top__button");
    t && (this.backToTopOffset = t.offsetHeight + 8), this.checkDisplay(), this.window.addEventListener("resize", () => this.checkDisplay()), new ResizeObserver(() => {
      this.checkDisplay();
    }).observe(document.body), this.isInitialised = !0;
  }
  /**
   * Check whether to show or hide the back to top button based on the height of the page content
   *
   * @returns {void}
   */
  checkDisplay() {
    document.body.offsetHeight - this.footerEl.offsetHeight - this.backToTopOffset < this.window.innerHeight ? this.backToTopElement.classList.add("visually-hidden") : this.backToTopElement.classList.remove("ds_back-to-top--clamped"), document.body.offsetHeight - this.footerEl.offsetHeight <= this.window.innerHeight ? this.backToTopElement.classList.add("ds_back-to-top--hidden") : this.backToTopElement.classList.remove("ds_back-to-top--hidden"), this.checkPosition();
  }
  /**
   * Adjust the position of the back to top button based on the footer height
   *
   * @returns {void}
   */
  checkPosition() {
    const t = this.footerEl.offsetHeight + 8, e = Math.ceil(t / 8);
    this.backToTopElement.classList.forEach((s) => {
      s.match(/ds_!_off-b-/) && this.backToTopElement.classList.remove(s);
    }), this.backToTopElement.classList.add(`ds_!_off-b-${e}`);
  }
}
class j extends b {
  emptyMessage;
  field;
  idModifier;
  inputElement;
  isInvalidInitialState;
  maxLength;
  messageElement;
  messageTimeout;
  screenReaderMessageElement;
  threshold;
  thresholdCharacters;
  /**
   * Create a character count instance
   *
   * @param {HTMLElement} field - the input field or textarea to apply a character count to
   */
  constructor(t) {
    super(t), this.field = t, this.inputElement = this.field.querySelector("input, textarea"), this.threshold = this.field.dataset.threshold ? Number(this.field.dataset.threshold) * 0.01 : 0, this.messageTimeout = 0, this.idModifier = A();
  }
  /**
   * Initialise the character count
   * - create DOM elements used by the character count component
   * - check the current state & set the display accordingly
   * - setup event listener on the input element to watch for changes
   *
   * @returns {void}
   */
  init() {
    if (this.inputElement && !this.isInitialised) {
      if (this.maxLength = this.getMaxLength(), this.thresholdCharacters = this.getThresholdCharacters(), this.maxLength === 0)
        return;
      this.emptyMessage = `You can enter up to ${this.maxLength} characters`;
      const t = document.createElement("div");
      t.classList.add("fully-hidden"), t.classList.add("ds_character-count__initial"), t.textContent = this.emptyMessage, t.id = `character-count-empty-${this.idModifier}`, this.messageElement = document.createElement("div"), this.messageElement.classList.add("ds_input__message"), this.messageElement.classList.add("ds_hint-text"), this.messageElement.setAttribute("aria-hidden", "true"), this.screenReaderMessageElement = document.createElement("div"), this.screenReaderMessageElement.classList.add("visually-hidden"), this.screenReaderMessageElement.id = `character-count-remaining-${this.idModifier}`;
      const e = new D(this.inputElement.getAttribute("aria-describedby"));
      this.inputElement.setAttribute("aria-describedby", e.add([t.id, this.screenReaderMessageElement.id])), this.inputElement.value.length < this.thresholdCharacters && this.messageElement.classList.add("fully-hidden"), this.isInvalidInitialState = !!this.inputElement.getAttribute("aria-invalid") && this.inputElement.getAttribute("aria-invalid") !== "false", this.field.appendChild(this.messageElement), this.field.appendChild(this.screenReaderMessageElement), this.field.appendChild(t), this.updateCountMessage(), this.inputElement.oldValue = this.inputElement.value, this.inputElement.addEventListener("input", this.checkIfChanged.bind(this)), this.isInitialised = !0;
    }
  }
  /**
   * Per GDS:
   * "Speech recognition software such as Dragon NaturallySpeaking will modify the
   * fields by directly changing its `value`. These changes don't trigger events
   * in JavaScript, so we need to poll to handle when and if they occur."
   *
   * @returns {void}
   */
  checkIfChanged() {
    this.inputElement.oldValue || (this.inputElement.oldValue = ""), this.inputElement.value !== this.inputElement.oldValue && (this.screenReaderMessageElement.setAttribute("aria-live", "polite"), this.inputElement.oldValue = this.inputElement.value, this.updateCountMessage.bind(this)());
  }
  /**
   * Get the component's "maxLength" based on either a supplied maxlength attribute or
   * data-maxlength attribute. Remove a maxlength attribute if it is present.
   *
   * @returns {number}
   */
  getMaxLength() {
    let t = 0;
    return this.inputElement.getAttribute("maxlength") ? (t = Number(this.inputElement.getAttribute("maxlength")), this.inputElement.removeAttribute("maxlength")) : this.field.dataset.maxlength && (t = Number(this.field.dataset.maxlength)), t;
  }
  /**
   * Get the number of characters required to make the character count appear, calculated from
   * the maxlength and the supplied threshold
   *
   * @returns {number}
   */
  getThresholdCharacters() {
    return Math.round(this.maxLength * this.threshold);
  }
  /**
   * Updates the remaining character count message
   * - adds error message and aria invalid if the count is exceeded
   * - pluralises the message correctly
   * - hides the message if there is a count threshold that is not met
   * - updates the hidden screen reader message element after a short delay (the delay helps ensure the message is not unterrupted by the screen reader announcing the value of the field)
   *
   * @returns {void}
   */
  updateCountMessage() {
    const t = this.maxLength - this.inputElement.value.length;
    let e = "characters";
    Math.abs(t) === 1 && (e = "character"), this.messageElement.textContent = `You have ${t} ${e} remaining`, t < 0 ? (this.inputElement.classList.add("ds_input--error"), this.inputElement.setAttribute("aria-invalid", "true"), this.messageElement.textContent = `You have ${Math.abs(t)} ${e} too many`, this.messageElement.classList.add("ds_input__message--error")) : (this.isInvalidInitialState || (this.inputElement.classList.remove("ds_input--error"), this.inputElement.setAttribute("aria-invalid", "false")), this.messageElement.classList.remove("ds_input__message--error"), this.inputElement.value.length === 0 ? this.messageElement.textContent = this.emptyMessage : this.messageElement.textContent = `You have ${t} ${e} remaining`), this.inputElement.value.length < this.thresholdCharacters ? this.messageElement.classList.add("fully-hidden") : this.messageElement.classList.remove("fully-hidden"), clearTimeout(this.messageTimeout), this.messageTimeout = window.setTimeout(() => {
      this.inputElement.value.length >= this.thresholdCharacters ? this.updateScreenReaderMessage() : this.screenReaderMessageElement.innerHTML = "&nbsp;";
    }, 1e3);
  }
  /**
   * Updates the content of the hidden screen reader message
   *
   * @returns {void}
   */
  updateScreenReaderMessage() {
    this.screenReaderMessageElement.textContent = this.messageElement.textContent;
  }
}
class R extends b {
  checkboxes;
  /**
   * Creates a checkboxes component
   *
   * @param {HTMLElement} checkboxes - the tab container element
   */
  constructor(t) {
    super(t), this.checkboxes = [].slice.call(t.querySelectorAll(".ds_checkbox__input"));
  }
  /**
   * Initialises a checkbox group
   * Adds an event listener to handle 'exclusive' checkbox behaviour
   * - unchecks all other checkboxes when an exclusive checkbox is checked
   * - unchecks the exclusive checkbox if any other checkbox is checked
   *
   * @returns {void}
   */
  init() {
    this.checkboxes.forEach((t) => {
      t.addEventListener("change", () => {
        t.dataset.behaviour === "exclusive" ? this.checkboxes.filter((e) => e !== t).forEach((e) => e.checked = !1) : this.checkboxes.filter((e) => e.dataset.behaviour === "exclusive").forEach((e) => e.checked = !1);
      });
    }), this.isInitialised = !0;
  }
}
class F extends b {
  storage;
  categories;
  cookieAcceptAllButton;
  cookieAcceptEssentialButton;
  cookieNoticeElement;
  cookieNoticeSuccessElement;
  /**
   * Creates a cookie notification component
   *
   * @param {HTMLElement} element - the cookie notification element
   * @param {StorageArgs} storage - the DS storage object
   * @param {string[]} categories - an array of cookie categories
   */
  constructor(t, e = p, s) {
    super(t);
    const n = [
      "necessary",
      "preferences",
      "statistics",
      "campaigns",
      "marketing"
    ];
    this.storage = e, this.categories = s || n, this.cookieNoticeElement = t, this.cookieNoticeSuccessElement = document.getElementById("cookie-confirm"), this.cookieAcceptAllButton = this.cookieNoticeElement.querySelector(".js-accept-all-cookies"), this.cookieAcceptEssentialButton = this.cookieNoticeElement.querySelector(".js-accept-essential-cookies");
  }
  /**
   * Initialise the cookie notification component
   * - display the cookie notice if not yet acknowledged
   * - bind event listeners to the accept buttons
   * - manage setting cookie permissions based on user choice
   * - focus on success message after acceptance
   *
   * @returns {void}
   */
  init() {
    this.storage.get({ type: "cookie", name: "cookie-notification-acknowledged" }) || this.cookieNoticeElement.classList.remove("fully-hidden"), this.cookieAcceptAllButton.addEventListener("click", (t) => {
      t.preventDefault(), this.setAllOptionalPermissions(!0), this.cookieNoticeElement.classList.add("fully-hidden"), this.cookieNoticeSuccessElement.classList.remove("fully-hidden"), S(this.cookieNoticeSuccessElement);
    }), this.cookieAcceptEssentialButton.addEventListener("click", (t) => {
      t.preventDefault(), this.setAllOptionalPermissions(!1), this.cookieNoticeElement.classList.add("fully-hidden"), this.cookieNoticeSuccessElement.classList.remove("fully-hidden"), S(this.cookieNoticeSuccessElement);
    }), this.isInitialised = !0;
  }
  /**
   * Sets all optional cookie permissions
   * - necessary is always allowed
   * - preferences, statistics, campaigns, marketing are set based on the 'allow' parameter
   * - all cookies are set to expire in 365 days
   *
   * @param {boolean} allow - whether to allow optional cookies
   * @returns {void}
   */
  setAllOptionalPermissions(t) {
    const e = Object.fromEntries(this.categories.map((s) => [s, s === "necessary" ? !0 : t]));
    for (const s in e)
      s === "necessary" ? e[s] = !0 : e[s] = t;
    this.storage.setCookie(
      "necessary",
      "cookiePermissions",
      JSON.stringify(e),
      365
    ), this.storage.setCookie(
      "necessary",
      "cookie-notification-acknowledged",
      "yes",
      365
    );
  }
}
class Y extends b {
  options;
  calendarButtonElement;
  dateInput;
  datePickerParent;
  dialogElement;
  dialogTitleElement;
  firstButtonInDialog;
  inputElement;
  lastButtonInDialog;
  monthInput;
  yearInput;
  isMultipleInput;
  currentDate;
  inputDate;
  calendarDays;
  dayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  monthLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  icons = {
    calendar_today: '<svg class="ds_icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>',
    chevron_left: '<svg focusable="false" class="ds_icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>',
    chevron_right: '<svg focusable="false" class="ds_icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>',
    double_chevron_left: '<svg focusable="false" class="ds_icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 16.6 17.6 18l-6-6 6-6L19 7.4 14.4 12l4.6 4.6Zm-6.6 0L11 18l-6-6 6-6 1.4 1.4L7.8 12l4.6 4.6Z"/></svg>',
    double_chevron_right: '<svg focusable="false" class="ds_icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.6 12 5 7.4 6.4 6l6 6-6 6L5 16.6 9.6 12Zm6.6 0-4.6-4.6L13 6l6 6-6 6-1.4-1.4 4.6-4.6Z"/></svg>'
  };
  /**
   * Creates a date picker component
   *
   * @param {HTMLElement} el - the date picker element
   * @param {object} options - configuration options for the date picker
   */
  constructor(t, e = {}) {
    super(t), t && (this.datePickerParent = t, this.options = Object.assign({
      disabledDates: []
    }, e), this.inputElement = this.datePickerParent.querySelector("input"), this.isMultipleInput = t.classList.contains("ds_datepicker--multiple"), this.dateInput = t.querySelector(".js-datepicker-date"), this.monthInput = t.querySelector(".js-datepicker-month"), this.yearInput = t.querySelector(".js-datepicker-year"), this.currentDate = /* @__PURE__ */ new Date(), this.currentDate.setHours(0, 0, 0, 0), this.calendarDays = []);
  }
  /**
   * Initialise the date picker
   * - inserts button and dialog into the DOM
   * - sets up event listeners
   * - populates the calendar with initial dates
   *
   * @returns {void}
   */
  init() {
    if (!this.inputElement || this.isInitialised)
      return;
    this.setOptions(), this.setMinAndMaxDatesOnCalendar();
    const t = document.createElement("div");
    t.innerHTML = this.buttonTemplate(), this.calendarButtonElement = t.firstChild, this.calendarButtonElement.setAttribute("data-button", `datepicker-${this.inputElement.id}-toggle`), this.isMultipleInput ? this.inputElement.parentElement?.parentElement?.appendChild(this.calendarButtonElement) : (this.inputElement.parentElement?.appendChild(this.calendarButtonElement), this.inputElement.parentElement?.classList.add("ds_input__wrapper--has-icon")), this.dialogElement = document.createElement("div"), this.dialogElement.id = "datepicker-" + A(), this.dialogElement.setAttribute("class", "ds_datepicker__dialog  datepickerDialog"), this.dialogElement.setAttribute("role", "dialog"), this.dialogElement.setAttribute("aria-modal", "true"), this.dialogElement.innerHTML = this.dialogTemplate(this.dialogElement.id), this.calendarButtonElement.setAttribute("aria-controls", this.dialogElement.id), this.calendarButtonElement.setAttribute("aria-expanded", "false"), this.datePickerParent.appendChild(this.dialogElement), this.dialogTitleElement = this.dialogElement.querySelector(".js-datepicker-month-year");
    const e = this.datePickerParent.querySelector("tbody");
    let s = 0;
    for (let d = 0; d < 6; d++) {
      const _ = e.insertRow(d);
      for (let y = 0; y < 7; y++) {
        const v = document.createElement("td"), h = document.createElement("button");
        h.type = "button", h.dataset.form = "date-select", v.appendChild(h), _.appendChild(v);
        const L = new z(h, s, d, y, this);
        L.init(), this.calendarDays.push(L), s++;
      }
    }
    const n = this.dialogElement.querySelector(".js-datepicker-prev-month"), a = this.dialogElement.querySelector(".js-datepicker-prev-year"), o = this.dialogElement.querySelector(".js-datepicker-next-month"), l = this.dialogElement.querySelector(".js-datepicker-next-year");
    n.addEventListener("click", (d) => this.focusPreviousMonth(d, !1)), a.addEventListener("click", (d) => this.focusPreviousYear(d, !1)), o.addEventListener("click", (d) => this.focusNextMonth(d, !1)), l.addEventListener("click", (d) => this.focusNextYear(d, !1)), [this.inputElement, this.dateInput, this.monthInput, this.yearInput].forEach((d) => {
      d && d.addEventListener("blur", () => {
        this.calendarButtonElement.querySelector("span").textContent = "Choose date";
      });
    });
    const m = this.dialogElement.querySelector(".js-datepicker-cancel"), u = this.dialogElement.querySelector(".js-datepicker-ok");
    m.addEventListener("click", (d) => {
      d.preventDefault(), this.closeDialog();
    }), u.addEventListener("click", () => this.selectDate(this.currentDate));
    const g = this.dialogElement.querySelectorAll('button:not([disabled="true"])');
    this.firstButtonInDialog = g[0], this.lastButtonInDialog = g[g.length - 1], this.firstButtonInDialog.addEventListener("keydown", (d) => this.firstButtonKeyup(d)), this.lastButtonInDialog.addEventListener("keydown", (d) => this.lastButtonKeyup(d)), this.calendarButtonElement.addEventListener("click", (d) => this.toggleDialog(d)), document.body.addEventListener("mouseup", (d) => this.backgroundClick(d)), this.updateCalendar(), this.isInitialised = !0;
  }
  /**
   * Adds months to a date
   *
   * @param {Date} date - the date to add months to
   * @param {number} months - number of months to add (negative to subtract)
   * @returns {Date} - the new date after adding months
   */
  addMonths(t, e) {
    const s = t.getDate();
    return t.setMonth(t.getMonth() + +e), t.getDate() !== s && t.setDate(0), t;
  }
  /**
   * Date picker button template
   *
   * @returns {string} - HTML template for the date picker button
   */
  buttonTemplate() {
    return `<button type="button" class="ds_button  ds_button--icon-only  ds_datepicker__button  ds_no-margin  js-calendar-button" aria-expanded="false">
            <span class="visually-hidden">Choose date</span>
            ${this.icons.calendar_today}
        </button>
        `;
  }
  /**
   * Date picker dialog template
   *
   * @param {string} id
   * @returns {string} - HTML template for the date picker dialog
   */
  dialogTemplate(t) {
    return `<div class="ds_datepicker__dialog__header">
        <div class="ds_datepicker__dialog__navbuttons">
            <button type="button" class="ds_button  ds_button--icon-only  js-datepicker-prev-year" aria-label="previous year" data-button="button-datepicker-prevyear">
                <span class="visually-hidden">Previous year</span>
                ${this.icons.double_chevron_left}
            </button>

            <button type="button" class="ds_button  ds_button--icon-only  js-datepicker-prev-month" aria-label="previous month" data-button="button-datepicker-prevmonth">
                <span class="visually-hidden">Previous month</span>
                ${this.icons.chevron_left}
            </button>
        </div>

        <h2 class="ds_datepicker__dialog__title  js-datepicker-month-year" aria-live="polite">June 2020</h2>

        <div class="ds_datepicker__dialog__navbuttons">
            <button type="button" class="ds_button  ds_button--icon-only  js-datepicker-next-month" aria-label="next month" data-button="button-datepicker-nextmonth">
                <span class="visually-hidden">Next month</span>
                ${this.icons.chevron_right}
            </button>

            <button type="button" class="ds_button  ds_button--icon-only  js-datepicker-next-year" aria-label="next year" data-button="button-datepicker-nextyear">
                <span class="visually-hidden">Next year</span>
                ${this.icons.double_chevron_right}
            </button>
        </div>
      </div>

      <table class="ds_datepicker__dialog__table  js-datepicker-grid" role="grid">
      <caption id="${t}-caption" class="ds_datepicker__dialog__table-caption">You can use the cursor keys to select a date</caption>
      <thead>
          <tr>
          <th scope="col">
            <span aria-hidden="true">Su</span>
            <span class="visually-hidden">Sunday</span>
          </th>
          <th scope="col">
            <span aria-hidden="true">Mo</span>
            <span class="visually-hidden">Monday</span>
          </th>
          <th scope="col">
            <span aria-hidden="true">Tu</span>
            <span class="visually-hidden">Tuesday</span>
          </th>
          <th scope="col">
            <span aria-hidden="true">We</span>
            <span class="visually-hidden">Wednesday</span>
          </th>
          <th scope="col">
            <span aria-hidden="true">Th</span>
            <span class="visually-hidden">Thursday</span>
          </th>
          <th scope="col">
            <span aria-hidden="true">Fr</span>
            <span class="visually-hidden">Friday</span>
          </th>
          <th scope="col">
            <span aria-hidden="true">Sa</span>
            <span class="visually-hidden">Saturday</span>
          </th>
          </tr>
      </thead>

      <tbody></tbody>
      </table>

      <div class="ds_datepicker__dialog__buttongroup">
      <button type="button" class="ds_button  ds_button--small  ds_button--cancel  js-datepicker-cancel" value="cancel" data-button="button-datepicker-cancel">Cancel</button>
      <button type="button" class="ds_button  ds_button--small  js-datepicker-ok" value="ok" data-button="button-datepicker-ok">OK</button>
      </div>`;
  }
  /**
   * Formats a number with leading zeroes
   *
   * @param {number} value - value to format
   * @param {number} length - desired length of output string
   * @returns {string} - formatted string
   */
  leadingZeroes(t, e = 2) {
    let s = t.toString();
    for (; s.length < e; )
      s = "0" + s.toString();
    return s;
  }
  /**
   * Handle clicks outside the date picker dialog
   * - closes the dialog if open and the click is outside the dialog
   *
   * @param {MouseEvent} event
   * @returns {void}
   */
  backgroundClick(t) {
    const e = t.target;
    this.isOpen() && !this.dialogElement.contains(e) && !this.inputElement.contains(e) && !this.calendarButtonElement.contains(e) && (t.preventDefault(), this.closeDialog());
  }
  /**
   * Close the date picker dialog
   * - sets aria-expanded to false on the calendar button
   * - focuses the calendar button
   *
   * @returns {void}
   */
  closeDialog() {
    this.dialogElement.classList.remove("ds_datepicker__dialog--open"), this.calendarButtonElement.setAttribute("aria-expanded", "false"), this.calendarButtonElement.focus();
  }
  /**
   * Handles the keyup event on the first button in the dialog
   * - focuses the first button in the dialog if the Tab and Shift keys are pressed
   *
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  firstButtonKeyup(t) {
    t.key === "Tab" && t.shiftKey && (this.lastButtonInDialog.focus(), t.preventDefault());
  }
  /**
   * Focuses the next day in the calendar
   *
   * @param {Date} date
   * @returns {void}
   */
  focusNextDay(t = new Date(this.currentDate)) {
    t.setDate(t.getDate() + 1), this.goToDate(t);
  }
  /**
   * Focuses the previous day in the calendar
   *
   * @param {Date} date
   * @returns {void}
   */
  focusPreviousDay(t = new Date(this.currentDate)) {
    t.setDate(t.getDate() - 1), this.goToDate(t);
  }
  /**
   * Focuses the next week in the calendar
   *
   * @param {Date} date
   * @returns {void}
   */
  focusNextWeek(t = new Date(this.currentDate)) {
    t.setDate(t.getDate() + 7), this.goToDate(t);
  }
  /**
   * Focuses the previous week in the calendar
   *
   * @param {Date} date
   * @returns {void}
   */
  focusPreviousWeek(t = new Date(this.currentDate)) {
    t.setDate(t.getDate() - 7), this.goToDate(t);
  }
  /**
   * Focuses the first day of the week in the calendar
   *
   * @returns {void}
   */
  focusFirstDayOfWeek() {
    const t = new Date(this.currentDate);
    t.setDate(t.getDate() - t.getDay()), this.goToDate(t);
  }
  /**
   * Focuses the last day of the week in the calendar
   *
   * @returns {void}
   */
  focusLastDayOfWeek() {
    const t = new Date(this.currentDate);
    t.setDate(t.getDate() - t.getDay() + 6), this.goToDate(t);
  }
  /**
   * Focuses the next month in the calendar
   *
   * @param {Event} event
   * @param {boolean} focus
   * @returns {void}
   */
  focusNextMonth(t, e = !0) {
    t.preventDefault();
    const s = new Date(this.currentDate);
    this.addMonths(s, 1), this.goToDate(s, e);
  }
  /**
   * Focuses the previous month in the calendar
   *
   * @param {Event} event
   * @param {boolean} focus
   * @returns {void}
   */
  focusPreviousMonth(t, e = !0) {
    t.preventDefault();
    const s = new Date(this.currentDate);
    this.addMonths(s, -1), this.goToDate(s, e);
  }
  /**
   * Focuses the next year in the calendar
   *
   * @param {Event} event
   * @param {boolean} focus
   * @returns {void}
   */
  focusNextYear(t, e = !0) {
    t.preventDefault();
    const s = new Date(this.currentDate);
    s.setFullYear(s.getFullYear() + 1), this.goToDate(s, e);
  }
  /**
   * Focuses the previous year in the calendar
   *
   * @param {Event} event
   * @param {boolean} focus
   * @returns {void}
   */
  focusPreviousYear(t, e = !0) {
    t.preventDefault();
    const s = new Date(this.currentDate);
    s.setFullYear(s.getFullYear() - 1), this.goToDate(s, e);
  }
  /**
   * Formats a date string into a Date object
   * - according to the date format set on the date picker parent element
   * - falls back to the provided fallback date if formatting fails
   *
   * @param {string} dateString - The date string to format
   * @param {Date | null} fallback - The fallback date if formatting fails
   * @returns {Date} - The formatted date
   */
  formattedDateFromString(t, e = /* @__PURE__ */ new Date()) {
    let s = null;
    const n = t.split("/");
    if (t.match(/\d{1,4}\/\d{1,2}\/\d{1,4}/))
      switch (this.datePickerParent.dataset.dateformat) {
        case "YMD":
          s = /* @__PURE__ */ new Date(`${n[1]}/${n[2]}/${n[0]}`);
          break;
        case "MDY":
          s = /* @__PURE__ */ new Date(`${n[0]}/${n[1]}/${n[2]}`);
          break;
        default:
          s = /* @__PURE__ */ new Date(`${n[1]}/${n[0]}/${n[2]}`);
          break;
      }
    return s instanceof Date && !isNaN(s.getTime()) ? s : e;
  }
  /**
   * Formats a date in a human-readable format
   *
   * @param {Date} date - The date to format
   * @returns {string} - The formatted date
   */
  formattedDateHuman(t) {
    return `${this.dayLabels[t.getDay()]} ${t.getDate()} ${this.monthLabels[t.getMonth()]} ${t.getFullYear()}`;
  }
  /**
   * Go to a specific date in the calendar
   *
   * @param {Date} date - The date to go to
   * @param {boolean} focus - Whether to focus the date in the calendar
   * @returns {void}
   */
  goToDate(t, e) {
    const s = this.currentDate;
    this.currentDate = t, (s.getMonth() !== this.currentDate.getMonth() || s.getFullYear() !== this.currentDate.getFullYear()) && this.updateCalendar(), this.setCurrentDate(e);
  }
  /**
   * Check whether a date is disabled
   * - Checks if the date is before minDate or after maxDate
   * - Checks if the date is in the disabledDates array
   *
   * @param {Date} date - The date to check
   * @returns {boolean} - whether the date is disabled
   */
  isDisabledDate(t) {
    let e = !1;
    this.options.minDate && this.options.minDate > t && (e = !0), this.options.maxDate && this.options.maxDate < t && (e = !0);
    for (const s of this.options.disabledDates)
      t.toDateString() === s.toDateString() && (e = !0);
    return e;
  }
  /**
   * Checks whether the date picker dialog is open
   *
   * @returns {boolean} - whether the dialog is open
   */
  isOpen() {
    return this.dialogElement.classList.contains("ds_datepicker__dialog--open");
  }
  /**
   * Handles the keyup event on the last button in the dialog
   * - focuses the first button in the dialog if the Tab key is pressed
   *
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  lastButtonKeyup(t) {
    t.key === "Tab" && !t.shiftKey && (this.firstButtonInDialog.focus(), t.preventDefault());
  }
  /**
   * Opens the date picker dialog
   * - displays the dialog
   * - positions the dialog
   * - gets the date from the input element(s)
   * - updates the calendar
   * - sets the current date
   *
   * @returns {void}
   */
  openDialog() {
    this.dialogElement.classList.add("ds_datepicker__dialog--open"), this.calendarButtonElement.setAttribute("aria-expanded", "true");
    let t, e;
    this.isMultipleInput ? (t = this.calendarButtonElement.offsetLeft + this.calendarButtonElement.offsetWidth + 16, e = `${this.dateInput.value}/${this.monthInput.value}/${this.yearInput.value}`) : (t = this.inputElement.offsetWidth + 16, e = this.inputElement.value);
    const s = Math.ceil(t / 8);
    this.dialogElement.classList.forEach((n) => {
      n.match(/ds_!_off-l-/) && this.dialogElement.classList.remove(n);
    }), this.dialogElement.classList.add(`ds_!_off-l-${s}`), e.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/) && (this.inputDate = this.formattedDateFromString(e), this.currentDate = this.inputDate), this.updateCalendar(), this.setCurrentDate();
  }
  /**
   * Selects a date from the calendar
   * - Updates the calendar button text
   * - Sets the date in the input field(s)
   * - Dispatches a change event on the input element
   * - Calls the dateSelectCallback if provided
   * - Closes the dialog
   *
   * @param {Date} date The date to select
   * @returns {void | false}
   */
  selectDate(t) {
    if (this.isDisabledDate(t))
      return !1;
    this.calendarButtonElement.querySelector("span").textContent = `Choose date. Selected date is ${this.formattedDateHuman(t)}`, this.setDate(t);
    const e = new Event("change");
    this.inputElement.dispatchEvent(e), this.options.dateSelectCallback && this.options.dateSelectCallback(t), this.closeDialog();
  }
  /**
   * Sets the current date in the calendar
   * - Sets the current date in the calendar
   * - Focuses the current date button if focus is true
   * - Marks today and selected date with appropriate classes and attributes
   *
   * @param {boolean} focus Whether to focus the current date button
   * @returns {void}
   */
  setCurrentDate(t = !0) {
    const e = this.currentDate, s = this.calendarDays.filter((n) => n.button.classList.contains("fully-hidden") === !1);
    s.forEach((n) => {
      n.button.setAttribute("tabindex", "-1"), n.button.classList.remove("ds_selected");
      const a = n.date;
      a.setHours(0, 0, 0, 0);
      const o = /* @__PURE__ */ new Date();
      o.setHours(0, 0, 0, 0), a.getTime() === e.getTime() && !n.isDisabled && t && (n.button.setAttribute("tabindex", "0"), n.button.focus(), n.button.classList.add("ds_selected")), this.inputDate && !this.isDisabledDate(this.inputDate) && a.getTime() === this.inputDate.getTime() ? (n.button.classList.add("ds_datepicker__current"), n.button.setAttribute("aria-description", "selected date")) : (n.button.classList.remove("ds_datepicker__current"), n.button.removeAttribute("aria-description")), a.getTime() === o.getTime() ? (n.button.classList.add("ds_datepicker__today"), n.button.setAttribute("aria-current", "date")) : (n.button.classList.remove("ds_datepicker__today"), n.button.removeAttribute("aria-current"));
    }), t || (s[0].button.setAttribute("tabindex", "0"), this.currentDate = s[0].date);
  }
  /**
   * Sets the date in the input field(s)
   *
   * @param {Date} date - The date to set
   * @returns {void}
   */
  setDate(t) {
    if (this.isMultipleInput)
      this.dateInput.value = t.getDate().toString(), this.monthInput.value = (t.getMonth() + 1).toString(), this.yearInput.value = t.getFullYear().toString();
    else
      switch (this.inputElement.value = `${this.leadingZeroes(t.getDate())}/${this.leadingZeroes(t.getMonth() + 1)}/${t.getFullYear()}`, this.datePickerParent.dataset.dateformat) {
        case "YMD":
          this.inputElement.value = `${t.getFullYear()}/${this.leadingZeroes(t.getMonth() + 1)}/${this.leadingZeroes(t.getDate())}`;
          break;
        case "MDY":
          this.inputElement.value = `${this.leadingZeroes(t.getMonth() + 1)}/${this.leadingZeroes(t.getDate())}/${t.getFullYear()}`;
          break;
        default:
          this.inputElement.value = `${this.leadingZeroes(t.getDate())}/${this.leadingZeroes(t.getMonth() + 1)}/${t.getFullYear()}`;
          break;
      }
  }
  /**
   * Sets the current date to be within the min and max date range
   *
   * @returns {void}
   */
  setMinAndMaxDatesOnCalendar() {
    this.options.minDate && this.currentDate < this.options.minDate && (this.currentDate = this.options.minDate), this.options.maxDate && this.currentDate > this.options.maxDate && (this.currentDate = this.options.maxDate);
  }
  /**
   * Sets options for the date picker from both passed options and data attributes
   *
   * @returns {void}
   */
  setOptions() {
    this.transformLegacyDataAttributes(), !this.options.minDate && this.datePickerParent.dataset.mindate && (this.options.minDate = this.formattedDateFromString(this.datePickerParent.dataset.mindate, null)), !this.options.maxDate && this.datePickerParent.dataset.maxdate && (this.options.maxDate = this.formattedDateFromString(this.datePickerParent.dataset.maxdate, null)), !this.options.disabledDates?.length && this.datePickerParent.dataset.disableddates && (this.options.disabledDates = this.datePickerParent.dataset.disableddates.replace(/\s+/, " ").split(" ").map((t) => this.formattedDateFromString(t)).filter((t) => t));
  }
  /**
   * Toggles the date picker dialog open or closed
   *
   * @param {Event} event - The event that triggered the toggle
   * @returns {void}
   */
  toggleDialog(t) {
    t.preventDefault(), this.isOpen() ? this.closeDialog() : (this.setMinAndMaxDatesOnCalendar(), this.openDialog());
  }
  /**
   * Transforms legacy data attributes from the input element to the date picker parent element
   *
   * @returns {void}
   */
  transformLegacyDataAttributes() {
    this.inputElement.dataset.mindate && (this.datePickerParent.dataset.mindate = this.inputElement.dataset.mindate), this.inputElement.dataset.maxdate && (this.datePickerParent.dataset.maxdate = this.inputElement.dataset.maxdate), this.inputElement.dataset.dateformat && (this.datePickerParent.dataset.dateformat = this.inputElement.dataset.dateformat);
  }
  /**
   * Updates the calendar display by redrawing it
   * - Sets the dialog title to the current month and year
   * - Updates each day button in the calendar grid
   * - Hides days from previous/next month
   * - Disables days outside min/max date range or in disabled dates list
   *
   * @returns {void}
   */
  updateCalendar() {
    this.dialogTitleElement.innerHTML = `${this.monthLabels[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`, this.dialogElement.setAttribute("aria-label", this.dialogTitleElement.innerHTML);
    const t = this.currentDate, e = new Date(t.getFullYear(), t.getMonth(), 1), s = e.getDay();
    e.setDate(e.getDate() - s);
    const n = new Date(e);
    for (const a of this.calendarDays) {
      const o = n.getMonth() !== t.getMonth();
      let l = !1;
      this.options.minDate && n < this.options.minDate && (l = !0), this.options.maxDate && n > this.options.maxDate && (l = !0), this.isDisabledDate(n) && (l = !0), a.update(n, o, l), n.setDate(n.getDate() + 1);
    }
  }
}
class z {
  button;
  column;
  date;
  index;
  row;
  picker;
  /**
   * Constructor for a day button in the date picker calendar
   *
   * @param {HTMLElement} button - The button element representing the day
   * @param {number} index - Index of the day button in the calendar grid
   * @param {number} row - Row index of the day button
   * @param {number} column - Column index of the day button
   * @param {DSDatePicker} picker - Parent date picker instance
   */
  constructor(t, e, s, n, a) {
    this.index = e, this.row = s, this.column = n, this.button = t, this.picker = a, this.date = /* @__PURE__ */ new Date();
  }
  /**
   * Initializes the day button, attaching event listeners for click and keydown events
   *
   * @returns {void}
   */
  init() {
    this.button.addEventListener("keydown", this.keyPress.bind(this)), this.button.addEventListener("click", this.click.bind(this));
  }
  /**
   * Updates the day button
   * - Sets the button text to the day of the month
   * - Sets the aria-label to the formatted date
   * - Adds/removes fully-hidden class based on isHidden
   * - Adds/removes aria-disabled attribute based on isDisabled
   * - Sets the date property to the provided date
   *
   * @param {Date} day The date to update the button with
   * @param {boolean} isHidden Whether the day is hidden (from previous/next month)
   * @param {boolean} isDisabled Whether the day is disabled
   * @returns {void}
   */
  update(t, e, s) {
    this.date = new Date(t), this.button.innerHTML = t.getDate().toString(), this.button.setAttribute("aria-label", this.picker.formattedDateHuman(this.date)), s ? this.button.setAttribute("aria-disabled", "true") : this.button.removeAttribute("aria-disabled"), e ? this.button.classList.add("fully-hidden") : this.button.classList.remove("fully-hidden");
  }
  /**
   * Handler for mouse click on day buttons
   * - Selects the clicked date
   *
   * @param {MouseEvent} event
   * @returns {void}
   */
  click(t) {
    this.picker.goToDate(this.date), this.picker.selectDate(this.date), t.stopPropagation(), t.preventDefault();
  }
  /**
   * Handler for keyboard events on day buttons
   * - Arrow keys to navigate days/weeks
   * - Home/End to go to first/last day of week
   * - Page Up/Down to go to previous/next month (with Shift for year)
   * - Escape to close the dialog
   * - Enter/Space to select the focused date
   * - Tab to move focus to next/previous focusable element in the dialog
   * - Shift+Tab to move focus to previous focusable element in the dialog
   *
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  keyPress(t) {
    let e = !0;
    switch (t.key) {
      case "ArrowLeft":
        this.picker.focusPreviousDay();
        break;
      case "ArrowRight":
        this.picker.focusNextDay();
        break;
      case "ArrowUp":
        this.picker.focusPreviousWeek();
        break;
      case "ArrowDown":
        this.picker.focusNextWeek();
        break;
      case "Home":
        this.picker.focusFirstDayOfWeek();
        break;
      case "End":
        this.picker.focusLastDayOfWeek();
        break;
      case "PageUp":
        t.shiftKey ? this.picker.focusPreviousYear(t) : this.picker.focusPreviousMonth(t);
        break;
      case "PageDown":
        t.shiftKey ? this.picker.focusNextYear(t) : this.picker.focusNextMonth(t);
        break;
      default:
        e = !1;
        break;
    }
    e && (t.preventDefault(), t.stopPropagation());
  }
}
class W extends b {
  content;
  details;
  summary;
  openAttribute;
  /**
   * Creates a details component
   *
   * @param {HTMLDetailsElement} element - the details element
   */
  constructor(t) {
    super(t), this.details = t, this.summary = t.querySelector(".ds_details__summary"), this.content = t.querySelector(".ds_details__text"), this.summary.nodeName === "SUMMARY" ? this.openAttribute = "open" : this.openAttribute = "data-open";
  }
  /**
   * Adds details-like open/close behaviour to non-native details components
   *
   * @returns {void}
   */
  init() {
    typeof this.details.open != "boolean" && (this.polyfillAttributes(), this.polyfillEvents()), this.isInitialised = !0;
  }
  /**
   * Close the disclosure widget
   * - set aria attribute
   * - clear 'open' attribute
   *
   * @returns {void}
   */
  closeDetails() {
    this.details.removeAttribute(this.openAttribute), this.summary.setAttribute("aria-expanded", "false");
  }
  /**
   * Open the disclosure widget
   * - set aria attribute
   * - set 'open' attribute
   *
   * @returns {void}
   */
  openDetails() {
    this.details.setAttribute(this.openAttribute, "open"), this.summary.setAttribute("aria-expanded", "true");
  }
  /**
   * Add role and attributes to a non-native disclosure widget
   *
   * @returns {void}
   */
  polyfillAttributes() {
    this.content.id = this.content.id || `details-${A()}`, this.details.setAttribute("role", "group"), this.summary.setAttribute("role", "button"), this.summary.setAttribute("aria-controls", this.content.id), this.summary.nodeName === "SUMMARY" && (this.summary.tabIndex = 0);
    const t = this.details.hasAttribute(this.openAttribute);
    this.summary.setAttribute("aria-expanded", t.toString());
  }
  /**
   * Add mouse and keyboard events to trigger open/close of a non-native disclosure widget
   *
   * @returns {void}
   */
  polyfillEvents() {
    this.summary.addEventListener("click", () => {
      this.setState();
    }), this.summary.addEventListener("keypress", (t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.setState());
    }), this.summary.addEventListener("keyup", (t) => {
      t.key === " " && t.preventDefault();
    });
  }
  /**
   * Open or close the disclosure widget based on the value of its 'open' attribute
   *
   * @returns {void}
   */
  setState() {
    this.details.hasAttribute(this.openAttribute) ? this.closeDetails() : this.openDetails();
  }
}
class V extends b {
  altlink;
  button;
  window;
  /**
   * Creates a hide page component
   *
   * @param {HTMLElement} element - the hide page element
   * @param {Window} _window - the window object
   */
  constructor(t, e = window) {
    const s = t.querySelector(".js-hide-page");
    super(s), this.button = s, this.window = e, this.altlink = this.button?.dataset.altlink || "https://www.google.com";
  }
  /**
   * Attach event listeners to the hide page button
   *
   * @returns {void}
   */
  init() {
    this.button && (this.attachKeyboardEvents(), this.attachMouseEvents(), this.isInitialised = !0);
  }
  /**
   * Add keyboard events
   * - hide page on 'esc'
   *
   * @returns {void}
   */
  attachKeyboardEvents() {
    document.addEventListener("keyup", (t) => {
      t.key === "Escape" && this.doHidePage(t);
    });
  }
  /**
   * Add mouse events
   * - hide page on click
   *
   * @returns {void}
   */
  attachMouseEvents() {
    this.button.addEventListener("click", (t) => {
      this.doHidePage(t);
    });
  }
  /**
   * Hide the current page and navigate to an alternative link
   * - clear page body
   * - navigate to alt link in current tab
   * - open primary link in new tab
   *
   * @param {Event} event
   * @returns {void}
   */
  doHidePage(t) {
    t.preventDefault(), document.body.innerHTML = "", document.title = ".", this.window.open(this.button.href, "_newtab"), this.window.location.replace(this.altlink);
  }
}
class U extends b {
  notification;
  notificationClose;
  /**
   * Creates a notification component
   *
   * @param {HTMLElement} notification - the notification element
   */
  constructor(t) {
    super(t), this.notification = t, this.notificationClose = t.querySelector(".js-close-notification");
  }
  /**
   * Add event listener to the close button
   *
   * @returns {void}
   */
  init() {
    this.notificationClose && this.notificationClose.addEventListener("click", () => {
      this.notification.parentNode?.removeChild(this.notification);
    }), this.isInitialised = !0;
  }
}
class K extends b {
  sideNavigation;
  /**
   * Creates a side navigation component
   *
   * @param {HTMLElement} sideNavigation - the side navigation element
   */
  constructor(t) {
    super(t), this.sideNavigation = t;
  }
  /**
   * Set up the side nav if one has been provided to the constructor
   *
   * @returns {void}
   */
  init() {
    this.sideNavigation && !this.isInitialised && (this.setupSideNavigation(), this.isInitialised = !0);
  }
  /**
   * Perform DOM transformation on the side nav
   * - add aria attributes to new markup
   * - add event listener to new markup
   *
   * @returns {void}
   */
  setupSideNavigation() {
    const t = this.sideNavigation.querySelector(".js-toggle-side-navigation"), e = this.sideNavigation.querySelector(".ds_side-navigation__expand"), s = this.sideNavigation.querySelector(".ds_side-navigation__list");
    s.id = s.id || `side-navigation-${A()}`, t.checked = !1;
    const n = document.createElement("button");
    n.classList.add("ds_side-navigation__expand"), n.classList.add("ds_link"), n.classList.add("js-side-navigation-button"), n.setAttribute("aria-expanded", "false"), n.innerHTML = e.innerHTML, n.setAttribute("aria-expanded", "false"), n.setAttribute("aria-controls", s.id), e.classList.add("fully-hidden"), t.classList.add("fully-hidden"), t.classList.remove("visually-hidden"), this.sideNavigation.insertBefore(n, s), n.setAttribute("aria-controls", s.id), n.addEventListener("click", () => {
      const a = t.checked;
      n.setAttribute("aria-expanded", (!a).toString()), t.checked = !a;
    }), window.addEventListener("scroll", () => {
      n.offsetTop >= 1 ? n.classList.add("ds_side-navigation__expand--shadow") : n.classList.remove("ds_side-navigation__expand--shadow");
    });
  }
}
class Z extends b {
  mobileMenu;
  newMenuButton;
  /**
   * Creates a mobile menu component
   *
   * @param {HTMLElement} mobileMenu - the mobile menu element
   */
  constructor(t) {
    super(t), this.mobileMenu = t, this.newMenuButton = document.createElement("button");
  }
  /**
   * Set up the mobile menu if one has been provided to the constructor
   *
   * @returns {void}
   */
  init() {
    this.mobileMenu && (this.setupMobileNavigation(), this.isInitialised = !0);
  }
  /**
   * Perform DOM transformation on the mobile nav
   * - add aria attributes to new markup
   * - add event listener to new markup
   *
   * @returns {void}
   */
  setupMobileNavigation() {
    const t = document.querySelector(".js-toggle-menu");
    this.newMenuButton.innerHTML = t.innerHTML, this.newMenuButton.setAttribute("class", t.getAttribute("class")), this.newMenuButton.classList.add("ds_link"), this.newMenuButton.setAttribute("aria-controls", t.getAttribute("aria-controls")), this.newMenuButton.setAttribute("aria-expanded", "false"), t.parentNode?.appendChild(this.newMenuButton), t.classList.add("fully-hidden"), this.newMenuButton.addEventListener("click", (e) => {
      e.preventDefault(), this.mobileMenu = document.getElementById(this.newMenuButton.getAttribute("aria-controls")), this.mobileMenu.classList.contains("ds_site-navigation--open") ? this.closeMenu() : this.openMenu();
    });
  }
  /**
   * Open the site nav menu
   *
   * @returns {void}
   */
  openMenu() {
    this.mobileMenu.classList.add("ds_site-navigation--open"), this.newMenuButton.classList.add("ds_site-header__control--active"), this.newMenuButton.setAttribute("aria-expanded", "true");
  }
  /**
   * Close the site nav menu
   *
   * @returns {void}
   */
  closeMenu() {
    this.mobileMenu.classList.remove("ds_site-navigation--open"), this.newMenuButton.classList.remove("ds_site-header__control--active"), this.newMenuButton.setAttribute("aria-expanded", "false");
  }
}
const J = {
  /**
   * Initialise skip links
   * - adds click event to skip links to focus target element
   *
   * @returns {void}
   */
  init() {
    [].slice.call(document.querySelectorAll(".ds_skip-links__link")).forEach((i) => {
      i.addEventListener("click", () => {
        const t = document.querySelector(i.getAttribute("href"));
        t && S(t);
      });
    });
  }
};
class X extends b {
  container;
  window;
  /**
   * Creates a step navigation component
   *
   * @param {HTMLElement} container - the step navigation container element
   * @param _window - the window object
   */
  constructor(t, e = window) {
    super(t), this.container = t, this.window = e;
  }
  /**
   * Initialise step navigation
   * - adds current link class to link matching current URL
   *
   * @returns {void}
   */
  init() {
    this.container.querySelectorAll(".ds_accordion-item__body a").forEach((e) => {
      e.href === this.window.location.origin + this.window.location.pathname && e.classList.add("ds_step-navigation__current-link");
    }), this.isInitialised = !0;
  }
}
class q extends b {
  element;
  window;
  /**
   * Creates a mobile table component
   *
   * @param {HTMLTableElement} element - the table element
   * @param _window - the window object
   */
  constructor(t, e = window) {
    super(t), this.element = t, this.window = e;
  }
  /**
   * Initialise mobile table functionality
   * - checks data-smallscreen attribute to determine functionality
   * - 'scrolling' adds scrolling class if table is wider than container
   * - 'boxes' adds data-heading attributes to tds for small screen styling
   *
   * @returns {void}
   */
  init() {
    this.element.dataset.smallscreen === "scrolling" ? (this.checkScrollingTable(), this.window.addEventListener("resize", () => {
      this.checkScrollingTable();
    }), this.isInitialised = !0) : this.element.dataset.smallscreen === "boxes" && (this.setupBoxesTable(), this.isInitialised = !0);
  }
  /**
   * Check if table is wider than its container and add scrolling class if so
   *
   * @returns {void}
   */
  checkScrollingTable() {
    const t = this.element.querySelector("tbody"), e = this.element.parentElement;
    e && t.offsetWidth > e.offsetWidth ? this.element.classList.add("js-is-scrolling") : this.element.classList.remove("js-is-scrolling");
  }
  /**
   * Setup boxes table
   * - adds data-heading attributes to each td based on the relevant th in the header row
   *
   * @returns {void}
   */
  setupBoxesTable() {
    const t = this.element.querySelectorAll("tr");
    let e;
    if ([].slice.call(t[0].cells).filter((s) => s.tagName === "TH").length === t[0].cells.length && (e = t[0]), e)
      for (let s = 1, n = t.length; s < n; s++)
        [].slice.call(t[s].cells).forEach((a, o) => {
          a.setAttribute("data-heading", e.cells[o].textContent);
        });
  }
}
class G {
  window;
  constructor(t = window) {
    this.window = t;
  }
  /**
   * Initialise all mobile tables on the page
   * - finds all tables with data-smallscreen attribute
   * - initialises each MobileTable instance
   *
   * @returns {void}
   */
  init() {
    document.querySelectorAll("table[data-smallscreen]").forEach((e) => new q(e, this.window).init());
  }
}
class Q extends b {
  hasAutomaticActivation;
  boundOnHashChange;
  boundOnResize;
  hasEventsEnabled;
  resizeTimer;
  tabContainer;
  tabContents;
  tabHeaders;
  tabList;
  /**
   * Creates a tabs component
   *
   * @param {HTMLElement} tabContainer - the tab container element
   */
  constructor(t) {
    super(t), this.resizeTimer = 0, this.hasEventsEnabled = !1, this.hasAutomaticActivation = !t.classList.contains("ds_tabs--manual"), this.tabContainer = t, this.tabList = t.querySelector(".ds_tabs__list"), this.tabHeaders = [].slice.call(t.querySelectorAll(".ds_tabs__tab")), this.tabContents = [].slice.call(t.querySelectorAll(".ds_tabs__content")), this.boundOnHashChange = this.onHashChange.bind(this), window.addEventListener("hashchange", this.boundOnHashChange, !0), this.boundOnResize = this.onResize.bind(this), window.addEventListener("resize", this.boundOnResize, !0);
  }
  /**
   * Initialise tabs if medium size or larger
   *
   * @returns {void}
   */
  init() {
    k("medium") && (this.set(), this.hasEventsEnabled = !0);
  }
  /**
   * Setup tabs
   * - set roles and attributes
   * - add event listeners
   * - set initial active tab
   *
   * @returns {void}
   */
  set() {
    if (!this.isInitialised) {
      this.tabList.setAttribute("role", "tablist"), this.tabHeaders.forEach((s, n) => this.initTab(s, n)), this.tabContents.forEach((s) => {
        s.setAttribute("tabindex", "0"), s.setAttribute("role", "tabpanel");
      });
      const e = (this.getTab(window.location.hash) || this.tabHeaders[0].querySelector(".ds_tabs__tab-link")).parentElement;
      this.goToTab(e), this.isInitialised = !0;
    }
  }
  /**
   * Reset tabs to original state
   * - removes roles and attributes
   *
   * @returns {void}
   */
  reset() {
    this.isInitialised && (this.isInitialised = !1, this.tabList.removeAttribute("role"), this.tabHeaders.forEach((t, e) => this.resetTab(t, e)), this.tabContents.forEach((t) => {
      t.removeAttribute("tabindex"), t.removeAttribute("role");
    }));
  }
  /**
   * Runs when the browser is resized - includes debounce to prevent multiple calls in quick succession
   *
   * @returns {void}
   */
  onResize() {
    clearTimeout(this.resizeTimer), this.resizeTimer = window.setTimeout(() => {
      k("medium") ? this.set() : this.reset();
    }, 150);
  }
  /**
   * Runs when the hash value in the browser changes
   * - navigates to the tab matching the hash value
   *
   * @returns {void}
   */
  onHashChange() {
    const t = this.getTab(window.location.hash);
    if (!t)
      return;
    const e = t.parentElement;
    k("medium") && (this.goToTab(e), e.querySelector(".ds_tabs__tab-link").focus());
  }
  /**
   * Add the specified tab to the browser history
   * - adds the tab's href to the browser history
   *
   * @param {HTMLElement} tab - The tab to add to the browser history
   * @returns {void}
   */
  createHistoryEntry(t) {
    const e = this.getHref(t);
    history.pushState(null, "", e);
  }
  /**
   * Reset tab back to original state
   * - removes roles and attributes
   *
   * @param {HTMLElement} tabHeader - The tab header element
   * @param {number} index - The index of the tab
   * @returns {void}
   */
  resetTab(t, e) {
    t.removeAttribute("role"), t.classList.remove("ds_current");
    const s = t.querySelector(".ds_tabs__tab-link"), n = this.tabContents[e];
    s.removeAttribute("role"), s.removeAttribute("aria-controls"), s.removeAttribute("aria-selected"), s.removeAttribute("tabindex"), n.classList.remove("ds_tabs__content--hidden");
  }
  /**
   * Initialise tab and add event listeners for click and arrow keys
   * - sets aria attributes
   * - adds event listeners for click and arrow keys
   *
   * @param {HTMLElement} tabHeader - The tab header element
   * @param {number} index - The index of the tab
   * @returns {void}
   */
  initTab(t, e) {
    t.setAttribute("role", "presentation");
    const s = t.querySelector(".ds_tabs__tab-link"), n = this.tabContents[e], a = n.getAttribute("id");
    s.setAttribute("role", "tab"), s.setAttribute("aria-controls", a), s.setAttribute("aria-selected", "false"), s.setAttribute("tabindex", "-1"), n.classList.add("ds_tabs__content--hidden"), this.hasEventsEnabled || (s.addEventListener("click", (o) => {
      k("medium") && (o.preventDefault(), this.goToTab(t, !0));
    }), s.addEventListener("keydown", (o) => {
      if (k("medium")) {
        const l = o.target.parentElement;
        let c = !0;
        o.key === "ArrowRight" ? this.navToTab(this.getNextTab(l)) : o.key === "ArrowLeft" ? this.navToTab(this.getPreviousTab(l)) : o.key === "Home" ? this.navToTab(this.getFirstTab()) : o.key === "End" ? this.navToTab(this.getLastTab()) : o.key === "Spacebar" || o.key === " " ? this.goToTab(l, !0) : c = !1, c && o.preventDefault();
      }
    }));
  }
  /**
   * Navigates to the specified tab
   * - focuses the tab
   * - activates the tab if automatic activation is enabled
   *
   * @param {HTMLElement} tab - The tab to navigate to
   * @returns {void}
   */
  navToTab(t) {
    t.querySelector(".ds_tabs__tab-link").focus(), this.hasAutomaticActivation && this.goToTab(t, !0);
  }
  /**
   * Returns the next tab
   *
   * @param {HTMLElement} currentTab - The current tab
   * @returns {HTMLElement} - The next tab
   */
  getNextTab(t) {
    return t.nextElementSibling || this.getFirstTab();
  }
  /**
   * Returns the previous tab
   *
   * @param {HTMLElement} currentTab - The current tab
   * @returns {HTMLElement} - The previous tab
   */
  getPreviousTab(t) {
    return t.previousElementSibling || this.getLastTab();
  }
  /**
   * Returns the first tab
   *
   * @returns {HTMLElement} - The first tab
   */
  getFirstTab() {
    return this.tabHeaders[0];
  }
  /**
   * Returns the last tab
   *
   * @returns {HTMLElement} - The last tab
   */
  getLastTab() {
    return this.tabHeaders[this.tabHeaders.length - 1];
  }
  /**
   * Go to specified tab
   * - activates the tab and shows the relevant content
   * - deactivates the previous tab and hides its content
   * - updates browser history if required
   *
   * @param {HTMLElement} targetTab - The tab to activate
   * @param {boolean} updateHistory - Whether to update the browser history
   * @returns {void}
   */
  goToTab(t, e = !1) {
    const s = this.getCurrentTab();
    if (s === t)
      return;
    const n = t.querySelector(".ds_tabs__tab-link"), a = this.getTabContent(t);
    t.classList.add("ds_current"), n.setAttribute("aria-selected", "true"), n.setAttribute("tabindex", "0"), a.classList.remove("ds_tabs__content--hidden"), this.deactivateTab(s), e && this.createHistoryEntry(t);
  }
  /**
   * Deactivate the specified tab
   * - removes active classes and hides content
   * - sets aria attributes
   *
   * @param {HTMLElement} targetTab - The tab to deactivate
   * @returns {void}
   */
  deactivateTab(t) {
    if (!t)
      return;
    const e = t.querySelector(".ds_tabs__tab-link"), s = this.getTabContent(t);
    t.classList.remove("ds_current"), e.setAttribute("aria-selected", "false"), e.setAttribute("tabindex", "-1"), s.classList.add("ds_tabs__content--hidden");
  }
  /**
   * Returns the tab which matches the specified hash value
   *
   * @param {string} hash - The hash value to match
   * @returns {HTMLElement} - The matching tab element
   */
  getTab(t) {
    return this.tabContainer.querySelector('.ds_tabs__tab-link[href="' + t + '"]');
  }
  /**
   * Returns the current tab
   *
   * @returns {HTMLElement} - The current tab
   */
  getCurrentTab() {
    return this.tabList.querySelector(".ds_tabs__tab.ds_current");
  }
  /**
   * Returns the href of the specified tab
   *
   * @param {HTMLElement} tab - The tab element
   * @returns {string} - The href of the specified tab
   */
  getHref(t) {
    const s = t.querySelector(".ds_tabs__tab-link").href;
    return s.slice(s.indexOf("#"), s.length);
  }
  /**
   * Returns the content element for the specified tab
   *
   * @param {HTMLElement} tab - The tab element
   * @returns {HTMLElement} - The content element for the specified tab
   */
  getTabContent(t) {
    return this.tabContainer.querySelector(this.getHref(t));
  }
}
class tt extends b {
  boundOnResize;
  breakpointCheck;
  resizeTimer;
  tabContainer;
  tabList;
  tabNavigation;
  tabTitle;
  /**
   * Creates a tabs navigation component
   *
   * @param {HTMLElement} tabContainer - the tab container element
   * @param {Function} _breakpointCheck - the breakpoint check function
   */
  constructor(t, e = k) {
    super(t), this.breakpointCheck = e, this.resizeTimer = 0, this.tabContainer = t, this.tabList = t.querySelector(".ds_tabs__list"), this.tabNavigation = t.querySelector(".ds_tabs__navigation"), this.tabTitle = t.querySelector(".ds_tabs__title"), this.boundOnResize = this.onResize.bind(this), window.addEventListener("resize", this.boundOnResize, !0);
  }
  /**
   * Initialise tab navigation if smaller than medium size
   * - checks breakpoint and sets up tab navigation dropdown
   *
   * @returns {void}
   */
  init() {
    this.breakpointCheck("medium") || this.set();
  }
  /**
   * Setup tab navigation dropdown
   * - adds toggle button
   * - adds event listener to button
   * - sets aria-labelledby if current page label is shown
   *
   * @returns {void}
   */
  set() {
    if (!this.isInitialised) {
      const t = document.createElement("button"), e = this.tabList.getAttribute("id");
      t.classList.add("ds_tabs__toggle"), t.setAttribute("aria-expanded", "false"), t.innerHTML = this.tabTitle.innerHTML, t.setAttribute("aria-controls", e), this.tabNavigation.insertBefore(t, this.tabList), t.addEventListener("click", () => {
        t.getAttribute("aria-expanded") === "true" ? t.setAttribute("aria-expanded", "false") : t.setAttribute("aria-expanded", "true");
      }), this.tabContainer.querySelector(".ds_tabs__current") && this.tabNavigation.setAttribute("aria-labelledby", "ds_tabs__current"), this.isInitialised = !0;
    }
  }
  /**
   * Reset tabs to original state
   * - removes toggle button
   *
   * @returns {void}
   */
  reset() {
    if (this.isInitialised) {
      this.isInitialised = !1;
      const t = this.tabContainer.querySelector(".ds_tabs__toggle");
      t.parentNode?.removeChild(t), this.tabNavigation.setAttribute("aria-labelledby", "ds_tabs__title");
    }
  }
  /**
   * Runs when the browser is resized - includes debounce to prevent multiple calls in quick succession
   * - resets the tabs if the screen is smaller than medium
   *
   * @returns {void}
   */
  onResize() {
    clearTimeout(this.resizeTimer), this.resizeTimer = window.setTimeout(() => {
      this.breakpointCheck("medium") ? this.reset() : this.set();
    }, 150);
  }
}
const et = {
  Accordion: N,
  Autocomplete: H,
  BackToTop: O,
  CharacterCount: j,
  Checkboxes: R,
  CookieNotification: F,
  DatePicker: Y,
  Details: W,
  HideThisPage: V,
  NotificationBanner: U,
  SideNavigation: K,
  SiteNavigation: Z,
  skipLinks: J,
  StepNavigation: X,
  MobileTables: G,
  MobileTable: q,
  Tabs: Q,
  TabsNavigation: tt
}, f = {
  base: T,
  components: et,
  version: x,
  initAll: M,
  tracking: T.tools.tracking,
  elementIdModifier: 0
};
window.DS = f;
export {
  f as default
};
