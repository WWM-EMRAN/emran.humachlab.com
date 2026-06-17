# 🚀 Emran Ali — Dynamic Personal Portfolio Ecosystem

**Live Site:** [emran.humachlab.com](https://emran.humachlab.com)

Welcome to the source code for **Emran Ali's Personal Portfolio Website**. Originally based on a Bootstrap template, this project has been re-architected into a fully dynamic, data-driven platform. It serves as a centralized digital identity for a PhD researcher in AI and Health Informatics, showcasing academic background, research activities, and professional experiences.

---

## 📖 Part 1: General Overview
### (For Visitors, Recruiters, and General Readers)

This platform is designed as a **"Living Document."** Content is decoupled from the layout, allowing for instant updates across the entire ecosystem by modifying centralized data files. This ensures consistency between the live site, professional CV, and portfolio sections.

### 👨‍💼 About the Author
**Emran Ali** is a researcher, educator, and developer specializing in:
* Artificial Intelligence and Machine Learning
* Biomedical Signal Processing
* Software Development
* Research Project Leadership

### 🎨 Key Features
* **Modular Architecture:** A custom-built JavaScript engine handles dynamic data injection and component rendering.
* **Responsive Design:** Optimized for all devices using Bootstrap 5.3.3.
* **Dark/Futuristic Aesthetic:** Professional design with curated color schemes and micro-animations.
* **Dynamic Animations:** Powered by AOS (Animate On Scroll) for engaging content delivery.
* **Interactive Data:** Custom visualizations for academic metrics, research outputs, and professional timelines.
* **Instant Transitions:** Optimized loading and caching strategy for near-zero latency.

### 🗂️ Site Navigation & Pages

#### 1. **Main Interactive Hub (`index.html`)**
The central destination of the portfolio.
* **Hero Section:** Dynamic persona typing effects and profile highlights.
* **Live Metrics:** Real-time counters for research and professional achievements.
* **Visual Timeline:** Integrated display of Education and Experience.

#### 2. **Professional Portfolio (`curriculum_vitae.html`)**
A comprehensive, dynamic blog-style layout for academic and professional history.
* **Automated Rendering:** Dynamically generates complex sections from research data.
* **Rich Media:** Integrated support for publication links, project galleries, and event logs.

#### 3. **Detail Viewers (`page_details.html` & `section_details.html`)**
Dynamic templates used to display granular information about specific projects, research areas, or CV sections without requiring unique HTML files for every entry.

#### 4. **Smart Error Handling (`404.html`)**
A custom-branded error page ensuring users can always find their way back to the main hub.

---

## ⚙️ Part 2: Technical Architecture
### (For Software Engineers & Developers)

The ecosystem follows a high-performance **Separation of Concerns (SoC)** model. The **Data Layer (JSON)** is completely independent of the **Presentation Layer (HTML/CSS)**, orchestrated by a custom **Logic Layer (JS)**.

### 📂 Project Directory Structure

```text
/ (Root Directory)
│
├── index.html                # Main Portfolio Hub
├── curriculum_vitae.html     # Dynamic CV & Blog
├── page_details.html         # Dynamic Page Detail Template
├── section_details.html      # Dynamic Section Detail Template
├── 404.html                  # Custom 404 Error Page
│
└── assets/
    ├── css/
    │   ├── style.css         # Core Layout & Structural Styling
    │   └── style_custom.css  # Custom Refinements & Overrides
    │
    ├── js/                   # ⚙️ THE MODULAR ENGINE
    │   ├── site-loader.js    # Data Fetching & Caching Manager
    │   ├── site-core.js      # Core Application Logic
    │   ├── site-common.js    # Shared UI Components & Utilities
    │   ├── site-util.js      # Helper Functions & Formatting
    │   ├── site-index.js     # Index Page Component Controller
    │   ├── site-cv.js        # CV Page Component Controller
    │   ├── site-page.js      # Page Detail Controller
    │   ├── site-section.js   # Section Detail Controller
    │   └── scripts.js        # Legacy Support & General Scripts
    │
    ├── data/                 # 📄 THE DATABASE (21 JSON Files)
    │   ├── site.json         # Global Configuration & Meta
    │   ├── personal_information.json
    │   ├── academic_information.json
    │   ├── professional_experiences.json
    │   ├── publications.json
    │   ├── projects.json
    │   ├── skills_tools.json
    │   ├── honors_awards.json
    │   ├── diary.json
    │   ├── gallery.json
    │   ├── contact_details.json
    │   ├── copyright.json
    │   ├── courses_trainings_certificates.json
    │   ├── ea_logo.json
    │   ├── expertise_skills_achievements.json
    │   ├── key_information.json
    │   ├── languages.json
    │   ├── organisational_memberships.json
    │   ├── portfolios.json
    │   ├── sessions_events.json
    │   └── volunteering_services.json
    │
    ├── img/                  # Visual Assets (Logos, Profile, Photography)
    ├── docs/                 # Document Assets (PDFs, Certificates)
    └── vendor/               # Third-party Dependencies (Bootstrap, AOS, etc.)
```

### 🏗️ System Architecture

The ecosystem's "Engine" is built on the **Site Loader** principle, which transforms static JSON into an interactive DOM.

#### 1. Data-Injection Workflow
*   **Initialization:** `site-loader.js` parses the current URL to determine which components are required.
*   **Parallel Fetching:** The system fetches the necessary dataset (all or specific files) from `assets/data/`.
*   **Caching Layer:** Uses `localStorage` to store the dataset. The `site.json` file controls the `expiration_seconds`, allowing for instant subsequent loads while ensuring content stays fresh.

#### 2. Modular Component Logic
Instead of a monolithic script, functionality is split:
*   **Controllers:** `site-index.js` and `site-cv.js` handle page-specific rendering.
*   **Detail Engines:** `site-page.js` and `site-section.js` handle the deep-linking and granular data display.
*   **Utilities:** `site-util.js` provides consistent date formatting, sorting, and text sanitization across all views.

#### 3. Dynamic UI Integration
*   **Auto-Sorting:** Timelines and publication lists are sorted client-side based on JSON timestamps.
*   **Tag Filtering:** The gallery and blog sections automatically generate filter buttons by scanning the unique tags present in the raw data.
*   **Interactive Overlays:** GLightbox is programmatically re-initialized after data injection to ensure media interactivity on dynamically created elements.

### 🛠️ Technologies Used
* **Languages:** HTML5, CSS3, JavaScript (ES6+).
* **Framework:** Bootstrap 5.3.3.
* **Data Transport:** Fetch API, Async/Await.
* **State Management:** Browser LocalStorage API.
* **Key Libraries:**
    * **AOS:** Entrance animations.
    * **Typed.js:** Hero section typewriter effects.
    * **PureCounter:** Animated statistical data.
    * **GLightbox:** Responsive image and video lightboxes.
    * **Bootstrap Icons & Boxicons:** Scalable vector iconography.

### 👨‍💻 Developer Maintenance Guide
1.  **Project Updates:** To update content (e.g., adding a new publication), simply edit the corresponding file in `assets/data/`.
2.  **Bypass Cache:** During development, set `"expiration_seconds": 0` in `site.json` to see changes instantly without clearing browser storage.
3.  **Extensibility:** New pages can be added by creating a new controller script in `assets/js` and registering it in the `site-loader.js` orchestration logic.


### 🛠️ Todo
* **Need to fix:** 
* Most of the things are done. Only two issues left:
1. Page 404 is not working everywhere...
2. After a section failed, the back button does not load the previous page with the previous data properly...



---
*Copyright © 2026 Emran Ali. All Rights Reserved.*