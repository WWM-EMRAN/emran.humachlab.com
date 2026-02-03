const SitePage = {
    init(page) {
        console.log(`Details Page initializing with section: '${page}'...`);

        // --- 0. DATA SYNCHRONIZATION ---

        // --- 1. RENDER ALL SECTIONS ---
        this.render_all_page_details(page);


        console.log("Details Page synchronization complete.");
    },

   async render_all_page_details(page){
      try {

        // --- 0. DATA SYNCHRONIZATION ---

        // --- 1. RENDER ALL SECTIONS ---
        this.render_all_details_pages(page);

        // --- THE FIX: Hide preloader once finished ---
        window.hide_preloader();
      }
      catch (error) {
          console.error("Render Error in Section Details page:", error);
          window.hide_preloader(); // Hide anyway to stop the hang
      }
   },

    // Render all or catch rendering problem, also deal with preloader and page 404
    async render_all_details_pages(page) {
        try {
            // Call each section individually
            // --- 1. HEADER & IDENTITY ---
            this.render_sticky_header(page);

            // Main page content
            if (page === 'ea_logo'){
               this._render_ea_logo();
            }
            else if (page === 'copyright'){
               this._render_copyright();
            }
            else if (page === 'diary'){
               this._render_diary();
            }
            else if (page === 'gallery'){
               this._render_gallery();
            }
            else{
                console.error(`Invalid page type: ${page}`);
            }

            // --- THE FIX: Hide preloader once finished ---
            // window.hide_preloader();
        }
        catch (error) {
            console.error("Render Error in index page:", error);
            // window.hide_preloader(); // Hide anyway to stop the hang
        }
    },


    /**
     * Dynamically updates the sticky bar based on the active page using navigation data.
     * File: site-page.js
     * Target: .section-detail-header in page_details.html
     */
    render_sticky_header(page) {
        // 1. Fetch the page-specific data and the global site configuration
        const pageData = SiteCore.get(page);
        const siteConfig = SiteCore.get('site'); // Access global navigation from site.json

        if (!pageData || !siteConfig || !siteConfig.navigation) return;

        // 2. Search for the matching navigation item to get the Label and Icon
        // Corrected: use the 'page' parameter to match the URL (e.g., #diary)
        const targetUrl = `#${page}`;
        let foundItem = null;

        siteConfig.navigation.main_menu.forEach(item => {
            if (item.url === targetUrl) {
                foundItem = item;
            } else if (item.is_dropdown && item.submenu) {
                const sub = item.submenu.find(s => s.url === targetUrl);
                if (sub) foundItem = sub;
            }
        });

        // 3. Fallback Logic: If not in nav, use section_info from the page JSON itself
        const finalTitle = foundItem ? foundItem.label : (pageData.section_info ? pageData.section_info.title : "Details");
        const finalIcon = foundItem ? foundItem.icon_class : (pageData.section_info ? pageData.section_info.icon_class : "bi bi-globe");

        // 4. Update the DOM element
        const stickyHeader = document.querySelector('.section-detail-header');
        if (!stickyHeader) return;

        // Create and configure the new icon
        const iconElement = document.createElement('i');
        iconElement.className = `${finalIcon} me-2`;

        // Clear existing content ("Page Details Page: Page Title") and rebuild
        stickyHeader.innerHTML = '';
        stickyHeader.appendChild(iconElement);
        stickyHeader.appendChild(document.createTextNode(finalTitle));
    },



    /**
     * Renders the EA Logo Gallery
     * File: site-page.js
     * Targets: IDs and Classes found in page_details.html
     */
    _render_ea_logo() {
        const data = SiteCore.get('ea_logo');
        const contentArea = document.getElementById('details-list-container');
        if (!data || !contentArea) return;

        // // 1. Update Sticky Bar Title
        // const stickyTitle = document.querySelector('.cv-nav-title');
        // if (stickyTitle && data.section_info) {
        //     stickyTitle.textContent = data.section_info.title;
        // }

        // 2. Update Section Header
        const mainTitle = document.getElementById('section-main-title');
        const mainDesc = document.getElementById('section-main-description');

        if (data.section_info) {
            if (mainTitle) mainTitle.innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title}`;
            if (mainDesc) mainDesc.textContent = data.section_info.details;
        }

        // 3. Clear and Render Grid
        contentArea.innerHTML = '';
        const row = document.createElement('div');
        row.className = 'row gy-4';
        contentArea.appendChild(row);

        data.logos.forEach((logo, index) => {
            const col = document.createElement('div');
            col.className = 'col-xl-3 col-lg-4 col-md-6';
            col.setAttribute('data-aos', 'fade-up');
            col.setAttribute('data-aos-delay', (index % 4) * 100);
            col.id = `ea-logo-${logo.id_ref}`;

            col.innerHTML = `
                <div class="logo-card shadow-sm">
                    <a href="${logo.image_path}" class="glightbox" data-gallery="logo-gallery" title="${logo.title}">
                        <div class="logo-image-box">
                            <img src="${logo.image_path}" alt="${logo.title}" class="logo-display-img">
                        </div>
                    </a>
                    <div class="logo-details-box">
                        <span class="logo-tag">${logo.category}</span>
                        <h5 class="logo-card-title">${logo.title}</h5>
                    </div>
                </div>
            `;
            row.appendChild(col);
        });

        if (typeof GLightbox !== 'undefined') {
            GLightbox({ selector: '.glightbox' });
        }
    },


    /**
     * Renders the Copyright Page
     * File: site-page.js
     * Targets: #details-list-container, #section-main-title, #section-main-description
     */
    _render_copyright() {
        const data = SiteCore.get('copyright');
        const contentArea = document.getElementById('details-list-container');
        if (!data || !contentArea) return;

        // 1. Update Header & Sticky Bar
        // const stickyTitle = document.querySelector('.cv-nav-title');
        const mainTitle = document.getElementById('section-main-title');
        const mainDesc = document.getElementById('section-main-description');

        if (data.section_info) {
            // if (stickyTitle) stickyTitle.textContent = data.section_info.title;
            if (mainTitle) mainTitle.innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title}`;
            if (mainDesc) mainDesc.textContent = data.section_info.details;
        }

        // 2. Clear Content
        contentArea.innerHTML = '';

        // 3. Render each Copyright version
        data.copyrights.forEach((item, index) => {
            const card = document.createElement('div');
            // card.className = 'resume-item shadow-sm p-4 mb-4 legal-card';
            card.className = 'legal-card shadow-sm p-4 mb-4';
            card.setAttribute('data-aos', 'fade-up');
            card.id = `copyright-${item.id_ref}`; // Hybrid ID for deep-linking

            // Build modifications list if it exists
            const modsHtml = (item.modifications && item.modifications.length > 0) ? `
                <div class="mt-3 p-3 legal-meta-box">
                    <h6 class="fw-bold small text-uppercase mb-2"><i class="bi bi-gear-wide-connected me-2"></i>Key Modifications:</h6>
                    <ul class="list-unstyled mb-0 small">
                        ${item.modifications.map(mod => `<li class="mb-1"><i class="bi bi-check2-circle me-2 text-primary"></i>${mod}</li>`).join('')}
                    </ul>
                </div>` : '';

            card.innerHTML = `
                <h4 class="legal-accent-text text-uppercase mb-2">
                    <i class="bi bi-patch-check-fill me-2"></i>Version: ${item.version}
                </h4>

                <p class="fw-bold mb-3"><i class="bi bi-person-badge me-2"></i>Rights: ${item.right_to_copy}</p>

                <div class="mb-3">
                    <span class="badge badge-status"><i class="bi bi-shield-lock me-1"></i> Intellectual Property</span>
                </div>

                <div class="legal-description mb-3">
                    ${item.description}
                </div>

                ${modsHtml}
            `;
            contentArea.appendChild(card);
        });
    },



    /**
     * Renders the Gallery Page with Dual Filtering
     * File: site-page.js
     * Targets: #details-list-container, #section-main-title, #section-main-description
     */
    _render_gallery() {
        const data = SiteCore.get('gallery');
        const contentArea = document.getElementById('details-list-container');
        if (!data || !data.images || !contentArea) return;

        // 1. Update Section Header (Excluding Sticky Title)
        const mainTitle = document.getElementById('section-main-title');
        const mainDesc = document.getElementById('section-main-description');

        if (data.section_info) {
            if (mainTitle) mainTitle.innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title}`;
            if (mainDesc) mainDesc.textContent = data.section_info.details;
        }

        // 2. Extract Unique Categories and Clean Locations for Filters
        const categories = ['all', ...new Set(data.images.map(img => img.category))];

        // Logic to extract primary location names (e.g., "Phillip Island", "Burwood")
        const locations = ['all', ...new Set(data.images.map(img => {
            const loc = img.location.toLowerCase();
            if (loc.includes('phillip island')) return 'phillip island';
            if (loc.includes('burwood')) return 'burwood';
            if (loc.includes('melbourne')) return 'melbourne';
            return 'other';
        }))].filter(l => l !== 'other');

        // 3. Clear and Build Filter Structure
        contentArea.innerHTML = '';

        // Create Row for Category Filters
        const catNav = document.createElement('div');
        catNav.className = 'gallery-filter-nav mb-2';
        catNav.innerHTML = '<span class="small fw-bold me-2 text-uppercase">Category:</span>';
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `filter-btn cat-filter ${cat === 'all' ? 'active' : ''}`;
            btn.textContent = cat;
            btn.onclick = () => this._apply_gallery_dual_filter('category', cat, btn);
            catNav.appendChild(btn);
        });
        contentArea.appendChild(catNav);

        // Create Row for Location Filters
        const locNav = document.createElement('div');
        locNav.className = 'gallery-filter-nav mb-4';
        locNav.innerHTML = '<span class="small fw-bold me-2 text-uppercase">Location:</span>';
        locations.forEach(loc => {
            const btn = document.createElement('button');
            btn.className = `filter-btn loc-filter ${loc === 'all' ? 'active' : ''}`;
            btn.textContent = loc;
            btn.onclick = () => this._apply_gallery_dual_filter('location', loc, btn);
            locNav.appendChild(btn);
        });
        contentArea.appendChild(locNav);

        const row = document.createElement('div');
        row.className = 'row gy-4';
        contentArea.appendChild(row);

        // 4. Render Gallery Items
        data.images.forEach((item, index) => {
            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6 gallery-item-wrapper';

            // Assign attributes based on new JSON fields
            col.setAttribute('data-category', item.category);
            const itemLoc = item.location.toLowerCase();
            const locKey = itemLoc.includes('phillip island') ? 'phillip island' :
                          (itemLoc.includes('burwood') ? 'burwood' :
                          (itemLoc.includes('melbourne') ? 'melbourne' : 'other'));
            col.setAttribute('data-location', locKey);

            col.setAttribute('data-aos', 'fade-up');
            col.id = `gallery-${item.id_ref}`;

            col.innerHTML = `
                <div class="gallery-card shadow-sm">
                    <a href="${item.image_path}" class="glightbox" data-gallery="gallery-main" title="${item.title}: ${item.description} @ ${item.location}">
                        <div class="gallery-img-box">
                            <img src="${item.image_path}" alt="${item.title}">
                        </div>
                    </a>
                    <div class="gallery-info-box">
                        <h6 class="gallery-item-title">${item.title}</h6>
                        <p class="gallery-item-desc mb-2">${item.description}</p>
                        <div class="d-flex flex-wrap gap-2">
                            <span class="badge badge-status">${item.category}</span>
                            <span class="badge bg-light text-dark border"><i class="bi bi-geo-alt me-1"></i>${item.location}</span>
                        </div>
                    </div>
                </div>`;
            row.appendChild(col);
        });

        if (typeof GLightbox !== 'undefined') { GLightbox({ selector: '.glightbox' }); }
    },

    /**
     * Combined Logic for Category and Location filtering
     * File: site-page.js
     */
    _apply_gallery_dual_filter(type, value, activeBtn) {
        // 1. Update visual state for the clicked row
        const selector = type === 'category' ? '.cat-filter' : '.loc-filter';
        document.querySelectorAll(selector).forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');

        // 2. Identify the active criteria from both filter rows
        const activeCat = document.querySelector('.cat-filter.active').textContent.toLowerCase();
        const activeLoc = document.querySelector('.loc-filter.active').textContent.toLowerCase();

        // 3. Show/Hide items based on both conditions
        const items = document.querySelectorAll('.gallery-item-wrapper');
        items.forEach(item => {
            const itemCat = item.getAttribute('data-category').toLowerCase();
            const itemLoc = item.getAttribute('data-location').toLowerCase();

            const matchesCat = (activeCat === 'all' || itemCat === activeCat);
            const matchesLoc = (activeLoc === 'all' || itemLoc === activeLoc);

            if (matchesCat && matchesLoc) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        // Refresh AOS for visibility changes
        if (typeof AOS !== 'undefined') AOS.refresh();
    },


    /**
     * Renders the Diary Page with Filtering
     * File: site-page.js
     * Targets: #details-list-container, #section-main-title, #section-main-description
     */
    _render_diary() {
        const data = SiteCore.get('diary');
        const contentArea = document.getElementById('details-list-container');

        // Safety check for the specific 'diaryentries' object
        if (!data || !data.diaryentries || !contentArea) return;

        // 1. Update Section Header
        const mainTitle = document.getElementById('section-main-title');
        const mainDesc = document.getElementById('section-main-description');

        if (data.section_info) {
            if (mainTitle) mainTitle.innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title}`;
            if (mainDesc) mainDesc.textContent = data.section_info.details;
        }

        // 2. Extract Categories from the object keys
        const entryCategories = Object.keys(data.diaryentries);
        const filterCategories = ['all', ...entryCategories];

        // 3. Clear and build Filter Navigation
        contentArea.innerHTML = '';

        const filterNav = document.createElement('div');
        filterNav.className = 'diary-filter-nav';

        filterCategories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${cat === 'all' ? 'active' : ''}`;
            btn.textContent = cat;
            btn.onclick = () => this._filter_diary_items(cat, btn);
            filterNav.appendChild(btn);
        });

        contentArea.appendChild(filterNav);

        // 4. Render Diary Entries by iterating through category keys
        entryCategories.forEach(categoryName => {
            data.diaryentries[categoryName].forEach((item) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'diary-item-wrapper';
                wrapper.setAttribute('data-category', categoryName);
                wrapper.setAttribute('data-aos', 'fade-up');

                // Hybrid ID for deep-linking
                wrapper.id = `diary-${item.id_ref}`;

                // Handle multiple paragraphs
                const descriptionHtml = item.paragraphs ?
                    item.paragraphs.map(p => `<p class="mb-3">${p}</p>`).join('') : '';

                // Handle optional image and caption
                const imageHtml = item.image_path ? `
                    <div class="diary-media mb-4 text-center">
                        <a href="${item.image_path}" class="glightbox" data-gallery="diary-gallery-${item.id_ref}">
                            <img src="${item.image_path}" class="img-fluid rounded shadow-sm border" alt="${item.title}">
                        </a>
                        ${item.image_caption ? `<div class="diary-caption mt-2 small text-muted italic">${item.image_caption}</div>` : ''}
                    </div>` : '';

                wrapper.innerHTML = `
