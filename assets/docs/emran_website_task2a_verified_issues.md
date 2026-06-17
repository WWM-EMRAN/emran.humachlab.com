# Emran Personal Website
## Task 2a — Verified Project Issues

**Project source:** `/mnt/data/emran.humachlab.com/`  
**Scope:** Issue discovery only  
**Modification status:** No project files were changed during this audit

---

## 1. Audit Summary

The current project was reviewed across:

- Project structure
- HTML
- JavaScript
- JSON
- Navigation
- Deep links
- Error handling
- Caching
- External libraries
- Metadata
- Accessibility
- Content consistency
- Development artefacts

The JavaScript passes basic syntax validation, all active production JSON files parse successfully, no duplicate static HTML IDs were found, and referenced local assets exist.

The following issues are confirmed.

---

## 2. Issue Overview

| ID | Priority | Issue | Main location |
|---|---:|---|---|
| ISS-001 | Critical | Standalone `404.html` loads `site-loader.js` without its required modules | `404.html`, `site-loader.js` |
| ISS-002 | Critical | Custom 404 assets break for nested invalid URLs | `404.html` |
| ISS-003 | High | Section-details deep-link hash can be replaced with `#about` | `scripts.js`, `site-section.js` |
| ISS-004 | High | Invalid subsection IDs are not validated | `site-loader.js`, `site-section.js` |
| ISS-005 | High | Back navigation after dynamic 404 may restore the URL but not the page content | `site-util.js` |
| ISS-006 | High | Failure of any one JSON file can disable the entire website | `site-loader.js`, `site-core.js` |
| ISS-007 | High | Local-storage cache handling is fragile and cannot reliably recover | `site-core.js` |
| ISS-008 | Medium | Internal navigation performs the same scroll twice | `scripts.js` |
| ISS-009 | Medium | Unsupported CV modes can be opened directly and produce an incomplete page | `site-cv.js`, `site-loader.js` |
| ISS-010 | Medium | Page-specific titles are overwritten with one generic title | `site-common.js` |
| ISS-011 | Medium | Some third-party libraries are initialised multiple times | Several JS controllers |
| ISS-012 | Medium | Confirmed content mistakes exist in production data | JSON and fallback HTML |
| ISS-013 | Medium | HTML and JSON duplicate the same content | All main HTML pages |
| ISS-014 | Medium | Stale or duplicate development files remain in production | `scripts1.js`, `site-loader1.js`, etc. |
| ISS-015 | Medium | Dependency loading is inconsistent between pages | HTML pages |
| ISS-016 | Medium | External links have security and accessibility weaknesses | HTML and generated markup |
| ISS-017 | Low | HTML validation produces numerous standards errors | Main HTML files |
| ISS-018 | Low | Rendering errors are swallowed and reported with misleading messages | Page controllers |

---

## 3. Detailed Issues

## ISS-001 — Standalone 404 page has missing JavaScript dependencies

**Priority:** Critical  
**Location:** `404.html`, `site-loader.js`

`404.html` loads:

```html
<script src="./assets/js/site-loader.js"></script>
<script src="./assets/js/scripts.js"></script>
```

However, `site-loader.js` immediately requires:

```js
SiteCore.preloadAllData(...)
SiteUtil.syncGlobalMetrics()
SiteCommon.init(...)
```

The 404 page does not load:

```text
site-core.js
site-util.js
site-common.js
```

Its error handler then calls:

```js
window.render_404_page("Content");
```

but `render_404_page()` is defined in the missing `site-util.js`.

### Impact

The page intended to handle errors can itself produce secondary JavaScript errors.

---

## ISS-002 — The custom 404 page will break on nested invalid paths

**Priority:** Critical  
**Location:** `404.html`

The 404 page uses relative paths:

```html
./assets/css/style.css
./assets/js/site-loader.js
./assets/img/Emran_Ali_Logo2.gif
```

When GitHub Pages serves `404.html` for a nested invalid URL such as:

```text
https://emran.humachlab.com/unknown/path/page
```

the browser can resolve those paths relative to the invalid nested URL rather than the site root.

### Impact

Styles, scripts, images, and JSON requests can return 404 responses.

---

## ISS-003 — Section-details hash can be overwritten by scroll-spy

**Priority:** High  
**Location:** `scripts.js`, `site-section.js`

`site-section.js` scrolls to the requested section or subsection. Immediately afterward, `scripts.js` initialises scroll-spy.

