# Emran Personal Website
## Task 1 — Project Review and Architecture Analysis

**Project source:** `/mnt/data/emran.humachlab.com/`  
**Project type:** Static, data-driven personal website for GitHub Pages  
**Primary technologies:** HTML, CSS, JavaScript, JSON, Bootstrap, AOS, Typed.js, PureCounter, GLightbox, Isotope, and Swiper

---

## 1. Review Scope

This task covered a careful review of the latest extracted project files, including:

- Project directory structure
- HTML page responsibilities
- JavaScript loading and controller flow
- JSON data sources
- Runtime initialisation
- Navigation and deep-link architecture
- Curriculum vitae rendering
- Static and dynamic content relationships
- Current testing and development infrastructure

No project source files were modified during Task 1.

---

## 2. Project Inventory

The extracted project currently contains approximately:

- **1,230 total files**
- **303 directories**
- **5 HTML pages**
- **11 JavaScript files**
- **22 production JSON files**
- **21 JSON files in `assets/data_test/`**
- **2 primary CSS files**
- **442 image assets**
- **5 document assets**
- Local vendor libraries and icon packages

The extracted project size is approximately **371 MB**.

---

## 3. Overall Architecture

The project is a static GitHub Pages website with a semi-dynamic, data-driven architecture.

```text
HTML templates
      ↓
JavaScript controllers and renderer modules
      ↓
JSON content files
```

The HTML files define page structure and fallback content. JavaScript modules load JSON data, render the current page, initialise navigation, and activate external libraries.

---

## 4. Main Pages

| Page | Purpose | Main controller |
|---|---|---|
| `index.html` | Main personal portfolio homepage | `site-index.js` |
| `curriculum_vitae.html` | Curriculum vitae views | `site-cv.js` |
| `section_details.html` | Full section and subsection details | `site-section.js` |
| `page_details.html` | Diary, gallery, copyright, and logo-related pages | `site-page.js` |
| `404.html` | GitHub Pages error page | Shared or limited site scripts |

---

## 5. Shared JavaScript Architecture

| File | Main responsibility |
|---|---|
| `site-loader.js` | Loads JSON data, identifies the current page, and starts the correct page controller |
| `site-core.js` | Fetches, stores, and caches JSON data |
| `site-util.js` | Provides utilities for metrics, duration calculations, URL parsing, filters, and dynamic error handling |
| `site-common.js` | Renders or synchronises shared navigation, sidebar, metadata, and footer components |
| `scripts.js` | Manages navigation behaviour, preloader, smooth scrolling, scroll-spy, and third-party initialisation |
| `site-index.js` | Renders the homepage |
| `site-section.js` | Renders the section-details page |
| `site-cv.js` | Renders curriculum vitae layouts |
| `site-page.js` | Renders general detail pages |
| Other scripts | Supporting behaviour and specialised page functions |

---

## 6. Runtime Sequence

The normal application lifecycle is:

```text
DOMContentLoaded
    ↓
site-loader.js
    ↓
SiteCore.preloadAllData()
    ↓
JSON files fetched or restored from localStorage
    ↓
SiteUtil.syncGlobalMetrics()
    ↓
SiteCommon.init()
    ↓
Page-specific controller initialisation
    ↓
Dynamic HTML rendering
    ↓
AOS, PureCounter, GLightbox, Typed.js, Isotope, and related libraries initialised
    ↓
Preloader removed
```

This sequence confirms that the project relies on client-side rendering after the base HTML document has loaded.

---

## 7. Data Layer

The production data source is:

```text
assets/data/
```

A parallel dataset also exists at:

```text
assets/data_test/
```

The current loader uses the production data directory. The alternative test-data path is present in the code but is not currently active.

The active loader requests approximately **21 JSON files**.

The production data directory also contains:

```text
publications1.json
```

This file is not part of the current active loader list and requires later review to determine whether it is obsolete, experimental, a backup, or an intended replacement.

---

## 8. Main Content Quantities

The current production data contains approximately:

- **4** academic qualifications
- **14** professional roles
- **10** skill categories
- **12** honours and awards
- **23** courses, training programmes, and certificates
- **5** projects
- **9** organisational memberships
- **2** sessions or events
- **3** languages
- **3** portfolio records
- **2** volunteering records
- **16** publications
- **17** gallery images
- **8** logo records

