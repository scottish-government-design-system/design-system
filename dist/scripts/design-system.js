//#region src/all/all.ts
function initAll(scope = document) {
	[].slice.call(scope.querySelectorAll("[data-module=\"ds-accordion\"]:not(.js-instantiated)")).forEach((accordion) => new DS.components.Accordion(accordion).init());
	[].slice.call(scope.querySelectorAll("[data-module=\"ds-back-to-top\"]:not(.js-instantiated)")).forEach((backToTop) => new DS.components.BackToTop(backToTop).init());
	[].slice.call(scope.querySelectorAll("[data-module=\"ds-character-count\"]:not(.js-instantiated)")).forEach((characterCount) => new DS.components.CharacterCount(characterCount).init());
	[].slice.call(scope.querySelectorAll("[data-module=\"ds-checkboxes\"]:not(.js-instantiated)")).forEach((checkboxes) => new DS.components.Checkboxes(checkboxes).init());
	[].slice.call(document.querySelectorAll("[data-module=\"ds-cookie-notification\"]:not(.js-instantiated)")).forEach((cookieNotification) => new DS.components.CookieNotification(cookieNotification).init());
	[].slice.call(document.querySelectorAll("[data-module=\"ds-datepicker\"]:not(.js-instantiated)")).forEach((datePicker) => new DS.components.DatePicker(datePicker).init());
	[].slice.call(document.querySelectorAll("[data-module=\"ds-details\"]:not(.js-instantiated)")).forEach((details) => new DS.components.Details(details).init());
	[].slice.call(document.querySelectorAll("[data-module=\"ds-file-upload\"]:not(.js-instantiated)")).forEach((fileUploadElement) => new DS.components.FileUpload(fileUploadElement).init());
	[].slice.call(scope.querySelectorAll(".ds_hide-page")).forEach((hidePage) => new DS.components.HideThisPage(hidePage).init());
	[].slice.call(scope.querySelectorAll("[data-module=\"ds-mobile-navigation-menu\"]:not(.js-instantiated)")).forEach((mobileMenu) => new DS.components.SiteNavigation(mobileMenu).init());
	[].slice.call(scope.querySelectorAll("[data-module=\"ds-notification\"]:not(.js-instantiated)")).forEach((notificationBanner) => new DS.components.NotificationBanner(notificationBanner).init());
	[].slice.call(scope.querySelectorAll("[data-module=\"ds-notification-message\"]:not(.js-instantiated)")).forEach((notificationMessage) => new DS.components.NotificationMessage(notificationMessage).init());
	[].slice.call(scope.querySelectorAll("[data-module=\"ds-side-navigation\"]:not(.js-instantiated)")).forEach((sideNavigation) => new DS.components.SideNavigation(sideNavigation).init());
	DS.components.skipLinks.init();
	[].slice.call(scope.querySelectorAll("[data-module=\"ds-step-navigation\"]:not(.js-instantiated)")).forEach((stepNavigation) => new DS.components.StepNavigation(stepNavigation).init());
	[].slice.call(scope.querySelectorAll("table[data-smallscreen]")).forEach((table) => new DS.components.MobileTable(table).init());
	[].slice.call(document.querySelectorAll("[data-module=\"ds-tabs\"]:not(.js-instantiated)")).forEach((tabSet) => new DS.components.Tabs(tabSet).init());
	[].slice.call(document.querySelectorAll("[data-module=\"ds-tabs-navigation\"]:not(.js-instantiated)")).forEach((tabNavigationSet) => new DS.components.TabsNavigation(tabNavigationSet).init());
	DS.base.tools.tracking.init();
}
//#endregion
//#region src/base/tools/id-modifier/id-modifier.ts
/**
* Generates a unique ID modifier string.
* - Increments a global counter stored on the window object
* - Returns a string in the format 'dsX', where X is the current counter value
*
* @returns {string} - the ID modifier string
*/
function id_modifier_default() {
	window.DS = window.DS || {};
	window.DS.elementIdModifier = window.DS.elementIdModifier || 0;
	window.DS.elementIdModifier += 1;
	return `ds${window.DS.elementIdModifier}`;
}
//#endregion
//#region src/base/tools/promise-request/promise-request.ts
var PromiseRequest = function(url, method = "GET") {
	const request = new XMLHttpRequest();
	return new Promise((resolve, reject) => {
		request.onreadystatechange = () => {
			if (request.readyState !== 4) return;
			/* v8 ignore if -- @preserve */
			if (request.status >= 200 && request.status < 300) resolve(request);
			else reject({
				status: request.status,
				statusText: request.statusText
			});
		};
		request.open(method, url, true);
		request.send();
	});
};
//#endregion
//#region src/base/tools/storage/storage.ts
var storage = {
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
	set: function(obj) {
		if (storage.hasPermission(obj.category)) {
			if (obj.type === "cookie") return storage.cookie.set(obj.name, obj.value, obj.expiresDays);
			else if (obj.type === "local") localStorage.setItem(obj.name, obj.value);
			else if (obj.type === "session") sessionStorage.setItem(obj.name, obj.value);
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
	get: function(obj) {
		let value = "";
		if (obj.type === "cookie") value = storage.cookie.get(obj.name);
		else if (obj.type === "local") value = localStorage.getItem(obj.name);
		else if (obj.type === "session") value = sessionStorage.getItem(obj.name);
		return value || "";
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
	remove: function(obj) {
		if (obj.type === "cookie") storage.cookie.remove(obj.name);
		else if (obj.type === "local") localStorage.removeItem(obj.name);
		else if (obj.type === "session") sessionStorage.removeItem(obj.name);
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
	setCookie: function(category, name, value, expiresDays) {
		if (storage.hasPermission(category)) storage.cookie.set(name, value, expiresDays);
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
	setLocalStorage: function(category, name, value) {
		if (storage.hasPermission(category)) localStorage.setItem(name, value);
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
	setSessionStorage: function(category, name, value) {
		if (storage.hasPermission(category)) sessionStorage.setItem(name, value);
	},
	/**
	* Get a cookie value
	* - more direct method than get({type: 'cookies', name: foo})
	*
	* @param {string} name - the name of the cookie
	* @returns {string | null}
	*/
	getCookie: function(name) {
		return storage.cookie.get(name);
	},
	/**
	* Get a localStorage value
	* - more direct method than get({type: 'localStorage', name: foo})
	*
	* @param {string} name - the name of the localStorage item
	* @returns {string | null}
	*/
	getLocalStorage: function(name) {
		return localStorage.getItem(name);
	},
	/**
	* Get a sessionStorage value
	* - more direct method than get({type: 'sessionStorage', name: foo})
	*
	* @param {string} name - the name of the sessionStorage item
	* @returns {string | null}
	*/
	getSessionStorage: function(name) {
		return sessionStorage.getItem(name);
	},
	/**
	* Remove a cookie
	* - more direct method than remove({type: 'cookies', name: foo}
	*
	* @param {string} name - the name of the cookie
	* @returns {void}
	*/
	removeCookie: function(name) {
		return storage.cookie.remove(name);
	},
	/**
	* Remove a localStorage item
	* - more direct method than remove({type: 'localStorage', name: foo}
	*
	* @param {string} name - the name of the localStorage item
	* @returns {void}
	*/
	removeLocalStorage: function(name) {
		return localStorage.removeItem(name);
	},
	/**
	* Remove a sessionStorage item
	* - more direct method than remove({type: 'sessionStorage', name: foo}
	*
	* @param {string} name - the name of the sessionStorage item
	* @returns {void}
	*/
	removeSessionStorage: function(name) {
		return sessionStorage.removeItem(name);
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
		set: function(name, value, expiresDays) {
			value = window.btoa(value);
			const cookieData = {
				name,
				value
			};
			if (expiresDays) {
				const date = /* @__PURE__ */ new Date();
				date.setTime(date.getTime() + expiresDays * 24 * 60 * 60 * 1e3);
				cookieData.expires = date.toUTCString();
			}
			let cookieString = name + "=" + value + "; ";
			if (cookieData.expires) cookieString += "expires=" + cookieData.expires + "; ";
			cookieString += "path=/";
			document.cookie = cookieString;
			return cookieData;
		},
		/**
		* Get a cookie value
		* - searches document.cookie for a matching name
		* - decodes base64 encoded values
		*
		* @param {string} name - the name of the cookie
		* @returns {string | null} - the cookie value, or null if no matching cookie found
		*/
		get: function(name) {
			const nameEQ = name + "=", cookiesArray = document.cookie.split(";");
			for (let i = 0, il = cookiesArray.length; i < il; i++) {
				let cookie = cookiesArray[i];
				while (cookie.charAt(0) === " ") cookie = cookie.substring(1, cookie.length);
				if (cookie.indexOf(nameEQ) === 0) {
					const string = cookie.substring(nameEQ.length, cookie.length);
					if (/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(string)) return window.atob(string);
					else return string;
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
		remove: function(name, _window = window) {
			const hostparts = _window.location.host.split(".");
			let domain;
			storage.unsetCookieWithDomain(name);
			while (hostparts.length > 1) {
				domain = hostparts.join(".");
				storage.unsetCookieWithDomain(name, domain);
				storage.unsetCookieWithDomain(name, `.${domain}`);
				hostparts.shift();
			}
		}
	},
	/**
	* Check if permission has been given to set a storage item for a given category
	*
	* @param {CategoryArgs} category - the category to check
	* @returns {boolean}
	*/
	hasPermission(category) {
		const cookiePermissionsString = storage.get({
			type: "cookie",
			name: "cookiePermissions"
		}) || "";
		let cookiePermissions = {};
		if (storage.getIsJsonString(cookiePermissionsString)) cookiePermissions = JSON.parse(cookiePermissionsString);
		return category === "necessary" || cookiePermissions[category] === true;
	},
	/**
	* Check if a string is valid JSON
	*
	* @param {string} string - the string to check
	* @returns {boolean}
	*/
	getIsJsonString: function(string) {
		try {
			JSON.parse(string);
		} catch (error) {
			this.error = error;
			return false;
		}
		return true;
	},
	/**
	* Unset a cookie for a given domain
	*
	* @param {string} name - the name of the cookie
	* @param {string} domain - the domain of the cookie
	* @returns {void}
	*/
	unsetCookieWithDomain: function(name, domain) {
		const domainString = domain ? `domain=${domain};` : "";
		document.cookie = `${name}=;path=/;${domainString};expires=Thu, 01 Jan 1970 00:00:01 GMT`;
	}
};
//#endregion
//#region src/base/tools/temporary-focus/temporary-focus.ts
/**
* Temporarily focuses an element. Removes ability to focus element on blur.
*
* @param {Element} element - The element to focus temporarily
* @returns {void}
*/
function temporary_focus_default(element) {
	element.tabIndex = -1;
	element.addEventListener("focusout", () => {
		element.removeAttribute("tabindex");
	});
	element.focus();
}
//#endregion
//#region src/base/tools/token-list/token-list.ts
/**
* Token list
*
* @class TokenList
* @extends DSComponent
* @property {Array<string>} tokens - array of tokens
*/
var TokenList = class {
	tokens;
	/**
	* TokenList is a rough equivalent of DOMTokenList for managing a space-separated list of strings.
	*
	* @param {string} tokens
	*/
	constructor(tokens) {
		if (tokens && tokens.trim().length > 0) this.tokens = tokens.replace(/\s+/g, " ").split(" ");
		else this.tokens = [];
	}
	/**
	* Add one or more strings to the token list
	*
	* @param {string | Array<string>} itemsToAdd - space-separated list or array of strings to add
	* @returns {string} - updated value of the token list
	*/
	add(itemsToAdd) {
		if (typeof itemsToAdd === "string") itemsToAdd = itemsToAdd.replace(/\s+/g, " ").split(" ");
		itemsToAdd.forEach((item) => {
			if (!this.tokens.includes(item)) this.tokens.push(item);
		});
		return this.value;
	}
	/**
	* Remove one or more strings from the token list
	*
	* @param {string} tokens - space-separated list of strings to remove
	* @returns {string} - updated value of the token list
	*/
	remove(tokens) {
		tokens.replace(/\s+/g, " ").split(" ").forEach((item) => {
			if (this.tokens.includes(item)) this.tokens.splice(this.tokens.indexOf(item), 1);
		});
		return this.value;
	}
	/**
	* Check if the token list contains a specific string
	*
	* @param {string} token - string to check for
	* @returns {boolean}
	*/
	contains(token) {
		return this.tokens.includes(token);
	}
	/**
	* Get the current value of the token list as a space-separated string
	*
	* @returns {string}
	*/
	get value() {
		return this.tokens.join(" ").trim();
	}
};
//#endregion
//#region src/version.ts
var version_default = "v4.1.1";
//#endregion
//#region src/base/tools/tracking/tracking.ts
/**
* Slugify a string
*
* @param {string} string - the string to slugify
* @returns {string} the slugified string
*/
function slugify(string) {
	string = String(string);
	return string.trim().toLowerCase().replace(/['"’‘”“`]/g, "").replace(/[\W|_]+/g, "-").replace(/^-+|-+$/g, "");
}
/**
* Get all previous siblings of an element
*
* @param {HTMLElement} node
* @returns {HTMLElement[]}
*/
function prevUntil(node) {
	const prevNodes = [];
	if (node.parentElement) {
		const nodeArray = [].slice.call(node.parentElement.children);
		for (let i = 0, il = nodeArray.length; i < il; i++) {
			if (nodeArray[i] === node) break;
			prevNodes.push(nodeArray[i]);
		}
	}
	return prevNodes;
}
/**
* Find an element in an array of nodes matching a selector
* - also handles special cases where the selector is inside a special case element
*   e.g. finding a heading inside a ds_page-header block
*
* @param {HTMLElement[]} nodeArray
* @param {string} selector
* @param {string} specialCases
* @returns {HTMLElement | null}
*/
function findElementInNodeArray(nodeArray, selector, specialCases) {
	nodeArray.reverse();
	for (let i = 0, il = nodeArray.length; i < il; i++) {
		if (nodeArray[i].matches(selector)) return nodeArray[i];
		if (specialCases && nodeArray[i].matches(specialCases)) {
			if (nodeArray[i].querySelector(selector)) return nodeArray[i].querySelector(selector);
		}
	}
	return null;
}
/**
* Tracking tools
* - adds data attributes for tracking and pushes data to the dataLayer
* - can be re-initialized on dynamic content by calling tracking.init(scope)
* - scope parameter is optional and defaults to document.documentElement
*/
var tracking = {
	hasAddedCanonicalUrl: false,
	hasAddedClickTracking: false,
	hasAddedPrefersColorScheme: false,
	hasAddedVersion: false,
	/**
	* Initialize tracking
	*
	* @param {HTMLElement} scope - the element to initialize tracking on
	* @returns {void}
	*/
	init: function(scope = document.documentElement) {
		let key;
		for (key in tracking.add) tracking.add[key](scope);
	},
	/**
	* Gather elements by class name
	*
	* @param {string} className - the class name to gather elements for
	* @param {HTMLElement} scope - the element to search within
	* @returns {HTMLElement[]}
	*/
	gatherElements: function(className, scope) {
		const elements = [].slice.call(scope.querySelectorAll(`.${className}`));
		if (scope.classList && scope.classList.contains(className)) elements.push(scope);
		return elements;
	},
	/**
	* Get the type of click (left/middle/right + modifier keys)
	*
	* @param {MouseEvent} event
	* @returns {string | undefined} - click type
	*/
	getClickType: function(event) {
		switch (event.type) {
			case "click": if (event.ctrlKey) return "ctrl click";
			else if (event.metaKey) return "command/win click";
			else if (event.shiftKey) return "shift click";
			else return "primary click";
			case "auxclick": return "middle click";
			case "contextmenu": return "secondary click";
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
	getNearestSectionHeader: function(element) {
		const linkSectionExceptions = "nav,.ds_metadata,.ds_summary-card__header,.ds_card__content-header";
		const linkSectionIdentifiers = "h1,h2,h3,h4,h5,h6,summary,.ds_details__summary";
		const linkSectionSpecialCases = ".ds_page-header,.ds_layout__header,.ds_accordion-item__header";
		if (typeof element.closest === "function" && element.closest(linkSectionExceptions)) return;
		const possibleHeader = findElementInNodeArray(prevUntil(element), linkSectionIdentifiers, linkSectionSpecialCases);
		let nearestSectionHeader;
		if (possibleHeader) nearestSectionHeader = possibleHeader;
		else if (element.parentElement) nearestSectionHeader = tracking.getNearestSectionHeader(element.parentElement);
		return nearestSectionHeader;
	},
	/**
	* Push data to the dataLayer
	*
	* @param data
	* @returns {void}
	*/
	pushToDataLayer: function(data) {
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push(data);
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
		clicks: function(scope = document.documentElement) {
			if (!tracking.hasAddedClickTracking) {
				scope.addEventListener("click", (event) => {
					tracking.pushToDataLayer({ "method": tracking.getClickType(event) });
				});
				scope.addEventListener("auxclick", (event) => {
					if (event.button === 1 || event.buttons === 4) tracking.pushToDataLayer({ "method": tracking.getClickType(event) });
				});
				scope.addEventListener("contextmenu", (event) => {
					tracking.pushToDataLayer({ "method": tracking.getClickType(event) });
				});
				tracking.hasAddedClickTracking = true;
			}
		},
		/**
		* Add canonical URL to dataLayer
		* - only adds once
		*
		* @returns {void}
		*/
		canonicalUrl: () => {
			const canonicalLink = document.querySelector("link[rel=\"canonical\"]");
			if (canonicalLink && canonicalLink.href) {
				if (!tracking.hasAddedCanonicalUrl) {
					tracking.pushToDataLayer({ canonicalUrl: canonicalLink.href });
					tracking.hasAddedCanonicalUrl = true;
				}
			}
		},
		/**
		* Add prefers color scheme to dataLayer
		* - only adds once
		*
		* @returns {void}
		*/
		prefersColorScheme: function() {
			/* v8 ignore if -- @preserve */
			if (!window.matchMedia) return;
			const colorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			if (!tracking.hasAddedPrefersColorScheme) {
				tracking.pushToDataLayer({ prefersColorScheme: colorScheme });
				tracking.hasAddedPrefersColorScheme = true;
			}
		},
		/**
		* Add version to dataLayer
		* - only adds once
		*
		* @returns {void}
		*/
		version: function() {
			if (!tracking.hasAddedVersion) {
				tracking.pushToDataLayer({ version: version_default });
				tracking.hasAddedVersion = true;
			}
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
		accordions: function(scope = document.documentElement) {
			tracking.gatherElements("ds_accordion", scope).forEach((accordion) => {
				let name = "";
				if (accordion.dataset.name) name = accordion.dataset.name;
				if (!accordion.classList.contains("js-initialised")) return;
				[].slice.call(accordion.querySelectorAll("a:not(.ds_button)")).forEach((link) => {
					if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", `accordion-link`);
				});
				const openAll = accordion.querySelector(".js-open-all");
				const items = [].slice.call(accordion.querySelectorAll(".ds_accordion-item"));
				/**
				* Check if all accordion items are open
				*
				* @returns {boolean}
				*/
				function checkOpenAll() {
					const openItemsCount = accordion.querySelectorAll(".ds_accordion-item[open]").length;
					return items.length === openItemsCount;
				}
				/**
				* Set open all button data attribute
				*
				* @param {HTMLButtonElement} openAll
				* @returns {void}
				*/
				function setOpenAll(openAll) {
					if (openAll) if (checkOpenAll()) openAll.setAttribute("data-accordion", `accordion-${name.length ? name + "-" : name}close-all`);
					else openAll.setAttribute("data-accordion", `accordion-${name.length ? name + "-" : name}open-all`);
				}
				/**
				* Set accordion item data attribute
				*
				* @param {HTMLElement} item
				* @param {number} index
				* @returns {void}
				*/
				function setAccordionItem(item, index) {
					item.querySelector(".ds_accordion-item__header").setAttribute("data-accordion", `accordion-${name.length ? name + "-" : name}${item.hasAttribute("open") ? "close" : "open"}-${index + 1}`);
				}
				setOpenAll(openAll);
				items.forEach((item, index) => {
					setAccordionItem(item, index);
				});
				if (openAll) openAll.addEventListener("click", () => {
					items.forEach((item, index) => {
						setAccordionItem(item, index);
					});
					setOpenAll(openAll);
				});
				items.forEach((item, index) => {
					const itemHeader = item.querySelector(".ds_accordion-item__header");
					item.addEventListener("toggle", () => {
						itemHeader.setAttribute("data-accordion", `accordion-${name.length ? name + "-" : name}${item.hasAttribute("open") ? "close" : "open"}-${index + 1}`);
						setOpenAll(openAll);
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
		asides: function(scope = document.documentElement) {
			tracking.gatherElements("ds_article-aside", scope).forEach((aside) => {
				[].slice.call(aside.querySelectorAll("a:not(.ds_button)")).forEach((link, index) => {
					if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", `link-related-${index + 1}`);
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
		autocompletes: function(scope = document.documentElement) {
			function autocompleteDataLayerPush(storedValue, inputElement) {
				tracking.pushToDataLayer({
					event: "autocomplete",
					searchText: storedValue,
					clickText: inputElement.dataset.autocompletetext,
					resultsCount: parseInt(inputElement.dataset.autocompletecount),
					clickedResults: `result ${inputElement.dataset.autocompleteposition} of ${inputElement.dataset.autocompletecount}`
				});
				delete inputElement.dataset.autocompletetext;
				delete inputElement.dataset.autocompletecount;
				delete inputElement.dataset.autocompleteposition;
			}
			tracking.gatherElements("ds_autocomplete", scope).forEach((autocomplete) => {
				const inputElement = autocomplete.querySelector(".js-autocomplete-input");
				const listBoxElement = document.querySelector("#" + inputElement.getAttribute("aria-owns") + " .ds_autocomplete__suggestions-list");
				let storedValue = inputElement.value;
				inputElement.addEventListener("keydown", (event) => {
					if (event.key === "Enter" && inputElement.dataset.autocompletetext) autocompleteDataLayerPush(storedValue, inputElement);
					storedValue = inputElement.value;
				});
				listBoxElement?.addEventListener("mousedown", () => {
					autocompleteDataLayerPush(storedValue, inputElement);
				});
			});
		},
		/**
		* Sets data-navigation="backtotop" on back to top components
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		backToTop: function(scope = document.documentElement) {
			tracking.gatherElements("ds_back-to-top__button", scope).forEach((backToTop) => {
				backToTop.setAttribute("data-navigation", "backtotop");
			});
		},
		/**
		* Sets data-navigation="breadcrumb-[INDEX+1]" on breadcrumb item components
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		breadcrumbs: function(scope = document.documentElement) {
			tracking.gatherElements("ds_breadcrumbs", scope).forEach((breadcrumbList) => {
				[].slice.call(breadcrumbList.querySelectorAll(".ds_breadcrumbs__link")).forEach((link, index) => {
					if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", `breadcrumb-${index + 1}`);
				});
			});
		},
		/**
		* Sets data-button="button-[TEXT]" on button components
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		buttons: function(scope = document.documentElement) {
			[].slice.call(scope.querySelectorAll(".ds_button, input[type=\"button\"], input[type=\"submit\"], button")).forEach((button) => {
				if (!button.getAttribute("data-button")) button.setAttribute("data-button", `button-${slugify(button.textContent)}`);
			});
		},
		/**
		* Sets data-navigation="card-[INDEX+1]" on cards that are links
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		cards: function(scope = document.documentElement) {
			tracking.gatherElements("ds_card__link--cover", scope).forEach((link, index) => {
				if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", `card-${index + 1}`);
			});
			tracking.gatherElements("ds_card", scope).forEach((card, index) => {
				[].slice.call(card.querySelectorAll(".ds_button, input[type=\"button\"], input[type=\"submit\"], button")).forEach((button) => {
					if (!button.getAttribute("data-section")) button.setAttribute("data-section", `card-${index + 1}`);
				});
				[].slice.call(card.querySelectorAll("a:not(.ds_card__link)")).forEach((link) => {
					if (!link.getAttribute("data-section")) link.setAttribute("data-section", `card-${index + 1}`);
				});
			});
		},
		/**
		* Sets data-navigation="category-item-[INDEX+1]" on category item components
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		categoryLists: function(scope = document.documentElement) {
			tracking.gatherElements("ds_category-list", scope).forEach((categoryList) => {
				[].slice.call(categoryList.querySelectorAll(".ds_category-item__link")).forEach((link, index) => {
					if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", `category-item-${index + 1}`);
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
		checkboxes: function(scope = document.documentElement) {
			tracking.gatherElements("ds_checkbox__input", scope).forEach((checkbox) => {
				let attributeValue = checkbox.getAttribute("data-form") || "";
				if (!attributeValue && checkbox.id) attributeValue = `checkbox-${checkbox.id}`;
				else attributeValue = attributeValue.replace(/-checked/g, "");
				if (checkbox.checked) attributeValue = attributeValue + "-checked";
				checkbox.setAttribute("data-form", attributeValue);
				if (checkbox.id && !checkbox.getAttribute("data-value")) checkbox.setAttribute("data-value", `${checkbox.id}`);
				const label = scope.querySelector(`[for=${checkbox.id}]`);
				if (label && !checkbox.classList.contains("js-has-tracking-event")) {
					label.addEventListener("click", () => {
						checkbox.dataset.form = `checkbox-${checkbox.id}-${checkbox.checked ? "unchecked" : "checked"}`;
					});
					checkbox.classList.add("js-has-tracking-event");
				}
			});
		},
		/**
		* Sets data-navigation="confirmation-link" on links in confirmation message components
		* DEPRECATED - this will be removed in a future release
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		confirmationMessages: function(scope = document.documentElement) {
			tracking.gatherElements("ds_confirmation-message", scope).forEach((confirmationMessage) => {
				[].slice.call(confirmationMessage.querySelectorAll("a:not(.ds_button)")).forEach((link) => {
					link.setAttribute("data-navigation", "confirmation-link");
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
		contactDetails: function(scope = document.documentElement) {
			tracking.gatherElements("ds_contact-details", scope).forEach((contactDetails) => {
				[].slice.call(contactDetails.querySelectorAll(".ds_contact-details__social-link")).forEach((link) => {
					if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", `contact-details-${slugify(link.textContent)}`);
				});
				[].slice.call(contactDetails.querySelectorAll("a[href^=\"mailto\"]")).forEach((link) => {
					if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", "contact-details-email");
				});
			});
		},
		/**
		* Sets data-navigation="contentsnav-[INDEX+1]" on contents nav links
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		contentNavs: function(scope = document.documentElement) {
			tracking.gatherElements("ds_contents-nav", scope).forEach((contentsNav) => {
				[].slice.call(contentsNav.querySelectorAll(".ds_contents-nav__link")).forEach((link, index) => {
					if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", `contentsnav-${index + 1}`);
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
		details: function(scope = document.documentElement) {
			tracking.gatherElements("ds_details", scope).forEach((detailsElement) => {
				const summary = detailsElement.querySelector(".ds_details__summary");
				summary.setAttribute("data-accordion", `detail-${detailsElement.open ? "close" : "open"}`);
				summary.addEventListener("click", () => {
					summary.setAttribute("data-accordion", `detail-${detailsElement.open ? "open" : "close"}`);
				});
				[].slice.call(detailsElement.querySelectorAll("a:not(.ds_button)")).forEach((link) => {
					if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", `details-link`);
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
		errorMessages: function(scope = document.documentElement) {
			tracking.gatherElements("ds_question__error-message", scope).forEach((errorMessage, index) => {
				if (typeof errorMessage.closest === "function" && errorMessage.closest(".ds_question")) {
					const target = errorMessage.closest(".ds_question")?.querySelector(".js-validation-group, .ds_input, .ds_select, .ds_checkbox__input, .ds_radio__input");
					let targetName = (index + 1).toString();
					if (target) if (target.classList.contains("js-validation-group")) {
						const unique = function(value, index, self) {
							return self.indexOf(value) === index;
						};
						targetName = [].slice.call(target.querySelectorAll(".ds_input, .ds_select, .ds_checkbox__input, .ds_radio__input")).map((input) => {
							if (input.type === "radio") return input.name;
							else return input.id;
						}).filter(unique).join("-");
					} else if (target.type === "radio") targetName = target.name;
					else targetName = target.id;
					if (!errorMessage.getAttribute("data-form")) errorMessage.setAttribute("data-form", `error-${targetName}`);
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
		errorSummaries: function(scope = document.documentElement) {
			tracking.gatherElements("ds_error-summary", scope).forEach((errorSummary) => {
				[].slice.call(errorSummary.querySelectorAll(".ds_error-summary__list a")).forEach((link) => {
					if (!link.getAttribute("data-form") && link.href) link.setAttribute("data-form", `error-${link.href.substring(link.href.lastIndexOf("#") + 1)}`);
				});
			});
		},
		/**
		* Sets data-navigation="link-external" to external links
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		externalLinks: function(scope = document.documentElement) {
			[].slice.call(scope.querySelectorAll("a")).filter((link) => {
				let hostAndPort = window.location.hostname;
				/* v8 ignore else -- @preserve */
				if (window.location.port) hostAndPort += ":" + window.location.port;
				return !new RegExp("/" + hostAndPort + "/?|^tel:|^mailto:|^/").test(link.href);
			}).forEach((link) => {
				link.setAttribute("data-navigation", "link-external");
			});
		},
		/**
		* Sets data-form="fileinput-[ID]" on file upload components
		* Sets data-filesize and data-filetype when a file is added
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		fileUploads: function(scope = document.documentElement) {
			[].slice.call(scope.querySelectorAll(".ds_file-upload")).forEach((fileUpload) => {
				const inputElement = fileUpload.querySelector("input[type=\"file\"]");
				if (!inputElement.getAttribute("data-form") && inputElement.id) inputElement.setAttribute("data-form", `fileinput-${inputElement.id}`);
				function getFileExtensionFromFilename(fileName) {
					const split = fileName.split(".");
					if (split.length > 1) return split.pop()?.toLowerCase();
					else return "";
				}
				function getFileSizeInMB(fileSizeInBytes) {
					return `${(fileSizeInBytes * 1e-6).toFixed(2)}MB`;
				}
				inputElement.addEventListener("input", () => {
					if (inputElement.files?.length) {
						inputElement.setAttribute("data-filetype", getFileExtensionFromFilename(inputElement.files[0].name));
						inputElement.setAttribute("data-filesize", getFileSizeInMB(inputElement.files[0].size));
					} else {
						inputElement.removeAttribute("data-filesize");
						inputElement.removeAttribute("data-filetype");
					}
				});
				function pushEventWithDetail(event, eventType) {
					const data = { event: eventType };
					if (!event.detail.canFill) data.status = "fail: unable to fill";
					else if (!event.detail.canAccept) data.status = "fail: unable to accept";
					else data.status = "success";
					data.files = Array.from(event.detail.files).map((item) => {
						const itemAsFile = item;
						return {
							extension: getFileExtensionFromFilename(itemAsFile.name),
							size: itemAsFile.size,
							type: itemAsFile.type
						};
					});
					tracking.pushToDataLayer(data);
				}
				fileUpload.addEventListener("dropHappened", ((event) => {
					pushEventWithDetail(event, "fileUploadDrop");
				}));
				fileUpload.addEventListener("changeHappened", ((event) => {
					pushEventWithDetail(event, "fileUploadChange");
				}));
				inputElement.addEventListener("cancel", () => {
					tracking.pushToDataLayer({ event: "fileUploadCancel" });
				});
			});
		},
		/**
		* Sets data-navigation="hide-this-page" on hide this page links
		* Adds an event listener to push 'esc' presses the data layer
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		hideThisPage: function(scope = document.documentElement) {
			tracking.gatherElements("ds_hide-page", scope).forEach((hideThisPageElement) => {
				[].slice.call(hideThisPageElement.querySelectorAll(".ds_hide-page__button")).forEach((hideThisPageButton) => {
					hideThisPageButton.setAttribute("data-navigation", "hide-this-page");
					document.addEventListener("keyup", (event) => {
						if (event.key === "Esc") tracking.pushToDataLayer({ "event": "hide-this-page-keyboard" });
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
		insetTexts: function(scope = document.documentElement) {
			tracking.gatherElements("ds_inset-text", scope).forEach((insetText) => {
				[].slice.call(insetText.querySelectorAll(".ds_inset-text__text a:not(.ds_button)")).forEach((link) => {
					/* v8 ignore else -- @preserve */
					if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", "inset-link");
				});
			});
		},
		/**
		* Sets data-section="[SECTIONNAME]" on links
		* SECIONNAME is determined by seeking the closest heading (or headinglike) element to the link
		* @returns {void}
		*/
		links: function(scope = document.documentElement) {
			[].slice.call(scope.querySelectorAll("a")).forEach((link) => {
				const nearestHeader = tracking.getNearestSectionHeader(link);
				if (nearestHeader) {
					if (!link.getAttribute("data-section")) link.setAttribute("data-section", nearestHeader.textContent.trim());
				}
			});
		},
		/**
		* Sets data-navigation="[NAME]-[INDEX+1]" on links in metadata items
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		metadataItems: function(scope = document.documentElement) {
			tracking.gatherElements("ds_metadata__item", scope).forEach((metadataItem, index) => {
				const keyElement = metadataItem.querySelector(".ds_metadata__key");
				let key;
				if (keyElement) key = keyElement.textContent.trim();
				else key = `metadata-${index}`;
				[].slice.call(metadataItem.querySelectorAll(".ds_metadata__value a")).forEach((link, index) => {
					if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", `${slugify(key)}-${index + 1}`);
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
		notifications: function(scope = document.documentElement) {
			tracking.gatherElements("ds_notification", scope).forEach((banner, index) => {
				const bannername = banner.id || (index + 1).toString();
				[].slice.call(banner.querySelectorAll("a:not(.ds_button)")).forEach((link) => {
					if (!link.getAttribute("data-banner")) link.setAttribute("data-banner", `banner-${bannername}-link`);
				});
				[].slice.call(banner.querySelectorAll(".ds_button:not(.ds_notification__close)")).forEach((button) => {
					if (!button.getAttribute("data-banner")) button.setAttribute("data-banner", `banner-${bannername}-${slugify(button.textContent)}`);
				});
				const close = banner.querySelector(".ds_notification__close");
				if (close && !close.getAttribute("data-banner")) close.setAttribute("data-banner", `banner-${bannername}-close`);
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
		notificationMessages: function(scope = document.documentElement) {
			tracking.gatherElements("ds_notification-message", scope).forEach((message, index) => {
				const messageName = message.id || (index + 1).toString();
				const notificationType = (() => {
					if (message.classList.contains("ds_notification-message--error")) return "error";
					else if (message.classList.contains("ds_notification-message--warning")) return "warning";
					else if (message.classList.contains("ds_notification-message--info")) return "info";
					else return "confirmation";
				})();
				[].slice.call(message.querySelectorAll("a")).forEach((link) => {
					if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", `${notificationType}-${messageName}-link`);
				});
				message.querySelector(".ds_notification-message__close")?.setAttribute("data-button", `${notificationType}-${messageName}-close`);
			});
		},
		/**
		* Sets data-search="pagination-more" on "load more" links
		* Sets data-search="pagination-[LINKTEXT]" on pagination links
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		pagination: function(scope = document.documentElement) {
			tracking.gatherElements("ds_pagination", scope).forEach((pagination) => {
				const loadmore = pagination.querySelector(".ds_pagination__load-more button");
				if (loadmore && !loadmore.getAttribute("data-search")) loadmore.setAttribute("data-search", "pagination-more");
				[].slice.call(pagination.querySelectorAll("a.ds_pagination__link")).forEach((link) => {
					if (!link.getAttribute("data-search")) link.setAttribute("data-search", `pagination-${slugify(link.textContent)}`);
				});
			});
		},
		/**
		* Sets data-banner="banner-[NAME]-link" on links in phase banners
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		phaseBanners: function(scope = document.documentElement) {
			tracking.gatherElements("ds_phase-banner", scope).forEach((banner) => {
				const tagElement = banner.querySelector(".ds_tag");
				const bannername = tagElement ? tagElement.textContent.trim() : "phase";
				[].slice.call(banner.querySelectorAll("a")).forEach((link) => {
					if (!link.getAttribute("data-banner")) link.setAttribute("data-banner", `banner-${slugify(bannername)}-link`);
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
		radios: function(scope = document.documentElement) {
			tracking.gatherElements("ds_radio__input", scope).forEach((radio) => {
				if (!radio.getAttribute("data-form") && radio.name && radio.id) radio.setAttribute("data-form", `radio-${radio.name}-${radio.id}`);
				if (radio.id && !radio.getAttribute("data-value")) radio.setAttribute("data-value", `${radio.id}`);
			});
		},
		/**
		* Sets data-button="button-filter-[SLUG]-remove" on search facet buttons
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		searchFacets: function(scope = document.documentElement) {
			tracking.gatherElements("ds_facet__button", scope).forEach((facetButton) => {
				facetButton.setAttribute("data-button", `button-filter-${facetButton.dataset.slug}-remove`);
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
		searchResults: function(scope = document.documentElement) {
			tracking.gatherElements("ds_search-results", scope).forEach((searchResults) => {
				const list = searchResults.querySelector(".ds_search-results__list");
				if (!list) return;
				const items = [].slice.call(searchResults.querySelectorAll(".ds_search-result"));
				const promotedItems = [].slice.call(searchResults.querySelectorAll(".ds_search-result--promoted"));
				const start = +(list.getAttribute("start") || "1");
				items.forEach((item, index) => {
					const link = item.querySelector(".ds_search-result__link");
					const mediaLink = item.querySelector(".ds_search-result__media-link");
					const parentLink = item.querySelector(".ds_search-result__context a");
					if (item.classList.contains("ds_search-result--promoted")) {
						const attributeValue = `search-promoted-${index + 1}/${promotedItems.length}`;
						link.setAttribute("data-search", attributeValue);
					} else {
						let count;
						if (list.getAttribute("data-total")) count = list.getAttribute("data-total");
						let attributeValue = `search-result-${start + index - promotedItems.length}`;
						const mediaAttributeValue = `search-image-${start + index - promotedItems.length}`;
						let parentAttributeValue = `search-parent-link-${start + index - promotedItems.length}`;
						if (count) {
							attributeValue += `/${count}`;
							parentAttributeValue += `/${count}`;
						}
						link.setAttribute("data-search", attributeValue);
						if (mediaLink) mediaLink.setAttribute("data-search", mediaAttributeValue);
						if (parentLink) parentLink.setAttribute("data-search", parentAttributeValue);
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
		searchSuggestions: function(scope = document.documentElement) {
			tracking.gatherElements("ds_search-suggestions", scope).forEach((searchSuggestionBlock) => {
				const searchSuggestionLinks = [].slice.call(searchSuggestionBlock.querySelectorAll(".ds_search-suggestions a"));
				searchSuggestionLinks.forEach((link, index) => {
					link.setAttribute("data-search", `suggestion-result-${index + 1}/${searchSuggestionLinks.length}`);
				});
			});
		},
		/**
		* Sets data-search="search-related-[INDEX+1]/[TOTALLINKS]" on related search items
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		searchRelated: function(scope = document.documentElement) {
			tracking.gatherElements("ds_search-results__related", scope).forEach((searchRelatedBlock) => {
				const searchRelatedLinks = [].slice.call(searchRelatedBlock.querySelectorAll(".ds_search-results__related a"));
				searchRelatedLinks.forEach((link, index) => {
					link.setAttribute("data-search", `search-related-${index + 1}/${searchRelatedLinks.length}`);
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
		selects: function(scope = document.documentElement) {
			tracking.gatherElements("ds_select", scope).forEach((select) => {
				if (!select.getAttribute("data-form") && select.id) select.setAttribute("data-form", `select-${select.id}`);
				[].slice.call(select.querySelectorAll("option")).forEach((option) => {
					let valueSlug = "null";
					if (option.value) valueSlug = slugify(option.value);
					option.setAttribute("data-form", `${select.getAttribute("data-form")}-${valueSlug}`);
				});
				if (!select.classList.contains("js-has-tracking-event")) {
					select.addEventListener("change", (e) => {
						const checkedItem = e.target.querySelector(":checked");
						tracking.pushToDataLayer({ "event": String(checkedItem.dataset.form) });
					});
					select.classList.add("js-has-tracking-event");
				}
			});
		},
		/**
		* Sets data-navigation="sequential-previous" on previous links
		* Sets data-navigation="sequential-previous" on next links
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		sequentialNavs: function(scope = document.documentElement) {
			tracking.gatherElements("ds_sequential-nav", scope).forEach((sequentialNav) => {
				const prev = sequentialNav.querySelector(".ds_sequential-nav__item--prev > .ds_sequential-nav__button ");
				const next = sequentialNav.querySelector(".ds_sequential-nav__item--next > .ds_sequential-nav__button ");
				if (prev && !prev.getAttribute("data-navigation")) prev.setAttribute("data-navigation", `sequential-previous`);
				if (next && !next.getAttribute("data-navigation")) next.setAttribute("data-navigation", `sequential-next`);
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
		sideNavs: function(scope = document.documentElement) {
			tracking.gatherElements("ds_side-navigation", scope).forEach((sideNav) => {
				const list = sideNav.querySelector(".ds_side-navigation__list");
				const button = sideNav.querySelector(".js-side-navigation-button");
				const control = sideNav.querySelector(".js-toggle-side-navigation");
				function setNavButton() {
					button?.setAttribute("data-navigation", `navigation-${control.checked ? "close" : "open"}`);
				}
				function recurse(list, stub = "") {
					[].slice.call(list.children).forEach((listItem, index) => {
						[].slice.call(listItem.children).forEach((child) => {
							if (child.classList.contains("ds_side-navigation__list")) recurse(child, `${stub}-${index + 1}`);
							else child.setAttribute("data-navigation", `sidenav${stub}-${index + 1}`);
						});
					});
				}
				recurse(list);
				if (button) {
					setNavButton();
					button.addEventListener("click", () => {
						setNavButton();
					});
				}
			});
		},
		/**
		* Sets data-header="header-logo" on brand/logo link
		* Sets data-header="header-title" on site title link
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		siteBranding: function(scope = document.documentElement) {
			tracking.gatherElements("ds_site-branding", scope).forEach((branding) => {
				const logo = branding.querySelector(".ds_site-branding__logo");
				if (logo && !logo.getAttribute("data-header")) logo.setAttribute("data-header", "header-logo");
				const title = branding.querySelector(".ds_site-branding__title");
				if (title && !title.getAttribute("data-header")) title.setAttribute("data-header", "header-title");
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
		siteFooter: function(scope = document.documentElement) {
			tracking.gatherElements("ds_site-footer", scope).forEach((footer) => {
				[].slice.call(footer.querySelectorAll(".ds_site-footer__org-link")).forEach((link) => {
					if (!link.getAttribute("data-footer")) link.setAttribute("data-footer", "footer-logo");
				});
				[].slice.call(footer.querySelectorAll(".ds_site-footer__copyright a")).forEach((link) => {
					if (!link.getAttribute("data-footer")) link.setAttribute("data-footer", "footer-copyright");
				});
				[].slice.call(footer.querySelectorAll(".ds_site-items__item a:not(.ds_button)")).forEach((link, index) => {
					if (!link.getAttribute("data-footer")) link.setAttribute("data-footer", `footer-link-${index + 1}`);
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
		siteNavigation: function(scope = document.documentElement) {
			tracking.gatherElements("ds_site-navigation", scope).forEach((siteNavigation) => {
				[].slice.call(siteNavigation.querySelectorAll(".ds_site-navigation__link")).forEach((link, index) => {
					if (!link.getAttribute("data-device")) if (typeof link.closest === "function" && link.closest(".ds_site-navigation--mobile")) link.setAttribute("data-device", "mobile");
					else link.setAttribute("data-device", "desktop");
					if (!link.getAttribute("data-header")) link.setAttribute("data-header", `header-link-${index + 1}`);
				});
			});
			tracking.gatherElements("ds_site-navigation--mobile", scope).forEach((mobileNavigation) => {
				const toggler = mobileNavigation.parentNode?.querySelector(".js-toggle-menu");
				if (toggler) toggler.setAttribute("data-header", "header-menu-toggle");
			});
		},
		/**
		* Sets data-navigation="skip-link-[INDEX+1]" on links in skip links components
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		skipLinks: function(scope = document.documentElement) {
			[].slice.call(scope.querySelectorAll(".ds_skip-links__link")).forEach((link, index) => {
				if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", `skip-link-${index + 1}`);
			});
		},
		/**
		* Sets data-navigation="partof-sidebar" on stepnav sidebar links
		* Sets data-navigation="partof-header" on stepnav header links
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		stepNavigation: function(scope = document.documentElement) {
			tracking.gatherElements("ds_step-navigation", scope).forEach((stepNavigation) => {
				[].slice.call(stepNavigation.querySelectorAll(".ds_step-navigation__title-link")).forEach((partOfLink) => {
					partOfLink.setAttribute("data-navigation", "partof-sidebar");
				});
			});
			tracking.gatherElements("ds_step-navigation-top", scope).forEach((stepNavigationTopBar) => {
				[].slice.call(stepNavigationTopBar.querySelectorAll("a")).forEach((partOfLink) => {
					partOfLink.setAttribute("data-navigation", "partof-header");
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
		summaryCard: function(scope = document.documentElement) {
			tracking.gatherElements("ds_summary-card", scope).forEach((cards, index) => {
				[].slice.call(cards.querySelectorAll(".ds_summary-card__actions-list")).forEach((actions) => {
					const actionButtons = [].slice.call(actions.querySelectorAll("button"));
					const actionLinks = [].slice.call(actions.querySelectorAll("a"));
					actionButtons.forEach((actionButton) => {
						actionButton.setAttribute("data-button", `button-${slugify(actionButton.textContent)}-${index + 1}`);
					});
					actionLinks.forEach((actionLink) => {
						actionLink.setAttribute("data-navigation", `navigation-${slugify(actionLink.textContent)}-${index + 1}`);
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
		summaryList: function(scope = document.documentElement) {
			tracking.gatherElements("ds_summary-list__actions", scope).forEach((actionContainer) => {
				[].slice.call(actionContainer.querySelectorAll("button, a")).forEach((actionElement) => {
					const actionElementType = actionElement.tagName === "BUTTON" ? "button" : "navigation";
					const keyForAction = actionElement.closest(".ds_summary-list__item")?.querySelector(".ds_summary-list__key");
					const keyText = "-" + slugify(keyForAction.textContent);
					actionElement.setAttribute(`data-${actionElementType}`, `${actionElementType}-${slugify(actionElement.textContent)}${keyText}`);
				});
			});
		},
		/**
		* Sets data-navigation="tab-link-[TABSET]-[LINKINDEX+1]" on tabs
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		tabs: function(scope = document.documentElement) {
			const tabComponent = tracking.gatherElements("ds_tabs", scope);
			let tabSet = 1;
			tabComponent.forEach((tabs) => {
				[].slice.call(tabs.querySelectorAll(".ds_tabs__tab-link")).forEach((link, index) => {
					if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", `tab-link-${tabSet}-${index + 1}`);
				});
				tabSet++;
			});
		},
		/**
		* Sets data-navigation="tasklist" on links in task lists
		* Sets data-navigation="tasklist-skip" on skip links in task lists
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		taskList: function(scope = document.documentElement) {
			tracking.gatherElements("ds_task-list__task-link", scope).forEach((link) => {
				if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", `tasklist`);
			});
			tracking.gatherElements("js-task-list-skip-link", scope).forEach((link) => {
				if (!link.getAttribute("data-navigation")) link.setAttribute("data-navigation", `tasklist-skip`);
			});
		},
		/**
		* Sets data-form="[TYPE]input-[ID]" on text input components
		* e.g. data-form="textinput-foo", data-form="numberinput-bar"
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		textInputs: function(scope = document.documentElement) {
			[].slice.call(scope.querySelectorAll("input.ds_input")).forEach((textInput) => {
				if (!textInput.getAttribute("data-form") && textInput.id) {
					const type = textInput.type;
					textInput.setAttribute("data-form", `${type}input-${textInput.id}`);
				}
			});
		},
		/**
		* Sets data-form="textarea-[ID]" on textarea components
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		textareas: function(scope = document.documentElement) {
			[].slice.call(scope.querySelectorAll("textarea.ds_input")).forEach((textarea) => {
				if (!textarea.getAttribute("data-form") && textarea.id) textarea.setAttribute("data-form", `textarea-${textarea.id}`);
			});
		},
		/**
		* Sets data-navigation="warning-link" attributes on links within warning text components
		*
		* @param {HTMLElement} scope - the element to initialize tracking on
		* @returns {void}
		*/
		warningTexts: function(scope = document.documentElement) {
			tracking.gatherElements("ds_warning-text", scope).forEach((warningText) => {
				[].slice.call(warningText.querySelectorAll(".ds_warning-text a:not(.ds_button)")).forEach((link) => {
					link.setAttribute("data-navigation", "warning-link");
				});
			});
		}
	}
};
//#endregion
//#region src/base/tools/index.ts
var tools_default = {
	idModifier: id_modifier_default,
	PromiseRequest,
	storage,
	temporaryFocus: temporary_focus_default,
	TokenList,
	tracking
};
//#endregion
//#region src/base/utilities/breakpoint-check/breakpoint-check.ts
/**
* Checks whether a given breakpoint is visible at the current viewport size
*
* @param {BreakpointSize} size
* @returns {boolean}
*/
function breakpoint_check_default(size) {
	const breakElement = document.createElement("div");
	breakElement.classList.add("ds_breakpoint-check");
	breakElement.classList.add("ds_breakpoint-check--" + size);
	document.body.appendChild(breakElement);
	const breakpointIsVisible = window.getComputedStyle(breakElement, null).display === "block";
	breakElement.parentNode?.removeChild(breakElement);
	return breakpointIsVisible;
}
//#endregion
//#region src/base/index.ts
var base_default = {
	tools: tools_default,
	utilities: { breakpointCheck: breakpoint_check_default }
};
//#endregion
//#region src/base/component/component.ts
var DSComponent = class {
	#element;
	#isInitialised = false;
	constructor(element) {
		this.#element = element;
		if (this.#element) this.#element.classList.add("js-instantiated");
		this.#isInitialised = false;
	}
	set isInitialised(initialised) {
		this.#isInitialised = initialised;
		if (initialised) this.#element.classList.add("js-initialised");
		else this.#element.classList.remove("js-initialised");
	}
	get isInitialised() {
		return this.#isInitialised;
	}
};
//#endregion
//#region src/components/accordion/accordion.ts
/**
* Accordion component
*
* @class Accordion
* @extends DSComponent
* @property {HTMLElement} accordion - the accordion element
* @property {HTMLElement[]} items - the accordion items
* @property {HTMLButtonElement} openAllButton - the open all button
*/
var Accordion = class extends DSComponent {
	accordion;
	items;
	openAllButton;
	/**
	* Creates an accordion component
	*
	* @param {HTMLElement} accordion - the accordion element
	*/
	constructor(accordion) {
		super(accordion);
		this.accordion = accordion;
		this.items = [].slice.call(accordion.querySelectorAll(".ds_accordion-item"));
		this.openAllButton = accordion.querySelector(".js-open-all");
		if (this.accordion.querySelector("div.ds_accordion-item")) this.doFallback();
	}
	/**
	* Initialize the accordion
	* - initialize each accordion item
	* - initialize the open all button if present
	*
	* @returns {void}
	*/
	init() {
		if (!this.isInitialised) {
			this.items.forEach((item) => this.initAccordionItem(item));
			if (this.openAllButton) this.initOpenAll();
			this.isInitialised = true;
		}
	}
	/**
	* Fallback for old markup
	* - convert accordion panels to DETAILS elements
	* - redeclare this.items
	*
	* @returns {void}
	*/
	doFallback() {
		this.items.forEach((item) => {
			const details = document.createElement("details");
			const summary = document.createElement("summary");
			const body = item.querySelector(".ds_accordion-item__body") || document.createElement("div");
			const title = item.querySelector(".ds_accordion-item__title") || document.createElement("div");
			const control = item.querySelector(".ds_accordion-item__control") || document.createElement("input");
			summary.innerHTML = title.innerHTML + item.querySelector(".ds_accordion-item__indicator")?.outerHTML;
			details.classList.add("ds_accordion-item");
			summary.classList.add("ds_accordion-item__header");
			if (control.checked) details.setAttribute("open", "");
			details.appendChild(summary);
			details.appendChild(body);
			item.replaceWith(details);
		});
		this.items = [].slice.call(this.accordion.querySelectorAll(".ds_accordion-item"));
	}
	/**
	* Initialize an accordion item
	* - set IDs on accordion panels
	* - set initial state
	*
	* @param {HTMLElement} item - the accordion item to initialize
	* @returns {void}
	*/
	initAccordionItem(item) {
		const ID_MODIFIER = id_modifier_default();
		item.id = item.id || `accordion-item-${ID_MODIFIER}`;
		const startsOpen = item.hasAttribute("open");
		let accordionHasLocationHashInIt = false;
		if (window.location.hash) try {
			if (item.querySelector(window.location.hash)) {
				accordionHasLocationHashInIt = true;
				item.setAttribute("open", "");
			}
		} catch {}
		if (startsOpen) {
			if (this.openAllButton) this.setOpenAllButton(this.checkAllOpen());
			if (accordionHasLocationHashInIt) item.scrollIntoView();
		}
		item.addEventListener("toggle", () => {
			if (this.openAllButton) this.setOpenAllButton(this.checkAllOpen());
		});
	}
	/**
	* Initialize the open all button
	* - set aria attributes
	* - attach event listener
	*
	* @returns {void}
	*/
	initOpenAll() {
		this.openAllButton.setAttribute("aria-controls", this.items.map((item) => item.id).join(" "));
		this.openAllButton.setAttribute("aria-expanded", false.toString());
		this.openAllButton.addEventListener("click", () => {
			const opening = !this.checkAllOpen();
			[].slice.call(this.accordion.querySelectorAll(".ds_accordion-item")).forEach((item) => {
				opening ? item.setAttribute("open", "") : item.removeAttribute("open");
			});
			this.setOpenAllButton(opening);
		});
	}
	/**
	* Set the open all button text and aria-expanded attribute
	*
	* @param {boolean} isOpen - true if all items are open, false otherwise
	* @returns {void}
	*/
	setOpenAllButton(isOpen) {
		if (isOpen) this.openAllButton.innerHTML = "Close all <span class=\"visually-hidden\">sections</span>";
		else this.openAllButton.innerHTML = "Open all <span class=\"visually-hidden\">sections</span>";
		this.openAllButton.setAttribute("aria-expanded", isOpen.toString());
	}
	/**
	* Check if all accordion items are open
	*
	* @returns {boolean} - true if all items are open, false otherwise
	*/
	checkAllOpen() {
		const openItemsCount = this.accordion.querySelectorAll(".ds_accordion-item[open]").length;
		return this.items.length === openItemsCount;
	}
};
//#endregion
//#region src/components/autocomplete/highlight.ts
/**
* Highlight matching text in an element
*
* @param {HTMLElement} element - the element to highlight
* @param {string} pattern - the pattern to match
* @param {HighlightOptionsArgs} options - the highlight options
* @returns {void}
*/
function highlight(element, pattern, options) {
	options = Object.assign({}, { className: "" }, options);
	/**
	* Highlight matching text in a text node
	*
	* @param {Text} textNode - the text node to highlight
	* @param {string} pattern - the pattern to match
	* @returns {boolean}
	*/
	function highlightTextNode(textNode, pattern) {
		if (!textNode.data || pattern === "") return false;
		let patternNode;
		let wrapperNode;
		const match = new RegExp(pattern, "i").exec(textNode.data);
		if (match) {
			wrapperNode = document.createElement("MARK");
			if (options.className) wrapperNode.className = options.className;
			patternNode = textNode.splitText(match.index);
			patternNode.splitText(match[0].length);
			wrapperNode.appendChild(patternNode.cloneNode(true));
			textNode.parentNode?.replaceChild(wrapperNode, patternNode);
		}
		return !!match;
	}
	/**
	* Traverse the element and highlight matching text nodes
	*
	* @param {Node} element - the element to traverse
	* @returns {void}
	*/
	function traverse(element) {
		let childNode;
		const TEXT_NODE_TYPE = 3;
		for (let i = 0; i < element.childNodes.length; i++) {
			childNode = element.childNodes[i];
			if (childNode.nodeType === TEXT_NODE_TYPE) i += highlightTextNode(childNode, pattern) ? 1 : 0;
			else traverse(childNode);
		}
	}
	traverse(element);
}
//#endregion
//#region src/components/autocomplete/autocomplete.ts
/**
* Autocomplete component
*
* @class Autocomplete
* @extends DSComponent
* @property {SuggestionArgs} activeSuggestion - the currently active suggestion
* @property {string} endpointUrl - the URL of the autocomplete suggestions endpoint
* @property {HTMLInputElement} inputElement - the input element for autocomplete
* @property {number} keypressTimeout - the timeout ID for keypress throttling
* @property {HTMLElement} listBoxElement - the list box element containing suggestions
* @property {number} minLength - the minimum length of input to trigger suggestions
* @property {Function} PromiseRequest - the function to make promise-based requests
* @property {number} selectedSuggestion - the index of the currently selected suggestion
* @property {HTMLElement} statusElement - the status element for screen reader updates
* @property {number} statusTimeout - the timeout ID for status updates
* @property {SuggestionArgs[]} suggestions - the array of current suggestions
* @property {Function} suggestionMappingFunction - the function to map raw suggestions to Suggestion objects
* @property {string} tempToggleCharacter - a temporary character to toggle status updates
* @property {number} throttleDelay - the delay in milliseconds for throttling input
*/
var Autocomplete = class extends DSComponent {
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
	constructor(element, endpointUrl, options = {}) {
		super(element);
		this.inputElement = element.querySelector(".js-autocomplete-input");
		this.endpointUrl = endpointUrl;
		this.suggestionMappingFunction = options.suggestionMappingFunction || ((suggestions) => suggestions);
		this.throttleDelay = options.throttleDelay || 100;
		this.minLength = options.minLength || 3;
		this.tempToggleCharacter = "";
		this.PromiseRequest = PromiseRequest;
		this.statusElement = document.querySelector("#autocomplete-status");
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
		if (!this.inputElement || !this.endpointUrl) return;
		this.listBoxElement = document.getElementById(this.inputElement.getAttribute("aria-owns")).querySelector(".ds_autocomplete__suggestions-list");
		this.inputElement.addEventListener("keydown", (event) => {
			if (event.key === "ArrowDown") {
				event.preventDefault();
				this.selectSuggestion(typeof this.selectedSuggestion === "undefined" ? 0 : this.selectedSuggestion + 1);
			} else if (event.key === "ArrowUp") {
				event.preventDefault();
				this.selectSuggestion(typeof this.selectedSuggestion === "undefined" ? -1 : this.selectedSuggestion - 1);
			} else if (event.key === "Esc") this.clearSearch();
			else if (event.key === "Enter" && this.activeSuggestion) {
				event.preventDefault();
				this.acceptSelectedSuggestion();
			}
		});
		this.inputElement.addEventListener("input", () => {
			window.clearTimeout(this.keypressTimeout);
			const value = this.inputElement.value.trim();
			if (value.length >= this.minLength) this.keypressTimeout = window.setTimeout(() => {
				this.fetchSuggestions(value).then((suggestions) => {
					this.suggestions = suggestions;
					this.showSuggestions(this.suggestions);
					this.updateStatus(this.suggestions.length, 1500);
				});
			}, this.throttleDelay);
			else this.clearSuggestions();
		});
		this.inputElement.addEventListener("focus", () => {
			if (this.inputElement.value) if (this.suggestions) {
				this.showSuggestions(this.suggestions);
				this.updateStatus(this.suggestions.length, 1500);
			} else this.fetchSuggestions(this.inputElement.value.trim());
		});
		this.inputElement.addEventListener("blur", () => {
			this.clearSuggestions();
		});
		this.listBoxElement.addEventListener("mousedown", (event) => {
			event.preventDefault();
			const target = event.target;
			const suggestionElement = target.classList.contains("ds_autocomplete__suggestion") ? target : target.closest(".ds_autocomplete__suggestion");
			if (suggestionElement) {
				const suggestionElementParent = suggestionElement.parentElement;
				const selectedIndex = Array.from(suggestionElementParent.children).indexOf(suggestionElement);
				this.selectSuggestion(selectedIndex);
				this.acceptSelectedSuggestion();
			}
		});
		this.isInitialised = true;
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
		const selectedItem = document.querySelector("#" + this.inputElement.getAttribute("aria-activedescendant"));
		this.inputElement.value = selectedItem.querySelector(".js-suggestion-text").textContent.trim();
		this.inputElement.dataset.autocompletetext = this.inputElement.value;
		this.inputElement.dataset.autocompletecount = this.suggestions.length.toString();
		this.inputElement.dataset.autocompleteposition = String([].slice.call(this.listBoxElement.querySelectorAll("li")).indexOf(selectedItem) + 1);
		this.clearSuggestions();
	}
	/**
	* Build the HTML for a suggestion
	* - creates a span element with the suggestion text
	*
	* @param {string} suggestionHtml - the HTML content for the suggestion
	* @returns {string} - the HTML string for the suggestion
	*/
	buildSuggestionHtml(suggestionHtml) {
		return `<span aria-hidden="true" class="ds_autocomplete__suggestion__text  js-suggestion-text">${suggestionHtml}</span>
                <span class="visually-hidden">${suggestionHtml}</span>`;
	}
	/**
	* Clear the search input
	* - clears the suggestions
	*
	* @returns {void}
	*/
	clearSearch() {
		this.inputElement.value = "";
		this.clearSuggestions();
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
		delete this.activeSuggestion;
		delete this.selectedSuggestion;
		this.listBoxElement.innerHTML = "";
		this.inputElement.removeAttribute("aria-activedescendant");
		this.inputElement.classList.remove("js-has-suggestions");
		this.statusElement.innerHTML = "";
		if (this.suggestions) this.suggestions.filter((item) => item.isActive).forEach((item) => {
			item.isActive = false;
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
	fetchSuggestions(searchTerm) {
		return this.PromiseRequest(this.endpointUrl + encodeURIComponent(searchTerm)).then((result) => this.suggestionMappingFunction(result)).catch((result) => {
			console.log("fetch failed", result);
			return this.suggestionMappingFunction([]);
		});
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
	selectSuggestion(selectionIndex) {
		this.selectedSuggestion = selectionIndex;
		this.suggestions.forEach((suggestion, index) => {
			if (index === this.modulo(selectionIndex, this.suggestions.length)) {
				suggestion.isActive = true;
				this.activeSuggestion = suggestion;
				this.inputElement.setAttribute("aria-activedescendant", "suggestion-" + index);
			} else delete suggestion.isActive;
		});
		this.showSuggestions(this.suggestions);
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
	showSuggestions(suggestions) {
		this.listBoxElement.innerHTML = "";
		if (suggestions.length) {
			for (let i = 0, il = suggestions.length; i < il; i++) {
				const suggestion = suggestions[i];
				const suggestionElement = document.createElement("li");
				suggestionElement.id = "suggestion-" + i;
				suggestionElement.classList.add("ds_autocomplete__suggestion");
				suggestionElement.setAttribute("role", "option");
				document.createElement("span").classList.add("js-suggestion-text");
				if (suggestion.isActive) suggestionElement.classList.add("active");
				suggestionElement.innerHTML = this.buildSuggestionHtml(suggestion.displayText);
				highlight(suggestionElement.querySelector(".js-suggestion-text"), this.inputElement.value, {});
				this.listBoxElement.appendChild(suggestionElement);
			}
			this.inputElement.classList.add("js-has-suggestions");
			const listboxParentElement = this.listBoxElement.parentElement;
			const visualViewport = window.visualViewport;
			while (visualViewport.height < listboxParentElement.offsetHeight + this.inputElement.offsetHeight + 16) {
				const lastItem = this.listBoxElement.querySelector("li:last-child");
				lastItem.parentNode?.removeChild(lastItem);
				suggestions = suggestions.splice(suggestions.length - 1);
			}
		} else this.clearSuggestions();
	}
	/**
	* Update the status
	* - Throttle updates to avoid overwhelming screen readers
	*
	* @param {number} suggestionCount - the number of suggestions
	* @param {number} delay - the delay in milliseconds
	* @returns {void}
	*/
	updateStatus(suggestionCount, delay = 100) {
		if (this.statusElement) {
			if (this.statusTimeout) window.clearTimeout(this.statusTimeout);
			const text = `There ${suggestionCount === 1 ? "is" : "are"} ${suggestionCount} ${suggestionCount === 1 ? "option" : "options"}`;
			this.statusTimeout = window.setTimeout(() => {
				this.updateStatusText(text);
			}, delay);
		}
	}
	/**
	* Update the status text
	*
	* @param {string} text - the text to update the status with
	* @returns {void}
	*/
	updateStatusText(text) {
		if (this.tempToggleCharacter.length) this.tempToggleCharacter = "";
		else this.tempToggleCharacter = ".";
		this.statusElement.textContent = text + this.tempToggleCharacter;
	}
	/**
	* Simple modulo function that handles negative numbers correctly
	*
	* @param {number} a - the dividend
	* @param {number} b - the divisor
	* @returns {number} - the result of a mod b
	*/
	modulo(a, b) {
		return (a % b + b) % b;
	}
};
//#endregion
//#region src/components/back-to-top/back-to-top.ts
/**
* Back to top component
*
* @class BackToTop
* @extends DSComponent
* @property {HTMLElement} backToTopElement - the back to top element
* @property {HTMLElement} footerEl - the footer element
* @property {Window} window - the window object
*/
var BackToTop = class extends DSComponent {
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
	constructor(element, _window = window, options = {}) {
		super(element);
		const fallbackFooterEl = document.createElement("div");
		if (options.footerElSelector) this.footerEl = document.querySelector(options.footerElSelector);
		else this.footerEl = document.querySelector(".ds_site-footer") || fallbackFooterEl;
		this.backToTopElement = element;
		this.window = _window;
	}
	/**
	* Initialise the back to top component
	* - check whether to show or hide the back to top button
	* - adjust the position of the back to top button based on the footer height
	*
	* @returns {void}
	*/
	init() {
		if (!this.backToTopElement) return;
		const backToTopButton = this.backToTopElement.querySelector(".ds_back-to-top__button");
		if (backToTopButton) this.backToTopOffset = backToTopButton.offsetHeight + 8;
		this.checkDisplay();
		this.window.addEventListener("resize", () => this.checkDisplay());
		new ResizeObserver(() => {
			this.checkDisplay();
		}).observe(document.body);
		this.isInitialised = true;
	}
	/**
	* Check whether to show or hide the back to top button based on the height of the page content
	*
	* @returns {void}
	*/
	checkDisplay() {
		if (document.body.offsetHeight - this.footerEl.offsetHeight - this.backToTopOffset < this.window.innerHeight) this.backToTopElement.classList.add("visually-hidden");
		else {
			this.backToTopElement.classList.remove("ds_back-to-top--clamped");
			this.backToTopElement.classList.remove("visually-hidden");
		}
		if (document.body.offsetHeight - this.footerEl.offsetHeight <= this.window.innerHeight) this.backToTopElement.classList.add("ds_back-to-top--hidden");
		else this.backToTopElement.classList.remove("ds_back-to-top--hidden");
		this.checkPosition();
	}
	/**
	* Adjust the position of the back to top button based on the footer height
	*
	* @returns {void}
	*/
	checkPosition() {
		const footerOffset = this.footerEl.offsetHeight + 8;
		const backToTopSpacingUnits = Math.ceil(footerOffset / 8);
		this.backToTopElement.classList.forEach((className) => {
			if (className.match(/ds_!_off-b-/)) this.backToTopElement.classList.remove(className);
		});
		this.backToTopElement.classList.add(`ds_!_off-b-${backToTopSpacingUnits}`);
	}
};
//#endregion
//#region src/components/character-count/character-count.ts
/**
* Character count component
*
* @class CharacterCount
* @extends DSComponent
* @private {string} emptyMessage
* @private {HTMLElement} field
* @private {string} idModifier
* @private {CharacterCountInputElement} inputElement
* @private {boolean} isInvalidInitialState
* @private {number} maxLength
* @private {HTMLElement} messageElement
* @private {number} messageTimeout
* @private {HTMLElement} screenReaderMessageElement
* @private {number} threshold
* @private {number} thresholdCharacters
*/
var CharacterCount = class extends DSComponent {
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
	constructor(field) {
		super(field);
		this.field = field;
		this.inputElement = this.field.querySelector("input, textarea");
		this.threshold = this.field.dataset.threshold ? Number(this.field.dataset.threshold) * .01 : 0;
		this.messageTimeout = 0;
		this.idModifier = id_modifier_default();
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
		if (!this.inputElement) return;
		if (!this.isInitialised) {
			this.maxLength = this.getMaxLength();
			this.thresholdCharacters = this.getThresholdCharacters();
			if (this.maxLength === 0) return;
			this.emptyMessage = `You can enter up to ${this.maxLength} characters`;
			const emptyMessageElement = document.createElement("div");
			emptyMessageElement.classList.add("fully-hidden");
			emptyMessageElement.classList.add("ds_character-count__initial");
			emptyMessageElement.textContent = this.emptyMessage;
			emptyMessageElement.id = `character-count-empty-${this.idModifier}`;
			this.messageElement = document.createElement("div");
			this.messageElement.classList.add("ds_input__message");
			this.messageElement.classList.add("ds_hint-text");
			this.messageElement.setAttribute("aria-hidden", "true");
			this.screenReaderMessageElement = document.createElement("div");
			this.screenReaderMessageElement.classList.add("visually-hidden");
			this.screenReaderMessageElement.id = `character-count-remaining-${this.idModifier}`;
			const describedByTokenList = new TokenList(this.inputElement.getAttribute("aria-describedby"));
			this.inputElement.setAttribute("aria-describedby", describedByTokenList.add([emptyMessageElement.id, this.screenReaderMessageElement.id]));
			if (this.inputElement.value.length < this.thresholdCharacters) this.messageElement.classList.add("fully-hidden");
			this.isInvalidInitialState = !!this.inputElement.getAttribute("aria-invalid") && this.inputElement.getAttribute("aria-invalid") !== "false";
			this.field.appendChild(this.messageElement);
			this.field.appendChild(this.screenReaderMessageElement);
			this.field.appendChild(emptyMessageElement);
			this.updateCountMessage();
			this.inputElement.oldValue = this.inputElement.value;
			this.inputElement.addEventListener("input", this.checkIfChanged.bind(this));
			this.isInitialised = true;
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
		if (!this.inputElement.oldValue) this.inputElement.oldValue = "";
		if (this.inputElement.value !== this.inputElement.oldValue) {
			this.screenReaderMessageElement.setAttribute("aria-live", "polite");
			this.inputElement.oldValue = this.inputElement.value;
			this.updateCountMessage.bind(this)();
		}
	}
	/**
	* Get the component's "maxLength" based on either a supplied maxlength attribute or
	* data-maxlength attribute. Remove a maxlength attribute if it is present.
	*
	* @returns {number}
	*/
	getMaxLength() {
		let maxLength = 0;
		if (this.inputElement.getAttribute("maxlength")) {
			maxLength = Number(this.inputElement.getAttribute("maxlength"));
			this.inputElement.removeAttribute("maxlength");
		} else if (this.field.dataset.maxlength) maxLength = Number(this.field.dataset.maxlength);
		return maxLength;
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
		const count = this.maxLength - this.inputElement.value.length;
		let noun = "characters";
		if (Math.abs(count) === 1) noun = "character";
		this.messageElement.textContent = `You have ${count} ${noun} remaining`;
		if (count < 0) {
			this.inputElement.classList.add("ds_input--error");
			this.inputElement.setAttribute("aria-invalid", true.toString());
			this.messageElement.textContent = `You have ${Math.abs(count)} ${noun} too many`;
			this.messageElement.classList.add("ds_input__message--error");
		} else {
			if (!this.isInvalidInitialState) {
				this.inputElement.classList.remove("ds_input--error");
				this.inputElement.setAttribute("aria-invalid", false.toString());
			}
			this.messageElement.classList.remove("ds_input__message--error");
			if (this.inputElement.value.length === 0) this.messageElement.textContent = this.emptyMessage;
			else this.messageElement.textContent = `You have ${count} ${noun} remaining`;
		}
		if (this.inputElement.value.length < this.thresholdCharacters) this.messageElement.classList.add("fully-hidden");
		else this.messageElement.classList.remove("fully-hidden");
		clearTimeout(this.messageTimeout);
		this.messageTimeout = window.setTimeout(() => {
			if (this.inputElement.value.length >= this.thresholdCharacters) this.updateScreenReaderMessage();
			else this.screenReaderMessageElement.innerHTML = "&nbsp;";
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
};
//#endregion
//#region src/components/checkbox/checkboxes.ts
/**
* Checkboxes component
*
* @class Checkboxes
* @extends DSComponent
* @property {HTMLInputElement} checkboxes - checkbox elements in the checkbox group
*/
var Checkboxes = class extends DSComponent {
	checkboxes;
	/**
	* Creates a checkboxes component
	*
	* @param {HTMLElement} checkboxes - the tab container element
	*/
	constructor(checkboxes) {
		super(checkboxes);
		this.checkboxes = [].slice.call(checkboxes.querySelectorAll(".ds_checkbox__input"));
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
		this.checkboxes.forEach((checkbox) => {
			checkbox.addEventListener("change", () => {
				switch (checkbox.dataset.behaviour) {
					case "exclusive":
						this.checkboxes.filter((item) => item !== checkbox).forEach((item) => item.checked = false);
						break;
					default:
						this.checkboxes.filter((item) => item.dataset.behaviour === "exclusive").forEach((item) => item.checked = false);
						break;
				}
			});
		});
		this.isInitialised = true;
	}
};
//#endregion
//#region src/components/cookie-notification/cookie-notification.ts
/**
* Cookie notification component
*
* @class CookieNotification
* @extends DSComponent
* @property {object} storage - the DS storage object
* @property {string[]} categories - an array of cookie categories
* @property {HTMLButtonElement} cookieAcceptAllButton - the accept all cookies button
* @property {HTMLButtonElement} cookieAcceptEssentialButton - the accept essential cookies button
* @property {HTMLElement} cookieNoticeElement - the cookie notice element
* @property {HTMLElement} cookieNoticeSuccessElement - the cookie notice success message element
*/
var CookieNotification = class extends DSComponent {
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
	constructor(element, storage$1 = storage, categories) {
		super(element);
		const defaultCategories = [
			"necessary",
			"preferences",
			"statistics",
			"campaigns",
			"marketing"
		];
		this.storage = storage$1;
		this.categories = categories || defaultCategories;
		this.cookieNoticeElement = element;
		this.cookieNoticeSuccessElement = document.getElementById("cookie-confirm");
		this.cookieAcceptAllButton = this.cookieNoticeElement.querySelector(".js-accept-all-cookies");
		this.cookieAcceptEssentialButton = this.cookieNoticeElement.querySelector(".js-accept-essential-cookies");
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
		if (!this.storage.get({
			type: "cookie",
			name: "cookie-notification-acknowledged"
		})) this.cookieNoticeElement.classList.remove("fully-hidden");
		this.cookieAcceptAllButton.addEventListener("click", (event) => {
			event.preventDefault();
			this.setAllOptionalPermissions(true);
			this.cookieNoticeElement.classList.add("fully-hidden");
			this.cookieNoticeSuccessElement.classList.remove("fully-hidden");
			temporary_focus_default(this.cookieNoticeSuccessElement);
		});
		this.cookieAcceptEssentialButton.addEventListener("click", (event) => {
			event.preventDefault();
			this.setAllOptionalPermissions(false);
			this.cookieNoticeElement.classList.add("fully-hidden");
			this.cookieNoticeSuccessElement.classList.remove("fully-hidden");
			temporary_focus_default(this.cookieNoticeSuccessElement);
		});
		this.isInitialised = true;
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
	setAllOptionalPermissions(allow) {
		const cookiePermissions = Object.fromEntries(this.categories.map((category) => {
			return [category, category === "necessary" ? true : allow];
		}));
		for (const key in cookiePermissions) if (key === "necessary") cookiePermissions[key] = true;
		else cookiePermissions[key] = allow;
		this.storage.setCookie("necessary", "cookiePermissions", JSON.stringify(cookiePermissions), 365);
		this.storage.setCookie("necessary", "cookie-notification-acknowledged", "yes", 365);
	}
};
//#endregion
//#region src/components/date-picker/date-picker.ts
/**
* Date picker component
*
* @class DSDatePicker
* @extends DSComponent
* @property {HTMLElement} datePickerParent - the date picker parent element
* @property {HTMLButtonElement} calendarButtonElement - the calendar button element
* @property {HTMLInputElement} dateInput - the date input element
* @property {HTMLElement} dialogElement - the date picker dialog element
* @property {HTMLElement} dialogTitleElement - the date picker dialog title element
* @property {HTMLButtonElement} firstButtonInDialog - the first button in the date picker dialog
* @property {HTMLInputElement} inputElement - the main input element
* @property {HTMLButtonElement} lastButtonInDialog - the last button in the date picker dialog
* @property {HTMLInputElement} monthInput - the month input element
* @property {HTMLInputElement} yearInput - the year input element
* @property {boolean} isMultipleInput - whether the date picker uses multiple input fields
* @property {function} dateSelectCallback - callback function to be called when a date is selected
* @property {Date} currentDate - the currently selected date
* @property {Date[]} disabledDates - array of disabled dates
* @property {Date} inputDate - the date currently in the input field
* @property {Date} maxDate - the maximum selectable date
* @property {Date} minDate - the minimum selectable date
* @property {CalendarDayArgs[]} calendarDays - array of calendar day objects
* @property {string[]} dayLabels - array of day labels
* @property {string[]} monthLabels - array of month labels
* @property {object} icons - object containing SVG icon templates
*/
var DSDatePicker = class extends DSComponent {
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
		calendar_today: "<svg class=\"ds_icon\" xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 0 24 24\" width=\"24px\" fill=\"#000000\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z\"/></svg>",
		chevron_left: "<svg focusable=\"false\" class=\"ds_icon\" aria-hidden=\"true\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 0 24 24\" width=\"24px\" fill=\"#000000\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/></svg>",
		chevron_right: "<svg focusable=\"false\" class=\"ds_icon\" aria-hidden=\"true\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 0 24 24\" width=\"24px\" fill=\"#000000\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/></svg>",
		double_chevron_left: "<svg focusable=\"false\" class=\"ds_icon\" aria-hidden=\"true\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M19 16.6 17.6 18l-6-6 6-6L19 7.4 14.4 12l4.6 4.6Zm-6.6 0L11 18l-6-6 6-6 1.4 1.4L7.8 12l4.6 4.6Z\"/></svg>",
		double_chevron_right: "<svg focusable=\"false\" class=\"ds_icon\" aria-hidden=\"true\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M9.6 12 5 7.4 6.4 6l6 6-6 6L5 16.6 9.6 12Zm6.6 0-4.6-4.6L13 6l6 6-6 6-1.4-1.4 4.6-4.6Z\"/></svg>"
	};
	/**
	* Creates a date picker component
	*
	* @param {HTMLElement} el - the date picker element
	* @param {object} options - configuration options for the date picker
	*/
	constructor(el, options = {}) {
		super(el);
		if (!el) return;
		this.datePickerParent = el;
		this.options = Object.assign({ disabledDates: [] }, options);
		this.inputElement = this.datePickerParent.querySelector("input");
		this.isMultipleInput = el.classList.contains("ds_datepicker--multiple");
		this.dateInput = el.querySelector(".js-datepicker-date");
		this.monthInput = el.querySelector(".js-datepicker-month");
		this.yearInput = el.querySelector(".js-datepicker-year");
		this.currentDate = /* @__PURE__ */ new Date();
		this.currentDate.setHours(0, 0, 0, 0);
		this.calendarDays = [];
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
		if (!this.inputElement || this.isInitialised) return;
		this.setOptions();
		this.setMinAndMaxDatesOnCalendar();
		const calendarButtonTempContainer = document.createElement("div");
		calendarButtonTempContainer.innerHTML = this.buttonTemplate();
		this.calendarButtonElement = calendarButtonTempContainer.firstChild;
		this.calendarButtonElement.setAttribute("data-button", `datepicker-${this.inputElement.id}-toggle`);
		if (this.isMultipleInput) this.inputElement.parentElement?.parentElement?.appendChild(this.calendarButtonElement);
		else {
			this.inputElement.parentElement?.appendChild(this.calendarButtonElement);
			this.inputElement.parentElement?.classList.add("ds_input__wrapper--has-icon");
		}
		this.dialogElement = document.createElement("div");
		this.dialogElement.id = "datepicker-" + id_modifier_default();
		this.dialogElement.setAttribute("class", "ds_datepicker__dialog  datepickerDialog");
		this.dialogElement.setAttribute("role", "dialog");
		this.dialogElement.setAttribute("aria-modal", "true");
		this.dialogElement.innerHTML = this.dialogTemplate(this.dialogElement.id);
		this.calendarButtonElement.setAttribute("aria-controls", this.dialogElement.id);
		this.calendarButtonElement.setAttribute("aria-expanded", false.toString());
		this.datePickerParent.appendChild(this.dialogElement);
		this.dialogTitleElement = this.dialogElement.querySelector(".js-datepicker-month-year");
		const tbody = this.datePickerParent.querySelector("tbody");
		for (let i = 0; i < 6; i++) {
			const row = tbody.insertRow(i);
			for (let j = 0; j < 7; j++) {
				const cell = document.createElement("td");
				const dateButton = document.createElement("button");
				dateButton.type = "button";
				dateButton.dataset.form = "date-select";
				cell.appendChild(dateButton);
				row.appendChild(cell);
				const calendarDay = new DSCalendarDay(dateButton, this);
				calendarDay.init();
				this.calendarDays.push(calendarDay);
			}
		}
		const prevMonthButton = this.dialogElement.querySelector(".js-datepicker-prev-month");
		const prevYearButton = this.dialogElement.querySelector(".js-datepicker-prev-year");
		const nextMonthButton = this.dialogElement.querySelector(".js-datepicker-next-month");
		const nextYearButton = this.dialogElement.querySelector(".js-datepicker-next-year");
		prevMonthButton.addEventListener("click", (event) => this.focusPreviousMonth(event, false));
		prevYearButton.addEventListener("click", (event) => this.focusPreviousYear(event, false));
		nextMonthButton.addEventListener("click", (event) => this.focusNextMonth(event, false));
		nextYearButton.addEventListener("click", (event) => this.focusNextYear(event, false));
		[
			this.inputElement,
			this.dateInput,
			this.monthInput,
			this.yearInput
		].forEach((input) => {
			if (input) input.addEventListener("blur", () => {
				this.calendarButtonElement.querySelector("span").textContent = "Choose date";
			});
		});
		const cancelButton = this.dialogElement.querySelector(".js-datepicker-cancel");
		const okButton = this.dialogElement.querySelector(".js-datepicker-ok");
		cancelButton.addEventListener("click", (event) => {
			event.preventDefault();
			this.closeDialog();
		});
		okButton.addEventListener("click", () => this.selectDate(this.currentDate));
		const dialogButtons = this.dialogElement.querySelectorAll("button:not([disabled=\"true\"])");
		this.firstButtonInDialog = dialogButtons[0];
		this.lastButtonInDialog = dialogButtons[dialogButtons.length - 1];
		this.firstButtonInDialog.addEventListener("keydown", (event) => this.firstButtonKeyup(event));
		this.lastButtonInDialog.addEventListener("keydown", (event) => this.lastButtonKeyup(event));
		this.calendarButtonElement.addEventListener("click", (event) => this.toggleDialog(event));
		document.body.addEventListener("mouseup", (event) => this.backgroundClick(event));
		this.updateCalendar();
		this.isInitialised = true;
	}
	/**
	* Adds months to a date
	*
	* @param {Date} date - the date to add months to
	* @param {number} months - number of months to add (negative to subtract)
	* @returns {Date} - the new date after adding months
	*/
	addMonths(date, months) {
		const tempDate = date.getDate();
		date.setMonth(date.getMonth() + +months);
		if (date.getDate() !== tempDate) date.setDate(0);
		return date;
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
	dialogTemplate(id) {
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
      <caption id="${id}-caption" class="ds_datepicker__dialog__table-caption">You can use the cursor keys to select a date</caption>
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
	leadingZeroes(value, length = 2) {
		let ret = value.toString();
		while (ret.length < length) ret = "0" + ret.toString();
		return ret;
	}
	/**
	* Handle clicks outside the date picker dialog
	* - closes the dialog if open and the click is outside the dialog
	*
	* @param {MouseEvent} event
	* @returns {void}
	*/
	backgroundClick(event) {
		const target = event.target;
		if (this.isOpen() && !this.dialogElement.contains(target) && !this.inputElement.contains(target) && !this.calendarButtonElement.contains(target)) {
			event.preventDefault();
			this.closeDialog();
		}
	}
	/**
	* Close the date picker dialog
	* - sets aria-expanded to false on the calendar button
	* - focuses the calendar button
	*
	* @returns {void}
	*/
	closeDialog() {
		this.dialogElement.classList.remove("ds_datepicker__dialog--open");
		this.calendarButtonElement.setAttribute("aria-expanded", false.toString());
		this.calendarButtonElement.focus();
	}
	/**
	* Handles the keyup event on the first button in the dialog
	* - focuses the first button in the dialog if the Tab and Shift keys are pressed
	*
	* @param {KeyboardEvent} event
	* @returns {void}
	*/
	firstButtonKeyup(event) {
		if (event.key === "Tab" && event.shiftKey) {
			this.lastButtonInDialog.focus();
			event.preventDefault();
		}
	}
	/**
	* Focuses the next day in the calendar
	*
	* @param {Date} date
	* @returns {void}
	*/
	focusNextDay(date = new Date(this.currentDate)) {
		date.setDate(date.getDate() + 1);
		this.goToDate(date);
	}
	/**
	* Focuses the previous day in the calendar
	*
	* @param {Date} date
	* @returns {void}
	*/
	focusPreviousDay(date = new Date(this.currentDate)) {
		date.setDate(date.getDate() - 1);
		this.goToDate(date);
	}
	/**
	* Focuses the next week in the calendar
	*
	* @param {Date} date
	* @returns {void}
	*/
	focusNextWeek(date = new Date(this.currentDate)) {
		date.setDate(date.getDate() + 7);
		this.goToDate(date);
	}
	/**
	* Focuses the previous week in the calendar
	*
	* @param {Date} date
	* @returns {void}
	*/
	focusPreviousWeek(date = new Date(this.currentDate)) {
		date.setDate(date.getDate() - 7);
		this.goToDate(date);
	}
	/**
	* Focuses the first day of the week in the calendar
	*
	* @returns {void}
	*/
	focusFirstDayOfWeek() {
		const date = new Date(this.currentDate);
		date.setDate(date.getDate() - date.getDay());
		this.goToDate(date);
	}
	/**
	* Focuses the last day of the week in the calendar
	*
	* @returns {void}
	*/
	focusLastDayOfWeek() {
		const date = new Date(this.currentDate);
		date.setDate(date.getDate() - date.getDay() + 6);
		this.goToDate(date);
	}
	/**
	* Focuses the next month in the calendar
	*
	* @param {Event} event
	* @param {boolean} focus
	* @returns {void}
	*/
	focusNextMonth(event, focus = true) {
		event.preventDefault();
		const date = new Date(this.currentDate);
		this.addMonths(date, 1);
		this.goToDate(date, focus);
	}
	/**
	* Focuses the previous month in the calendar
	*
	* @param {Event} event
	* @param {boolean} focus
	* @returns {void}
	*/
	focusPreviousMonth(event, focus = true) {
		event.preventDefault();
		const date = new Date(this.currentDate);
		this.addMonths(date, -1);
		this.goToDate(date, focus);
	}
	/**
	* Focuses the next year in the calendar
	*
	* @param {Event} event
	* @param {boolean} focus
	* @returns {void}
	*/
	focusNextYear(event, focus = true) {
		event.preventDefault();
		const date = new Date(this.currentDate);
		date.setFullYear(date.getFullYear() + 1);
		this.goToDate(date, focus);
	}
	/**
	* Focuses the previous year in the calendar
	*
	* @param {Event} event
	* @param {boolean} focus
	* @returns {void}
	*/
	focusPreviousYear(event, focus = true) {
		event.preventDefault();
		const date = new Date(this.currentDate);
		date.setFullYear(date.getFullYear() - 1);
		this.goToDate(date, focus);
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
	formattedDateFromString(dateString, fallback = /* @__PURE__ */ new Date()) {
		let formattedDate = null;
		const parts = dateString.split("/");
		if (dateString.match(/\d{1,4}\/\d{1,2}\/\d{1,4}/)) switch (this.datePickerParent.dataset.dateformat) {
			case "YMD":
				formattedDate = /* @__PURE__ */ new Date(`${parts[1]}/${parts[2]}/${parts[0]}`);
				break;
			case "MDY":
				formattedDate = /* @__PURE__ */ new Date(`${parts[0]}/${parts[1]}/${parts[2]}`);
				break;
			default:
				formattedDate = /* @__PURE__ */ new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
				break;
		}
		if (formattedDate instanceof Date && !isNaN(formattedDate.getTime())) return formattedDate;
		else return fallback;
	}
	/**
	* Formats a date in a human-readable format
	*
	* @param {Date} date - The date to format
	* @returns {string} - The formatted date
	*/
	formattedDateHuman(date) {
		return `${this.dayLabels[date.getDay()]} ${date.getDate()} ${this.monthLabels[date.getMonth()]} ${date.getFullYear()}`;
	}
	/**
	* Go to a specific date in the calendar
	*
	* @param {Date} date - The date to go to
	* @param {boolean} focus - Whether to focus the date in the calendar
	* @returns {void}
	*/
	goToDate(date, focus) {
		const current = this.currentDate;
		this.currentDate = date;
		if (current.getMonth() !== this.currentDate.getMonth() || current.getFullYear() !== this.currentDate.getFullYear()) this.updateCalendar();
		this.setCurrentDate(focus);
	}
	/**
	* Check whether a date is disabled
	* - Checks if the date is before minDate or after maxDate
	* - Checks if the date is in the disabledDates array
	*
	* @param {Date} date - The date to check
	* @returns {boolean} - whether the date is disabled
	*/
	isDisabledDate(date) {
		let disabled = false;
		if (this.options.minDate && this.options.minDate > date) disabled = true;
		if (this.options.maxDate && this.options.maxDate < date) disabled = true;
		for (const disabledDate of this.options.disabledDates) if (date.toDateString() === disabledDate.toDateString()) disabled = true;
		return disabled;
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
	lastButtonKeyup(event) {
		if (event.key === "Tab" && !event.shiftKey) {
			this.firstButtonInDialog.focus();
			event.preventDefault();
		}
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
		this.dialogElement.classList.add("ds_datepicker__dialog--open");
		this.calendarButtonElement.setAttribute("aria-expanded", true.toString());
		let leftOffset;
		let dateAsString;
		if (this.isMultipleInput) {
			leftOffset = this.calendarButtonElement.offsetLeft + this.calendarButtonElement.offsetWidth + 16;
			dateAsString = `${this.dateInput.value}/${this.monthInput.value}/${this.yearInput.value}`;
		} else {
			leftOffset = this.inputElement.offsetWidth + 16;
			dateAsString = this.inputElement.value;
		}
		const dialogElementSpacingUnits = Math.ceil(leftOffset / 8);
		this.dialogElement.classList.forEach((className) => {
			if (className.match(/ds_!_off-l-/)) this.dialogElement.classList.remove(className);
		});
		this.dialogElement.classList.add(`ds_!_off-l-${dialogElementSpacingUnits}`);
		if (dateAsString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
			this.inputDate = this.formattedDateFromString(dateAsString);
			this.currentDate = this.inputDate;
		}
		this.updateCalendar();
		this.setCurrentDate();
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
	selectDate(date) {
		if (this.isDisabledDate(date)) return false;
		this.calendarButtonElement.querySelector("span").textContent = `Choose date. Selected date is ${this.formattedDateHuman(date)}`;
		this.setDate(date);
		const changeEvent = new Event("change");
		this.inputElement.dispatchEvent(changeEvent);
		if (this.options.dateSelectCallback) this.options.dateSelectCallback(date);
		this.closeDialog();
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
	setCurrentDate(focus = true) {
		const currentDate = this.currentDate;
		const filteredDays = this.calendarDays.filter((calendarDay) => calendarDay.button.classList.contains("fully-hidden") === false);
		filteredDays.forEach((calendarDay) => {
			calendarDay.button.setAttribute("tabindex", (-1).toString());
			calendarDay.button.classList.remove("ds_selected");
			const calendarDayDate = calendarDay.date;
			calendarDayDate.setHours(0, 0, 0, 0);
			const today = /* @__PURE__ */ new Date();
			today.setHours(0, 0, 0, 0);
			if (calendarDayDate.getTime() === currentDate.getTime() && !calendarDay.isDisabled) {
				if (focus) {
					calendarDay.button.setAttribute("tabindex", 0 .toString());
					calendarDay.button.focus();
					calendarDay.button.classList.add("ds_selected");
				}
			}
			if (this.inputDate && !this.isDisabledDate(this.inputDate) && calendarDayDate.getTime() === this.inputDate.getTime()) {
				calendarDay.button.classList.add("ds_datepicker__current");
				calendarDay.button.setAttribute("aria-description", "selected date");
			} else {
				calendarDay.button.classList.remove("ds_datepicker__current");
				calendarDay.button.removeAttribute("aria-description");
			}
			if (calendarDayDate.getTime() === today.getTime()) {
				calendarDay.button.classList.add("ds_datepicker__today");
				calendarDay.button.setAttribute("aria-current", "date");
			} else {
				calendarDay.button.classList.remove("ds_datepicker__today");
				calendarDay.button.removeAttribute("aria-current");
			}
		});
		if (!focus) {
			filteredDays[0].button.setAttribute("tabindex", 0 .toString());
			this.currentDate = filteredDays[0].date;
		}
	}
	/**
	* Sets the date in the input field(s)
	*
	* @param {Date} date - The date to set
	* @returns {void}
	*/
	setDate(date) {
		if (this.isMultipleInput) {
			this.dateInput.value = date.getDate().toString();
			this.monthInput.value = (date.getMonth() + 1).toString();
			this.yearInput.value = date.getFullYear().toString();
		} else {
			this.inputElement.value = `${this.leadingZeroes(date.getDate())}/${this.leadingZeroes(date.getMonth() + 1)}/${date.getFullYear()}`;
			switch (this.datePickerParent.dataset.dateformat) {
				case "YMD":
					this.inputElement.value = `${date.getFullYear()}/${this.leadingZeroes(date.getMonth() + 1)}/${this.leadingZeroes(date.getDate())}`;
					break;
				case "MDY":
					this.inputElement.value = `${this.leadingZeroes(date.getMonth() + 1)}/${this.leadingZeroes(date.getDate())}/${date.getFullYear()}`;
					break;
				default:
					this.inputElement.value = `${this.leadingZeroes(date.getDate())}/${this.leadingZeroes(date.getMonth() + 1)}/${date.getFullYear()}`;
					break;
			}
		}
	}
	/**
	* Sets the current date to be within the min and max date range
	*
	* @returns {void}
	*/
	setMinAndMaxDatesOnCalendar() {
		if (this.options.minDate && this.currentDate < this.options.minDate) this.currentDate = this.options.minDate;
		if (this.options.maxDate && this.currentDate > this.options.maxDate) this.currentDate = this.options.maxDate;
	}
	/**
	* Sets options for the date picker from both passed options and data attributes
	*
	* @returns {void}
	*/
	setOptions() {
		this.transformLegacyDataAttributes();
		if (!this.options.minDate && this.datePickerParent.dataset.mindate) this.options.minDate = this.formattedDateFromString(this.datePickerParent.dataset.mindate, null);
		if (!this.options.maxDate && this.datePickerParent.dataset.maxdate) this.options.maxDate = this.formattedDateFromString(this.datePickerParent.dataset.maxdate, null);
		if (!this.options.disabledDates?.length && this.datePickerParent.dataset.disableddates) this.options.disabledDates = this.datePickerParent.dataset.disableddates.replace(/\s+/, " ").split(" ").map((item) => this.formattedDateFromString(item)).filter((item) => item);
	}
	/**
	* Toggles the date picker dialog open or closed
	*
	* @param {Event} event - The event that triggered the toggle
	* @returns {void}
	*/
	toggleDialog(event) {
		event.preventDefault();
		if (this.isOpen()) this.closeDialog();
		else {
			this.setMinAndMaxDatesOnCalendar();
			this.openDialog();
		}
	}
	/**
	* Transforms legacy data attributes from the input element to the date picker parent element
	*
	* @returns {void}
	*/
	transformLegacyDataAttributes() {
		if (this.inputElement.dataset.mindate) this.datePickerParent.dataset.mindate = this.inputElement.dataset.mindate;
		if (this.inputElement.dataset.maxdate) this.datePickerParent.dataset.maxdate = this.inputElement.dataset.maxdate;
		if (this.inputElement.dataset.dateformat) this.datePickerParent.dataset.dateformat = this.inputElement.dataset.dateformat;
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
		this.dialogTitleElement.innerHTML = `${this.monthLabels[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
		this.dialogElement.setAttribute("aria-label", this.dialogTitleElement.innerHTML);
		const day = this.currentDate;
		const firstOfMonth = new Date(day.getFullYear(), day.getMonth(), 1);
		const dayOfWeek = firstOfMonth.getDay();
		firstOfMonth.setDate(firstOfMonth.getDate() - dayOfWeek);
		const thisDay = new Date(firstOfMonth);
		for (const element of this.calendarDays) {
			const isHidden = thisDay.getMonth() !== day.getMonth();
			let isDisabled = false;
			if (this.options.minDate && thisDay < this.options.minDate) isDisabled = true;
			if (this.options.maxDate && thisDay > this.options.maxDate) isDisabled = true;
			if (this.isDisabledDate(thisDay)) isDisabled = true;
			element.update(thisDay, isHidden, isDisabled);
			thisDay.setDate(thisDay.getDate() + 1);
		}
	}
};
/**
* Class representing a day button in the date picker calendar
*
* @class DSCalendarDay
* @property {HTMLButtonElement} button - The button element representing the day
* @property {number} column - Column index of the day button
* @property {Date} date - The date represented by the day button
* @property {number} index - Index of the day button in the calendar grid
* @property {number} row - Row index of the day button
* @property {DSDatePicker} picker - Parent date picker instance
*/
var DSCalendarDay = class {
	button;
	date;
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
	constructor(button, picker) {
		this.button = button;
		this.picker = picker;
		this.date = /* @__PURE__ */ new Date();
	}
	/**
	* Initializes the day button, attaching event listeners for click and keydown events
	*
	* @returns {void}
	*/
	init() {
		this.button.addEventListener("keydown", this.keyPress.bind(this));
		this.button.addEventListener("click", this.click.bind(this));
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
	update(day, isHidden, isDisabled) {
		this.date = new Date(day);
		this.button.innerHTML = day.getDate().toString();
		this.button.setAttribute("aria-label", this.picker.formattedDateHuman(this.date));
		if (isDisabled) this.button.setAttribute("aria-disabled", true.toString());
		else this.button.removeAttribute("aria-disabled");
		if (isHidden) this.button.classList.add("fully-hidden");
		else this.button.classList.remove("fully-hidden");
	}
	/**
	* Handler for mouse click on day buttons
	* - Selects the clicked date
	*
	* @param {MouseEvent} event
	* @returns {void}
	*/
	click(event) {
		this.picker.goToDate(this.date);
		this.picker.selectDate(this.date);
		event.stopPropagation();
		event.preventDefault();
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
	keyPress(event) {
		let calendarNavKey = true;
		switch (event.key) {
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
				if (event.shiftKey) this.picker.focusPreviousYear(event);
				else this.picker.focusPreviousMonth(event);
				break;
			case "PageDown":
				if (event.shiftKey) this.picker.focusNextYear(event);
				else this.picker.focusNextMonth(event);
				break;
			default:
				calendarNavKey = false;
				break;
		}
		if (calendarNavKey) {
			event.preventDefault();
			event.stopPropagation();
		}
	}
};
//#endregion
//#region src/components/details/details.ts
/**
* Details component
*
* @class Details
* @extends DSComponent
* @property {HTMLElement} content - the details content element
* @property {HTMLDetailsElement} details - the details element
* @property {HTMLElement} summary - the details summary element
* @property {'open' | 'data-open'} openAttribute - the attribute used to indicate open state
*/
var Details = class extends DSComponent {
	content;
	details;
	summary;
	openAttribute;
	/**
	* Creates a details component
	*
	* @param {HTMLDetailsElement} element - the details element
	*/
	constructor(element) {
		super(element);
		this.details = element;
		this.summary = element.querySelector(".ds_details__summary");
		this.content = element.querySelector(".ds_details__text");
		if (this.summary.nodeName === "SUMMARY") this.openAttribute = "open";
		else this.openAttribute = "data-open";
	}
	/**
	* Adds details-like open/close behaviour to non-native details components
	*
	* @returns {void}
	*/
	init() {
		if (typeof this.details.open !== "boolean") {
			this.polyfillAttributes();
			this.polyfillEvents();
		}
		this.isInitialised = true;
	}
	/**
	* Close the disclosure widget
	* - set aria attribute
	* - clear 'open' attribute
	*
	* @returns {void}
	*/
	closeDetails() {
		this.details.removeAttribute(this.openAttribute);
		this.summary.setAttribute("aria-expanded", "false");
	}
	/**
	* Open the disclosure widget
	* - set aria attribute
	* - set 'open' attribute
	*
	* @returns {void}
	*/
	openDetails() {
		this.details.setAttribute(this.openAttribute, "open");
		this.summary.setAttribute("aria-expanded", "true");
	}
	/**
	* Add role and attributes to a non-native disclosure widget
	*
	* @returns {void}
	*/
	polyfillAttributes() {
		this.content.id = this.content.id || `details-${id_modifier_default()}`;
		this.details.setAttribute("role", "group");
		this.summary.setAttribute("role", "button");
		this.summary.setAttribute("aria-controls", this.content.id);
		if (this.summary.nodeName === "SUMMARY") this.summary.tabIndex = 0;
		const isOpen = this.details.hasAttribute(this.openAttribute);
		this.summary.setAttribute("aria-expanded", isOpen.toString());
	}
	/**
	* Add mouse and keyboard events to trigger open/close of a non-native disclosure widget
	*
	* @returns {void}
	*/
	polyfillEvents() {
		this.summary.addEventListener("click", () => {
			this.setState();
		});
		this.summary.addEventListener("keypress", (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				this.setState();
			}
		});
		this.summary.addEventListener("keyup", (event) => {
			if (event.key === " ") event.preventDefault();
		});
	}
	/**
	* Open or close the disclosure widget based on the value of its 'open' attribute
	*
	* @returns {void}
	*/
	setState() {
		if (this.details.hasAttribute(this.openAttribute)) this.closeDetails();
		else this.openDetails();
	}
};
//#endregion
//#region src/components/file-upload/file-upload.ts
/**
* Heavily based on the GOVUK Design System file upload component
* https://design-system.service.gov.uk/components/file-upload/
*/
var defaultText = {
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
};
/**
* File upload component
*
* @class FileUpload
* @extends DSComponent
* @property {HTMLSpanElement} announcementsSpan
* @property {HTMLButtonElement} dropzoneButton
* @property {HTMLElement} element
* @property {HTMLInputElement} fileInputElement
* @property {HTMLSpanElement} statusSpan
* @property {TextArgs} text
*/
var FileUpload = class FileUpload extends DSComponent {
	announcementsSpan;
	dropzoneButton;
	element;
	fileInputElement;
	hasEnteredAnotherElement;
	statusSpan;
	text;
	static defaultText = defaultText;
	#statusText;
	constructor(element, options = {}) {
		super(element);
		this.element = element;
		this.fileInputElement = this.element.querySelector("input[type=\"file\"]");
		if (this.fileInputElement === null) throw new Error("File upload: input element not found");
		if (!this.fileInputElement.id) throw new Error("File upload: input element missing id");
		this.text = this.setText(options.text);
		this.transformMarkup();
		this.addEventListeners();
		this.updateDisabledState();
		this.observeDisabledState();
	}
	init() {
		this.isInitialised = true;
	}
	/**
	* Adds events to mimic/duplicate the native file input behaviour where needed
	* @returns {void}
	*/
	addEventListeners() {
		this.dropzoneButton.addEventListener("click", this.onClick.bind(this));
		this.dropzoneButton.addEventListener("dragover", (event) => {
			event.preventDefault();
		});
		this.dropzoneButton.addEventListener("drop", this.onDrop.bind(this));
		this.fileInputElement.addEventListener("input", this.onInput.bind(this));
		this.fileInputElement.addEventListener("change", this.onChange.bind(this));
		document.addEventListener("dragenter", this.updateDropzoneVisibility.bind(this));
		document.addEventListener("dragenter", () => {
			this.hasEnteredAnotherElement = true;
		});
		document.addEventListener("dragleave", () => {
			if (!this.hasEnteredAnotherElement && !this.dropzoneButton.disabled) {
				this.hideDraggingState();
				this.announcementsSpan.textContent = this.text.leftDropzone;
			}
			this.hasEnteredAnotherElement = false;
		});
	}
	/**
	* Checks the selected files against the `accept` attribute of the file input element
	* @param {FileList} files
	* @returns {boolean}
	*/
	canAccept(files) {
		let canAccept = true;
		if (!this.fileInputElement.accept) return true;
		const canAcceptFile = (file) => {
			let canAcceptFile = false;
			this.fileInputElement.accept.replace(" ", "").split(",").forEach((accept) => {
				if (accept.match(/^\.\w+/)) {
					const test = new RegExp(accept + "$");
					if (file.name.match(test)) canAcceptFile = true;
				} else if (accept.match(/\w+\/\w.+/)) {
					if (file.type === accept) canAcceptFile = true;
				} else if (accept.match(/audio|image|video\/*/)) {
					if (file.type.match(new RegExp(accept.replace("*", ".+")))) canAcceptFile = true;
				}
			});
			return canAcceptFile;
		};
		[].slice.call(files).forEach((file) => {
			if (!canAcceptFile(file)) canAccept = false;
		});
		return canAccept;
	}
	/**
	* Check whether the content of what is being dragged can be dropped onto the file input
	* @param {DataTransfer} dataTransfer
	* @returns {boolean}
	*/
	canDrop(dataTransfer) {
		if (dataTransfer.items?.length) return this.matchesInputCapacity(this.countFileItems(dataTransfer.items));
		if (dataTransfer.types?.length) return dataTransfer.types.includes("Files");
		return true;
	}
	/**
	* Confirms that the provided dataTransfer can fill the input
	* e.g. reject multiple files in a non-multiple input
	* @param {DataTransfer} dataTransfer
	* @returns {boolean}
	*/
	canFillInput(dataTransfer) {
		return this.matchesInputCapacity(dataTransfer.files.length);
	}
	/**
	* Returns the number of DataTransferItems that have the "file" type/kind
	* @param {DataTransferItemList} list
	* @returns {number}
	*/
	countFileItems(list) {
		return [].slice.call(list).filter((item) => item.kind === "file").length;
	}
	/**
	* Unsets the dragging CSS class on the drop zone
	* @returns {void}
	*/
	hideDraggingState() {
		this.dropzoneButton.classList.remove("ds_file-upload__dropzone--dragging");
	}
	/**
	* Check that the number of files to be added matches the number allowed
	* (i.e. a single file for a non-multple input, or more than one if it's a 'multiple' input)
	* @param {number} numberOfFiles
	* @returns {boolean}
	*/
	matchesInputCapacity(numberOfFiles) {
		if (this.fileInputElement.multiple) return numberOfFiles > 0;
		return numberOfFiles === 1;
	}
	/**
	* Watch for changes to the disabled state of the underlying input element.
	* Keep the replacement element's disabled state in sync.
	* @returns {void}
	*/
	observeDisabledState() {
		new MutationObserver((mutationList) => {
			for (const mutation of mutationList) if (mutation.type === "attributes" && mutation.attributeName === "disabled") this.updateDisabledState();
		}).observe(this.fileInputElement, { attributes: true });
	}
	/**
	* A custom event to pass file data to the tracking script
	* @returns {void}
	*/
	onChange() {
		const fileList = this.fileInputElement.files;
		const changeHappened = new CustomEvent("changeHappened", {
			bubbles: true,
			composed: true,
			detail: {
				canFill: true,
				canAccept: true,
				files: fileList
			}
		});
		this.element.dispatchEvent(changeHappened);
	}
	/**
	* A click on the button triggers a click on the actual (hidden) file input
	* @returns {void}
	*/
	onClick() {
		this.fileInputElement.click();
	}
	/**
	* Put dragged files onto the file input element
	* Update component state
	* @param {DragEvent} event
	* @returns {void}
	*/
	onDrop(event) {
		event.preventDefault();
		if (event.dataTransfer && this.canAccept(event.dataTransfer.files) && this.canFillInput(event.dataTransfer)) {
			this.setFilesOnFileInputElement(event.dataTransfer.files);
			this.hideDraggingState();
		}
		this.announcementsSpan.textContent = "";
		if (event.dataTransfer) {
			const dropHappened = new CustomEvent("dropHappened", {
				bubbles: true,
				composed: true,
				detail: {
					files: event.dataTransfer.files,
					canAccept: this.canAccept(event.dataTransfer.files),
					canFill: this.canFillInput(event.dataTransfer)
				}
			});
			this.element.dispatchEvent(dropHappened);
		}
	}
	/**
	* Update the component with the current state of the file input
	* - update instruction message
	* - update the status message
	* - update CSS class on root element
	* @returns {void}
	*/
	onInput() {
		const fileList = this.fileInputElement.files;
		if (fileList.length === 0) {
			this.#statusText = this.text.defaultStatusText;
			this.element.classList.remove("ds_file-upload--has-files");
		} else {
			if (fileList.length === 1) this.#statusText = fileList[0].name;
			else this.#statusText = this.text.filesAddedText.replace("$NUMBER", fileList.length.toString());
			this.element.classList.add("ds_file-upload--has-files");
		}
		this.statusSpan.textContent = this.#statusText;
	}
	/**
	* Sets the files attribute on the file input element from a provided file list
	* Fires an 'input' event on the file input element
	* @param {FileList} files
	* @returns {void}
	*/
	setFilesOnFileInputElement(files) {
		this.fileInputElement.files = files;
		this.fileInputElement.dispatchEvent(new CustomEvent("input"));
	}
	/**
	* Sets the text used on parts of the file upload
	* - extends the default set of text with any alterations specified in component options
	* - sets pluralisation based on the file input's 'multiple' attribute
	* - freezes the resulting text to prevent further modification
	* @param extension
	* @returns {TextArgs}
	*/
	setText(extension = {}) {
		const extendedText = Object.assign(FileUpload.defaultText, extension);
		return Object.freeze({
			buttonText: this.fileInputElement.multiple ? extendedText.buttonTextPlural : extendedText.buttonText,
			defaultStatusText: this.fileInputElement.multiple ? extendedText.defaultStatusTextPlural : extendedText.defaultStatusText,
			enteredDropzone: extendedText.enteredDropzone,
			filesAddedText: extendedText.filesAddedText,
			filesListHeading: extendedText.filesListHeading,
			instructionText: this.fileInputElement.multiple ? extendedText.instructionTextPlural : extendedText.instructionText,
			leftDropzone: extendedText.leftDropzone
		});
	}
	/**
	* Sets the dragging CSS class on the drop zone
	* @returns {void}
	*/
	showDraggingState() {
		this.dropzoneButton.classList.add("ds_file-upload__dropzone--dragging");
	}
	/**
	* Transforms the native file input element to aset of elements we have more control over
	* - adds a visually hidden span for screen reader status updates
	* - adds a visible span for status text
	* - adds a visible span for instructional text so we're not using browser defaults
	* - adds a fake button with DS button styling for the "choose file" button
	*     with text that is not dependant on browser default
	* - hides the original file input but keeps it available for us to use its native
	*     behavior where needed
	* @returns {void}
	*/
	transformMarkup() {
		const label = this.element.querySelector(`[for="${this.fileInputElement.id}"]`);
		label.id = label.id || this.fileInputElement.id + "-label";
		this.fileInputElement.setAttribute("aria-hidden", "true");
		this.fileInputElement.setAttribute("hidden", "true");
		this.fileInputElement.setAttribute("tabindex", "-1");
		this.dropzoneButton = document.createElement("button");
		this.dropzoneButton.classList.add("ds_file-upload__dropzone");
		this.dropzoneButton.type = "button";
		this.dropzoneButton.id = this.fileInputElement.id + "-dropzone";
		if (this.fileInputElement.getAttribute("aria-describedby")) this.dropzoneButton.setAttribute("aria-describedby", this.fileInputElement.getAttribute("aria-describedby"));
		if (this.fileInputElement.getAttribute("aria-invalid")) this.dropzoneButton.setAttribute("aria-invalid", this.fileInputElement.getAttribute("aria-invalid"));
		if (this.fileInputElement.classList.contains("ds_file-upload__input--error")) this.dropzoneButton.classList.add("ds_file-upload__dropzone--error");
		this.statusSpan = document.createElement("span");
		this.statusSpan.classList.add("ds_file-upload__status");
		this.statusSpan.textContent = this.text.defaultStatusText;
		this.statusSpan.id = `${this.fileInputElement.id}-status`;
		this.statusSpan.setAttribute("aria-live", "polite");
		const commaSpan = document.createElement("span");
		commaSpan.className = "visually-hidden";
		commaSpan.textContent = ", ";
		commaSpan.id = `${this.fileInputElement.id}-comma`;
		const containerSpan = document.createElement("span");
		containerSpan.classList.add("ds_file-upload__button-container");
		const pseudoButtonSpan = document.createElement("span");
		pseudoButtonSpan.classList.add("ds_file-upload__button");
		pseudoButtonSpan.textContent = this.text.buttonText;
		const instructionSpan = document.createElement("span");
		instructionSpan.classList.add("ds_file-upload__instruction");
		instructionSpan.textContent = this.text.instructionText;
		instructionSpan.id = `${this.fileInputElement.id}-instruction`;
		this.announcementsSpan = document.createElement("span");
		this.announcementsSpan.classList.add("visually-hidden");
		this.announcementsSpan.setAttribute("aria-live", "assertive");
		containerSpan.appendChild(pseudoButtonSpan);
		containerSpan.insertAdjacentText("beforeend", " ");
		containerSpan.appendChild(instructionSpan);
		this.dropzoneButton.appendChild(this.statusSpan);
		this.dropzoneButton.appendChild(commaSpan);
		this.dropzoneButton.appendChild(containerSpan);
		this.dropzoneButton.setAttribute("aria-labelledby", `${label.id} ${commaSpan.id} ${this.dropzoneButton.id}`);
		this.fileInputElement.insertAdjacentElement("beforebegin", this.dropzoneButton);
		this.element.insertAdjacentElement("afterend", this.announcementsSpan);
	}
	/**
	* Synchronise the `disabled` state between the input and replacement button.
	* @returns {void}
	*/
	updateDisabledState() {
		this.dropzoneButton.disabled = this.fileInputElement.disabled;
	}
	/**
	* In response to drag events:
	*  - updates the content/display of the drop zone pseudo button
	*  - updates the text content of the visually hidden announcements span
	* @param {DragEvent} event
	* @returns {void}
	*/
	updateDropzoneVisibility(event) {
		if (this.dropzoneButton.disabled) return;
		if (this.dropzoneButton.contains(event.target)) {
			if (event.dataTransfer && this.canDrop(event.dataTransfer) && !this.dropzoneButton.classList.contains("ds_file-upload__dropzone--dragging")) {
				this.showDraggingState();
				this.announcementsSpan.textContent = this.text.enteredDropzone;
			}
		} else {
			this.hideDraggingState();
			this.announcementsSpan.textContent = this.text.leftDropzone;
		}
	}
};
//#endregion
//#region src/components/hide-this-page/hide-this-page.ts
/**
* Hide this page component
*
* @class HidePage
* @extends DSComponent
* @property {string} altlink - the alternative link to navigate to
* @property {HTMLAnchorElement} button - the hide page button element
* @property {Window} window - the window object
*/
var HidePage = class extends DSComponent {
	altlink;
	button;
	window;
	/**
	* Creates a hide page component
	*
	* @param {HTMLElement} element - the hide page element
	* @param {Window} _window - the window object
	*/
	constructor(element, _window = window) {
		const button = element.querySelector(".js-hide-page");
		super(button);
		this.button = button;
		this.window = _window;
		this.altlink = this.button?.dataset.altlink || "https://www.google.com";
	}
	/**
	* Attach event listeners to the hide page button
	*
	* @returns {void}
	*/
	init() {
		if (!this.button) return;
		this.attachKeyboardEvents();
		this.attachMouseEvents();
		this.isInitialised = true;
	}
	/**
	* Add keyboard events
	* - hide page on 'esc'
	*
	* @returns {void}
	*/
	attachKeyboardEvents() {
		document.addEventListener("keyup", (event) => {
			if (event.key === "Escape") this.doHidePage(event);
		});
	}
	/**
	* Add mouse events
	* - hide page on click
	*
	* @returns {void}
	*/
	attachMouseEvents() {
		this.button.addEventListener("click", (event) => {
			this.doHidePage(event);
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
	doHidePage(event) {
		event.preventDefault();
		document.body.innerHTML = "";
		document.title = ".";
		this.window.open(this.button.href, "_newtab");
		this.window.location.replace(this.altlink);
	}
};
//#endregion
//#region src/components/notification-banner/notification-banner.ts
/**
* Notification banner component
*
* @class Notification
* @extends DSComponent
* @property {HTMLElement} notification - the notification element
* @property {HTMLElement} notificationClose - the notification close button element
*/
var Notification = class extends DSComponent {
	notification;
	notificationClose;
	/**
	* Creates a notification component
	*
	* @param {HTMLElement} notification - the notification element
	*/
	constructor(notification) {
		super(notification);
		this.notification = notification;
		this.notificationClose = notification.querySelector(".js-close-notification");
	}
	/**
	* Add event listener to the close button
	*
	* @returns {void}
	*/
	init() {
		if (this.notificationClose) this.notificationClose.addEventListener("click", () => {
			this.notification.parentNode?.removeChild(this.notification);
		});
		this.isInitialised = true;
	}
};
//#endregion
//#region src/components/notification-message/notification-message.ts
/**
* Notification message component
*
* @class NotificationMessage
* @extends DSComponent
* @property {HTMLElement} notificationMessage - the notification message element
* @property {HTMLElement} notificationMessageClose - the notification message close button element
*/
var NotificationMessage = class extends DSComponent {
	notificationMessage;
	notificationMessageClose;
	/**
	* Creates a notification component
	*
	* @param {HTMLElement} notificationMessage - the notification element
	*/
	constructor(notificationMessage) {
		super(notificationMessage);
		this.notificationMessage = notificationMessage;
		this.notificationMessageClose = notificationMessage.querySelector(".js-close-notification-message");
	}
	/**
	* Add event listener to the close button
	*
	* @returns {void}
	*/
	init() {
		if (this.notificationMessageClose) this.notificationMessageClose.addEventListener("click", () => {
			this.notificationMessage.parentNode?.removeChild(this.notificationMessage);
		});
		this.isInitialised = true;
	}
};
//#endregion
//#region src/components/side-navigation/side-navigation.ts
/**
* Side navigation component
*
* @class SideNavigation
* @extends DSComponent
* @property {HTMLElement} sideNavigation - the side navigation element
*/
var SideNavigation = class extends DSComponent {
	sideNavigation;
	/**
	* Creates a side navigation component
	*
	* @param {HTMLElement} sideNavigation - the side navigation element
	*/
	constructor(sideNavigation) {
		super(sideNavigation);
		this.sideNavigation = sideNavigation;
	}
	/**
	* Set up the side nav if one has been provided to the constructor
	*
	* @returns {void}
	*/
	init() {
		if (this.sideNavigation && !this.isInitialised) {
			this.setupSideNavigation();
			this.isInitialised = true;
		}
	}
	/**
	* Perform DOM transformation on the side nav
	* - add aria attributes to new markup
	* - add event listener to new markup
	*
	* @returns {void}
	*/
	setupSideNavigation() {
		const navControl = this.sideNavigation.querySelector(".js-toggle-side-navigation");
		const navLabel = this.sideNavigation.querySelector(".ds_side-navigation__expand");
		const navList = this.sideNavigation.querySelector(".ds_side-navigation__list");
		navList.id = navList.id || `side-navigation-${id_modifier_default()}`;
		navControl.checked = false;
		const navButton = document.createElement("button");
		navButton.classList.add("ds_side-navigation__expand");
		navButton.classList.add("ds_link");
		navButton.classList.add("js-side-navigation-button");
		navButton.setAttribute("aria-expanded", false.toString());
		navButton.innerHTML = navLabel.innerHTML;
		navButton.setAttribute("aria-expanded", false.toString());
		navButton.setAttribute("aria-controls", navList.id);
		navLabel.classList.add("fully-hidden");
		navControl.classList.add("fully-hidden");
		navControl.classList.remove("visually-hidden");
		this.sideNavigation.insertBefore(navButton, navList);
		navButton.setAttribute("aria-controls", navList.id);
		navButton.addEventListener("click", () => {
			const isOpen = navControl.checked;
			navButton.setAttribute("aria-expanded", (!isOpen).toString());
			navControl.checked = !isOpen;
		});
		window.addEventListener("scroll", () => {
			if (navButton.offsetTop >= 1) navButton.classList.add("ds_side-navigation__expand--shadow");
			else navButton.classList.remove("ds_side-navigation__expand--shadow");
		});
	}
};
//#endregion
//#region src/components/site-navigation/site-navigation.ts
/**
* Mobile menu component
*
* @class MobileMenu
* @extends DSComponent
* @property {HTMLElement} mobileMenu - the mobile menu element
* @property {HTMLButtonElement} newMenuButton - the new mobile menu button
*/
var MobileMenu = class extends DSComponent {
	mobileMenu;
	newMenuButton;
	/**
	* Creates a mobile menu component
	*
	* @param {HTMLElement} mobileMenu - the mobile menu element
	*/
	constructor(mobileMenu) {
		super(mobileMenu);
		this.mobileMenu = mobileMenu;
		this.newMenuButton = document.createElement("button");
	}
	/**
	* Set up the mobile menu if one has been provided to the constructor
	*
	* @returns {void}
	*/
	init() {
		if (this.mobileMenu) {
			this.setupMobileNavigation();
			this.isInitialised = true;
		}
	}
	/**
	* Perform DOM transformation on the mobile nav
	* - add aria attributes to new markup
	* - add event listener to new markup
	*
	* @returns {void}
	*/
	setupMobileNavigation() {
		const oldMenuButton = document.querySelector(".js-toggle-menu");
		this.newMenuButton.innerHTML = oldMenuButton.innerHTML;
		this.newMenuButton.setAttribute("class", oldMenuButton.getAttribute("class"));
		this.newMenuButton.classList.add("ds_link");
		this.newMenuButton.setAttribute("aria-controls", oldMenuButton.getAttribute("aria-controls"));
		this.newMenuButton.setAttribute("aria-expanded", false.toString());
		oldMenuButton.parentNode?.appendChild(this.newMenuButton);
		oldMenuButton.classList.add("fully-hidden");
		this.newMenuButton.addEventListener("click", (event) => {
			event.preventDefault();
			this.mobileMenu = document.getElementById(this.newMenuButton.getAttribute("aria-controls"));
			if (this.mobileMenu.classList.contains("ds_site-navigation--open")) this.closeMenu();
			else this.openMenu();
		});
	}
	/**
	* Open the site nav menu
	*
	* @returns {void}
	*/
	openMenu() {
		this.mobileMenu.classList.add("ds_site-navigation--open");
		this.newMenuButton.classList.add("ds_site-header__control--active");
		this.newMenuButton.setAttribute("aria-expanded", true.toString());
	}
	/**
	* Close the site nav menu
	*
	* @returns {void}
	*/
	closeMenu() {
		this.mobileMenu.classList.remove("ds_site-navigation--open");
		this.newMenuButton.classList.remove("ds_site-header__control--active");
		this.newMenuButton.setAttribute("aria-expanded", false.toString());
	}
};
//#endregion
//#region src/components/skip-links/skip-links.ts
/**
* Skip links component
*/
var skipLinks = { 
/**
* Initialise skip links
* - adds click event to skip links to focus target element
*
* @returns {void}
*/
init() {
	[].slice.call(document.querySelectorAll(".ds_skip-links__link")).forEach((link) => {
		link.addEventListener("click", () => {
			const linkTarget = document.querySelector(link.getAttribute("href"));
			if (linkTarget) temporary_focus_default(linkTarget);
		});
	});
} };
//#endregion
//#region src/components/step-navigation/step-navigation.ts
/**
* Step navigation component
*
* @class StepNavigation
* @extends DSComponent
* @property {HTMLElement} container - the step navigation container element
* @property {Window} window - the window object
*/
var StepNavigation = class extends DSComponent {
	container;
	window;
	/**
	* Creates a step navigation component
	*
	* @param {HTMLElement} container - the step navigation container element
	* @param _window - the window object
	*/
	constructor(container, _window = window) {
		super(container);
		this.container = container;
		this.window = _window;
	}
	/**
	* Initialise step navigation
	* - adds current link class to link matching current URL
	*
	* @returns {void}
	*/
	init() {
		this.container.querySelectorAll(".ds_accordion-item__body a").forEach((link) => {
			if (link.href === this.window.location.origin + this.window.location.pathname) link.classList.add("ds_step-navigation__current-link");
		});
		this.isInitialised = true;
	}
};
//#endregion
//#region src/components/table/table.ts
/**
* Mobile table component
*
* @class MobileTable
* @extends DSComponent
* @property {HTMLTableElement} element - the table element
* @property {Window} window - the window object
*/
var MobileTable = class extends DSComponent {
	element;
	window;
	/**
	* Creates a mobile table component
	*
	* @param {HTMLTableElement} element - the table element
	* @param _window - the window object
	*/
	constructor(element, _window = window) {
		super(element);
		this.element = element;
		this.window = _window;
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
		if (this.element.dataset.smallscreen === "scrolling") {
			this.checkScrollingTable();
			this.window.addEventListener("resize", () => {
				this.checkScrollingTable();
			});
			this.isInitialised = true;
		} else if (this.element.dataset.smallscreen === "boxes") {
			this.setupBoxesTable();
			this.isInitialised = true;
		}
	}
	/**
	* Check if table is wider than its container and add scrolling class if so
	*
	* @returns {void}
	*/
	checkScrollingTable() {
		const tableBodyElement = this.element.querySelector("tbody");
		const tableParentElement = this.element.parentElement;
		if (tableParentElement && tableBodyElement.offsetWidth > tableParentElement.offsetWidth) this.element.classList.add("js-is-scrolling");
		else this.element.classList.remove("js-is-scrolling");
	}
	/**
	* Setup boxes table
	* - adds data-heading attributes to each td based on the relevant th in the header row
	*
	* @returns {void}
	*/
	setupBoxesTable() {
		const trs = this.element.querySelectorAll("tr");
		let headerRow;
		if ([].slice.call(trs[0].cells).filter((cell) => cell.tagName === "TH").length === trs[0].cells.length) headerRow = trs[0];
		if (headerRow) for (let j = 1, jl = trs.length; j < jl; j++) [].slice.call(trs[j].cells).forEach((td, index) => {
			td.setAttribute("data-heading", headerRow.cells[index].textContent);
		});
	}
};
/**
* Mobile tables component (legacy)
*
* @class MobileTables
* @extends DSComponent
* @property {Window} window - the window object
*/
var MobileTables = class {
	window;
	constructor(_window = window) {
		this.window = _window;
	}
	/**
	* Initialise all mobile tables on the page
	* - finds all tables with data-smallscreen attribute
	* - initialises each MobileTable instance
	*
	* @returns {void}
	*/
	init() {
		document.querySelectorAll("table[data-smallscreen]").forEach((table) => new MobileTable(table, this.window).init());
	}
};
//#endregion
//#region src/components/tabs/tabs.ts
/**
* Tabs component
*
* @class Tabs
* @extends DSComponent
* @property {HTMLElement} tabContainer - the tab container element
* @property {HTMLElement[]} tabContents - the tab content elements
* @property {HTMLElement[]} tabHeaders - the tab header elements
* @property {HTMLElement} tabList - the tab list element
* @property {boolean} hasAutomaticActivation - whether tabs activate automatically on focus
* @property {boolean} hasEventsEnabled - whether event listeners have been added
* @property {number} resizeTimer - timer for debouncing resize events
*/
var Tabs = class extends DSComponent {
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
	constructor(tabContainer) {
		super(tabContainer);
		this.resizeTimer = 0;
		this.hasEventsEnabled = false;
		this.hasAutomaticActivation = !tabContainer.classList.contains("ds_tabs--manual");
		this.tabContainer = tabContainer;
		this.tabList = tabContainer.querySelector(".ds_tabs__list");
		this.tabHeaders = [].slice.call(tabContainer.querySelectorAll(".ds_tabs__tab"));
		this.tabContents = [].slice.call(tabContainer.querySelectorAll(".ds_tabs__content"));
		this.boundOnHashChange = this.onHashChange.bind(this);
		window.addEventListener("hashchange", this.boundOnHashChange, true);
		this.boundOnResize = this.onResize.bind(this);
		window.addEventListener("resize", this.boundOnResize, true);
	}
	/**
	* Initialise tabs if medium size or larger
	*
	* @returns {void}
	*/
	init() {
		if (breakpoint_check_default("medium")) {
			this.set();
			this.hasEventsEnabled = true;
		}
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
			this.tabList.setAttribute("role", "tablist");
			this.tabHeaders.forEach((tabHeader, index) => this.initTab(tabHeader, index));
			this.tabContents.forEach((item) => {
				item.setAttribute("tabindex", "0");
				item.setAttribute("role", "tabpanel");
			});
			const currentTab = (this.getTab(window.location.hash) || this.tabHeaders[0].querySelector(".ds_tabs__tab-link")).parentElement;
			this.goToTab(currentTab);
			this.isInitialised = true;
		}
	}
	/**
	* Reset tabs to original state
	* - removes roles and attributes
	*
	* @returns {void}
	*/
	reset() {
		if (this.isInitialised) {
			this.isInitialised = false;
			this.tabList.removeAttribute("role");
			this.tabHeaders.forEach((tabHeader, index) => this.resetTab(tabHeader, index));
			this.tabContents.forEach((item) => {
				item.removeAttribute("tabindex");
				item.removeAttribute("role");
			});
		}
	}
	/**
	* Runs when the browser is resized - includes debounce to prevent multiple calls in quick succession
	*
	* @returns {void}
	*/
	onResize() {
		clearTimeout(this.resizeTimer);
		this.resizeTimer = window.setTimeout(() => {
			if (breakpoint_check_default("medium")) this.set();
			else this.reset();
		}, 150);
	}
	/**
	* Runs when the hash value in the browser changes
	* - navigates to the tab matching the hash value
	*
	* @returns {void}
	*/
	onHashChange() {
		const tabWithHashLink = this.getTab(window.location.hash);
		if (!tabWithHashLink) return;
		const tabWithHash = tabWithHashLink.parentElement;
		if (breakpoint_check_default("medium")) {
			this.goToTab(tabWithHash);
			tabWithHash.querySelector(".ds_tabs__tab-link").focus();
		}
	}
	/**
	* Add the specified tab to the browser history
	* - adds the tab's href to the browser history
	*
	* @param {HTMLElement} tab - The tab to add to the browser history
	* @returns {void}
	*/
	createHistoryEntry(tab) {
		const tabId = this.getHref(tab);
		history.pushState(null, "", tabId);
	}
	/**
	* Reset tab back to original state
	* - removes roles and attributes
	*
	* @param {HTMLElement} tabHeader - The tab header element
	* @param {number} index - The index of the tab
	* @returns {void}
	*/
	resetTab(tabHeader, index) {
		tabHeader.removeAttribute("role");
		tabHeader.classList.remove("ds_current");
		const tabLink = tabHeader.querySelector(".ds_tabs__tab-link");
		const tabContent = this.tabContents[index];
		tabLink.removeAttribute("role");
		tabLink.removeAttribute("aria-controls");
		tabLink.removeAttribute("aria-selected");
		tabLink.removeAttribute("tabindex");
		tabContent.classList.remove("ds_tabs__content--hidden");
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
	initTab(tabHeader, index) {
		tabHeader.setAttribute("role", "presentation");
		const tabLink = tabHeader.querySelector(".ds_tabs__tab-link");
		const tabContent = this.tabContents[index];
		const tabId = tabContent.getAttribute("id");
		tabLink.setAttribute("role", "tab");
		tabLink.setAttribute("aria-controls", tabId);
		tabLink.setAttribute("aria-selected", "false");
		tabLink.setAttribute("tabindex", "-1");
		tabContent.classList.add("ds_tabs__content--hidden");
		if (!this.hasEventsEnabled) {
			tabLink.addEventListener("click", (event) => {
				if (breakpoint_check_default("medium")) {
					event.preventDefault();
					this.goToTab(tabHeader, true);
				}
			});
			tabLink.addEventListener("keydown", (event) => {
				if (breakpoint_check_default("medium")) {
					const tab = event.target.parentElement;
					let tabNavKey = true;
					if (event.key === "ArrowRight") this.navToTab(this.getNextTab(tab));
					else if (event.key === "ArrowLeft") this.navToTab(this.getPreviousTab(tab));
					else if (event.key === "Home") this.navToTab(this.getFirstTab());
					else if (event.key === "End") this.navToTab(this.getLastTab());
					else if (event.key === "Spacebar" || event.key === " ") this.goToTab(tab, true);
					else tabNavKey = false;
					if (tabNavKey) event.preventDefault();
				}
			});
		}
	}
	/**
	* Navigates to the specified tab
	* - focuses the tab
	* - activates the tab if automatic activation is enabled
	*
	* @param {HTMLElement} tab - The tab to navigate to
	* @returns {void}
	*/
	navToTab(tab) {
		tab.querySelector(".ds_tabs__tab-link").focus();
		if (this.hasAutomaticActivation) this.goToTab(tab, true);
	}
	/**
	* Returns the next tab
	*
	* @param {HTMLElement} currentTab - The current tab
	* @returns {HTMLElement} - The next tab
	*/
	getNextTab(currentTab) {
		return currentTab.nextElementSibling || this.getFirstTab();
	}
	/**
	* Returns the previous tab
	*
	* @param {HTMLElement} currentTab - The current tab
	* @returns {HTMLElement} - The previous tab
	*/
	getPreviousTab(currentTab) {
		return currentTab.previousElementSibling || this.getLastTab();
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
	goToTab(targetTab, updateHistory = false) {
		const oldTab = this.getCurrentTab();
		if (oldTab === targetTab) return;
		const targetTabLink = targetTab.querySelector(".ds_tabs__tab-link");
		const targetTabContent = this.getTabContent(targetTab);
		targetTab.classList.add("ds_current");
		targetTabLink.setAttribute("aria-selected", true.toString());
		targetTabLink.setAttribute("tabindex", "0");
		targetTabContent.classList.remove("ds_tabs__content--hidden");
		this.deactivateTab(oldTab);
		if (updateHistory) this.createHistoryEntry(targetTab);
	}
	/**
	* Deactivate the specified tab
	* - removes active classes and hides content
	* - sets aria attributes
	*
	* @param {HTMLElement} targetTab - The tab to deactivate
	* @returns {void}
	*/
	deactivateTab(targetTab) {
		if (!targetTab) return;
		const targetTabLink = targetTab.querySelector(".ds_tabs__tab-link");
		const targetTabContent = this.getTabContent(targetTab);
		targetTab.classList.remove("ds_current");
		targetTabLink.setAttribute("aria-selected", false.toString());
		targetTabLink.setAttribute("tabindex", "-1");
		targetTabContent.classList.add("ds_tabs__content--hidden");
	}
	/**
	* Returns the tab which matches the specified hash value
	*
	* @param {string} hash - The hash value to match
	* @returns {HTMLElement} - The matching tab element
	*/
	getTab(hash) {
		return this.tabContainer.querySelector(".ds_tabs__tab-link[href=\"" + hash + "\"]");
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
	getHref(tab) {
		const href = tab.querySelector(".ds_tabs__tab-link").href;
		return href.slice(href.indexOf("#"), href.length);
	}
	/**
	* Returns the content element for the specified tab
	*
	* @param {HTMLElement} tab - The tab element
	* @returns {HTMLElement} - The content element for the specified tab
	*/
	getTabContent(tab) {
		return this.tabContainer.querySelector(this.getHref(tab));
	}
};
//#endregion
//#region src/components/tabs/tabs-navigation.ts
/**
* Tabs navigation component
*
* @class TabsNavigation
* @extends DSComponent
* @property {HTMLElement} tabContainer - the tab container element
* @property {HTMLElement} tabList - the list containing the tabs
* @property {HTMLElement} tabNavigation - the tab navigation
* @property {HTMLElement} tabTitle - the tab navigation title
* @property {Function} breakpointCheck - the breakpoint check function
* @property {number} [resizeTimer] - the resize timer
* @property {Function} boundOnResize - the bound on resize function
*/
var TabsNavigation = class extends DSComponent {
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
	constructor(tabContainer, _breakpointCheck = breakpoint_check_default) {
		super(tabContainer);
		this.breakpointCheck = _breakpointCheck;
		this.resizeTimer = 0;
		this.tabContainer = tabContainer;
		this.tabList = tabContainer.querySelector(".ds_tabs__list");
		this.tabNavigation = tabContainer.querySelector(".ds_tabs__navigation");
		this.tabTitle = tabContainer.querySelector(".ds_tabs__title");
		this.boundOnResize = this.onResize.bind(this);
		window.addEventListener("resize", this.boundOnResize, true);
	}
	/**
	* Initialise tab navigation if smaller than medium size
	* - checks breakpoint and sets up tab navigation dropdown
	*
	* @returns {void}
	*/
	init() {
		if (this.breakpointCheck("medium")) {} else this.set();
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
			const navButton = document.createElement("button");
			const tabListId = this.tabList.getAttribute("id");
			navButton.classList.add("ds_tabs__toggle");
			navButton.setAttribute("aria-expanded", false.toString());
			navButton.innerHTML = this.tabTitle.innerHTML;
			navButton.setAttribute("aria-controls", tabListId);
			this.tabNavigation.insertBefore(navButton, this.tabList);
			navButton.addEventListener("click", () => {
				if (navButton.getAttribute("aria-expanded") === "true") navButton.setAttribute("aria-expanded", false.toString());
				else navButton.setAttribute("aria-expanded", true.toString());
			});
			if (this.tabContainer.querySelector(".ds_tabs__current")) this.tabNavigation.setAttribute("aria-labelledby", "ds_tabs__current");
			this.isInitialised = true;
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
			this.isInitialised = false;
			const navButton = this.tabContainer.querySelector(".ds_tabs__toggle");
			navButton.parentNode?.removeChild(navButton);
			this.tabNavigation.setAttribute("aria-labelledby", "ds_tabs__title");
		}
	}
	/**
	* Runs when the browser is resized - includes debounce to prevent multiple calls in quick succession
	* - resets the tabs if the screen is smaller than medium
	*
	* @returns {void}
	*/
	onResize() {
		clearTimeout(this.resizeTimer);
		this.resizeTimer = window.setTimeout(() => {
			if (this.breakpointCheck("medium")) this.reset();
			else this.set();
		}, 150);
	}
};
//#endregion
//#region src/index.ts
var DS = {
	base: base_default,
	components: {
		Accordion,
		Autocomplete,
		BackToTop,
		CharacterCount,
		Checkboxes,
		CookieNotification,
		DatePicker: DSDatePicker,
		Details,
		FileUpload,
		HideThisPage: HidePage,
		NotificationBanner: Notification,
		NotificationMessage,
		SideNavigation,
		SiteNavigation: MobileMenu,
		skipLinks,
		StepNavigation,
		MobileTables,
		MobileTable,
		Tabs,
		TabsNavigation
	},
	version: version_default,
	initAll,
	tracking: base_default.tools.tracking,
	elementIdModifier: 0
};
window.DS = DS;
//#endregion
export { DS as default };