<!--                    <div class="resume-item shadow-sm p-4 mb-4 diary-card">-->
                    <div class="diary-card shadow-sm p-4 mb-4">
                        <h4 class="diary-accent-text text-uppercase mb-2">
                            <i class="bi bi-journal-text me-2"></i>${item.title}
                        </h4>
    
                        <div class="mb-3 d-flex flex-wrap gap-2">
                            <span class="badge badge-dates"><i class="bi bi-calendar3 me-1"></i> ${item.date}</span>
                            <span class="badge badge-status text-capitalize"><i class="bi bi-tag me-1"></i> ${categoryName}</span>
                        </div>
    
                        ${imageHtml}
    
                        <div class="diary-description">
                            ${descriptionHtml}
                        </div>
    
                        ${item.url_link ? `
                            <div class="mt-4">
                                <a href="${item.url_link}" target="_blank" class="btn btn-sm btn-outline-primary" style="font-size: 11px;">
                                    <i class="bi bi-link-45deg me-1"></i> View External Reference
                                </a>
                            </div>` : ''}
                    </div>
                `;
                contentArea.appendChild(wrapper);
            });
        });

        // Re-init GLightbox for diary images
        if (typeof GLightbox !== 'undefined') {
            GLightbox({ selector: '.glightbox' });
        }
    },

    /**
     * Helper to filter diary entries
     * File: site-page.js
     */
    _filter_diary_items(category, activeBtn) {
        const btns = document.querySelectorAll('.filter-btn');
        btns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');

        const items = document.querySelectorAll('.diary-item-wrapper');
        items.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        if (typeof AOS !== 'undefined') AOS.refresh();
    }




};