These quantities are useful for later automated validation and test coverage.

---

## 9. Deep-Link and Navigation Architecture

The site supports navigation to both whole sections and individual subsection records.

### Main-section link

```text
section_details.html#academic_information
```

### Subsection link

```text
section_details.html#academic_information-phd_cu_csm
```

The project also contains support for older query-based link formats:

```text
section_details.html?section=academic_information
section_details.html?section=academic_information&id=phd_cu_csm
section_details.html?section=academic_information-phd_cu_csm
```

The section-details controller combines the main section identifier with an item identifier to create stable element IDs.

Examples:

```text
academic_information-phd_cu_csm
professional_experiences-res_du_grp
projects-prj_ducuphdres
```

Different sections use different JSON identifier fields, including `degree_id`, `role_id`, `id_ref`, and section-specific fallback identifiers. This variation must be handled consistently in future testing.

---

## 10. Curriculum Vitae Architecture

The curriculum vitae functionality is handled by `site-cv.js`.

The file contains or references controllers such as:

```text
SiteCV
SiteCV_Standard
SiteCV_OnePage
```

The following CV types are mentioned in the implementation:

```text
standard
onePage
twoPage
detailed
```

At the current stage, only `standard` and `onePage` appear to have active rendering branches. The remaining modes require later issue analysis to determine whether they are incomplete, deprecated, or planned.

---

## 11. Static and Dynamic Content Relationship

The project contains substantial static content inside its HTML files. JavaScript later replaces or rebuilds much of this content from JSON.

The website therefore currently contains two representations of many sections:

```text
Static fallback content inside HTML
Dynamic source content inside JSON
```

The JSON data is the primary runtime source of truth, while the HTML provides initial structure, fallback content, loading-time markup, and a non-JavaScript baseline.

This dual-content approach may lead to maintenance duplication and content inconsistencies and should be evaluated during Task 2.

---

## 12. Vendor and Asset Structure

The project includes local copies of several frontend libraries:

- Bootstrap
- Bootstrap Icons
- Boxicons
- AOS
- Typed.js
- PureCounter
- GLightbox
- Isotope
- Swiper
- Font Awesome-related assets

These libraries are external dependencies. Their internal vendor code should generally not be modified.

Testing should focus on whether they load correctly, whether page controllers initialise them correctly, whether duplicate initialisation occurs, and whether their use causes runtime conflicts.

---

## 13. Repository and Development State

The extracted project contains a `.git` directory and is currently based on the:

```text
main
```

branch.

The uploaded ZIP appears to contain an actively edited working copy rather than a clean committed snapshot because the working tree contains multiple changes relative to the current Git commit.

This is important for future work because generated test files should be placed in clearly separated directories, source modifications should be tracked carefully, and issue fixes should avoid unintentionally overwriting unrelated work.

---

## 14. Current Syntax State

The active JavaScript files were checked for basic JavaScript syntax validity using:

```text
node --check
```

The reviewed JavaScript files passed the basic syntax check.

This verifies only JavaScript parsing. It does not confirm runtime correctness, DOM compatibility, JSON schema consistency, navigation correctness, external-library behaviour, or browser integration. Those areas belong to Tasks 2 and 3.

---

## 15. Current Testing Infrastructure

The project currently has no formal automated testing infrastructure.

The following items were not found:

- `package.json`
- Automated test command
- Unit-test framework
- Browser integration-test framework
- Test configuration
- Test directory
- GitHub Actions testing workflow
- Coverage configuration
- Linting configuration
- Continuous-integration pipeline

Task 3 will introduce the necessary testing structure without requiring a server-side application.

---

## 16. Architectural Summary

The current project is a developed static portfolio system with reusable JSON-driven content, page-specific controllers, shared utilities, dynamic navigation, multiple CV layouts, detailed deep-link support, and local frontend dependencies.

Its main architectural complexity comes from:

1. Duplicate static and dynamic content
2. Multiple route formats
3. Several controller layers
4. Mixed shared and page-specific responsibilities
5. Locally cached JSON
6. Parallel production and test datasets
7. The absence of automated validation

---

## 17. Task 1 Status

**Task 1 is complete.**

The next planned step is:

```text
Task 2a — Identify, verify, classify, and prioritise project issues
```

No issue fixes should be implemented until the issue list and detailed issue document have been reviewed.
