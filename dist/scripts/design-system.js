function x(t = document) {
  [].slice.call(t.querySelectorAll('[data-module="ds-accordion"]:not(.js-instantiated)')).forEach((e) => new h.components.Accordion(e).init()), [].slice.call(t.querySelectorAll('[data-module="ds-back-to-top"]:not(.js-instantiated)')).forEach((e) => new h.components.BackToTop(e).init()), [].slice.call(t.querySelectorAll('[data-module="ds-character-count"]:not(.js-instantiated)')).forEach((e) => new h.components.CharacterCount(e).init()), [].slice.call(t.querySelectorAll('[data-module="ds-checkboxes"]:not(.js-instantiated)')).forEach((e) => new h.components.Checkboxes(e).init()), [].slice.call(document.querySelectorAll('[data-module="ds-cookie-notification"]:not(.js-instantiated)')).forEach((e) => new h.components.CookieNotification(e).init()), [].slice.call(document.querySelectorAll('[data-module="ds-datepicker"]:not(.js-instantiated)')).forEach((e) => new h.components.DatePicker(e).init()), [].slice.call(document.querySelectorAll('[data-module="ds-details"]:not(.js-instantiated)')).forEach((e) => new h.components.Details(e).init()), [].slice.call(document.querySelectorAll('[data-module="ds-file-upload"]:not(.js-instantiated)')).forEach((e) => new h.components.FileUpload(e).init()), [].slice.call(t.querySelectorAll(".ds_hide-page")).forEach((e) => new h.components.HideThisPage(e).init()), [].slice.call(t.querySelectorAll('[data-module="ds-mobile-navigation-menu"]:not(.js-instantiated)')).forEach((e) => new h.components.SiteNavigation(e).init()), [].slice.call(t.querySelectorAll('[data-module="ds-notification"]:not(.js-instantiated)')).forEach((e) => new h.components.NotificationBanner(e).init()), [].slice.call(t.querySelectorAll('[data-module="ds-notification-message"]:not(.js-instantiated)')).forEach((e) => new h.components.NotificationMessage(e).init()), [].slice.call(t.querySelectorAll('[data-module="ds-side-navigation"]:not(.js-instantiated)')).forEach((e) => new h.components.SideNavigation(e).init()), h.components.skipLinks.init(), [].slice.call(t.querySelectorAll('[data-module="ds-step-navigation"]:not(.js-instantiated)')).forEach((e) => new h.components.StepNavigation(e).init()), [].slice.call(t.querySelectorAll("table[data-smallscreen]")).forEach((e) => new h.components.MobileTable(e).init()), [].slice.call(document.querySelectorAll('[data-module="ds-tabs"]:not(.js-instantiated)')).forEach((e) => new h.components.Tabs(e).init()), [].slice.call(document.querySelectorAll('[data-module="ds-tabs-navigation"]:not(.js-instantiated)')).forEach((e) => new h.components.TabsNavigation(e).init()), h.base.tools.tracking.init();
}
function v() {
  return window.DS = window.DS || {}, window.DS.elementIdModifier = window.DS.elementIdModifier || 0, window.DS.elementIdModifier += 1, `ds${window.DS.elementIdModifier}`;
}
var S = function(t, e = "GET") {
  const i = new XMLHttpRequest();
  return new Promise((s, n) => {
    i.onreadystatechange = () => {
      if (i.readyState !== 4) return;
      i.status >= 200 && i.status < 300 ? s(i) : n({
        status: i.status,
        statusText: i.statusText
      });
    }, i.open(e, t, !0), i.send();
  });
}, f = {
  set: function(t) {
    if (f.hasPermission(t.category)) {
      if (t.type === "cookie") return f.cookie.set(t.name, t.value, t.expiresDays);
      t.type === "local" ? localStorage.setItem(t.name, t.value) : t.type === "session" && sessionStorage.setItem(t.name, t.value);
    }
  },
  get: function(t) {
    let e = "";
    return t.type === "cookie" ? e = f.cookie.get(t.name) : t.type === "local" ? e = localStorage.getItem(t.name) : t.type === "session" && (e = sessionStorage.getItem(t.name)), e || "";
  },
  remove: function(t) {
    t.type === "cookie" ? f.cookie.remove(t.name) : t.type === "local" ? localStorage.removeItem(t.name) : t.type === "session" && sessionStorage.removeItem(t.name);
  },
  setCookie: function(t, e, i, s) {
    f.hasPermission(t) && f.cookie.set(e, i, s);
  },
  setLocalStorage: function(t, e, i) {
    f.hasPermission(t) && localStorage.setItem(e, i);
  },
  setSessionStorage: function(t, e, i) {
    f.hasPermission(t) && sessionStorage.setItem(e, i);
  },
  getCookie: function(t) {
    return f.cookie.get(t);
  },
  getLocalStorage: function(t) {
    return localStorage.getItem(t);
  },
  getSessionStorage: function(t) {
    return sessionStorage.getItem(t);
  },
  removeCookie: function(t) {
    return f.cookie.remove(t);
  },
  removeLocalStorage: function(t) {
    return localStorage.removeItem(t);
  },
  removeSessionStorage: function(t) {
    return sessionStorage.removeItem(t);
  },
  cookie: {
    set: function(t, e, i) {
      e = window.btoa(e);
      const s = {
        name: t,
        value: e
      };
      if (i) {
        const a = /* @__PURE__ */ new Date();
        a.setTime(a.getTime() + i * 24 * 60 * 60 * 1e3), s.expires = a.toUTCString();
      }
      let n = t + "=" + e + "; ";
      return s.expires && (n += "expires=" + s.expires + "; "), n += "path=/", document.cookie = n, s;
    },
    get: function(t) {
      const e = t + "=", i = document.cookie.split(";");
      for (let s = 0, n = i.length; s < n; s++) {
        let a = i[s];
        for (; a.charAt(0) === " "; ) a = a.substring(1, a.length);
        if (a.indexOf(e) === 0) {
          const o = a.substring(e.length, a.length);
          return /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(o) ? window.atob(o) : o;
        }
      }
      return null;
    },
    remove: function(t, e = window) {
      const i = e.location.host.split(".");
      let s;
      for (f.unsetCookieWithDomain(t); i.length > 1; )
        s = i.join("."), f.unsetCookieWithDomain(t, s), f.unsetCookieWithDomain(t, `.${s}`), i.shift();
    }
  },
  hasPermission(t) {
    const e = f.get({
      type: "cookie",
      name: "cookiePermissions"
    }) || "";
    let i = {};
    return f.getIsJsonString(e) && (i = JSON.parse(e)), t === "necessary" || i[t] === !0;
  },
  getIsJsonString: function(t) {
    try {
      JSON.parse(t);
    } catch (e) {
      return this.error = e, !1;
    }
    return !0;
  },
  unsetCookieWithDomain: function(t, e) {
    const i = e ? `domain=${e};` : "";
    document.cookie = `${t}=;path=/;${i};expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  }
};
window.storage = f;
function A(t) {
  t.tabIndex = -1, t.addEventListener("focusout", () => {
    t.removeAttribute("tabindex");
  }), t.focus();
}
var L = class {
  tokens;
  constructor(t) {
    t && t.trim().length > 0 ? this.tokens = t.replace(/\s+/g, " ").split(" ") : this.tokens = [];
  }
  add(t) {
    return typeof t == "string" && (t = t.replace(/\s+/g, " ").split(" ")), t.forEach((e) => {
      this.tokens.includes(e) || this.tokens.push(e);
    }), this.value;
  }
  remove(t) {
    return t.replace(/\s+/g, " ").split(" ").forEach((e) => {
      this.tokens.includes(e) && this.tokens.splice(this.tokens.indexOf(e), 1);
    }), this.value;
  }
  contains(t) {
    return this.tokens.includes(t);
  }
  get value() {
    return this.tokens.join(" ").trim();
  }
}, D = "v4.1.1";
function g(t) {
  return t = String(t), t.trim().toLowerCase().replace(/['"’‘”“`]/g, "").replace(/[\W|_]+/g, "-").replace(/^-+|-+$/g, "");
}
function q(t) {
  const e = [];
  if (t.parentElement) {
    const i = [].slice.call(t.parentElement.children);
    for (let s = 0, n = i.length; s < n && i[s] !== t; s++)
      e.push(i[s]);
  }
  return e;
}
function C(t, e, i) {
  t.reverse();
  for (let s = 0, n = t.length; s < n; s++) {
    if (t[s].matches(e)) return t[s];
    if (i && t[s].matches(i) && t[s].querySelector(e))
      return t[s].querySelector(e);
  }
  return null;
}
var r = {
  hasAddedCanonicalUrl: !1,
  hasAddedClickTracking: !1,
  hasAddedPrefersColorScheme: !1,
  hasAddedVersion: !1,
  init: function(t = document.documentElement) {
    let e;
    for (e in r.add) r.add[e](t);
  },
  gatherElements: function(t, e) {
    const i = [].slice.call(e.querySelectorAll(`.${t}`));
    return e.classList && e.classList.contains(t) && i.push(e), i;
  },
  getClickType: function(t) {
    switch (t.type) {
      case "click":
        return t.ctrlKey ? "ctrl click" : t.metaKey ? "command/win click" : t.shiftKey ? "shift click" : "primary click";
      case "auxclick":
        return "middle click";
      case "contextmenu":
        return "secondary click";
    }
  },
  getNearestSectionHeader: function(t) {
    const e = "nav,.ds_metadata,.ds_summary-card__header,.ds_card__content-header", i = "h1,h2,h3,h4,h5,h6,.ds_details__summary", s = ".ds_page-header,.ds_layout__header,.ds_accordion-item__header";
    if (typeof t.closest == "function" && t.closest(e)) return;
    const n = C(q(t), i, s);
    let a;
    return n ? a = n : t.parentElement && (a = r.getNearestSectionHeader(t.parentElement)), a;
  },
  pushToDataLayer: function(t) {
    window.dataLayer = window.dataLayer || [], window.dataLayer.push(t);
  },
  add: {
    clicks: function(t = document.documentElement) {
      r.hasAddedClickTracking || (t.addEventListener("click", (e) => {
        r.pushToDataLayer({ method: r.getClickType(e) });
      }), t.addEventListener("auxclick", (e) => {
        (e.button === 1 || e.buttons === 4) && r.pushToDataLayer({ method: r.getClickType(e) });
      }), t.addEventListener("contextmenu", (e) => {
        r.pushToDataLayer({ method: r.getClickType(e) });
      }), r.hasAddedClickTracking = !0);
    },
    canonicalUrl: () => {
      const t = document.querySelector('link[rel="canonical"]');
      t && t.href && (r.hasAddedCanonicalUrl || (r.pushToDataLayer({ canonicalUrl: t.href }), r.hasAddedCanonicalUrl = !0));
    },
    prefersColorScheme: function() {
      if (!window.matchMedia) return;
      const t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      r.hasAddedPrefersColorScheme || (r.pushToDataLayer({ prefersColorScheme: t }), r.hasAddedPrefersColorScheme = !0);
    },
    version: function() {
      r.hasAddedVersion || (r.pushToDataLayer({ version: D }), r.hasAddedVersion = !0);
    },
    accordions: function(t = document.documentElement) {
      r.gatherElements("ds_accordion", t).forEach((e) => {
        let i = "";
        if (e.dataset.name && (i = e.dataset.name), !e.classList.contains("js-initialised")) return;
        [].slice.call(e.querySelectorAll("a:not(.ds_button)")).forEach((c) => {
          c.getAttribute("data-navigation") || c.setAttribute("data-navigation", "accordion-link");
        });
        const s = e.querySelector(".js-open-all"), n = [].slice.call(e.querySelectorAll(".ds_accordion-item"));
        function a() {
          const c = e.querySelectorAll(".ds_accordion-item--open").length;
          return n.length === c;
        }
        function o(c) {
          c && (a() ? c.setAttribute("data-accordion", `accordion-${i.length ? i + "-" : i}close-all`) : c.setAttribute("data-accordion", `accordion-${i.length ? i + "-" : i}open-all`));
        }
        function d(c, l) {
          const m = c.querySelector(".ds_accordion-item__button"), u = c.querySelector(".ds_accordion-item__control");
          m.setAttribute("data-accordion", `accordion-${i.length ? i + "-" : i}${u.checked ? "close" : "open"}-${l + 1}`);
        }
        o(s), n.forEach((c, l) => {
          d(c, l);
        }), s && s.addEventListener("click", () => {
          n.forEach((c, l) => {
            d(c, l);
          }), o(s);
        }), n.forEach((c, l) => {
          const m = c.querySelector(".ds_accordion-item__button"), u = c.querySelector(".ds_accordion-item__control");
          m.addEventListener("click", () => {
            m.setAttribute("data-accordion", `accordion-${i.length ? i + "-" : i}${u.checked ? "close" : "open"}-${l + 1}`), o(s);
          });
        });
      });
    },
    asides: function(t = document.documentElement) {
      r.gatherElements("ds_article-aside", t).forEach((e) => {
        [].slice.call(e.querySelectorAll("a:not(.ds_button)")).forEach((i, s) => {
          i.getAttribute("data-navigation") || i.setAttribute("data-navigation", `link-related-${s + 1}`);
        });
      });
    },
    autocompletes: function(t = document.documentElement) {
      function e(i, s) {
        r.pushToDataLayer({
          event: "autocomplete",
          searchText: i,
          clickText: s.dataset.autocompletetext,
          resultsCount: parseInt(s.dataset.autocompletecount),
          clickedResults: `result ${s.dataset.autocompleteposition} of ${s.dataset.autocompletecount}`
        }), delete s.dataset.autocompletetext, delete s.dataset.autocompletecount, delete s.dataset.autocompleteposition;
      }
      r.gatherElements("ds_autocomplete", t).forEach((i) => {
        const s = i.querySelector(".js-autocomplete-input"), n = document.querySelector("#" + s.getAttribute("aria-owns") + " .ds_autocomplete__suggestions-list");
        let a = s.value;
        s.addEventListener("keydown", (o) => {
          o.key === "Enter" && s.dataset.autocompletetext && e(a, s), a = s.value;
        }), n?.addEventListener("mousedown", () => {
          e(a, s);
        });
      });
    },
    backToTop: function(t = document.documentElement) {
      r.gatherElements("ds_back-to-top__button", t).forEach((e) => {
        e.setAttribute("data-navigation", "backtotop");
      });
    },
    breadcrumbs: function(t = document.documentElement) {
      r.gatherElements("ds_breadcrumbs", t).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_breadcrumbs__link")).forEach((i, s) => {
          i.getAttribute("data-navigation") || i.setAttribute("data-navigation", `breadcrumb-${s + 1}`);
        });
      });
    },
    buttons: function(t = document.documentElement) {
      [].slice.call(t.querySelectorAll('.ds_button, input[type="button"], input[type="submit"], button')).forEach((e) => {
        e.getAttribute("data-button") || e.setAttribute("data-button", `button-${g(e.textContent)}`);
      });
    },
    cards: function(t = document.documentElement) {
      r.gatherElements("ds_card__link--cover", t).forEach((e, i) => {
        e.getAttribute("data-navigation") || e.setAttribute("data-navigation", `card-${i + 1}`);
      }), r.gatherElements("ds_card", t).forEach((e, i) => {
        [].slice.call(e.querySelectorAll('.ds_button, input[type="button"], input[type="submit"], button')).forEach((s) => {
          s.getAttribute("data-section") || s.setAttribute("data-section", `card-${i + 1}`);
        }), [].slice.call(e.querySelectorAll("a:not(.ds_card__link)")).forEach((s) => {
          s.getAttribute("data-section") || s.setAttribute("data-section", `card-${i + 1}`);
        });
      });
    },
    categoryLists: function(t = document.documentElement) {
      r.gatherElements("ds_category-list", t).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_category-item__link")).forEach((i, s) => {
          i.getAttribute("data-navigation") || i.setAttribute("data-navigation", `category-item-${s + 1}`);
        });
      });
    },
    checkboxes: function(t = document.documentElement) {
      r.gatherElements("ds_checkbox__input", t).forEach((e) => {
        let i = e.getAttribute("data-form") || "";
        !i && e.id ? i = `checkbox-${e.id}` : i = i.replace(/-checked/g, ""), e.checked && (i = i + "-checked"), e.setAttribute("data-form", i), e.id && !e.getAttribute("data-value") && e.setAttribute("data-value", `${e.id}`);
        const s = t.querySelector(`[for=${e.id}]`);
        s && !e.classList.contains("js-has-tracking-event") && (s.addEventListener("click", () => {
          e.dataset.form = `checkbox-${e.id}-${e.checked ? "unchecked" : "checked"}`;
        }), e.classList.add("js-has-tracking-event"));
      });
    },
    confirmationMessages: function(t = document.documentElement) {
      r.gatherElements("ds_confirmation-message", t).forEach((e) => {
        [].slice.call(e.querySelectorAll("a:not(.ds_button)")).forEach((i) => {
          i.setAttribute("data-navigation", "confirmation-link");
        });
      });
    },
    contactDetails: function(t = document.documentElement) {
      r.gatherElements("ds_contact-details", t).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_contact-details__social-link")).forEach((i) => {
          i.getAttribute("data-navigation") || i.setAttribute("data-navigation", `contact-details-${g(i.textContent)}`);
        }), [].slice.call(e.querySelectorAll('a[href^="mailto"]')).forEach((i) => {
          i.getAttribute("data-navigation") || i.setAttribute("data-navigation", "contact-details-email");
        });
      });
    },
    contentNavs: function(t = document.documentElement) {
      r.gatherElements("ds_contents-nav", t).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_contents-nav__link")).forEach((i, s) => {
          i.getAttribute("data-navigation") || i.setAttribute("data-navigation", `contentsnav-${s + 1}`);
        });
      });
    },
    details: function(t = document.documentElement) {
      r.gatherElements("ds_details", t).forEach((e) => {
        const i = e.querySelector(".ds_details__summary");
        i.setAttribute("data-accordion", `detail-${e.open ? "close" : "open"}`), i.addEventListener("click", () => {
          i.setAttribute("data-accordion", `detail-${e.open ? "open" : "close"}`);
        }), [].slice.call(e.querySelectorAll("a:not(.ds_button)")).forEach((s) => {
          s.getAttribute("data-navigation") || s.setAttribute("data-navigation", "details-link");
        });
      });
    },
    errorMessages: function(t = document.documentElement) {
      r.gatherElements("ds_question__error-message", t).forEach((e, i) => {
        if (typeof e.closest == "function" && e.closest(".ds_question")) {
          const s = e.closest(".ds_question")?.querySelector(".js-validation-group, .ds_input, .ds_select, .ds_checkbox__input, .ds_radio__input");
          let n = (i + 1).toString();
          if (s) if (s.classList.contains("js-validation-group")) {
            const a = function(o, d, c) {
              return c.indexOf(o) === d;
            };
            n = [].slice.call(s.querySelectorAll(".ds_input, .ds_select, .ds_checkbox__input, .ds_radio__input")).map((o) => o.type === "radio" ? o.name : o.id).filter(a).join("-");
          } else s.type === "radio" ? n = s.name : n = s.id;
          e.getAttribute("data-form") || e.setAttribute("data-form", `error-${n}`);
        }
      });
    },
    errorSummaries: function(t = document.documentElement) {
      r.gatherElements("ds_error-summary", t).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_error-summary__list a")).forEach((i) => {
          !i.getAttribute("data-form") && i.href && i.setAttribute("data-form", `error-${i.href.substring(i.href.lastIndexOf("#") + 1)}`);
        });
      });
    },
    externalLinks: function(t = document.documentElement) {
      [].slice.call(t.querySelectorAll("a")).filter((e) => {
        let i = window.location.hostname;
        return window.location.port && (i += ":" + window.location.port), !new RegExp("/" + i + "/?|^tel:|^mailto:|^/").test(e.href);
      }).forEach((e) => {
        e.setAttribute("data-navigation", "link-external");
      });
    },
    fileUploads: function(t = document.documentElement) {
      [].slice.call(t.querySelectorAll(".ds_file-upload")).forEach((e) => {
        const i = e.querySelector('input[type="file"]');
        !i.getAttribute("data-form") && i.id && i.setAttribute("data-form", `fileinput-${i.id}`);
        function s(o) {
          const d = o.split(".");
          return d.length > 1 ? d.pop()?.toLowerCase() : "";
        }
        function n(o) {
          return `${(o * 1e-6).toFixed(2)}MB`;
        }
        i.addEventListener("input", () => {
          i.files?.length ? (i.setAttribute("data-filetype", s(i.files[0].name)), i.setAttribute("data-filesize", n(i.files[0].size))) : (i.removeAttribute("data-filesize"), i.removeAttribute("data-filetype"));
        });
        function a(o, d) {
          const c = { event: d };
          o.detail.canFill ? o.detail.canAccept ? c.status = "success" : c.status = "fail: unable to accept" : c.status = "fail: unable to fill";
          const l = [], m = [], u = [];
          for (const E of o.detail.files) {
            const b = E;
            l.push(s(b.name)), m.push(b.size), u.push(b.type);
          }
          c.files = {
            extension: l.join(" "),
            size: m.join(" "),
            type: u.join(" ")
          }, r.pushToDataLayer(c);
        }
        e.addEventListener("dropHappened", ((o) => {
          a(o, "fileUploadDrop");
        })), e.addEventListener("changeHappened", ((o) => {
          a(o, "fileUploadChange");
        })), e.addEventListener("cancel", () => {
          r.pushToDataLayer({ event: "fileUploadCancel" });
        });
      });
    },
    hideThisPage: function(t = document.documentElement) {
      r.gatherElements("ds_hide-page", t).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_hide-page__button")).forEach((i) => {
          i.setAttribute("data-navigation", "hide-this-page"), document.addEventListener("keyup", (s) => {
            s.key === "Esc" && r.pushToDataLayer({ event: "hide-this-page-keyboard" });
          });
        });
      });
    },
    insetTexts: function(t = document.documentElement) {
      r.gatherElements("ds_inset-text", t).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_inset-text__text a:not(.ds_button)")).forEach((i) => {
          i.getAttribute("data-navigation") || i.setAttribute("data-navigation", "inset-link");
        });
      });
    },
    links: function(t = document.documentElement) {
      [].slice.call(t.querySelectorAll("a")).forEach((e) => {
        const i = r.getNearestSectionHeader(e);
        i && (e.getAttribute("data-section") || e.setAttribute("data-section", i.textContent.trim()));
      });
    },
    metadataItems: function(t = document.documentElement) {
      r.gatherElements("ds_metadata__item", t).forEach((e, i) => {
        const s = e.querySelector(".ds_metadata__key");
        let n;
        s ? n = s.textContent.trim() : n = `metadata-${i}`, [].slice.call(e.querySelectorAll(".ds_metadata__value a")).forEach((a, o) => {
          a.getAttribute("data-navigation") || a.setAttribute("data-navigation", `${g(n)}-${o + 1}`);
        });
      });
    },
    notifications: function(t = document.documentElement) {
      r.gatherElements("ds_notification", t).forEach((e, i) => {
        const s = e.id || (i + 1).toString();
        [].slice.call(e.querySelectorAll("a:not(.ds_button)")).forEach((a) => {
          a.getAttribute("data-banner") || a.setAttribute("data-banner", `banner-${s}-link`);
        }), [].slice.call(e.querySelectorAll(".ds_button:not(.ds_notification__close)")).forEach((a) => {
          a.getAttribute("data-banner") || a.setAttribute("data-banner", `banner-${s}-${g(a.textContent)}`);
        });
        const n = e.querySelector(".ds_notification__close");
        n && !n.getAttribute("data-banner") && n.setAttribute("data-banner", `banner-${s}-close`);
      });
    },
    notificationMessages: function(t = document.documentElement) {
      r.gatherElements("ds_notification-message", t).forEach((e, i) => {
        const s = e.id || (i + 1).toString(), n = e.classList.contains("ds_notification-message--error") ? "error" : e.classList.contains("ds_notification-message--warning") ? "warning" : e.classList.contains("ds_notification-message--info") ? "info" : "confirmation";
        [].slice.call(e.querySelectorAll("a")).forEach((a) => {
          a.getAttribute("data-navigation") || a.setAttribute("data-navigation", `${n}-${s}-link`);
        }), e.querySelector(".ds_notification-message__close")?.setAttribute("data-button", `${n}-${s}-close`);
      });
    },
    pagination: function(t = document.documentElement) {
      r.gatherElements("ds_pagination", t).forEach((e) => {
        const i = e.querySelector(".ds_pagination__load-more button");
        i && !i.getAttribute("data-search") && i.setAttribute("data-search", "pagination-more"), [].slice.call(e.querySelectorAll("a.ds_pagination__link")).forEach((s) => {
          s.getAttribute("data-search") || s.setAttribute("data-search", `pagination-${g(s.textContent)}`);
        });
      });
    },
    phaseBanners: function(t = document.documentElement) {
      r.gatherElements("ds_phase-banner", t).forEach((e) => {
        const i = e.querySelector(".ds_tag"), s = i ? i.textContent.trim() : "phase";
        [].slice.call(e.querySelectorAll("a")).forEach((n) => {
          n.getAttribute("data-banner") || n.setAttribute("data-banner", `banner-${g(s)}-link`);
        });
      });
    },
    radios: function(t = document.documentElement) {
      r.gatherElements("ds_radio__input", t).forEach((e) => {
        !e.getAttribute("data-form") && e.name && e.id && e.setAttribute("data-form", `radio-${e.name}-${e.id}`), e.id && !e.getAttribute("data-value") && e.setAttribute("data-value", `${e.id}`);
      });
    },
    searchFacets: function(t = document.documentElement) {
      r.gatherElements("ds_facet__button", t).forEach((e) => {
        e.setAttribute("data-button", `button-filter-${e.dataset.slug}-remove`);
      });
    },
    searchResults: function(t = document.documentElement) {
      r.gatherElements("ds_search-results", t).forEach((e) => {
        const i = e.querySelector(".ds_search-results__list");
        if (!i) return;
        const s = [].slice.call(e.querySelectorAll(".ds_search-result")), n = [].slice.call(e.querySelectorAll(".ds_search-result--promoted")), a = +(i.getAttribute("start") || "1");
        s.forEach((o, d) => {
          const c = o.querySelector(".ds_search-result__link"), l = o.querySelector(".ds_search-result__media-link"), m = o.querySelector(".ds_search-result__context a");
          if (o.classList.contains("ds_search-result--promoted")) {
            const u = `search-promoted-${d + 1}/${n.length}`;
            c.setAttribute("data-search", u);
          } else {
            let u;
            i.getAttribute("data-total") && (u = i.getAttribute("data-total"));
            let E = `search-result-${a + d - n.length}`;
            const b = `search-image-${a + d - n.length}`;
            let y = `search-parent-link-${a + d - n.length}`;
            u && (E += `/${u}`, y += `/${u}`), c.setAttribute("data-search", E), l && l.setAttribute("data-search", b), m && m.setAttribute("data-search", y);
          }
        });
      });
    },
    searchSuggestions: function(t = document.documentElement) {
      r.gatherElements("ds_search-suggestions", t).forEach((e) => {
        const i = [].slice.call(e.querySelectorAll(".ds_search-suggestions a"));
        i.forEach((s, n) => {
          s.setAttribute("data-search", `suggestion-result-${n + 1}/${i.length}`);
        });
      });
    },
    searchRelated: function(t = document.documentElement) {
      r.gatherElements("ds_search-results__related", t).forEach((e) => {
        const i = [].slice.call(e.querySelectorAll(".ds_search-results__related a"));
        i.forEach((s, n) => {
          s.setAttribute("data-search", `search-related-${n + 1}/${i.length}`);
        });
      });
    },
    selects: function(t = document.documentElement) {
      r.gatherElements("ds_select", t).forEach((e) => {
        !e.getAttribute("data-form") && e.id && e.setAttribute("data-form", `select-${e.id}`), [].slice.call(e.querySelectorAll("option")).forEach((i) => {
          let s = "null";
          i.value && (s = g(i.value)), i.setAttribute("data-form", `${e.getAttribute("data-form")}-${s}`);
        }), e.classList.contains("js-has-tracking-event") || (e.addEventListener("change", (i) => {
          const s = i.target.querySelector(":checked");
          r.pushToDataLayer({ event: String(s.dataset.form) });
        }), e.classList.add("js-has-tracking-event"));
      });
    },
    sequentialNavs: function(t = document.documentElement) {
      r.gatherElements("ds_sequential-nav", t).forEach((e) => {
        const i = e.querySelector(".ds_sequential-nav__item--prev > .ds_sequential-nav__button "), s = e.querySelector(".ds_sequential-nav__item--next > .ds_sequential-nav__button ");
        i && !i.getAttribute("data-navigation") && i.setAttribute("data-navigation", "sequential-previous"), s && !s.getAttribute("data-navigation") && s.setAttribute("data-navigation", "sequential-next");
      });
    },
    sideNavs: function(t = document.documentElement) {
      r.gatherElements("ds_side-navigation", t).forEach((e) => {
        const i = e.querySelector(".ds_side-navigation__list"), s = e.querySelector(".js-side-navigation-button"), n = e.querySelector(".js-toggle-side-navigation");
        function a() {
          s?.setAttribute("data-navigation", `navigation-${n.checked ? "close" : "open"}`);
        }
        function o(d, c = "") {
          [].slice.call(d.children).forEach((l, m) => {
            [].slice.call(l.children).forEach((u) => {
              u.classList.contains("ds_side-navigation__list") ? o(u, `${c}-${m + 1}`) : u.setAttribute("data-navigation", `sidenav${c}-${m + 1}`);
            });
          });
        }
        o(i), s && (a(), s.addEventListener("click", () => {
          a();
        }));
      });
    },
    siteBranding: function(t = document.documentElement) {
      r.gatherElements("ds_site-branding", t).forEach((e) => {
        const i = e.querySelector(".ds_site-branding__logo");
        i && !i.getAttribute("data-header") && i.setAttribute("data-header", "header-logo");
        const s = e.querySelector(".ds_site-branding__title");
        s && !s.getAttribute("data-header") && s.setAttribute("data-header", "header-title");
      });
    },
    siteFooter: function(t = document.documentElement) {
      r.gatherElements("ds_site-footer", t).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_site-footer__org-link")).forEach((i) => {
          i.getAttribute("data-footer") || i.setAttribute("data-footer", "footer-logo");
        }), [].slice.call(e.querySelectorAll(".ds_site-footer__copyright a")).forEach((i) => {
          i.getAttribute("data-footer") || i.setAttribute("data-footer", "footer-copyright");
        }), [].slice.call(e.querySelectorAll(".ds_site-items__item a:not(.ds_button)")).forEach((i, s) => {
          i.getAttribute("data-footer") || i.setAttribute("data-footer", `footer-link-${s + 1}`);
        });
      });
    },
    siteNavigation: function(t = document.documentElement) {
      r.gatherElements("ds_site-navigation", t).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_site-navigation__link")).forEach((i, s) => {
          i.getAttribute("data-device") || (typeof i.closest == "function" && i.closest(".ds_site-navigation--mobile") ? i.setAttribute("data-device", "mobile") : i.setAttribute("data-device", "desktop")), i.getAttribute("data-header") || i.setAttribute("data-header", `header-link-${s + 1}`);
        });
      }), r.gatherElements("ds_site-navigation--mobile", t).forEach((e) => {
        const i = e.parentNode?.querySelector(".js-toggle-menu");
        i && i.setAttribute("data-header", "header-menu-toggle");
      });
    },
    skipLinks: function(t = document.documentElement) {
      [].slice.call(t.querySelectorAll(".ds_skip-links__link")).forEach((e, i) => {
        e.getAttribute("data-navigation") || e.setAttribute("data-navigation", `skip-link-${i + 1}`);
      });
    },
    stepNavigation: function(t = document.documentElement) {
      r.gatherElements("ds_step-navigation", t).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_step-navigation__title-link")).forEach((i) => {
          i.setAttribute("data-navigation", "partof-sidebar");
        });
      }), r.gatherElements("ds_step-navigation-top", t).forEach((e) => {
        [].slice.call(e.querySelectorAll("a")).forEach((i) => {
          i.setAttribute("data-navigation", "partof-header");
        });
      });
    },
    summaryCard: function(t = document.documentElement) {
      r.gatherElements("ds_summary-card", t).forEach((e, i) => {
        [].slice.call(e.querySelectorAll(".ds_summary-card__actions-list")).forEach((s) => {
          const n = [].slice.call(s.querySelectorAll("button")), a = [].slice.call(s.querySelectorAll("a"));
          n.forEach((o) => {
            o.setAttribute("data-button", `button-${g(o.textContent)}-${i + 1}`);
          }), a.forEach((o) => {
            o.setAttribute("data-navigation", `navigation-${g(o.textContent)}-${i + 1}`);
          });
        });
      });
    },
    summaryList: function(t = document.documentElement) {
      r.gatherElements("ds_summary-list__actions", t).forEach((e) => {
        [].slice.call(e.querySelectorAll("button, a")).forEach((i) => {
          const s = i.tagName === "BUTTON" ? "button" : "navigation", n = i.closest(".ds_summary-list__item")?.querySelector(".ds_summary-list__key"), a = "-" + g(n.textContent);
          i.setAttribute(`data-${s}`, `${s}-${g(i.textContent)}${a}`);
        });
      });
    },
    tabs: function(t = document.documentElement) {
      const e = r.gatherElements("ds_tabs", t);
      let i = 1;
      e.forEach((s) => {
        [].slice.call(s.querySelectorAll(".ds_tabs__tab-link")).forEach((n, a) => {
          n.getAttribute("data-navigation") || n.setAttribute("data-navigation", `tab-link-${i}-${a + 1}`);
        }), i++;
      });
    },
    taskList: function(t = document.documentElement) {
      r.gatherElements("ds_task-list__task-link", t).forEach((e) => {
        e.getAttribute("data-navigation") || e.setAttribute("data-navigation", "tasklist");
      }), r.gatherElements("js-task-list-skip-link", t).forEach((e) => {
        e.getAttribute("data-navigation") || e.setAttribute("data-navigation", "tasklist-skip");
      });
    },
    textInputs: function(t = document.documentElement) {
      [].slice.call(t.querySelectorAll("input.ds_input")).forEach((e) => {
        if (!e.getAttribute("data-form") && e.id) {
          const i = e.type;
          e.setAttribute("data-form", `${i}input-${e.id}`);
        }
      });
    },
    textareas: function(t = document.documentElement) {
      [].slice.call(t.querySelectorAll("textarea.ds_input")).forEach((e) => {
        !e.getAttribute("data-form") && e.id && e.setAttribute("data-form", `textarea-${e.id}`);
      });
    },
    warningTexts: function(t = document.documentElement) {
      r.gatherElements("ds_warning-text", t).forEach((e) => {
        [].slice.call(e.querySelectorAll(".ds_warning-text a:not(.ds_button)")).forEach((i) => {
          i.setAttribute("data-navigation", "warning-link");
        });
      });
    }
  }
}, M = {
  idModifier: v,
  PromiseRequest: S,
  storage: f,
  temporaryFocus: A,
  TokenList: L,
  tracking: r
};
function _(t) {
  const e = document.createElement("div");
  e.classList.add("ds_breakpoint-check"), e.classList.add("ds_breakpoint-check--" + t), document.body.appendChild(e);
  const i = window.getComputedStyle(e, null).display === "block";
  return e.parentNode?.removeChild(e), i;
}
var I = { breakpointCheck: _ }, k = {
  tools: M,
  utilities: I
}, p = class {
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
}, $ = class extends p {
  accordion;
  items;
  openAllButton;
  constructor(t) {
    super(t), this.accordion = t, this.items = [].slice.call(t.querySelectorAll(".ds_accordion-item")), this.openAllButton = t.querySelector(".js-open-all");
  }
  init() {
    this.isInitialised || (this.items.forEach((t) => this.initAccordionItem(t)), this.openAllButton && this.initOpenAll(), this.isInitialised = !0);
  }
  initAccordionItem(t) {
    const e = t.querySelector(".ds_accordion-item__body"), i = t.querySelector(".ds_accordion-item__control"), s = t.querySelector(".ds_accordion-item__header"), n = t.querySelector(".ds_accordion-item__indicator"), a = t.querySelector(".ds_accordion-item__label span"), o = s.querySelector(".ds_accordion-item__title");
    let d = !1;
    if (window.location.hash) try {
      t.querySelector(window.location.hash) && (d = !0, i.checked = !0);
    } catch {
    }
    const c = i.checked, l = document.createElement("button");
    o.classList.add("ds_accordion-item__title--button"), l.classList.add("ds_accordion-item__button"), l.classList.add("js-accordion-button"), l.id = o.id + "-button", l.type = "button", i.classList.remove("visually-hidden"), i.classList.add("fully-hidden"), i.setAttribute("tabindex", "-1"), l.innerHTML = o.innerHTML, n.setAttribute("aria-hidden", "true"), o.innerHTML = "", o.insertBefore(l, o.firstChild), l.appendChild(n), a.classList.add("fully-hidden");
    const m = v();
    t.id = t.id || `accordion-item-${m}`, e.id = e.id || `accordion-item-${m}-body`, c && (t.classList.add("ds_accordion-item--open"), this.openAllButton && this.setOpenAllButton(this.checkAllOpen()), d && t.scrollIntoView()), l.setAttribute("aria-expanded", c.toString()), l.setAttribute("aria-controls", e.id), l.addEventListener("click", (u) => {
      u.preventDefault(), this.toggleAccordionItem(t);
    });
  }
  initOpenAll() {
    this.openAllButton.addEventListener("click", () => {
      function t(n) {
        return n.closest(".ds_accordion-item");
      }
      const e = !this.checkAllOpen(), i = [].slice.call(this.accordion.querySelectorAll(".js-accordion-button"));
      let s;
      e ? s = i.filter((n) => !t(n).classList.contains("ds_accordion-item--open")) : s = i.filter((n) => t(n).classList.contains("ds_accordion-item--open")), s.forEach((n) => {
        this.toggleAccordionItem(t(n));
      }), this.setOpenAllButton(e);
    }), this.openAllButton.setAttribute("aria-controls", this.items.map((t) => t.id).join(" ")), this.openAllButton.setAttribute("aria-expanded", "false");
  }
  toggleAccordionItem(t) {
    const e = t.querySelector(".js-accordion-button"), i = t.querySelector(".ds_accordion-item__control"), s = t.classList.contains("ds_accordion-item--open");
    s ? t.classList.remove("ds_accordion-item--open") : t.classList.add("ds_accordion-item--open"), e.setAttribute("aria-expanded", (!s).toString()), i.checked = !s, this.openAllButton && this.setOpenAllButton(this.checkAllOpen());
  }
  setOpenAllButton(t) {
    t ? this.openAllButton.innerHTML = 'Close all <span class="visually-hidden">sections</span>' : this.openAllButton.innerHTML = 'Open all <span class="visually-hidden">sections</span>', this.openAllButton.setAttribute("aria-expanded", t.toString());
  }
  checkAllOpen() {
    const t = this.accordion.querySelectorAll(".ds_accordion-item--open").length;
    return this.items.length === t;
  }
};
function B(t, e, i) {
  i = Object.assign({}, { className: "" }, i);
  function s(a, o) {
    if (!a.data || o === "") return !1;
    let d, c;
    const l = new RegExp(o, "i").exec(a.data);
    return l && (c = document.createElement("MARK"), i.className && (c.className = i.className), d = a.splitText(l.index), d.splitText(l[0].length), c.appendChild(d.cloneNode(!0)), a.parentNode?.replaceChild(c, d)), !!l;
  }
  function n(a) {
    let o;
    for (let c = 0; c < a.childNodes.length; c++)
      o = a.childNodes[c], o.nodeType === 3 ? c += s(o, e) ? 1 : 0 : n(o);
  }
  n(t);
}
var N = class extends p {
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
  constructor(t, e, i = {}) {
    super(t), this.inputElement = t.querySelector(".js-autocomplete-input"), this.endpointUrl = e, this.suggestionMappingFunction = i.suggestionMappingFunction || ((s) => s), this.throttleDelay = i.throttleDelay || 100, this.minLength = i.minLength || 3, this.tempToggleCharacter = "", this.PromiseRequest = S, this.statusElement = document.querySelector("#autocomplete-status");
  }
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
      const e = t.target, i = e.classList.contains("ds_autocomplete__suggestion") ? e : e.closest(".ds_autocomplete__suggestion");
      if (i) {
        const s = i.parentElement, n = Array.from(s.children).indexOf(i);
        this.selectSuggestion(n), this.acceptSelectedSuggestion();
      }
    }), this.isInitialised = !0);
  }
  acceptSelectedSuggestion() {
    const t = document.querySelector("#" + this.inputElement.getAttribute("aria-activedescendant"));
    this.inputElement.value = t.querySelector(".js-suggestion-text").textContent.trim(), this.inputElement.dataset.autocompletetext = this.inputElement.value, this.inputElement.dataset.autocompletecount = this.suggestions.length.toString(), this.inputElement.dataset.autocompleteposition = String([].slice.call(this.listBoxElement.querySelectorAll("li")).indexOf(t) + 1), this.clearSuggestions();
  }
  buildSuggestionHtml(t) {
    return `<span aria-hidden="true" class="ds_autocomplete__suggestion__text  js-suggestion-text">${t}</span>
                <span class="visually-hidden">${t}</span>`;
  }
  clearSearch() {
    this.inputElement.value = "", this.clearSuggestions();
  }
  clearSuggestions() {
    delete this.activeSuggestion, delete this.selectedSuggestion, this.listBoxElement.innerHTML = "", this.inputElement.removeAttribute("aria-activedescendant"), this.inputElement.classList.remove("js-has-suggestions"), this.statusElement.innerHTML = "", this.suggestions && this.suggestions.filter((t) => t.isActive).forEach((t) => {
      t.isActive = !1;
    });
  }
  fetchSuggestions(t) {
    return this.PromiseRequest(this.endpointUrl + encodeURIComponent(t)).then((e) => this.suggestionMappingFunction(e)).catch((e) => (console.log("fetch failed", e), this.suggestionMappingFunction([])));
  }
  selectSuggestion(t) {
    this.selectedSuggestion = t, this.suggestions.forEach((e, i) => {
      i === this.modulo(t, this.suggestions.length) ? (e.isActive = !0, this.activeSuggestion = e, this.inputElement.setAttribute("aria-activedescendant", "suggestion-" + i)) : delete e.isActive;
    }), this.showSuggestions(this.suggestions);
  }
  showSuggestions(t) {
    if (this.listBoxElement.innerHTML = "", t.length) {
      for (let s = 0, n = t.length; s < n; s++) {
        const a = t[s], o = document.createElement("li");
        o.id = "suggestion-" + s, o.classList.add("ds_autocomplete__suggestion"), o.setAttribute("role", "option"), document.createElement("span").classList.add("js-suggestion-text"), a.isActive && o.classList.add("active"), o.innerHTML = this.buildSuggestionHtml(a.displayText), B(o.querySelector(".js-suggestion-text"), this.inputElement.value, {}), this.listBoxElement.appendChild(o);
      }
      this.inputElement.classList.add("js-has-suggestions");
      const e = this.listBoxElement.parentElement, i = window.visualViewport;
      for (; i.height < e.offsetHeight + this.inputElement.offsetHeight + 16; ) {
        const s = this.listBoxElement.querySelector("li:last-child");
        s.parentNode?.removeChild(s), t = t.splice(t.length - 1);
      }
    } else this.clearSuggestions();
  }
  updateStatus(t, e = 100) {
    if (this.statusElement) {
      this.statusTimeout && window.clearTimeout(this.statusTimeout);
      const i = `There ${t === 1 ? "is" : "are"} ${t} ${t === 1 ? "option" : "options"}`;
      this.statusTimeout = window.setTimeout(() => {
        this.updateStatusText(i);
      }, e);
    }
  }
  updateStatusText(t) {
    this.tempToggleCharacter.length ? this.tempToggleCharacter = "" : this.tempToggleCharacter = ".", this.statusElement.textContent = t + this.tempToggleCharacter;
  }
  modulo(t, e) {
    return (t % e + e) % e;
  }
}, P = class extends p {
  backToTopElement;
  backToTopOffset;
  footerEl;
  window;
  constructor(t, e = window, i = {}) {
    super(t);
    const s = document.createElement("div");
    i.footerElSelector ? this.footerEl = document.querySelector(i.footerElSelector) : this.footerEl = document.querySelector(".ds_site-footer") || s, this.backToTopElement = t, this.window = e;
  }
  init() {
    if (!this.backToTopElement) return;
    const t = this.backToTopElement.querySelector(".ds_back-to-top__button");
    t && (this.backToTopOffset = t.offsetHeight + 8), this.checkDisplay(), this.window.addEventListener("resize", () => this.checkDisplay()), new ResizeObserver(() => {
      this.checkDisplay();
    }).observe(document.body), this.isInitialised = !0;
  }
  checkDisplay() {
    document.body.offsetHeight - this.footerEl.offsetHeight - this.backToTopOffset < this.window.innerHeight ? this.backToTopElement.classList.add("visually-hidden") : (this.backToTopElement.classList.remove("ds_back-to-top--clamped"), this.backToTopElement.classList.remove("visually-hidden")), document.body.offsetHeight - this.footerEl.offsetHeight <= this.window.innerHeight ? this.backToTopElement.classList.add("ds_back-to-top--hidden") : this.backToTopElement.classList.remove("ds_back-to-top--hidden"), this.checkPosition();
  }
  checkPosition() {
    const t = this.footerEl.offsetHeight + 8, e = Math.ceil(t / 8);
    this.backToTopElement.classList.forEach((i) => {
      i.match(/ds_!_off-b-/) && this.backToTopElement.classList.remove(i);
    }), this.backToTopElement.classList.add(`ds_!_off-b-${e}`);
  }
}, H = class extends p {
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
  constructor(t) {
    super(t), this.field = t, this.inputElement = this.field.querySelector("input, textarea"), this.threshold = this.field.dataset.threshold ? Number(this.field.dataset.threshold) * 0.01 : 0, this.messageTimeout = 0, this.idModifier = v();
  }
  init() {
    if (this.inputElement && !this.isInitialised) {
      if (this.maxLength = this.getMaxLength(), this.thresholdCharacters = this.getThresholdCharacters(), this.maxLength === 0) return;
      this.emptyMessage = `You can enter up to ${this.maxLength} characters`;
      const t = document.createElement("div");
      t.classList.add("fully-hidden"), t.classList.add("ds_character-count__initial"), t.textContent = this.emptyMessage, t.id = `character-count-empty-${this.idModifier}`, this.messageElement = document.createElement("div"), this.messageElement.classList.add("ds_input__message"), this.messageElement.classList.add("ds_hint-text"), this.messageElement.setAttribute("aria-hidden", "true"), this.screenReaderMessageElement = document.createElement("div"), this.screenReaderMessageElement.classList.add("visually-hidden"), this.screenReaderMessageElement.id = `character-count-remaining-${this.idModifier}`;
      const e = new L(this.inputElement.getAttribute("aria-describedby"));
      this.inputElement.setAttribute("aria-describedby", e.add([t.id, this.screenReaderMessageElement.id])), this.inputElement.value.length < this.thresholdCharacters && this.messageElement.classList.add("fully-hidden"), this.isInvalidInitialState = !!this.inputElement.getAttribute("aria-invalid") && this.inputElement.getAttribute("aria-invalid") !== "false", this.field.appendChild(this.messageElement), this.field.appendChild(this.screenReaderMessageElement), this.field.appendChild(t), this.updateCountMessage(), this.inputElement.oldValue = this.inputElement.value, this.inputElement.addEventListener("input", this.checkIfChanged.bind(this)), this.isInitialised = !0;
    }
  }
  checkIfChanged() {
    this.inputElement.oldValue || (this.inputElement.oldValue = ""), this.inputElement.value !== this.inputElement.oldValue && (this.screenReaderMessageElement.setAttribute("aria-live", "polite"), this.inputElement.oldValue = this.inputElement.value, this.updateCountMessage.bind(this)());
  }
  getMaxLength() {
    let t = 0;
    return this.inputElement.getAttribute("maxlength") ? (t = Number(this.inputElement.getAttribute("maxlength")), this.inputElement.removeAttribute("maxlength")) : this.field.dataset.maxlength && (t = Number(this.field.dataset.maxlength)), t;
  }
  getThresholdCharacters() {
    return Math.round(this.maxLength * this.threshold);
  }
  updateCountMessage() {
    const t = this.maxLength - this.inputElement.value.length;
    let e = "characters";
    Math.abs(t) === 1 && (e = "character"), this.messageElement.textContent = `You have ${t} ${e} remaining`, t < 0 ? (this.inputElement.classList.add("ds_input--error"), this.inputElement.setAttribute("aria-invalid", "true"), this.messageElement.textContent = `You have ${Math.abs(t)} ${e} too many`, this.messageElement.classList.add("ds_input__message--error")) : (this.isInvalidInitialState || (this.inputElement.classList.remove("ds_input--error"), this.inputElement.setAttribute("aria-invalid", "false")), this.messageElement.classList.remove("ds_input__message--error"), this.inputElement.value.length === 0 ? this.messageElement.textContent = this.emptyMessage : this.messageElement.textContent = `You have ${t} ${e} remaining`), this.inputElement.value.length < this.thresholdCharacters ? this.messageElement.classList.add("fully-hidden") : this.messageElement.classList.remove("fully-hidden"), clearTimeout(this.messageTimeout), this.messageTimeout = window.setTimeout(() => {
      this.inputElement.value.length >= this.thresholdCharacters ? this.updateScreenReaderMessage() : this.screenReaderMessageElement.innerHTML = "&nbsp;";
    }, 1e3);
  }
  updateScreenReaderMessage() {
    this.screenReaderMessageElement.textContent = this.messageElement.textContent;
  }
}, z = class extends p {
  checkboxes;
  constructor(t) {
    super(t), this.checkboxes = [].slice.call(t.querySelectorAll(".ds_checkbox__input"));
  }
  init() {
    this.checkboxes.forEach((t) => {
      t.addEventListener("change", () => {
        t.dataset.behaviour === "exclusive" ? this.checkboxes.filter((e) => e !== t).forEach((e) => e.checked = !1) : this.checkboxes.filter((e) => e.dataset.behaviour === "exclusive").forEach((e) => e.checked = !1);
      });
    }), this.isInitialised = !0;
  }
}, O = class extends p {
  storage;
  categories;
  cookieAcceptAllButton;
  cookieAcceptEssentialButton;
  cookieNoticeElement;
  cookieNoticeSuccessElement;
  constructor(t, e = f, i) {
    super(t);
    const s = [
      "necessary",
      "preferences",
      "statistics",
      "campaigns",
      "marketing"
    ];
    this.storage = e, this.categories = i || s, this.cookieNoticeElement = t, this.cookieNoticeSuccessElement = document.getElementById("cookie-confirm"), this.cookieAcceptAllButton = this.cookieNoticeElement.querySelector(".js-accept-all-cookies"), this.cookieAcceptEssentialButton = this.cookieNoticeElement.querySelector(".js-accept-essential-cookies");
  }
  init() {
    this.storage.get({
      type: "cookie",
      name: "cookie-notification-acknowledged"
    }) || this.cookieNoticeElement.classList.remove("fully-hidden"), this.cookieAcceptAllButton.addEventListener("click", (t) => {
      t.preventDefault(), this.setAllOptionalPermissions(!0), this.cookieNoticeElement.classList.add("fully-hidden"), this.cookieNoticeSuccessElement.classList.remove("fully-hidden"), A(this.cookieNoticeSuccessElement);
    }), this.cookieAcceptEssentialButton.addEventListener("click", (t) => {
      t.preventDefault(), this.setAllOptionalPermissions(!1), this.cookieNoticeElement.classList.add("fully-hidden"), this.cookieNoticeSuccessElement.classList.remove("fully-hidden"), A(this.cookieNoticeSuccessElement);
    }), this.isInitialised = !0;
  }
  setAllOptionalPermissions(t) {
    const e = Object.fromEntries(this.categories.map((i) => [i, i === "necessary" ? !0 : t]));
    for (const i in e) i === "necessary" ? e[i] = !0 : e[i] = t;
    this.storage.setCookie("necessary", "cookiePermissions", JSON.stringify(e), 365), this.storage.setCookie("necessary", "cookie-notification-acknowledged", "yes", 365);
  }
}, j = class extends p {
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
  dayLabels = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  monthLabels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  icons = {
    calendar_today: '<svg class="ds_icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>',
    chevron_left: '<svg focusable="false" class="ds_icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>',
    chevron_right: '<svg focusable="false" class="ds_icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>',
    double_chevron_left: '<svg focusable="false" class="ds_icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 16.6 17.6 18l-6-6 6-6L19 7.4 14.4 12l4.6 4.6Zm-6.6 0L11 18l-6-6 6-6 1.4 1.4L7.8 12l4.6 4.6Z"/></svg>',
    double_chevron_right: '<svg focusable="false" class="ds_icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.6 12 5 7.4 6.4 6l6 6-6 6L5 16.6 9.6 12Zm6.6 0-4.6-4.6L13 6l6 6-6 6-1.4-1.4 4.6-4.6Z"/></svg>'
  };
  constructor(t, e = {}) {
    super(t), t && (this.datePickerParent = t, this.options = Object.assign({ disabledDates: [] }, e), this.inputElement = this.datePickerParent.querySelector("input"), this.isMultipleInput = t.classList.contains("ds_datepicker--multiple"), this.dateInput = t.querySelector(".js-datepicker-date"), this.monthInput = t.querySelector(".js-datepicker-month"), this.yearInput = t.querySelector(".js-datepicker-year"), this.currentDate = /* @__PURE__ */ new Date(), this.currentDate.setHours(0, 0, 0, 0), this.calendarDays = []);
  }
  init() {
    if (!this.inputElement || this.isInitialised) return;
    this.setOptions(), this.setMinAndMaxDatesOnCalendar();
    const t = document.createElement("div");
    t.innerHTML = this.buttonTemplate(), this.calendarButtonElement = t.firstChild, this.calendarButtonElement.setAttribute("data-button", `datepicker-${this.inputElement.id}-toggle`), this.isMultipleInput ? this.inputElement.parentElement?.parentElement?.appendChild(this.calendarButtonElement) : (this.inputElement.parentElement?.appendChild(this.calendarButtonElement), this.inputElement.parentElement?.classList.add("ds_input__wrapper--has-icon")), this.dialogElement = document.createElement("div"), this.dialogElement.id = "datepicker-" + v(), this.dialogElement.setAttribute("class", "ds_datepicker__dialog  datepickerDialog"), this.dialogElement.setAttribute("role", "dialog"), this.dialogElement.setAttribute("aria-modal", "true"), this.dialogElement.innerHTML = this.dialogTemplate(this.dialogElement.id), this.calendarButtonElement.setAttribute("aria-controls", this.dialogElement.id), this.calendarButtonElement.setAttribute("aria-expanded", "false"), this.datePickerParent.appendChild(this.dialogElement), this.dialogTitleElement = this.dialogElement.querySelector(".js-datepicker-month-year");
    const e = this.datePickerParent.querySelector("tbody");
    for (let l = 0; l < 6; l++) {
      const m = e.insertRow(l);
      for (let u = 0; u < 7; u++) {
        const E = document.createElement("td"), b = document.createElement("button");
        b.type = "button", b.dataset.form = "date-select", E.appendChild(b), m.appendChild(E);
        const y = new F(b, this);
        y.init(), this.calendarDays.push(y);
      }
    }
    const i = this.dialogElement.querySelector(".js-datepicker-prev-month"), s = this.dialogElement.querySelector(".js-datepicker-prev-year"), n = this.dialogElement.querySelector(".js-datepicker-next-month"), a = this.dialogElement.querySelector(".js-datepicker-next-year");
    i.addEventListener("click", (l) => this.focusPreviousMonth(l, !1)), s.addEventListener("click", (l) => this.focusPreviousYear(l, !1)), n.addEventListener("click", (l) => this.focusNextMonth(l, !1)), a.addEventListener("click", (l) => this.focusNextYear(l, !1)), [
      this.inputElement,
      this.dateInput,
      this.monthInput,
      this.yearInput
    ].forEach((l) => {
      l && l.addEventListener("blur", () => {
        this.calendarButtonElement.querySelector("span").textContent = "Choose date";
      });
    });
    const o = this.dialogElement.querySelector(".js-datepicker-cancel"), d = this.dialogElement.querySelector(".js-datepicker-ok");
    o.addEventListener("click", (l) => {
      l.preventDefault(), this.closeDialog();
    }), d.addEventListener("click", () => this.selectDate(this.currentDate));
    const c = this.dialogElement.querySelectorAll('button:not([disabled="true"])');
    this.firstButtonInDialog = c[0], this.lastButtonInDialog = c[c.length - 1], this.firstButtonInDialog.addEventListener("keydown", (l) => this.firstButtonKeyup(l)), this.lastButtonInDialog.addEventListener("keydown", (l) => this.lastButtonKeyup(l)), this.calendarButtonElement.addEventListener("click", (l) => this.toggleDialog(l)), document.body.addEventListener("mouseup", (l) => this.backgroundClick(l)), this.updateCalendar(), this.isInitialised = !0;
  }
  addMonths(t, e) {
    const i = t.getDate();
    return t.setMonth(t.getMonth() + +e), t.getDate() !== i && t.setDate(0), t;
  }
  buttonTemplate() {
    return `<button type="button" class="ds_button  ds_button--icon-only  ds_datepicker__button  ds_no-margin  js-calendar-button" aria-expanded="false">
            <span class="visually-hidden">Choose date</span>
            ${this.icons.calendar_today}
        </button>
        `;
  }
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
  leadingZeroes(t, e = 2) {
    let i = t.toString();
    for (; i.length < e; ) i = "0" + i.toString();
    return i;
  }
  backgroundClick(t) {
    const e = t.target;
    this.isOpen() && !this.dialogElement.contains(e) && !this.inputElement.contains(e) && !this.calendarButtonElement.contains(e) && (t.preventDefault(), this.closeDialog());
  }
  closeDialog() {
    this.dialogElement.classList.remove("ds_datepicker__dialog--open"), this.calendarButtonElement.setAttribute("aria-expanded", "false"), this.calendarButtonElement.focus();
  }
  firstButtonKeyup(t) {
    t.key === "Tab" && t.shiftKey && (this.lastButtonInDialog.focus(), t.preventDefault());
  }
  focusNextDay(t = new Date(this.currentDate)) {
    t.setDate(t.getDate() + 1), this.goToDate(t);
  }
  focusPreviousDay(t = new Date(this.currentDate)) {
    t.setDate(t.getDate() - 1), this.goToDate(t);
  }
  focusNextWeek(t = new Date(this.currentDate)) {
    t.setDate(t.getDate() + 7), this.goToDate(t);
  }
  focusPreviousWeek(t = new Date(this.currentDate)) {
    t.setDate(t.getDate() - 7), this.goToDate(t);
  }
  focusFirstDayOfWeek() {
    const t = new Date(this.currentDate);
    t.setDate(t.getDate() - t.getDay()), this.goToDate(t);
  }
  focusLastDayOfWeek() {
    const t = new Date(this.currentDate);
    t.setDate(t.getDate() - t.getDay() + 6), this.goToDate(t);
  }
  focusNextMonth(t, e = !0) {
    t.preventDefault();
    const i = new Date(this.currentDate);
    this.addMonths(i, 1), this.goToDate(i, e);
  }
  focusPreviousMonth(t, e = !0) {
    t.preventDefault();
    const i = new Date(this.currentDate);
    this.addMonths(i, -1), this.goToDate(i, e);
  }
  focusNextYear(t, e = !0) {
    t.preventDefault();
    const i = new Date(this.currentDate);
    i.setFullYear(i.getFullYear() + 1), this.goToDate(i, e);
  }
  focusPreviousYear(t, e = !0) {
    t.preventDefault();
    const i = new Date(this.currentDate);
    i.setFullYear(i.getFullYear() - 1), this.goToDate(i, e);
  }
  formattedDateFromString(t, e = /* @__PURE__ */ new Date()) {
    let i = null;
    const s = t.split("/");
    if (t.match(/\d{1,4}\/\d{1,2}\/\d{1,4}/)) switch (this.datePickerParent.dataset.dateformat) {
      case "YMD":
        i = /* @__PURE__ */ new Date(`${s[1]}/${s[2]}/${s[0]}`);
        break;
      case "MDY":
        i = /* @__PURE__ */ new Date(`${s[0]}/${s[1]}/${s[2]}`);
        break;
      default:
        i = /* @__PURE__ */ new Date(`${s[1]}/${s[0]}/${s[2]}`);
        break;
    }
    return i instanceof Date && !isNaN(i.getTime()) ? i : e;
  }
  formattedDateHuman(t) {
    return `${this.dayLabels[t.getDay()]} ${t.getDate()} ${this.monthLabels[t.getMonth()]} ${t.getFullYear()}`;
  }
  goToDate(t, e) {
    const i = this.currentDate;
    this.currentDate = t, (i.getMonth() !== this.currentDate.getMonth() || i.getFullYear() !== this.currentDate.getFullYear()) && this.updateCalendar(), this.setCurrentDate(e);
  }
  isDisabledDate(t) {
    let e = !1;
    this.options.minDate && this.options.minDate > t && (e = !0), this.options.maxDate && this.options.maxDate < t && (e = !0);
    for (const i of this.options.disabledDates) t.toDateString() === i.toDateString() && (e = !0);
    return e;
  }
  isOpen() {
    return this.dialogElement.classList.contains("ds_datepicker__dialog--open");
  }
  lastButtonKeyup(t) {
    t.key === "Tab" && !t.shiftKey && (this.firstButtonInDialog.focus(), t.preventDefault());
  }
  openDialog() {
    this.dialogElement.classList.add("ds_datepicker__dialog--open"), this.calendarButtonElement.setAttribute("aria-expanded", "true");
    let t, e;
    this.isMultipleInput ? (t = this.calendarButtonElement.offsetLeft + this.calendarButtonElement.offsetWidth + 16, e = `${this.dateInput.value}/${this.monthInput.value}/${this.yearInput.value}`) : (t = this.inputElement.offsetWidth + 16, e = this.inputElement.value);
    const i = Math.ceil(t / 8);
    this.dialogElement.classList.forEach((s) => {
      s.match(/ds_!_off-l-/) && this.dialogElement.classList.remove(s);
    }), this.dialogElement.classList.add(`ds_!_off-l-${i}`), e.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/) && (this.inputDate = this.formattedDateFromString(e), this.currentDate = this.inputDate), this.updateCalendar(), this.setCurrentDate();
  }
  selectDate(t) {
    if (this.isDisabledDate(t)) return !1;
    this.calendarButtonElement.querySelector("span").textContent = `Choose date. Selected date is ${this.formattedDateHuman(t)}`, this.setDate(t);
    const e = new Event("change");
    this.inputElement.dispatchEvent(e), this.options.dateSelectCallback && this.options.dateSelectCallback(t), this.closeDialog();
  }
  setCurrentDate(t = !0) {
    const e = this.currentDate, i = this.calendarDays.filter((s) => s.button.classList.contains("fully-hidden") === !1);
    i.forEach((s) => {
      s.button.setAttribute("tabindex", "-1"), s.button.classList.remove("ds_selected");
      const n = s.date;
      n.setHours(0, 0, 0, 0);
      const a = /* @__PURE__ */ new Date();
      a.setHours(0, 0, 0, 0), n.getTime() === e.getTime() && !s.isDisabled && t && (s.button.setAttribute("tabindex", "0"), s.button.focus(), s.button.classList.add("ds_selected")), this.inputDate && !this.isDisabledDate(this.inputDate) && n.getTime() === this.inputDate.getTime() ? (s.button.classList.add("ds_datepicker__current"), s.button.setAttribute("aria-description", "selected date")) : (s.button.classList.remove("ds_datepicker__current"), s.button.removeAttribute("aria-description")), n.getTime() === a.getTime() ? (s.button.classList.add("ds_datepicker__today"), s.button.setAttribute("aria-current", "date")) : (s.button.classList.remove("ds_datepicker__today"), s.button.removeAttribute("aria-current"));
    }), t || (i[0].button.setAttribute("tabindex", "0"), this.currentDate = i[0].date);
  }
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
  setMinAndMaxDatesOnCalendar() {
    this.options.minDate && this.currentDate < this.options.minDate && (this.currentDate = this.options.minDate), this.options.maxDate && this.currentDate > this.options.maxDate && (this.currentDate = this.options.maxDate);
  }
  setOptions() {
    this.transformLegacyDataAttributes(), !this.options.minDate && this.datePickerParent.dataset.mindate && (this.options.minDate = this.formattedDateFromString(this.datePickerParent.dataset.mindate, null)), !this.options.maxDate && this.datePickerParent.dataset.maxdate && (this.options.maxDate = this.formattedDateFromString(this.datePickerParent.dataset.maxdate, null)), !this.options.disabledDates?.length && this.datePickerParent.dataset.disableddates && (this.options.disabledDates = this.datePickerParent.dataset.disableddates.replace(/\s+/, " ").split(" ").map((t) => this.formattedDateFromString(t)).filter((t) => t));
  }
  toggleDialog(t) {
    t.preventDefault(), this.isOpen() ? this.closeDialog() : (this.setMinAndMaxDatesOnCalendar(), this.openDialog());
  }
  transformLegacyDataAttributes() {
    this.inputElement.dataset.mindate && (this.datePickerParent.dataset.mindate = this.inputElement.dataset.mindate), this.inputElement.dataset.maxdate && (this.datePickerParent.dataset.maxdate = this.inputElement.dataset.maxdate), this.inputElement.dataset.dateformat && (this.datePickerParent.dataset.dateformat = this.inputElement.dataset.dateformat);
  }
  updateCalendar() {
    this.dialogTitleElement.innerHTML = `${this.monthLabels[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`, this.dialogElement.setAttribute("aria-label", this.dialogTitleElement.innerHTML);
    const t = this.currentDate, e = new Date(t.getFullYear(), t.getMonth(), 1), i = e.getDay();
    e.setDate(e.getDate() - i);
    const s = new Date(e);
    for (const n of this.calendarDays) {
      const a = s.getMonth() !== t.getMonth();
      let o = !1;
      this.options.minDate && s < this.options.minDate && (o = !0), this.options.maxDate && s > this.options.maxDate && (o = !0), this.isDisabledDate(s) && (o = !0), n.update(s, a, o), s.setDate(s.getDate() + 1);
    }
  }
}, F = class {
  button;
  date;
  picker;
  constructor(t, e) {
    this.button = t, this.picker = e, this.date = /* @__PURE__ */ new Date();
  }
  init() {
    this.button.addEventListener("keydown", this.keyPress.bind(this)), this.button.addEventListener("click", this.click.bind(this));
  }
  update(t, e, i) {
    this.date = new Date(t), this.button.innerHTML = t.getDate().toString(), this.button.setAttribute("aria-label", this.picker.formattedDateHuman(this.date)), i ? this.button.setAttribute("aria-disabled", "true") : this.button.removeAttribute("aria-disabled"), e ? this.button.classList.add("fully-hidden") : this.button.classList.remove("fully-hidden");
  }
  click(t) {
    this.picker.goToDate(this.date), this.picker.selectDate(this.date), t.stopPropagation(), t.preventDefault();
  }
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
}, R = class extends p {
  content;
  details;
  summary;
  openAttribute;
  constructor(t) {
    super(t), this.details = t, this.summary = t.querySelector(".ds_details__summary"), this.content = t.querySelector(".ds_details__text"), this.summary.nodeName === "SUMMARY" ? this.openAttribute = "open" : this.openAttribute = "data-open";
  }
  init() {
    typeof this.details.open != "boolean" && (this.polyfillAttributes(), this.polyfillEvents()), this.isInitialised = !0;
  }
  closeDetails() {
    this.details.removeAttribute(this.openAttribute), this.summary.setAttribute("aria-expanded", "false");
  }
  openDetails() {
    this.details.setAttribute(this.openAttribute, "open"), this.summary.setAttribute("aria-expanded", "true");
  }
  polyfillAttributes() {
    this.content.id = this.content.id || `details-${v()}`, this.details.setAttribute("role", "group"), this.summary.setAttribute("role", "button"), this.summary.setAttribute("aria-controls", this.content.id), this.summary.nodeName === "SUMMARY" && (this.summary.tabIndex = 0);
    const t = this.details.hasAttribute(this.openAttribute);
    this.summary.setAttribute("aria-expanded", t.toString());
  }
  polyfillEvents() {
    this.summary.addEventListener("click", () => {
      this.setState();
    }), this.summary.addEventListener("keypress", (t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.setState());
    }), this.summary.addEventListener("keyup", (t) => {
      t.key === " " && t.preventDefault();
    });
  }
  setState() {
    this.details.hasAttribute(this.openAttribute) ? this.closeDetails() : this.openDetails();
  }
}, Y = {
  buttonText: "Choose file",
  buttonTextPlural: "Choose files",
  defaultStatusText: "No file chosen",
  defaultStatusTextPlural: "No files chosen",
  enteredDropzone: "Entered drop zone",
  filesAddedText: "$NUMBER files",
  filesListHeading: "Files selected for upload",
  instructionText: "or drag and drop file here",
  instructionTextPlural: "or drag and drop files here",
  leftDropzone: "Left drop zone"
}, U = class T extends p {
  announcementsSpan;
  dropzoneButton;
  element;
  fileInputElement;
  hasEnteredAnotherElement;
  statusSpan;
  text;
  static defaultText = Y;
  #t;
  constructor(e, i = {}) {
    if (super(e), this.element = e, this.fileInputElement = this.element.querySelector('input[type="file"]'), this.fileInputElement === null) throw new Error("File upload: input element not found");
    if (!this.fileInputElement.id) throw new Error("File upload: input element missing id");
    this.text = this.setText(i.text), this.transformMarkup(), this.addEventListeners(), this.updateDisabledState(), this.observeDisabledState();
  }
  init() {
    this.isInitialised = !0;
  }
  addEventListeners() {
    this.dropzoneButton.addEventListener("click", this.onClick.bind(this)), this.dropzoneButton.addEventListener("dragover", (e) => {
      e.preventDefault();
    }), this.dropzoneButton.addEventListener("drop", this.onDrop.bind(this)), this.fileInputElement.addEventListener("input", this.onInput.bind(this)), this.fileInputElement.addEventListener("change", this.onChange.bind(this)), document.addEventListener("dragenter", this.updateDropzoneVisibility.bind(this)), document.addEventListener("dragenter", () => {
      this.hasEnteredAnotherElement = !0;
    }), document.addEventListener("dragleave", () => {
      !this.hasEnteredAnotherElement && !this.dropzoneButton.disabled && (this.hideDraggingState(), this.announcementsSpan.textContent = this.text.leftDropzone), this.hasEnteredAnotherElement = !1;
    });
  }
  canAccept(e) {
    let i = !0;
    if (!this.fileInputElement.accept) return !0;
    const s = (n) => {
      let a = !1;
      return this.fileInputElement.accept.replace(" ", "").split(",").forEach((o) => {
        if (o.match(/^\.\w+/)) {
          const d = new RegExp(o + "$");
          n.name.match(d) && (a = !0);
        } else o.match(/\w+\/\w.+/) ? n.type === o && (a = !0) : o.match(/audio|image|video\/*/) && n.type.match(new RegExp(o.replace("*", ".+"))) && (a = !0);
      }), a;
    };
    return [].slice.call(e).forEach((n) => {
      s(n) || (i = !1);
    }), i;
  }
  canDrop(e) {
    return e.items?.length ? this.matchesInputCapacity(this.countFileItems(e.items)) : e.types?.length ? e.types.includes("Files") : !0;
  }
  canFillInput(e) {
    return this.matchesInputCapacity(e.files.length);
  }
  countFileItems(e) {
    return [].slice.call(e).filter((i) => i.kind === "file").length;
  }
  hideDraggingState() {
    this.dropzoneButton.classList.remove("ds_file-upload__dropzone--dragging");
  }
  matchesInputCapacity(e) {
    return this.fileInputElement.multiple ? e > 0 : e === 1;
  }
  observeDisabledState() {
    new MutationObserver((e) => {
      for (const i of e) i.type === "attributes" && i.attributeName === "disabled" && this.updateDisabledState();
    }).observe(this.fileInputElement, { attributes: !0 });
  }
  onChange() {
    const e = this.fileInputElement.files, i = new CustomEvent("changeHappened", {
      bubbles: !0,
      composed: !0,
      detail: {
        canFill: !0,
        canAccept: !0,
        files: e
      }
    });
    this.element.dispatchEvent(i);
  }
  onClick() {
    this.fileInputElement.click();
  }
  onDrop(e) {
    if (e.preventDefault(), e.dataTransfer && this.canAccept(e.dataTransfer.files) && this.canFillInput(e.dataTransfer) && (this.setFilesOnFileInputElement(e.dataTransfer.files), this.hideDraggingState()), this.announcementsSpan.textContent = "", e.dataTransfer) {
      const i = new CustomEvent("dropHappened", {
        bubbles: !0,
        composed: !0,
        detail: {
          files: e.dataTransfer.files,
          canAccept: this.canAccept(e.dataTransfer.files),
          canFill: this.canFillInput(e.dataTransfer)
        }
      });
      this.element.dispatchEvent(i);
    }
  }
  onInput() {
    const e = this.fileInputElement.files;
    e.length === 0 ? (this.#t = this.text.defaultStatusText, this.element.classList.remove("ds_file-upload--has-files")) : (e.length === 1 ? this.#t = e[0].name : this.#t = this.text.filesAddedText.replace("$NUMBER", e.length.toString()), this.element.classList.add("ds_file-upload--has-files")), this.statusSpan.textContent = this.#t;
  }
  setFilesOnFileInputElement(e) {
    this.fileInputElement.files = e, this.fileInputElement.dispatchEvent(new CustomEvent("input"));
  }
  setText(e = {}) {
    const i = Object.assign(T.defaultText, e);
    return Object.freeze({
      buttonText: this.fileInputElement.multiple ? i.buttonTextPlural : i.buttonText,
      defaultStatusText: this.fileInputElement.multiple ? i.defaultStatusTextPlural : i.defaultStatusText,
      enteredDropzone: i.enteredDropzone,
      filesAddedText: i.filesAddedText,
      filesListHeading: i.filesListHeading,
      instructionText: this.fileInputElement.multiple ? i.instructionTextPlural : i.instructionText,
      leftDropzone: i.leftDropzone
    });
  }
  showDraggingState() {
    this.dropzoneButton.classList.add("ds_file-upload__dropzone--dragging");
  }
  transformMarkup() {
    const e = this.element.querySelector(`[for="${this.fileInputElement.id}"]`);
    e.id = e.id || this.fileInputElement.id + "-label", this.fileInputElement.setAttribute("aria-hidden", "true"), this.fileInputElement.setAttribute("hidden", "true"), this.fileInputElement.setAttribute("tabindex", "-1"), this.dropzoneButton = document.createElement("button"), this.dropzoneButton.classList.add("ds_file-upload__dropzone"), this.dropzoneButton.type = "button", this.dropzoneButton.id = this.fileInputElement.id + "-dropzone", this.fileInputElement.getAttribute("aria-describedby") && this.dropzoneButton.setAttribute("aria-describedby", this.fileInputElement.getAttribute("aria-describedby")), this.fileInputElement.getAttribute("aria-invalid") && this.dropzoneButton.setAttribute("aria-invalid", this.fileInputElement.getAttribute("aria-invalid")), this.fileInputElement.classList.contains("ds_file-upload__input--error") && this.dropzoneButton.classList.add("ds_file-upload__dropzone--error"), this.statusSpan = document.createElement("span"), this.statusSpan.classList.add("ds_file-upload__status"), this.statusSpan.textContent = this.text.defaultStatusText, this.statusSpan.id = `${this.fileInputElement.id}-status`, this.statusSpan.setAttribute("aria-live", "polite");
    const i = document.createElement("span");
    i.className = "visually-hidden", i.textContent = ", ", i.id = `${this.fileInputElement.id}-comma`;
    const s = document.createElement("span");
    s.classList.add("ds_file-upload__button-container");
    const n = document.createElement("span");
    n.classList.add("ds_file-upload__button"), n.textContent = this.text.buttonText;
    const a = document.createElement("span");
    a.classList.add("ds_file-upload__instruction"), a.textContent = this.text.instructionText, a.id = `${this.fileInputElement.id}-instruction`, this.announcementsSpan = document.createElement("span"), this.announcementsSpan.classList.add("visually-hidden"), this.announcementsSpan.setAttribute("aria-live", "assertive"), s.appendChild(n), s.insertAdjacentText("beforeend", " "), s.appendChild(a), this.dropzoneButton.appendChild(this.statusSpan), this.dropzoneButton.appendChild(i), this.dropzoneButton.appendChild(s), this.dropzoneButton.setAttribute("aria-labelledby", `${e.id} ${i.id} ${this.dropzoneButton.id}`), this.fileInputElement.insertAdjacentElement("beforebegin", this.dropzoneButton), this.element.insertAdjacentElement("afterend", this.announcementsSpan);
  }
  updateDisabledState() {
    this.dropzoneButton.disabled = this.fileInputElement.disabled;
  }
  updateDropzoneVisibility(e) {
    this.dropzoneButton.disabled || (this.dropzoneButton.contains(e.target) ? e.dataTransfer && this.canDrop(e.dataTransfer) && !this.dropzoneButton.classList.contains("ds_file-upload__dropzone--dragging") && (this.showDraggingState(), this.announcementsSpan.textContent = this.text.enteredDropzone) : (this.hideDraggingState(), this.announcementsSpan.textContent = this.text.leftDropzone));
  }
}, V = class extends p {
  altlink;
  button;
  window;
  constructor(t, e = window) {
    const i = t.querySelector(".js-hide-page");
    super(i), this.button = i, this.window = e, this.altlink = this.button?.dataset.altlink || "https://www.google.com";
  }
  init() {
    this.button && (this.attachKeyboardEvents(), this.attachMouseEvents(), this.isInitialised = !0);
  }
  attachKeyboardEvents() {
    document.addEventListener("keyup", (t) => {
      t.key === "Escape" && this.doHidePage(t);
    });
  }
  attachMouseEvents() {
    this.button.addEventListener("click", (t) => {
      this.doHidePage(t);
    });
  }
  doHidePage(t) {
    t.preventDefault(), document.body.innerHTML = "", document.title = ".", this.window.open(this.button.href, "_newtab"), this.window.location.replace(this.altlink);
  }
}, W = class extends p {
  notification;
  notificationClose;
  constructor(t) {
    super(t), this.notification = t, this.notificationClose = t.querySelector(".js-close-notification");
  }
  init() {
    this.notificationClose && this.notificationClose.addEventListener("click", () => {
      this.notification.parentNode?.removeChild(this.notification);
    }), this.isInitialised = !0;
  }
}, K = class extends p {
  notificationMessage;
  notificationMessageClose;
  constructor(t) {
    super(t), this.notificationMessage = t, this.notificationMessageClose = t.querySelector(".js-close-notification-message");
  }
  init() {
    this.notificationMessageClose && this.notificationMessageClose.addEventListener("click", () => {
      this.notificationMessage.parentNode?.removeChild(this.notificationMessage);
    }), this.isInitialised = !0;
  }
}, Z = class extends p {
  sideNavigation;
  constructor(t) {
    super(t), this.sideNavigation = t;
  }
  init() {
    this.sideNavigation && !this.isInitialised && (this.setupSideNavigation(), this.isInitialised = !0);
  }
  setupSideNavigation() {
    const t = this.sideNavigation.querySelector(".js-toggle-side-navigation"), e = this.sideNavigation.querySelector(".ds_side-navigation__expand"), i = this.sideNavigation.querySelector(".ds_side-navigation__list");
    i.id = i.id || `side-navigation-${v()}`, t.checked = !1;
    const s = document.createElement("button");
    s.classList.add("ds_side-navigation__expand"), s.classList.add("ds_link"), s.classList.add("js-side-navigation-button"), s.setAttribute("aria-expanded", "false"), s.innerHTML = e.innerHTML, s.setAttribute("aria-expanded", "false"), s.setAttribute("aria-controls", i.id), e.classList.add("fully-hidden"), t.classList.add("fully-hidden"), t.classList.remove("visually-hidden"), this.sideNavigation.insertBefore(s, i), s.setAttribute("aria-controls", i.id), s.addEventListener("click", () => {
      const n = t.checked;
      s.setAttribute("aria-expanded", (!n).toString()), t.checked = !n;
    }), window.addEventListener("scroll", () => {
      s.offsetTop >= 1 ? s.classList.add("ds_side-navigation__expand--shadow") : s.classList.remove("ds_side-navigation__expand--shadow");
    });
  }
}, J = class extends p {
  mobileMenu;
  newMenuButton;
  constructor(t) {
    super(t), this.mobileMenu = t, this.newMenuButton = document.createElement("button");
  }
  init() {
    this.mobileMenu && (this.setupMobileNavigation(), this.isInitialised = !0);
  }
  setupMobileNavigation() {
    const t = document.querySelector(".js-toggle-menu");
    this.newMenuButton.innerHTML = t.innerHTML, this.newMenuButton.setAttribute("class", t.getAttribute("class")), this.newMenuButton.classList.add("ds_link"), this.newMenuButton.setAttribute("aria-controls", t.getAttribute("aria-controls")), this.newMenuButton.setAttribute("aria-expanded", "false"), t.parentNode?.appendChild(this.newMenuButton), t.classList.add("fully-hidden"), this.newMenuButton.addEventListener("click", (e) => {
      e.preventDefault(), this.mobileMenu = document.getElementById(this.newMenuButton.getAttribute("aria-controls")), this.mobileMenu.classList.contains("ds_site-navigation--open") ? this.closeMenu() : this.openMenu();
    });
  }
  openMenu() {
    this.mobileMenu.classList.add("ds_site-navigation--open"), this.newMenuButton.classList.add("ds_site-header__control--active"), this.newMenuButton.setAttribute("aria-expanded", "true");
  }
  closeMenu() {
    this.mobileMenu.classList.remove("ds_site-navigation--open"), this.newMenuButton.classList.remove("ds_site-header__control--active"), this.newMenuButton.setAttribute("aria-expanded", "false");
  }
}, X = { init() {
  [].slice.call(document.querySelectorAll(".ds_skip-links__link")).forEach((t) => {
    t.addEventListener("click", () => {
      const e = document.querySelector(t.getAttribute("href"));
      e && A(e);
    });
  });
} }, G = class extends p {
  container;
  window;
  constructor(t, e = window) {
    super(t), this.container = t, this.window = e;
  }
  init() {
    this.container.querySelectorAll(".ds_accordion-item__body a").forEach((t) => {
      t.href === this.window.location.origin + this.window.location.pathname && t.classList.add("ds_step-navigation__current-link");
    }), this.isInitialised = !0;
  }
}, w = class extends p {
  element;
  window;
  constructor(t, e = window) {
    super(t), this.element = t, this.window = e;
  }
  init() {
    this.element.dataset.smallscreen === "scrolling" ? (this.checkScrollingTable(), this.window.addEventListener("resize", () => {
      this.checkScrollingTable();
    }), this.isInitialised = !0) : this.element.dataset.smallscreen === "boxes" && (this.setupBoxesTable(), this.isInitialised = !0);
  }
  checkScrollingTable() {
    const t = this.element.querySelector("tbody"), e = this.element.parentElement;
    e && t.offsetWidth > e.offsetWidth ? this.element.classList.add("js-is-scrolling") : this.element.classList.remove("js-is-scrolling");
  }
  setupBoxesTable() {
    const t = this.element.querySelectorAll("tr");
    let e;
    if ([].slice.call(t[0].cells).filter((i) => i.tagName === "TH").length === t[0].cells.length && (e = t[0]), e) for (let i = 1, s = t.length; i < s; i++) [].slice.call(t[i].cells).forEach((n, a) => {
      n.setAttribute("data-heading", e.cells[a].textContent);
    });
  }
}, Q = class {
  window;
  constructor(t = window) {
    this.window = t;
  }
  init() {
    document.querySelectorAll("table[data-smallscreen]").forEach((t) => new w(t, this.window).init());
  }
}, tt = class extends p {
  hasAutomaticActivation;
  boundOnHashChange;
  boundOnResize;
  hasEventsEnabled;
  resizeTimer;
  tabContainer;
  tabContents;
  tabHeaders;
  tabList;
  constructor(t) {
    super(t), this.resizeTimer = 0, this.hasEventsEnabled = !1, this.hasAutomaticActivation = !t.classList.contains("ds_tabs--manual"), this.tabContainer = t, this.tabList = t.querySelector(".ds_tabs__list"), this.tabHeaders = [].slice.call(t.querySelectorAll(".ds_tabs__tab")), this.tabContents = [].slice.call(t.querySelectorAll(".ds_tabs__content")), this.boundOnHashChange = this.onHashChange.bind(this), window.addEventListener("hashchange", this.boundOnHashChange, !0), this.boundOnResize = this.onResize.bind(this), window.addEventListener("resize", this.boundOnResize, !0);
  }
  init() {
    _("medium") && (this.set(), this.hasEventsEnabled = !0);
  }
  set() {
    if (!this.isInitialised) {
      this.tabList.setAttribute("role", "tablist"), this.tabHeaders.forEach((e, i) => this.initTab(e, i)), this.tabContents.forEach((e) => {
        e.setAttribute("tabindex", "0"), e.setAttribute("role", "tabpanel");
      });
      const t = (this.getTab(window.location.hash) || this.tabHeaders[0].querySelector(".ds_tabs__tab-link")).parentElement;
      this.goToTab(t), this.isInitialised = !0;
    }
  }
  reset() {
    this.isInitialised && (this.isInitialised = !1, this.tabList.removeAttribute("role"), this.tabHeaders.forEach((t, e) => this.resetTab(t, e)), this.tabContents.forEach((t) => {
      t.removeAttribute("tabindex"), t.removeAttribute("role");
    }));
  }
  onResize() {
    clearTimeout(this.resizeTimer), this.resizeTimer = window.setTimeout(() => {
      _("medium") ? this.set() : this.reset();
    }, 150);
  }
  onHashChange() {
    const t = this.getTab(window.location.hash);
    if (!t) return;
    const e = t.parentElement;
    _("medium") && (this.goToTab(e), e.querySelector(".ds_tabs__tab-link").focus());
  }
  createHistoryEntry(t) {
    const e = this.getHref(t);
    history.pushState(null, "", e);
  }
  resetTab(t, e) {
    t.removeAttribute("role"), t.classList.remove("ds_current");
    const i = t.querySelector(".ds_tabs__tab-link"), s = this.tabContents[e];
    i.removeAttribute("role"), i.removeAttribute("aria-controls"), i.removeAttribute("aria-selected"), i.removeAttribute("tabindex"), s.classList.remove("ds_tabs__content--hidden");
  }
  initTab(t, e) {
    t.setAttribute("role", "presentation");
    const i = t.querySelector(".ds_tabs__tab-link"), s = this.tabContents[e], n = s.getAttribute("id");
    i.setAttribute("role", "tab"), i.setAttribute("aria-controls", n), i.setAttribute("aria-selected", "false"), i.setAttribute("tabindex", "-1"), s.classList.add("ds_tabs__content--hidden"), this.hasEventsEnabled || (i.addEventListener("click", (a) => {
      _("medium") && (a.preventDefault(), this.goToTab(t, !0));
    }), i.addEventListener("keydown", (a) => {
      if (_("medium")) {
        const o = a.target.parentElement;
        let d = !0;
        a.key === "ArrowRight" ? this.navToTab(this.getNextTab(o)) : a.key === "ArrowLeft" ? this.navToTab(this.getPreviousTab(o)) : a.key === "Home" ? this.navToTab(this.getFirstTab()) : a.key === "End" ? this.navToTab(this.getLastTab()) : a.key === "Spacebar" || a.key === " " ? this.goToTab(o, !0) : d = !1, d && a.preventDefault();
      }
    }));
  }
  navToTab(t) {
    t.querySelector(".ds_tabs__tab-link").focus(), this.hasAutomaticActivation && this.goToTab(t, !0);
  }
  getNextTab(t) {
    return t.nextElementSibling || this.getFirstTab();
  }
  getPreviousTab(t) {
    return t.previousElementSibling || this.getLastTab();
  }
  getFirstTab() {
    return this.tabHeaders[0];
  }
  getLastTab() {
    return this.tabHeaders[this.tabHeaders.length - 1];
  }
  goToTab(t, e = !1) {
    const i = this.getCurrentTab();
    if (i === t) return;
    const s = t.querySelector(".ds_tabs__tab-link"), n = this.getTabContent(t);
    t.classList.add("ds_current"), s.setAttribute("aria-selected", "true"), s.setAttribute("tabindex", "0"), n.classList.remove("ds_tabs__content--hidden"), this.deactivateTab(i), e && this.createHistoryEntry(t);
  }
  deactivateTab(t) {
    if (!t) return;
    const e = t.querySelector(".ds_tabs__tab-link"), i = this.getTabContent(t);
    t.classList.remove("ds_current"), e.setAttribute("aria-selected", "false"), e.setAttribute("tabindex", "-1"), i.classList.add("ds_tabs__content--hidden");
  }
  getTab(t) {
    return this.tabContainer.querySelector('.ds_tabs__tab-link[href="' + t + '"]');
  }
  getCurrentTab() {
    return this.tabList.querySelector(".ds_tabs__tab.ds_current");
  }
  getHref(t) {
    const e = t.querySelector(".ds_tabs__tab-link").href;
    return e.slice(e.indexOf("#"), e.length);
  }
  getTabContent(t) {
    return this.tabContainer.querySelector(this.getHref(t));
  }
}, et = class extends p {
  boundOnResize;
  breakpointCheck;
  resizeTimer;
  tabContainer;
  tabList;
  tabNavigation;
  tabTitle;
  constructor(t, e = _) {
    super(t), this.breakpointCheck = e, this.resizeTimer = 0, this.tabContainer = t, this.tabList = t.querySelector(".ds_tabs__list"), this.tabNavigation = t.querySelector(".ds_tabs__navigation"), this.tabTitle = t.querySelector(".ds_tabs__title"), this.boundOnResize = this.onResize.bind(this), window.addEventListener("resize", this.boundOnResize, !0);
  }
  init() {
    this.breakpointCheck("medium") || this.set();
  }
  set() {
    if (!this.isInitialised) {
      const t = document.createElement("button"), e = this.tabList.getAttribute("id");
      t.classList.add("ds_tabs__toggle"), t.setAttribute("aria-expanded", "false"), t.innerHTML = this.tabTitle.innerHTML, t.setAttribute("aria-controls", e), this.tabNavigation.insertBefore(t, this.tabList), t.addEventListener("click", () => {
        t.getAttribute("aria-expanded") === "true" ? t.setAttribute("aria-expanded", "false") : t.setAttribute("aria-expanded", "true");
      }), this.tabContainer.querySelector(".ds_tabs__current") && this.tabNavigation.setAttribute("aria-labelledby", "ds_tabs__current"), this.isInitialised = !0;
    }
  }
  reset() {
    if (this.isInitialised) {
      this.isInitialised = !1;
      const t = this.tabContainer.querySelector(".ds_tabs__toggle");
      t.parentNode?.removeChild(t), this.tabNavigation.setAttribute("aria-labelledby", "ds_tabs__title");
    }
  }
  onResize() {
    clearTimeout(this.resizeTimer), this.resizeTimer = window.setTimeout(() => {
      this.breakpointCheck("medium") ? this.reset() : this.set();
    }, 150);
  }
}, it = {
  Accordion: $,
  Autocomplete: N,
  BackToTop: P,
  CharacterCount: H,
  Checkboxes: z,
  CookieNotification: O,
  DatePicker: j,
  Details: R,
  FileUpload: U,
  HideThisPage: V,
  NotificationBanner: W,
  NotificationMessage: K,
  SideNavigation: Z,
  SiteNavigation: J,
  skipLinks: X,
  StepNavigation: G,
  MobileTables: Q,
  MobileTable: w,
  Tabs: tt,
  TabsNavigation: et
}, h = {
  base: k,
  components: it,
  version: D,
  initAll: x,
  tracking: k.tools.tracking,
  elementIdModifier: 0
};
window.DS = h;
export {
  h as default
};