The scroll-spy contains logic similar to:

```js
if (window.scrollY < 200) {
    const isDetails =
        window.location.pathname.includes('section_details.html');

    if (isDetails) {
        bestMatchLink =
            document.querySelector('#navmenu a[href="#about"]');
    }
}
```

It then executes:

```js
history.replaceState(
    null,
    null,
    window.location.pathname + searchParams + newHash
);
```

Therefore a requested URL such as:

```text
section_details.html#academic_information-phd_cu_csm
```

can be replaced by:

```text
section_details.html#about
```

during initialisation.

### Impact

Deep links may lose their original subsection target before scrolling finishes.

---

## ISS-004 — Invalid subsection identifiers are silently accepted

**Priority:** High  
**Location:** `site-loader.js`, `site-section.js`

The loader validates only the parent section:

```js
if (!route.section || !route.dataKey || !SiteCore.get(route.dataKey))
```

It does not validate whether the requested subsection record exists.

For example:

```text
section_details.html#academic_information-NOT_A_REAL_DEGREE
```

passes parent-section validation because `academic_information.json` exists.

`navigate_to_hash()` then falls back to the main section.

### Impact

Broken subsection links can remain unnoticed and silently display the wrong content.

---

## ISS-005 — Dynamic 404 rendering conflicts with browser Back navigation

**Priority:** High  
**Location:** `site-util.js`

The dynamic 404 function replaces the entire `<main>` element:

```js
mainElement.innerHTML = `...404 content...`;
```

It does not preserve the previous DOM or provide a route-restoration mechanism.

### Impact

Browser Back can restore the previous URL without restoring the corresponding page content, leaving the URL and displayed page inconsistent.

---

## ISS-006 — One failed JSON file can disable every page

**Priority:** High  
**Location:** `site-loader.js`, `site-core.js`

Every page loads all JSON files:

```js
await SiteCore.preloadAllData(BASE, FILES);
```

The implementation uses:

```js
Promise.all(...)
```

If one optional file fails, the complete promise rejects.

### Impact

A missing unrelated file such as `gallery.json` can disable the homepage, CV, section details, and other pages.

---

## ISS-007 — Cache handling is fragile

**Priority:** High  
**Location:** `site-core.js`

The cache implementation has several weaknesses:

- `localStorage.getItem()` is not fully protected by `try/catch`.
- `localStorage.setItem()` can fail because of privacy settings, blocked storage, or quota limits.
- The cache key does not include a schema version, data version, or environment.
- Switching between `assets/data/` and `assets/data_test/` can reuse stale cache data.
- Cached data is not checked against the current required file list.
- A rejected cached promise can prevent retry during the same session.

### Impact

Storage or cache failures can send the whole site to its error page or preserve stale data.

---

## ISS-008 — Navigation scrolls twice per click

**Priority:** Medium  
**Location:** `scripts.js`

The internal navigation handler contains two consecutive blocks that both:

1. Find the same target.
2. Call `preventDefault()`.
3. Call `window.scrollTo()`.

### Impact

This can restart smooth scrolling, cause flicker, and interfere with deep-link behaviour.

---

## ISS-009 — Unsupported CV modes are still routable

**Priority:** Medium  
**Location:** `site-cv.js`, `site-loader.js`

The selector mentions:

```text
standard
onePage
twoPage
detailed
```

Only `standard` and `onePage` appear to have active rendering branches.

Direct URLs such as:

```text
curriculum_vitae.html?type=twoPage
curriculum_vitae.html?type=detailed
```

are still accepted.

### Impact

The page can display an incomplete mixture of fallback content and standard styling instead of a valid CV layout or error state.

---

## ISS-010 — Every dynamic page receives the same document title

**Priority:** Medium  
**Location:** `site-common.js`

`SiteCommon.init()` calls a metadata updater that executes:

```js
document.title = info.title;
```

The shared title is:

```text
Emran Ali - Personal Website
```

This overwrites page-specific titles such as:

```text
Emran Ali - CV
Emran Ali - Details
```

### Impact

CV, gallery, diary, copyright, and section-detail pages share the same browser and search-engine title.

---

## ISS-011 — Third-party libraries are initialised more than once

**Priority:** Medium  
**Location:** Several JavaScript controllers

Examples include:

