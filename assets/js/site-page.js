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
     * Renders the Gallery Page with Category, Location, and Tag Filtering
     * File: site-page.js
     * Targets: #details-list-container, #section-main-title, #section-main-description
     */
    _render_gallery() {
        const data = SiteCore.get('gallery');
        const contentArea = document.getElementById('details-list-container');

        if (!data || !data.images || !contentArea) return;

        // 1. Update Section Header
        const mainTitle = document.getElementById('section-main-title');
        const mainDesc = document.getElementById('section-main-description');

        if (data.section_info) {
            if (mainTitle) {
                mainTitle.innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title}`;
            }
            if (mainDesc) {
                mainDesc.textContent = data.section_info.details;
            }
        }

        // Helper: convert comma-separated string OR array into clean array
        const splitValues = (value) => {
            if (!value) return [];
            if (Array.isArray(value)) {
                return value.map(v => String(v).trim()).filter(Boolean);
            }
            return String(value)
                .split(',')
                .map(v => v.trim())
                .filter(Boolean);
        };

        // Helper: normalise location for filtering
        const getLocationKey = (location) => {
            const loc = String(location || '').toLowerCase();

            if (loc.includes('phillip island')) return 'phillip island';
            if (loc.includes('burwood')) return 'burwood';
            if (loc.includes('melbourne')) return 'melbourne';
            if (loc.includes('great ocean road')) return 'great ocean road';

            return 'other';
        };

        // 2. Prepare filter values
        const categorySet = new Set();
        const locationSet = new Set();
        const tagSet = new Set();

        data.images.forEach(img => {
            splitValues(img.category).forEach(cat => categorySet.add(cat));
            splitValues(img.tags).forEach(tag => tagSet.add(tag));

            const locKey = getLocationKey(img.location);
            if (locKey !== 'other') locationSet.add(locKey);
        });

        const categories = ['all', ...Array.from(categorySet)];
        const locations = ['all', ...Array.from(locationSet)];
        const tags = ['all', ...Array.from(tagSet)];

        // 3. Clear content
        contentArea.innerHTML = '';

        // Helper: create filter row
        const createFilterNav = (label, values, filterClass, type) => {
            const nav = document.createElement('div');
            nav.className = 'gallery-filter-nav mb-2';
            nav.innerHTML = `<span class="small fw-bold me-2 text-uppercase">${label}:</span>`;

            values.forEach(value => {
                const btn = document.createElement('button');
                btn.className = `filter-btn ${filterClass} ${value === 'all' ? 'active' : ''}`;
                btn.textContent = value;
                btn.onclick = () => this._apply_gallery_triple_filter(type, value, btn);
                nav.appendChild(btn);
            });

            return nav;
        };

        // 4. Build filter rows
        contentArea.appendChild(createFilterNav('Category', categories, 'cat-filter', 'category'));
        contentArea.appendChild(createFilterNav('Location', locations, 'loc-filter', 'location'));

        const tagNav = createFilterNav('Tag', tags, 'tag-filter', 'tag');
        tagNav.classList.add('mb-4');
        contentArea.appendChild(tagNav);

        // 5. Gallery row
        const row = document.createElement('div');
        row.className = 'row gy-4';
        contentArea.appendChild(row);

        // 6. Render Gallery Items
        data.images.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6 gallery-item-wrapper';

            const itemCategories = splitValues(item.category);
            const itemTags = splitValues(item.tags);
            const itemLocationKey = getLocationKey(item.location);

            col.setAttribute('data-category', itemCategories.join(','));
            col.setAttribute('data-location', itemLocationKey);
            col.setAttribute('data-tags', itemTags.join(','));
            col.setAttribute('data-aos', 'fade-up');
            col.id = `gallery-${item.id_ref}`;

            const categoryBadgesHtml = itemCategories.map(cat => `
                <span class="badge badge-status text-capitalize">
                    <i class="bi bi-folder me-1"></i>${cat}
                </span>
            `).join('');

            const tagBadgesHtml = itemTags.map(tag => `
                <span class="badge bg-info text-dark border text-capitalize">
                    <i class="bi bi-tag me-1"></i>${tag}
                </span>
            `).join('');

            col.innerHTML = `
                <div class="gallery-card shadow-sm">
                    <a href="${item.image_path}" 
                       class="glightbox" 
                       data-gallery="gallery-main" 
                       title="${item.title}: ${item.description} @ ${item.location}">
                        <div class="gallery-img-box">
                            <img src="${item.image_path}" alt="${item.title}">
                        </div>
                    </a>
    
                    <div class="gallery-info-box">
                        <h6 class="gallery-item-title">${item.title}</h6>
                        <p class="gallery-item-desc mb-2">${item.description}</p>
    
                        <div class="d-flex flex-wrap gap-2 mb-2">
                            <span class="badge bg-light text-dark border">
                                <i class="bi bi-geo-alt me-1"></i>${item.location}
                            </span>
                        </div>
    
                        <div class="d-flex flex-wrap gap-2">
                            ${categoryBadgesHtml}
                            ${tagBadgesHtml}
                        </div>
                    </div>
                </div>
            `;

            row.appendChild(col);
        });

        if (typeof GLightbox !== 'undefined') {
            GLightbox({ selector: '.glightbox' });
        }

        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    },

    /**
     * Combined Logic for Category, Location, and Tag filtering
     * File: site-page.js
     */
    _apply_gallery_triple_filter(type, value, activeBtn) {
        // 1. Update visual state for clicked filter row
        const selector =
            type === 'category'
                ? '.cat-filter'
                : type === 'location'
                    ? '.loc-filter'
                    : '.tag-filter';

        document.querySelectorAll(selector).forEach(btn => {
            btn.classList.remove('active');
        });

        activeBtn.classList.add('active');

        // 2. Get active filter values
        const activeCat = document.querySelector('.cat-filter.active')?.textContent.trim().toLowerCase() || 'all';
        const activeLoc = document.querySelector('.loc-filter.active')?.textContent.trim().toLowerCase() || 'all';
        const activeTag = document.querySelector('.tag-filter.active')?.textContent.trim().toLowerCase() || 'all';

        // 3. Show/hide items
        document.querySelectorAll('.gallery-item-wrapper').forEach(item => {
            const itemCategories = (item.getAttribute('data-category') || '')
                .split(',')
                .map(v => v.trim().toLowerCase())
                .filter(Boolean);

            const itemLocation = (item.getAttribute('data-location') || '').trim().toLowerCase();

            const itemTags = (item.getAttribute('data-tags') || '')
                .split(',')
                .map(v => v.trim().toLowerCase())
                .filter(Boolean);

            const matchesCat = activeCat === 'all' || itemCategories.includes(activeCat);
            const matchesLoc = activeLoc === 'all' || itemLocation === activeLoc;
            const matchesTag = activeTag === 'all' || itemTags.includes(activeTag);

            item.style.display = matchesCat && matchesLoc && matchesTag ? 'block' : 'none';
        });

        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    },


    /**
     * Renders the Diary Page with Filtering
     * File: site-page.js
     * Targets: #details-list-container, #section-main-title, #section-main-description
     */
    _render_diary() {
        const data = SiteCore.get('diary');
        const contentArea = document.getElementById('details-list-container');

        if (!data || !data.diaryentries || !contentArea) return;

        // 1. Update Section Header
        const mainTitle = document.getElementById('section-main-title');
        const mainDesc = document.getElementById('section-main-description');

        if (data.section_info) {
            if (mainTitle) {
                mainTitle.innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title}`;
            }
            if (mainDesc) {
                mainDesc.textContent = data.section_info.details;
            }
        }

        // 2. Flatten diary entries and collect tags from each entry
        const allEntries = [];
        const tagSet = new Set();

        Object.keys(data.diaryentries).forEach(groupKey => {
            data.diaryentries[groupKey].forEach(item => {
                const tagsArray = item.tags
                    ? item.tags.split(',').map(tag => tag.trim()).filter(Boolean)
                    : [];

                tagsArray.forEach(tag => tagSet.add(tag));

                allEntries.push({
                    ...item,
                    groupKey,
                    tagsArray
                });
            });
        });

        const filterCategories = ['all', ...Array.from(tagSet)];

        // 3. Clear and build Filter Navigation
        contentArea.innerHTML = '';

        const filterNav = document.createElement('div');
        filterNav.className = 'diary-filter-nav';

        filterCategories.forEach(tag => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${tag === 'all' ? 'active' : ''}`;
            btn.textContent = tag;
            btn.onclick = () => this._filter_diary_items(tag, btn);
            filterNav.appendChild(btn);
        });

        contentArea.appendChild(filterNav);

        // 4. Render Diary Entries
        allEntries.forEach(item => {
            const wrapper = document.createElement('div');
            wrapper.className = 'diary-item-wrapper';
            wrapper.setAttribute('data-tags', item.tagsArray.join(','));
            wrapper.setAttribute('data-aos', 'fade-up');
            wrapper.id = `diary-${item.id_ref}`;

            const descriptionHtml = item.paragraphs
                ? item.paragraphs.map(p => `<p class="mb-3">${p}</p>`).join('')
                : '';

            const imageHtml = item.image_path ? `
                <div class="diary-media mb-4 text-center">
                    <a href="${item.image_path}" class="glightbox" data-gallery="diary-gallery-${item.id_ref}">
                        <img src="${item.image_path}" class="img-fluid rounded shadow-sm border" alt="${item.title}">
                    </a>
                    ${item.image_caption ? `<div class="diary-caption mt-2 small text-muted italic">${item.image_caption}</div>` : ''}
                </div>` : '';

            const tagsHtml = item.tagsArray.map(tag => `
                <span class="badge badge-status text-capitalize">
                    <i class="bi bi-tag me-1"></i>${tag}
                </span>
            `).join('');

            wrapper.innerHTML = `
                <div class="diary-card shadow-sm p-4 mb-4">
                    <h4 class="diary-accent-text text-uppercase mb-2">
                        <i class="bi bi-journal-text me-2"></i>${item.title}
                    </h4>
    
                    <div class="mb-3 d-flex flex-wrap gap-2">
                        <span class="badge badge-dates">
                            <i class="bi bi-calendar3 me-1"></i> ${item.date}
                        </span>
                        ${tagsHtml}
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

        // 5. Re-init GLightbox for diary images
        if (typeof GLightbox !== 'undefined') {
            GLightbox({ selector: '.glightbox' });
        }

        // 6. Refresh AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    },

    /**
     * Helper to filter diary entries
     * File: site-page.js
     */
    _filter_diary_items(tag, activeBtn) {
        document.querySelectorAll('.diary-filter-nav .filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        activeBtn.classList.add('active');

        document.querySelectorAll('.diary-item-wrapper').forEach(item => {
            const tags = item.getAttribute('data-tags') || '';

            const tagList = tags
                .split(',')
                .map(t => t.trim().toLowerCase())
                .filter(Boolean);

            if (tag === 'all' || tagList.includes(tag.toLowerCase())) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }




};