- `PureCounter` initialised in `site-index.js`
- `PureCounter` initialised again in `scripts.js`
- `GLightbox` initialised in page render methods
- `GLightbox` initialised again in `scripts.js`
- AOS initialised during normal startup and dynamic 404 rendering
- Navigation behaviour can attach duplicate scroll listeners

### Impact

Repeated initialisation can produce duplicate observers, event listeners, instances, and memory use.

---

## ISS-012 — Confirmed production content errors

**Priority:** Medium  
**Location:** JSON and fallback HTML

### Broken LinkedIn URL

The following value is missing the colon:

```text
https//www.linkedin.com/in/wwmemran
```

It appears in:

```text
assets/data/personal_information.json
index.html
section_details.html
```

The correct URL should begin with:

```text
https://
```

### Invalid dates

Two impossible dates appear in production data:

```text
Sep. 31, 2022
Jun. 31, 2025
```

They occur in:

```text
assets/data/professional_experiences.json
```

These values feed JavaScript date parsing and duration calculations.

### Spelling error

The production heading is:

```text
Oranisational Memberships
```

instead of:

```text
Organisational Memberships
```

It appears in JSON and fallback HTML.

---

## ISS-013 — HTML and JSON maintain duplicate sources of truth

**Priority:** Medium  
**Location:** Main HTML pages and JSON data

The major pages contain complete static versions of sections that are later erased and recreated from JSON.

Approximate page sizes include:

```text
index.html: 286 KB
section_details.html: 153 KB
curriculum_vitae.html: 137 KB
```

### Impact

- Static fallback content can become outdated.
- Corrections may need to be applied twice.
- Search engines can initially parse stale content.
- Pages are unnecessarily large.
- DOM work is duplicated.
- Testing must account for both pre-render and post-render states.

---

## ISS-014 — Duplicate and development files are mixed with production

**Priority:** Medium  
**Location:** `assets/js/`, `assets/data/`, project root

Examples include:

```text
assets/js/scripts1.js
assets/js/site-loader1.js
assets/data/publications1.json
assets/data_test/
.idea/
```

### Impact

It is unclear whether these are backups, experiments, or active alternatives. They increase deployment size and maintenance risk.

---

## ISS-015 — Pages use inconsistent dependency sources

**Priority:** Medium  
**Location:** HTML pages

`index.html` loads local vendor JavaScript, while other pages load equivalent libraries from CDNs.

### Impact

- Different pages can use different versions.
- Some pages work offline while others do not.
- CDN outages affect only part of the site.
- Dependency upgrades become harder to control.
- Browser caching is less predictable.

---

## ISS-016 — External links need security and accessibility improvements

**Priority:** Medium  
**Location:** HTML and generated markup

Many links use:

```html
target="_blank"
```

without:

```html
rel="noopener noreferrer"
```

Icon-only links also lack accessible labels.

### Impact

- Security hardening is incomplete.
- Screen-reader users may not understand icon-only controls.
- Accessibility testing will fail on several interactive elements.

---

## ISS-017 — HTML standards validation errors

**Priority:** Low  
**Location:** Main HTML files

Recurring issues include:

- raw `&` characters instead of `&amp;`;
- icon-only anchors without accessible text;
- buttons without `type="button"`;
- stylesheet links without `rel="stylesheet"`;
- large amounts of inline styling;
- inconsistent self-closing syntax on HTML void elements.

### Impact

These may not always cause visible failures but reduce standards compliance and complicate accessibility testing.

---

## ISS-018 — Rendering errors are suppressed

**Priority:** Low  
**Location:** Page controllers

Several controller methods catch errors internally but do not rethrow them:

```js
catch (error) {
    console.error("Render Error in index page:", error);
}
```

Some messages also name the wrong page.

### Impact

The loader may continue, hide the preloader, and present a partially rendered page as successful.

---

## 4. Recommended Repair Order

1. Fix the standalone and dynamic 404 architecture.
2. Separate navigation from scroll-spy and protect requested deep links.
3. Validate subsection IDs.
4. Make data loading and cache recovery resilient.
5. Remove duplicate navigation and library initialisation.
6. Correct malformed content and invalid dates.
7. Standardise page metadata and dependency loading.
8. Clean obsolete files.
9. Address accessibility and HTML validation.
10. Improve error propagation and reporting.

---

## 5. Task Status

**Task 2a is complete.**

No project files were modified during this issue-discovery stage.

The next planned step is:

```text
Task 2b — Create a detailed issue specification and remediation plan
```
