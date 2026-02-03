const SiteSection = {
    init(section) {
        console.log(`Section Details Page initializing with section: '${section}'...`);

        // --- 0. DATA SYNCHRONIZATION ---

        // --- 1. RENDER ALL SECTIONS ---
        this.render_all_section_details(section);


        console.log("Section Details Page synchronization complete.");
    },

   async render_all_section_details(section){
      try {

        // --- 0. DATA SYNCHRONIZATION ---

        // --- 1. RENDER ALL SECTIONS ---
        this.render_all_details_sections(section);

        // --- THE FIX: Hide preloader once finished ---
        window.hide_preloader();
     }
     catch (error) {
         console.error("Render Error in Section Details page:", error);
         window.hide_preloader(); // Hide anyway to stop the hang
     }
   },

    // Render all or catch rendering problem, also deal with preloader and page 404
    async render_all_details_sections(section) {
        try {
            // Call each section individually
            // --- 1. HEADER & IDENTITY ---
            this.render_sticky_header(section);
            this.render_about();

            // --- 2. METRICS & STATS ---
            this.render_key_information();

            // --- 3. RESUME / TIMELINES ---
            this.render_academic_information();
            this.render_professional_experiences();

            // --- 4. EXPERTISE & SKILLS ---
            this.render_expertise_skills_achievements();
            this.render_skills_tools();
            this.render_honors_awards();
            this.render_courses_trainings_certificates();

            // --- 5. RESEARCH & PROJECTS ---
            this.render_projects();
            this.render_organisational_memberships();
            this.render_sessions_events();
            this.render_languages();
            this.render_portfolios();
            this.render_volunteering_services();
            this.render_publications();

            // --- 6. CONTACT & FOOTER ---
            this.render_contact_details();

            // // --- 7. FOOTER ---
            // this.render_footer();

            // --- THE FIX: Hide preloader once finished ---
            // window.hide_preloader();
        }
        catch (error) {
            console.error("Render Error in index page:", error);
            // window.hide_preloader(); // Hide anyway to stop the hang
        }
    },


    /**
     * Dynamically updates the sticky bar based on the active section using site.json data.
     * @param {string} section - The ID of the active section (e.g., 'about').
     */
    render_sticky_header(section) {
        // 1. Configuration: Mapping section IDs to icons and names
        const site = SiteCore.get('site');
        if (!site || !site.navigation || !site.navigation.main_menu) return;

        // Search for the matching section in navigation data
        const targetUrl = `#${section}`;
        let foundItem = null;

        // Iterate through main menu and submenus to find the config
        site.navigation.main_menu.forEach(item => {
            if (item.url === targetUrl) {
                foundItem = item;
            }
            else if (item.is_dropdown && item.submenu) {
                const sub = item.submenu.find(s => s.url === targetUrl);
                if (sub) foundItem = sub;
            }
        });

        if (!foundItem) return;

        // Map JSON data to the config variable used in your logic
        const config = {
            title: foundItem.label,
            icon: foundItem.icon_class // e.g., "bi bi-person" or "bx bx-home"
        };

        // 2. Identify the header elements in the sticky bar
        const stickyHeader = document.querySelector('.section-detail-header');
        if (!stickyHeader) return;

        const icon = stickyHeader.querySelector('i');

        // 3. Update the Icon classes
        if (icon) {
            // Clear old classes and apply the new classes from JSON
            icon.className = '';

            // Determine prefix (bi or bx) if not already explicitly handled in icon_class
            const prefix = config.icon.includes('bx') ? 'bx' : 'bi';
            icon.className = `${config.icon} me-2`; // Uses the full class string from JSON
        }

        // 4. Update the Text
        // We clear everything except the icon and append the new title
        stickyHeader.innerHTML = '';
        if (icon) stickyHeader.appendChild(icon);
        stickyHeader.appendChild(document.createTextNode(config.title));
    },


    /**
     * About Section Rendering
     * Targets: #about
     * Following the data-driven approach used in site-index.js
     */
    render_about() {
        // Correct data retrieval pattern from site-index.js
        const data = SiteCore.get('personal_information');
        const about = document.getElementById('about');
        if (!data || !about) return;

        const summary = data.profile_summary;
        const fullText = data.about_full_text;

        // 1. Title & Intro mapping
        const mainTitle = about.querySelector('.section-title h2');
        if (mainTitle) {
            mainTitle.innerHTML = `${summary.title} <a href="curriculum_vitae.html?type=standard"><i class="bx bx-printer ms-2"></i></a>`;
        }
        const intro = about.querySelector('.section-title h6');
        if (intro) intro.innerHTML = summary.intro_paragraph_html;

        // 2. Formal photo mapping
        const formalPhotoWrap = about.querySelector('.formal-photo');
        if (formalPhotoWrap && data?.assets?.images?.profile_image_formal) {
            const link = formalPhotoWrap.querySelector('a');
            const img = formalPhotoWrap.querySelector('img');
            const photoPath = data.assets.images.profile_image_formal;

            if (link) link.href = photoPath;
            if (img) img.src = photoPath;
        }

        // 3. Overview Content mapping
        const contentBox = about.querySelector('.content');
        if (contentBox) {
            const subtitle = contentBox.querySelector('h3');
            if (subtitle) subtitle.textContent = summary.subtitle;

            const uls = contentBox.querySelectorAll('ul');

            // Left Column mapping
            if (uls[0] && summary.key_points_left) {
                uls[0].innerHTML = summary.key_points_left.map((p) => `
                    <li data-aos="fade-in" data-aos-delay="100"><i class="${p.icon_class}"></i> <strong>${p.strong}:</strong> <span>${p.text}</span></li>
                `).join('');
            }

            // Right Column mapping
            if (uls[1] && summary.key_points_right) {
                uls[1].innerHTML = summary.key_points_right.map((p) => `
                    <li data-aos="fade-in" data-aos-delay="100"><i class="${p.icon_class}"></i> <strong>${p.strong}:</strong> 
                        <span>${p.link ? `<a href="${p.link}" target="_blank" rel="noreferrer">${p.text}</a>` : p.text}</span>
                    </li>
                `).join('');
            }
        }

        // 4. Research Area & Recent Works (Bottom List)
        const bottomList = about.querySelector('.col-lg-12 ul');
        if (bottomList) {
            const res = summary.research_area;
            const works = summary.recent_works;
            bottomList.innerHTML = `
                <li data-aos="fade-in" data-aos-delay="100"><i class="${res.icon_class} me-2 accent-color"></i> <strong>${res.title}:</strong> <span>${res.text}</span></li>
                <li data-aos="fade-in" data-aos-delay="100"><i class="${works.icon_class} me-2 accent-color"></i> <strong>${works.title}:</strong> <span>${works.text}</span></li>
            `;
        }

        // 5. Detailed "About Me" Section mapping
        const aboutMeTitle = about.querySelector('.section-title:last-of-type h2');
        if (aboutMeTitle) aboutMeTitle.innerHTML = `<i class="${fullText.icon_class} ms-2"></i> ${fullText.title}`;

        const aboutMeText = about.querySelector('.section-title:last-of-type p');
        if (aboutMeText) aboutMeText.innerHTML = fullText.paragraph_html;
    },


    /**
     * Key Information (Metrics) Rendering
     * Targets: #key_information
     * Patterns adapted from site-index.js
     */
    render_key_information() {
        const data = SiteCore.get('key_information');
        const section = document.getElementById('key_information');
        if (!data || !section) return;

        // 1. Update Section Header
        const titleBox = section.querySelector('.section-title');
        if (titleBox && data.section_info) {
            const h2 = titleBox.querySelector('h2');
            if (h2) {
                h2.innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title}`;
            }
            const h6 = titleBox.querySelector('h6');
            if (h6) {
                h6.textContent = data.section_info.details;
            }
        }

        // 2. Update Metrics Grid using dynamic mapping
        const container = section.querySelector('.row.gy-4');
        if (container && data.metrics) {
            container.innerHTML = data.metrics.map((m, index) => `
            <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="${(index % 4) * 100}">
                <div class="stats-item">
                    <i class="${m.icon_class}"></i>
                    <span data-purecounter-start="0" 
                          data-purecounter-end="${m.value}" 
                          data-purecounter-duration="1.5" 
                          data-purecounter-once="true"
                          class="purecounter">${m.value}</span>
                    <p><strong>${m.strong_text}</strong> ${m.description}</p>
                </div>
            </div>
        `).join('');
        }

        // 3. Re-initialize PureCounter for the newly injected dynamic elements
        if (typeof PureCounter !== 'undefined') {
            new PureCounter();
        }

        console.log("Key Information section synchronized with JSON data.");
    },


    /**
     * Renders Academic Information section
     * Target: #academic_information
     * Format: Matches section_details.html card structure
     */
    render_academic_information() {
        const data = SiteCore.get('academic_information');
        const section = document.getElementById('academic_information');
        if (!data || !section) return;

        // Update Section Header
        const header = section.querySelector('.section-title');
        if (header && data.section_info) {
            header.querySelector('h2').innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title}`;
            header.querySelector('h6').textContent = data.section_info.details;
        }

        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;
        contentContainer.innerHTML = '';

        // Grouping logic remains identical to keep content parity
        const groupedDegrees = data.degrees.reduce((acc, deg) => {
            if (!acc[deg.degree_level]) acc[deg.degree_level] = [];
            acc[deg.degree_level].push(deg);
            return acc;
        }, {});

        Object.keys(groupedDegrees).forEach(level => {
            // Level Header Row using the new .details-category-header class
            const headerRow = document.createElement('div');
            headerRow.className = 'col-12 mt-5 mb-3';
            headerRow.setAttribute('data-aos', 'fade-up');
            headerRow.innerHTML = `<h2 class="details-category-header"><i class="bi bi-mortarboard-fill me-2"></i>${level.toUpperCase()}</h2>`;
            contentContainer.appendChild(headerRow);

            groupedDegrees[level].forEach(deg => {
                const cardCol = document.createElement('div');
                cardCol.className = 'col-12 mb-4';
                cardCol.setAttribute('data-aos', 'fade-up');

                // ADDED: Assigned degree_id for Auto-Scrolling
                cardCol.id = deg.degree_id;

                cardCol.innerHTML = this._build_details_academic_card(deg);
                contentContainer.appendChild(cardCol);
            });
        });
    },

    /**
     * Helper to build the specific card structure from section_details.html
     */
    _build_details_academic_card(degree) {
        const collabHtml = (degree.collaboration && degree.collaboration.length > 0) ? `
            <div class="p-3 mb-3 small academic-collab-box">
                <span class="fw-bold"><i class="bi bi-people-fill me-2"></i>Institutional Collaboration:</span>
                <ul class="mb-0 mt-2 small">
                    ${degree.collaboration.map(c => `<li><strong>${c.collaboration_type}:</strong> ${c.degree_major} — 
                    <a href="${c.institution_link}" target="_blank" class="details-accent-link">${c.institution_name}</a> (${c.institution_location})</li>`).join('')}
                </ul>
            </div>` : '';

        const projectsHtml = degree.research_projects.map(rp => `
            <div class="list-group-item px-0 bg-transparent">
                <div class="d-flex justify-content-between"><strong>${rp.type}:</strong></div>
                <span class="text-secondary">${rp.title}</span>
                <div class="fst-italic mt-1 text-muted"><span class="fw-bold">Tools:</span> ${rp.tools}</div>
            </div>`).join('');

        return `
            <div class="card shadow-sm border-0 details-card">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                        <div>
                            <h4 class="fw-bold details-card-title mb-1">${degree.degree_major} — (${degree.degree_short_name || ''})</h4>
                            <p class="text-secondary mb-0">${degree.department_name}</p>
                        </div>
                    </div>
                    <div class="mb-3">
                        <i class="bi bi-building-fill me-2 text-muted"></i>
                        <a href="${degree.institution_link}" target="_blank" class="details-accent-link">${degree.institution_name}</a>
                        <span class="ms-2 text-muted small"><i class="bi bi-geo-alt me-1"></i>${degree.institution_location}</span>
                    </div>
                    <div class="d-flex flex-wrap gap-2 mb-4">
                        <span class="badge badge-dates"><i class="bi bi-calendar3 me-1"></i> ${degree.timeframe_details.start_date} – ${degree.timeframe_details.end_date}</span>
                        <span class="badge badge-duration"><i class="bi bi-hourglass-split me-1"></i> ${degree.timeframe_details.max_duration}</span>
                        <span class="badge badge-institute"><i class="bi bi-person-workspace me-1"></i> ${degree.degree_type}</span>
                        <span class="badge badge-status"><i class="bx bx-medal me-1"></i> ${degree.timeframe_details.award_date}</span>
                    </div>
                    <div class="row">
                        <div class="col-lg-7 border-end">
                            <p class="mb-3 small"><strong><i class="bi bi-magic me-1"></i> Specialisation:</strong> ${degree.specialisation}</p>
                            <div class="details-text-justify mb-4 small"><strong><i class="bi bi-file me-1"></i> Details:</strong> ${degree.description_full}</div>
                            <p class="mb-0 small"><strong><i class="bi bi-person-arms-up me-2"></i>Activities:</strong> ${degree.activities_involvement}</p>
                        </div>
                        <div class="col-lg-5 mt-4 mt-lg-0">
                            ${collabHtml}
                            <div class="mb-3 small"><strong><i class="bi bi-gift me-1"></i> Scholarship/Funding:</strong>
                                <div class="text-muted mt-1">${degree.scholarship ? degree.scholarship.scholarship_name : 'N/A'}</div>
                            </div>
                            <div class="mb-3 small"><strong><i class="bx bx-bulb me-1"></i> Research Topic:</strong>
                                <p class="small text-secondary mt-1">${degree.research_topic}</p>
                            </div>
                            ${degree.thesis_details ? `<div class="mb-3 small"><strong><i class="bi bi-file-richtext me-1"></i> Thesis:</strong> ${degree.thesis_details.thesis_title} 
                                <div class="text-muted small mt-1">Length: ${degree.thesis_details.thesis_length}</div></div>` : ''}
                        </div>
                    </div>
                    <div class="mt-4">
                        <h6 class="fw-bold"><i class="bx bxs-flask me-2"></i>Research and Projects</h6>
                        <div class="list-group list-group-flush small">${projectsHtml}</div>
                    </div>
                    <div class="mt-4 pt-3 border-top">
                        <span class="fw-bold small text-uppercase"><i class="bi bi-tags-fill me-2"></i>Skills:</span>
                        <span class="mt-2 text-muted italic small">${degree.related_skills}</span>
                    </div>
                </div>
            </div>`;
    },



    /**
     * Renders Professional Experiences section
     * Target: #professional_experiences
     * Format: Matches section_details.html card structure
     */
    render_professional_experiences() {
        const data = SiteCore.get('professional_experiences');
        const section = document.getElementById('professional_experiences');
        if (!data || !section) return;

        // 1. Update Section Header
        const header = section.querySelector('.section-title');
        if (header && data.section_info) {
            header.querySelector('h2').innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title}`;
            header.querySelector('h6').textContent = data.section_info.details;
        }

        // 2. Identify and Clear Content Container
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;
        contentContainer.innerHTML = '';

        // 3. Render Categorized Experiences
        if (data.experiences) {
            data.experiences.forEach(cat => {
                // Category Header (e.g., Research Experiences)
                const catHeader = document.createElement('div');
                catHeader.className = 'col-12 mt-5 mb-3';
                catHeader.setAttribute('data-aos', 'fade-up');
                catHeader.innerHTML = `<h2 style="font-size: 18px; font-weight: 700; color: var(--accent-color); text-transform: uppercase; letter-spacing: 1px;">
                    <i class="${cat.organisation[0]?.icon_class || 'bx bx-briefcase'} me-2"></i>${cat.category.toUpperCase()}</h2>`;
                contentContainer.appendChild(catHeader);

                // Organisations and Roles
                cat.organisation.forEach(org => {
                    // Organisation Sub-header
                    const orgHeader = document.createElement('div');
                    orgHeader.className = 'col-12 mt-4 mb-2 ps-2';
                    orgHeader.setAttribute('data-aos', 'fade-up');
                    orgHeader.innerHTML = `
                        <h3 class="fw-bold mb-1" style="font-size: 16px; color: var(--heading-color);">
                            <i class="bi bi-building-fill me-2 text-muted"></i>
                            <a href="${org.link}" target="_blank" class="text-decoration-none" style="color: var(--accent-color);">${org.organization}</a>
                            <span class="text-muted small ms-2"><i class="bi bi-geo-alt me-1"></i>${org.location}</span>
                        </h3>`;
                    contentContainer.appendChild(orgHeader);

                    // Render Role Cards for this Organisation
                    org.roles.forEach(role => {
                        const cardCol = document.createElement('div');
                        cardCol.className = 'col-12 mb-4';
                        cardCol.setAttribute('data-aos', 'fade-up');
                        cardCol.innerHTML = this._build_details_experience_card(role);
                        contentContainer.appendChild(cardCol);
                    });
                });
            });
        }
    },

    /**
     * Helper to build the specific professional card structure from section_details.html
     */
    /**
     * Helper to build the specific professional card structure from section_details.html
     * Targets: col-lg-7 (Left) and col-lg-5 (Right)
     */
    _build_details_experience_card(role) {
        // 1. Left Side: Key Responsibilities
        const responsibilitiesHtml = role.responsibilities_list?.length > 0 ? `
            <div class="mt-3">
                <strong class="small"><i class="bi bi-check2-circle me-2"></i>Key Responsibilities:</strong>
                <ul class="mb-0 small mt-1 list-unstyled">
                    ${role.responsibilities_list.map(item => `<li class="mb-1 d-flex align-items-start"><i class="bi bi-dot me-1"></i><span>${item}</span></li>`).join('')}
                </ul>
            </div>` : '';

        // 2. Right Side: Role Summary
        const summaryHtml = role.description_list?.length > 0 ? `
            <div class="mt-3">
                <strong class="small"><i class="bi bi-info-circle me-2"></i>Role Summary:</strong>
                <ul class="mb-0 small mt-1 list-unstyled">
                    ${role.description_list.map(item => `<li class="mb-1 d-flex align-items-start"><i class="bi bi-dot me-1"></i><span>${item}</span></li>`).join('')}
                </ul>
            </div>` : '';

        // 3. Right Side: Course Involvement (The New Addition)
        const courseInvolvementHtml = role.course_involvement?.length > 0 ? `
            <div class="mt-3">
                <strong class="small"><i class="bi bi-book me-2"></i>Course Involvement:</strong>
                <ul class="mb-0 small mt-1 list-unstyled">
                    ${role.course_involvement.map(course => `<li class="mb-1 d-flex align-items-start"><i class="bi bi-dot me-1"></i><span>${course}</span></li>`).join('')}
                </ul>
            </div>` : '';

        // Calculate dynamic duration using SiteUtil
        const duration = role.timeframe_details.duration || SiteUtil.calculateDuration(role.timeframe_details.start_date, role.timeframe_details.end_date);

        return `
            <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                        <h4 class="fw-bold text-dark mb-1" style="font-size: 16px;">${role.title}</h4>
                    </div>

                    <div class="d-flex flex-wrap gap-2 mb-4">
                        <span class="badge badge-dates"><i class="bi bi-calendar3 me-1"></i> ${role.timeframe_details.start_date} – ${role.timeframe_details.end_date}</span>
                        <span class="badge badge-duration"><i class="bi bi-hourglass-split me-1"></i> ${duration}</span>
                        <span class="badge badge-institute"><i class="bi bi-person-workspace me-1"></i> ${role.role_type}</span>
                        ${role.timeframe_details.end_date === 'Present' ? '<span class="badge badge-status"><i class="bx bx-medal me-1"></i> Ongoing</span>' : ''}
                    </div>

                    <div class="row">
                        <div class="col-lg-7 border-end">
                            <div class="text-justify mb-2 small" style="line-height: 1.6;">
                                <strong><i class="bi bi-file-earmark-text me-1"></i> About the Role:</strong> ${role.about_job}
                            </div>
                            ${responsibilitiesHtml}
                        </div>
                        <div class="col-lg-5 mt-4 mt-lg-0">
                            ${summaryHtml}
                            ${courseInvolvementHtml}
                        </div>
                    </div>

                    <div class="mt-4 pt-3 border-top">
                        <span class="fw-bold small">
                            <i class="bi bi-tags-fill me-2"></i>Competencies:
                        </span>
                        <span class="mt-2 text-muted italic small">${role.related_skills || 'N/A'}</span>
                    </div>
                </div>
            </div>`;
    },


    /**
     * Renders the main Expertise, Skills & Achievements wrapper header
     * Target: #expertise_skills_achievements
     */
    render_expertise_skills_achievements() {
        const data = SiteCore.get('expertise_skills_achievements');
        const section = document.getElementById('expertise_skills_achievements');
        if (!data || !section) return;

        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            const h2 = header.querySelector('h2');
            if (h2) {
                h2.innerHTML = `<i class="${info.icon_class}"></i> ${info.title}`;
            }
            const h6 = header.querySelector('h6');
            if (h6) h6.textContent = info.details;
        }
    },


    /**
     * Renders the Skills and Tools subsection as detailed cards
     * Target: #skills_tools
     */
    render_skills_tools() {
        const data = SiteCore.get('skills_tools');
        const section = document.getElementById('skills_tools');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title}`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Clear and Render Skills Grid
        const gridRow = section.querySelector('.container .row');
        if (gridRow && data.skills) {
            gridRow.innerHTML = ''; // Wipe existing static items

            data.skills.forEach((skill, index) => {
                const cardCol = document.createElement('div');
                cardCol.className = 'col-12 mb-4';
                cardCol.setAttribute('data-aos', 'fade-up');
                cardCol.setAttribute('data-aos-delay', (index % 4) * 100);

                // Split descriptions for the detailed lists and badges
                const detailPoints = skill.details_description.split('. ').filter(p => p.trim() !== '');
                const techBadges = skill.short_description.split(', ');

                cardCol.innerHTML = `
                    <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-center flex-wrap mb-3">
                                <h4 class="fw-bold text-dark mb-0" style="font-size: 18px;">
                                    <i class="${skill.icon_class} me-2" style="color: var(--accent-color);"></i>${skill.category}
                                </h4>
                                <span class="badge badge-duration" style="font-size: 13px;">
                                    <i class="bi bi-lightning-fill me-1"></i> ${skill.level}% Proficiency
                                </span>
                            </div>

                            <div class="progress mb-4" style="height: 8px; background-color: #f0f0f0; border-radius: 10px;">
                                <div class="progress-bar shadow-none" role="progressbar" 
                                     style="width: ${skill.level}%; background-color: var(--accent-color); border-radius: 10px;" 
                                     aria-valuenow="${skill.level}" aria-valuemin="0" aria-valuemax="100">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-lg-7 border-end">
                                    <h6 class="fw-bold mb-3" style="font-size: 14px; color: var(--heading-color);">
                                        <i class="bi bi-briefcase me-2"></i>Professional Application
                                    </h6>
                                    <ul class="mb-0 ps-0 mt-2 list-unstyled">
                                        ${detailPoints.map(point => {
                                            const parts = point.split(':');
                                            const strongText = parts.length > 1 ? `<strong style="color: var(--heading-color);">${parts[0]}:</strong>` : '';
                                            const contentText = parts.length > 1 ? parts[1] : parts[0];
                                            return `
                                                <li class="mb-2 d-flex align-items-start small">
                                                    <i class="bi bi-check2-circle text-primary me-2 mt-1"></i>
                                                    <span>${strongText} ${contentText}${point.endsWith('.') ? '' : '.'}</span>
                                                </li>`;
                                        }).join('')}
                                    </ul>
                                </div>

                                <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4">
                                    <h6 class="fw-bold mb-1" style="font-size: 14px; color: var(--heading-color);">
                                        <i class="bi bi-stack me-2"></i>Technologies & Frameworks
                                    </h6>
                                    <div class="mt-3 d-flex flex-wrap gap-2">
                                        ${techBadges.map(tech => `
                                            <span class="badge bg-light text-dark border-0 shadow-sm px-3 py-2" style="font-size: 12px; font-weight: 500;">
                                                ${tech.trim()}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                gridRow.appendChild(cardCol);
            });
        }
    },


    /**
     * Renders Honors and Awards section
     * Target: #honors_awards
     * Format: Detailed Card with split layout
     */
    render_honors_awards() {
        const data = SiteCore.get('honors_awards');
        const section = document.getElementById('honors_awards');
        if (!data || !section) return;

        // 1. Update Section Header
        const header = section.querySelector('.section-title');
        if (header && data.section_info) {
            header.querySelector('h2').innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title}`;
            header.querySelector('h6').textContent = data.section_info.details;
        }

        // 2. Identify and Clear Content Container
        const gridRow = section.querySelector('.container .row');
        if (gridRow && data.honorsawards) {
            gridRow.innerHTML = ''; // Wipe existing static items

            data.honorsawards.forEach((award, index) => {
                const cardCol = document.createElement('div');
                cardCol.className = 'col-12 mb-4';
                cardCol.setAttribute('data-aos', 'fade-up');
                cardCol.setAttribute('data-aos-delay', (index % 3) * 100);

                // Check for associated organization data
                const hasAssocOrg = award.associated_organization && award.associated_organization.name;
                const assocOrgHtml = hasAssocOrg ? `
                    <div class="p-3 mb-3 small" style="background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #6c757d;">
                        <span class="fw-bold"><i class="bi bi-link-45deg me-2"></i>Associated Partner:</span>
                        <div class="mt-1">
                            <a href="${award.associated_organization.link}" target="_blank" class="text-decoration-none fw-bold" style="color: var(--accent-color);">
                                ${award.associated_organization.name}
                            </a>
                        </div>
                    </div>` : '';

                // Build Action Button (Image or Link)
                const actionButtonHtml = award.award_link ? `
                    <div class="mt-3">
                        <a href="${award.award_link}" target="_blank" class="btn btn-sm w-100 btn-outline-primary" style="font-size: 13px; border-radius: 6px;">
                            <i class="bi bi-shield-check me-1"></i> View Details
                        </a>
                    </div>` : '';

                cardCol.innerHTML = `
                    <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                                <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                    <i class="${award.icon_class || 'bi bi-award'} me-2" style="color: var(--accent-color);"></i>${award.title}
                                </h4>
                            </div>

                            <div class="mb-3">
                                <i class="bi bi-building-fill me-2 text-muted"></i>
                                <a href="${award.issuer_organization.link}" target="_blank" class="fw-bold text-decoration-none" style="color: var(--accent-color); font-size: 16px;">
                                    ${award.issuer_organization.name}
                                </a>
                                ${award.issuer_organization.location ? `<span class="ms-1 text-muted small"> (${award.issuer_organization.location})</span>` : ''}
                            </div>

                            <div class="mb-4">
                                <span class="badge badge-dates px-3 py-2" style="font-size: 13px;">
                                    <i class="bi bi-calendar3 me-1"></i> ${award.date}
                                </span>
                                <span class="badge badge-institute" style="white-space: normal; text-align: left; line-height: 1.4;">
                                    <i class="bi bi-patch-check me-1"></i> ${award.short_description}
                                </span>
                            </div>

                            <div class="row">
                                <div class="col-lg-7 border-end">
                                    <div class="text-justify mb-2 small" style="line-height: 1.6;">
                                        <strong><i class="bi bi-file-earmark-text me-1"></i> Full Description:</strong>
                                        ${award.description_full}
                                    </div>
                                </div>
                                <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4">
                                    ${assocOrgHtml}
                                    ${actionButtonHtml}
                                </div>
                            </div>
                        </div>
                    </div>`;
                gridRow.appendChild(cardCol);
            });
        }
    },


    /**
     * Renders Courses, Trainings and Certificates section
     * Target: #courses_trainings_certificates
     * Format: Detailed Card structure matching section_details.html
     */
    render_courses_trainings_certificates() {
        const data = SiteCore.get('courses_trainings_certificates');
        const section = document.getElementById('courses_trainings_certificates');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title}`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Identify and Clear Content Container
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;

        // Find or create the row inside the container
        let gridRow = contentContainer.querySelector('.row');
        if (!gridRow) {
            gridRow = document.createElement('div');
            gridRow.className = 'row';
            contentContainer.appendChild(gridRow);
        }
        gridRow.innerHTML = ''; // Wipe existing static items

        // 3. Render all items as detailed cards
        if (data.coursestrainingscertificates) {
            data.coursestrainingscertificates.forEach((item, index) => {
                const cardCol = document.createElement('div');
                cardCol.className = 'col-12 mb-4';
                cardCol.setAttribute('data-aos', 'fade-up');
                cardCol.setAttribute('data-aos-delay', (index % 3) * 100);

                cardCol.innerHTML = this._build_details_certificate_card(item);
                gridRow.appendChild(cardCol);
            });
        }
    },

    /**
     * Helper to build the detailed certificate card structure
     */
    _build_details_certificate_card(item) {
        const details = item.details;

        // Split types for badges
        const typeBadges = details.type.split(', ').map(type =>
            `<span class="badge badge-institute"><i class="bi bi-tag-fill me-1"></i> ${type.trim()}</span>`
        ).join('');

        // Build Highlights list
        const highlightsHtml = details.key_information?.length > 0 ? `
            <div class="mt-3">
                <strong class="small"><i class="bi bi-list-check me-2"></i>Key Program Highlights:</strong>
                <ul class="mb-0 mt-2 small list-unstyled">
                    ${details.key_information.map(info => `
                        <li class="mb-2 d-flex align-items-start">
                            <i class="bi bi-patch-check-fill text-primary me-2 mt-1"></i>
                            <span>${info}</span>
                        </li>`).join('')}
                </ul>
            </div>` : '';

        // Verification and Course Buttons
        const courseLinkBtn = details.course_link ? `
            <a href="${details.course_link}" target="_blank" class="btn btn-sm btn-outline-secondary w-100 mb-2" style="font-size: 13px;">
                <i class="bi bi-journal-bookmark me-1"></i> View Course Page
            </a>` : '';

        const certVerifyBtn = details.certificate_link ? `
            <a href="${details.certificate_link}" target="_blank" class="btn btn-sm btn-primary w-100" style="font-size: 13px; background-color: var(--accent-color); border-color: var(--accent-color);">
                <i class="bi bi-shield-lock me-1"></i> Verify Certificate
            </a>` : '';

        return `
            <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                        <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                            <i class="${item.icon_class || 'bi bi-award'} me-2" style="color: var(--accent-color);"></i>${item.title}
                        </h4>
                        <span class="badge badge-dates px-3 py-2" style="font-size: 13px;">
                            <i class="bi bi-calendar3 me-1"></i> ${details.date}
                        </span>
                    </div>

                    <div class="mb-3">
                        <i class="bi bi-building-fill me-2 text-muted"></i>
                        <span class="fw-bold" style="color: var(--heading-color);">${details.offering_organization}</span>
                        ${details.funding_organization ? `<span class="ms-1 text-muted small"> (Funded by: ${details.funding_organization})</span>` : ''}
                    </div>

                    <div class="mb-4 d-flex flex-wrap gap-2">
                        ${typeBadges}
                    </div>

                    <div class="row">
                        <div class="col-lg-7 border-end">
                            <div>
                                ${item.image_path ? `
                                    <div class="mb-3">
                                        <a href="${item.image_path}" class="glightbox" data-gallery="cert-gallery" title="${item.title}">
                                            <img src="${item.image_path}" class="img-fluid rounded shadow-sm border w-100" style="object-fit: cover;" alt="${item.title}">
                                        </a>
                                    </div>` : ''}
                                <p class="small text-muted mb-2 fst-italic"><i class="bi bi-quote me-1"></i>${item.source}</p>
                            </div>
                            <div class="mt-auto">
                                ${courseLinkBtn}
                                ${certVerifyBtn}
                            </div>
                        </div>

                        <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column justify-content-between">
                            ${highlightsHtml}
                            <div class="text-justify mb-3 small" style="line-height: 1.6;">
                                <strong><i class="bi bi-info-circle me-1"></i> Program Description:</strong>
                                ${details.description || 'No description available.'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    },


    /**
     * Renders Projects section
     * Target: #projects
     * Format: Detailed Card structure matching section_details.html
     */
    render_projects() {
        const data = SiteCore.get('projects');
        const section = document.getElementById('projects');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title}`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Identify and Clear Content Container
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;
        contentContainer.innerHTML = '';

        // 3. Render each project as a detailed card
        if (data.projects) {
            data.projects.forEach((project, index) => {
                const cardCol = document.createElement('div');
                cardCol.className = 'col-12 mb-5';
                cardCol.setAttribute('data-aos', 'fade-up');
                cardCol.setAttribute('data-aos-delay', (index % 3) * 100);

                cardCol.innerHTML = this._build_details_project_card(project);
                contentContainer.appendChild(cardCol);
            });
        }
    },

    /**
     * Helper to build the detailed project card structure
     */
    _build_details_project_card(project) {
        // Build Funding List
        const fundingListHtml = project.funding_organization?.length > 0 ? `
            <div class="mb-3">
                <strong><i class="bi bi-building me-2"></i>Funding Organisation:</strong>
                <ul class="list-unstyled mt-1 mb-0 ps-0">
                    ${project.funding_organization.map(org => `
                        <li class="mb-1">
                            <i class="bi bi-patch-check-fill text-primary"></i>
                            <a href="${org.link}" target="_blank" class="text-decoration-none" style="color: var(--accent-color);">${org.name}</a>
                            <span class="text-muted small">, ${org.location}</span>
                        </li>`).join('')}
                </ul>
            </div>` : '';

        // Build Collaborators List
        const collaboratorsHtml = project.collaboration_organization?.length > 0 ? `
            <div class="mb-3 small p-3 bg-light rounded border-start border-3" style="border-color: #6c757d !important;">
                <strong><i class="bi bi-building me-2"></i>Key Collaborators:</strong>
                <ul class="list-unstyled mt-2 mb-0 ps-0">
                    ${project.collaboration_organization.map(collab => `
                        <li class="mb-2 d-flex align-items-start">
                            <i class="bi bi-patch-check-fill me-1 text-primary"></i>
                            <span>
                                <a href="${collab.link}" target="_blank" class="text-dark fw-bold text-decoration-none">${collab.name}</a>
                                <span class="text-muted x-small">, ${collab.location}</span>
                            </span>
                        </li>`).join('')}
                </ul>
            </div>` : '';

        // Status Badge Logic
        const isOngoing = project.status.toLowerCase().includes('ongoing');
        const statusBadge = isOngoing
            ? '<span class="badge badge-status"><i class="bi bi-info-circle me-1"></i> Ongoing</span>'
            : `<span class="badge badge-status"><i class="bi bi-check-circle me-1"></i> ${project.status}</span>`;

        return `
            <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                        <div>
                            <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                <i class="${project.icon_class || 'bi bi-lightbulb'} me-2" style="color: var(--accent-color);"></i>${project.title}
                            </h4>
                            <p class="text-secondary mb-0 fw-medium" style="font-size: 15px;">
                                <i class="bi bi-person-badge me-1"></i> ${project.role}
                            </p>
                        </div>
                    </div>

                    <div class="d-flex flex-wrap gap-2 mb-4">
                        <span class="badge badge-institute"><i class="bi bi-layers-half me-1"></i> ${project.basic_details}</span>
                        <span class="badge badge-dates px-3 py-2" style="font-size: 13px;">
                            <i class="bi bi-calendar3 me-1"></i> ${project.timeframe_details.start_date} – ${project.timeframe_details.end_date}
                        </span>
                        ${statusBadge}
                    </div>

                    <div class="row">
                        <div class="col-lg-7 border-end">
                            ${project.image_path ? `
                                <div class="mb-3 mt-2">
                                    <a href="${project.image_path}" class="glightbox" data-gallery="project-gallery" title="${project.title}">
                                        <img src="${project.image_path}" class="img-fluid rounded shadow-sm border w-100" style="object-fit: cover; max-height: 200px;" alt="${project.title}">
                                    </a>
                                </div>` : ''}
                            <div class="small p-3 bg-light rounded mb-3">
                                <strong><i class="bi bi-gift me-2"></i>Funding Status:</strong> ${project.funding || 'N/A'}
                                ${fundingListHtml}
                            </div>
                        </div>

                        <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column">
                            ${collaboratorsHtml}
                            <h6 class="fw-bold small text-uppercase mb-2" style="color: var(--accent-color);">Project Overview</h6>
                            <div class="text-justify mb-4 small" style="line-height: 1.6;">${project.long_description}</div>
                        </div>
                    </div>
                </div>
            </div>`;
    },


    /**
     * Renders Organisational Memberships section
     * Target: #organisational_memberships
     * Format: Detailed Card structure matching section_details.html
     */
    render_organisational_memberships() {
        const data = SiteCore.get('organisational_memberships');
        const section = document.getElementById('organisational_memberships');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title}`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Identify and Clear Content Container
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;

        // Find or create the grid row
        let gridRow = contentContainer.querySelector('.row');
        if (!gridRow) {
            gridRow = document.createElement('div');
            gridRow.className = 'row';
            contentContainer.appendChild(gridRow);
        }
        gridRow.innerHTML = ''; // Wipe existing static items

        // 3. Render each membership as a detailed card
        if (data.memberships) {
            data.memberships.forEach((mem, index) => {
                const cardCol = document.createElement('div');
                cardCol.className = 'col-12 mb-4';
                cardCol.setAttribute('data-aos', 'fade-up');
                cardCol.setAttribute('data-aos-delay', (index % 3) * 100);

                cardCol.innerHTML = this._build_details_membership_card(mem);
                gridRow.appendChild(cardCol);
            });
        }
    },

    /**
     * Helper to build the detailed membership card structure
     */
    _build_details_membership_card(mem) {
        // Build Affiliated Organisation List
        const orgsHtml = mem.membership_organization?.length > 0 ? `
            <div class="mb-3 small">
                <strong><i class="bi bi-building me-2"></i>Affiliated Organisation(s):</strong>
                <ul class="list-unstyled mt-2 mb-0 ps-0">
                    ${mem.membership_organization.map(org => `
                        <li class="mb-2 d-flex align-items-start">
                            <i class="bi bi-patch-check-fill me-2 text-primary"></i>
                            <span>
                                ${org.link ? `<a href="${org.link}" target="_blank" class="fw-bold text-decoration-none" style="color: var(--accent-color);">${org.name}</a>` : `<span class="fw-bold">${org.name}</span>`}
                                <span class="text-muted x-small">, ${org.location}</span>
                            </span>
                        </li>`).join('')}
                </ul>
            </div>` : '';

        // Optional Verification/Link Button
        const actionButtonHtml = mem.url_link ? `
            <div class="mt-auto">
                <a href="${mem.url_link}" target="_blank" class="btn btn-sm btn-primary w-100" style="font-size: 13px; background-color: var(--accent-color); border-color: var(--accent-color);">
                    <i class="bi bi-box-arrow-up-right me-1"></i> Verification/Link
                </a>
            </div>` : '';

        return `
            <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                        <div>
                            <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                <i class="${mem.icon_class || 'bi bi-person-check'} me-2" style="color: var(--accent-color);"></i>${mem.title}
                            </h4>
                            <p class="text-secondary mb-0 fw-medium" style="font-size: 15px;">
                                <i class="bi bi-award me-1"></i> ${mem.role}
                                <span class="text-muted"> | ${mem.membership_organization[0]?.name || ''}</span>
                            </p>
                        </div>
                    </div>

                    <div class="d-flex flex-wrap gap-2 mb-4">
                        <span class="badge badge-dates px-3 py-2" style="font-size: 13px;">
                            <i class="bi bi-calendar3 me-1"></i> ${mem.timeframe_details.start_date} – ${mem.timeframe_details.end_date}
                        </span>
                    </div>

                    <div class="row">
                        <div class="col-lg-7 border-end">
                            <div class="text-justify mb-3 small" style="line-height: 1.6;">
                                <h6 class="fw-bold small text-uppercase mb-2" style="color: var(--accent-color);">Membership Summary</h6>
                                ${mem.description_full}
                            </div>
                            ${mem.image_path ? `
                                <div class="mb-3">
                                    <a href="${mem.image_path}" class="glightbox" data-gallery="mem-gallery" title="${mem.title}">
                                        <img src="${mem.image_path}" class="img-fluid rounded shadow-sm border w-100" style="object-fit: cover; max-height: 200px;" alt="${mem.title}">
                                    </a>
                                </div>` : ''}
                        </div>

                        <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column">
                            ${orgsHtml}
                            ${actionButtonHtml}
                        </div>
                    </div>
                </div>
            </div>`;
    },


    /**
     * Renders Sessions and Events section
     * Target: #sessions_events
     * Format: Detailed Card structure matching section_details.html
     */
    render_sessions_events() {
        const data = SiteCore.get('sessions_events');
        const section = document.getElementById('sessions_events');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title}`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Identify and Clear Content Container
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;

        let gridRow = contentContainer.querySelector('.row');
        if (!gridRow) {
            gridRow = document.createElement('div');
            gridRow.className = 'row gy-4';
            contentContainer.appendChild(gridRow);
        }
        gridRow.innerHTML = ''; // Wipe existing static items

        // 3. Render each session/event as a detailed card
        if (data.sessionsevents) {
            data.sessionsevents.forEach((event, index) => {
                const cardCol = document.createElement('div');
                cardCol.className = 'col-12 mb-4';
                cardCol.setAttribute('data-aos', 'fade-up');
                cardCol.setAttribute('data-aos-delay', (index % 3) * 100);

                cardCol.innerHTML = this._build_details_session_event_card(event);
                gridRow.appendChild(cardCol);
            });
        }
    },

    /**
     * Helper to build the detailed session/event card structure
     */
    _build_details_session_event_card(event) {
        // Build Action Button if a link exists
        const actionButtonHtml = event.url_link ? `
            <div class="mt-auto">
                <a href="${event.url_link}" target="_blank" class="btn btn-sm btn-primary w-100" style="font-size: 13px; background-color: var(--accent-color); border-color: var(--accent-color);">
                    <i class="bi bi-box-arrow-up-right me-1"></i> View Event Details
                </a>
            </div>` : '';

        return `
            <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                        <div>
                            <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                <i class="${event.icon_class || 'bi bi-calendar-event'} me-2" style="color: var(--accent-color);"></i>${event.title}
                            </h4>
                            <p class="text-secondary mb-0 fw-medium" style="font-size: 15px;">
                                <i class="bi bi-building me-1"></i> ${event.organization}
                                <span class="text-muted small ms-1"><i class="bi bi-geo-alt me-1"></i>${event.location}</span>
                            </p>
                        </div>
                    </div>

                    <div class="d-flex flex-wrap gap-2 mb-4">
                        <span class="badge badge-dates px-3 py-2" style="font-size: 13px;">
                            <i class="bi bi-calendar3 me-1"></i> ${event.date}
                        </span>
                        <span class="badge badge-status"><i class="bi bi-info-circle me-1"></i> ${event.type}</span>
                    </div>

                    <div class="row">
                        <div class="col-lg-7 border-end">
                            <div class="text-justify mb-2 small" style="line-height: 1.6;">
                                <h6 class="fw-bold small text-uppercase mb-2" style="color: var(--accent-color);">Session Overview</h6>
                                ${event.description}
                            </div>
                            ${event.image_path ? `
                                <div class="mb-3">
                                    <a href="${event.image_path}" class="glightbox" data-gallery="event-gallery" title="${event.title}">
                                        <img src="${event.image_path}" class="img-fluid rounded shadow-sm border w-100" style="object-fit: cover; max-height: 200px;" alt="${event.title}">
                                    </a>
                                </div>` : ''}
                        </div>

                        <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column">
                            ${actionButtonHtml}
                        </div>
                    </div>
                </div>
            </div>`;
    },


    /**
     * Renders Languages section
     * Target: #languages
     * Format: Detailed Card structure matching section_details.html
     */
    render_languages() {
        const data = SiteCore.get('languages');
        const section = document.getElementById('languages');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title}`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Identify and Clear Content Container
        const gridRow = section.querySelector('.container .row');
        if (gridRow && data.languages) {
            gridRow.innerHTML = ''; // Wipe existing static items

            data.languages.forEach((lang, index) => {
                const cardCol = document.createElement('div');
                cardCol.className = 'col-12 mb-4';
                cardCol.setAttribute('data-aos', 'fade-up');
                cardCol.setAttribute('data-aos-delay', (index % 3) * 100);

                cardCol.innerHTML = this._build_details_language_card(lang);
                gridRow.appendChild(cardCol);
            });
        }
    },

    /**
     * Helper to build the detailed language card structure
     */
    _build_details_language_card(lang) {
        // Build Proficiency Breakdown & Test Scores for the right side
        let rightSideHtml = '';

        if (lang.test_scores && lang.test_scores.length > 0) {
            rightSideHtml = lang.test_scores.map(test => {
                const breakdown = test.proficiency_breakdown;
                const hasBreakdown = breakdown && (breakdown.listening || breakdown.reading || breakdown.writing || breakdown.speaking);

                return `
                <div class="mb-3 p-3 bg-light rounded border-start border-3" style="border-color: #6c757d !important;">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <strong class="small"><i class="bi bi-journal-check me-2"></i>Proficiency Details</strong>
                        ${test.test_name ? `<span class="badge bg-secondary" style="font-size: 10px;">${test.test_name}: ${test.test_score} (${test.test_year})</span>` : ''}
                    </div>
                    ${hasBreakdown ? `
                    <div class="d-flex flex-wrap gap-2 mt-2">
                        <span class="badge badge-institute" style="font-size: 11px;">L: ${breakdown.listening}</span>
                        <span class="badge badge-institute" style="font-size: 11px;">R: ${breakdown.reading}</span>
                        <span class="badge badge-institute" style="font-size: 11px;">W: ${breakdown.writing}</span>
                        <span class="badge badge-institute" style="font-size: 11px;">S: ${breakdown.speaking}</span>
                    </div>` : ''}
                </div>`;
            }).join('');
        }

        // Action Button
        const actionButtonHtml = lang.url_link ? `
            <div class="mt-auto">
                <a href="${lang.url_link}" target="_blank" class="btn btn-sm btn-primary w-100" style="font-size: 13px; background-color: var(--accent-color); border-color: var(--accent-color);">
                    <i class="bi bi-box-arrow-up-right me-1"></i> Verification/Link
                </a>
            </div>` : '';

        return `
            <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                        <div>
                            <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                <i class="${lang.icon_class} me-2" style="color: var(--accent-color);"></i>${lang.language}
                            </h4>
                            <p class="text-secondary mb-0 fw-medium" style="font-size: 15px;">
                                <i class="bi bi-star me-1"></i> ${lang.status}
                            </p>
                        </div>
                        <div class="mt-2 mt-md-0">
                            <span class="badge badge-status px-3 py-2" style="font-size: 13px;">
                                <i class="bi bi-bar-chart-line me-1"></i> ${lang.proficiency_level}
                            </span>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-7 border-end">
                            <div class="text-justify mb-2 small" style="line-height: 1.6;">
                                <h6 class="fw-bold small text-uppercase mb-2" style="color: var(--accent-color);">Competency Overview</h6>
                                ${lang.details}
                            </div>
                            ${lang.image_path ? `
                                <div class="mb-3">
                                    <a href="${lang.image_path}" class="glightbox" data-gallery="lang-gallery" title="${lang.language}">
                                        <img src="${lang.image_path}" class="img-fluid rounded shadow-sm border w-100" style="object-fit: cover; max-height: 200px;" alt="${lang.language}">
                                    </a>
                                </div>` : ''}
                        </div>

                        <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column">
                            ${rightSideHtml}
                            ${actionButtonHtml}
                        </div>
                    </div>
                </div>
            </div>`;
    },


    /**
     * Renders Portfolios section
     * Target: #portfolios
     * Format: Detailed Card structure matching section_details.html
     */
    render_portfolios() {
        const data = SiteCore.get('portfolios');
        const section = document.getElementById('portfolios');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title}`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Identify and Clear Content Container
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;

        let gridRow = contentContainer.querySelector('.row');
        if (!gridRow) {
            gridRow = document.createElement('div');
            gridRow.className = 'row gy-4';
            contentContainer.appendChild(gridRow);
        }
        gridRow.innerHTML = ''; // Wipe existing static items

        // 3. Render each portfolio item as a detailed card
        if (data.portfolios) {
            data.portfolios.forEach((item, index) => {
                const cardCol = document.createElement('div');
                cardCol.className = 'col-12 mb-4';
                cardCol.setAttribute('data-aos', 'fade-up');
                cardCol.setAttribute('data-aos-delay', (index % 3) * 100);

                cardCol.innerHTML = this._build_details_portfolio_card(item);
                gridRow.appendChild(cardCol);
            });
        }
    },

    /**
     * Helper to build the detailed portfolio card structure
     */
    _build_details_portfolio_card(item) {
        // Build Action Button for the external repository
        const actionButtonHtml = item.portfolio_url ? `
            <div class="mt-auto">
                <a href="${item.portfolio_url}" target="_blank" class="btn btn-sm btn-primary w-100" style="font-size: 13px; background-color: var(--accent-color); border-color: var(--accent-color);">
                    <i class="bi bi-github me-1"></i> View Repository
                </a>
            </div>` : '';

        return `
            <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                        <div>
                            <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                <i class="${item.icon_class || 'bi bi-window-sidebar'} me-2" style="color: var(--accent-color);"></i>${item.title}
                            </h4>
                            <p class="text-secondary mb-0 fw-medium" style="font-size: 14px;">
                                <i class="bi bi-tag me-1"></i> Resource Type: ${item.type}
                            </p>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-7 border-end">
                            <div class="text-justify mb-2 small" style="line-height: 1.6;">
                                <h6 class="fw-bold small text-uppercase mb-2" style="color: var(--accent-color);">Project/Repository Summary</h6>
                                ${item.description}
                            </div>
                        </div>

                        <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column justify-content-center">
                            <div class="p-3 mb-3 small bg-light rounded border">
                                <strong><i class="bi bi-info-circle me-2"></i>Deployment Details:</strong>
                                <div class="mt-2 text-muted">
                                    This resource is hosted on <strong>${item.type}</strong>. 
                                    Click the button below to explore the source code and documentation.
                                </div>
                            </div>
                            ${actionButtonHtml}
                        </div>
                    </div>
                </div>
            </div>`;
    },


    /**
     * Renders Volunteering Services section
     * Target: #volunteering_services
     * Format: Detailed Card structure matching section_details.html
     */
    render_volunteering_services() {
        const data = SiteCore.get('volunteering_services');
        const section = document.getElementById('volunteering_services');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title}`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Identify and Clear Content Container
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;

        let gridRow = contentContainer.querySelector('.row');
        if (!gridRow) {
            gridRow = document.createElement('div');
            gridRow.className = 'row gy-4';
            contentContainer.appendChild(gridRow);
        }
        gridRow.innerHTML = ''; // Wipe existing static items

        // 3. Render each volunteering item as a detailed card
        if (data.volunteerings) {
            data.volunteerings.forEach((vol, index) => {
                const cardCol = document.createElement('div');
                cardCol.className = 'col-12 mb-4';
                cardCol.setAttribute('data-aos', 'fade-up');
                cardCol.setAttribute('data-aos-delay', (index % 3) * 100);

                cardCol.innerHTML = this._build_details_volunteering_card(vol);
                gridRow.appendChild(cardCol);
            });
        }
    },

    /**
     * Helper to build the detailed volunteering card structure
     */
    _build_details_volunteering_card(vol) {
        // Build Action Button for verification/link
        const actionButtonHtml = vol.url_link ? `
            <div class="mt-auto">
                <a href="${vol.url_link}" target="_blank" class="btn btn-sm btn-primary w-100" style="font-size: 13px; background-color: var(--accent-color); border-color: var(--accent-color);">
                    <i class="bi bi-patch-check me-1"></i> View Verification/Credential
                </a>
            </div>` : '';

        return `
            <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                        <div>
                            <h4 class="fw-bold text-dark mb-1" style="font-size: 18px;">
                                <i class="${vol.icon_class || 'bi bi-person-heart'} me-2" style="color: var(--accent-color);"></i>${vol.title}
                            </h4>
                            <p class="text-secondary mb-0 fw-medium" style="font-size: 15px;">
                                <i class="bi bi-building me-1"></i> ${vol.organization}
                                <span class="text-muted small ms-1"><i class="bi bi-geo-alt me-1"></i>${vol.location}</span>
                            </p>
                        </div>
                    </div>

                    <div class="d-flex flex-wrap gap-2 mb-4">
                        <span class="badge badge-dates px-3 py-2" style="font-size: 13px;">
                            <i class="bi bi-calendar3 me-1"></i> ${vol.timeframe_details.start_date} – ${vol.timeframe_details.end_date}
                        </span>
                    </div>

                    <div class="row">
                        <div class="col-lg-7 border-end">
                            <div class="text-justify mb-3 small" style="line-height: 1.6;">
                                <h6 class="fw-bold small text-uppercase mb-2" style="color: var(--accent-color);">Service Description</h6>
                                ${vol.description_full}
                            </div>
                        </div>

                        <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column">
                            <div class="p-3 mb-3 small bg-light rounded border-start border-3" style="border-color: #6c757d !important;">
                                <div class="mb-2">
                                    <strong><i class="bi bi-info-circle me-2"></i>Summary:</strong>
                                    <div class="text-muted mt-1 fst-italic">${vol.summary_text}</div>
                                </div>
                                <div class="mt-2">
                                    <strong><i class="bi bi-heart me-2"></i>Cause:</strong>
                                    <div class="text-muted mt-1">${vol.cause}</div>
                                </div>
                            </div>
                                
                            ${vol.image_path ? `
                                <div class="mb-3">
                                    <a href="${vol.image_path}" class="glightbox" data-gallery="vol-gallery" title="${vol.title}">
                                        <img src="${vol.image_path}" class="img-fluid rounded shadow-sm border w-100" style="object-fit: cover; max-height: 200px;" alt="${vol.title}">
                                    </a>
                                </div>` : ''}
                            
                            ${actionButtonHtml}
                        </div>
                    </div>
                </div>
            </div>`;
    },


    /**
     * Renders Publications section
     * Target: #publications
     * Format: Detailed Card structure matching section_details.html
     */
    render_publications() {
        const data = SiteCore.get('publications');
        const section = document.getElementById('publications');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title}`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Identify and Clear Content Container
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;
        contentContainer.innerHTML = '';

        // 3. Render Categorized Publications
        if (data.publications) {
            Object.keys(data.publications).forEach(catKey => {
                const category = data.publications[catKey];

                // Category Header (e.g., JOURNALS)
                const catHeader = document.createElement('div');
                catHeader.className = 'col-12 mt-5 mb-3';
                catHeader.setAttribute('data-aos', 'fade-up');
                catHeader.innerHTML = `
                    <h2 style="font-size: 18px; font-weight: 700; color: var(--accent-color); text-transform: uppercase; letter-spacing: 1px;">
                        <i class="${category.icon_class} me-2"></i>${category.type.toUpperCase()}
                    </h2>`;
                contentContainer.appendChild(catHeader);

                // Individual Publication Cards
                category.items.forEach((pub, index) => {
                    const cardCol = document.createElement('div');
                    cardCol.className = 'col-12 mb-4';
                    cardCol.setAttribute('data-aos', 'fade-up');
                    cardCol.setAttribute('data-aos-delay', (index % 3) * 100);

                    cardCol.innerHTML = this._build_details_publication_card(pub, category);
                    contentContainer.appendChild(cardCol);
                });
            });
        }
    },

    /**
     * Helper to build the detailed publication card structure
     */
    _build_details_publication_card(pub, category) {
        const pubLink = pub.journal_link || pub.conference_link;

        // Build Action Button for Verification
        const actionButtonHtml = pubLink ? `
            <div class="mt-auto">
                <a href="${pubLink}" target="_blank" class="btn btn-sm btn-primary w-100" style="font-size: 13px; background-color: var(--accent-color); border-color: var(--accent-color);">
                    <i class="bi bi-box-arrow-up-right me-1"></i> View Full Publication
                </a>
            </div>` : '';

        return `
            <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
                        <h4 class="fw-bold text-dark mb-1" style="font-size: 17px;">
                            <i class="${pub.icon_class || 'bi bi-file-earmark-ruled'} me-2" style="color: var(--accent-color);"></i>${pub.title}
                        </h4>
                    </div>

                    <div class="d-flex flex-wrap gap-2 mb-4">
                        <span class="badge badge-institute"><i class="bi bi-bookmark-fill me-1"></i> ${category.sub_type}</span>
                        <span class="badge badge-status"><i class="bi bi-journal-check me-1"></i> Peer Reviewed</span>
                    </div>

                    <div class="row">
                        <div class="col-lg-7 border-end">
                            <div class="mb-3 p-3 bg-light rounded border-start border-3" style="border-color: var(--accent-color) !important;">
                                <strong class="small d-block mb-1"><i class="bi bi-quote me-1"></i> Citation:</strong>
                                <div class="small text-dark" style="line-height: 1.5;">${pub.citation_text}</div>
                            </div>
                            
                            <h6 class="fw-bold small text-uppercase mb-2" style="color: var(--accent-color);">Abstract Overview</h6>
                            <div class="text-justify mb-2 small" style="line-height: 1.6;">
                                ${pub.abstract}
                            </div>
                        </div>

                        <div class="col-lg-5 mt-4 mt-lg-0 ps-lg-4 d-flex flex-column">
                            <div class="p-3 mb-3 small bg-light rounded border">
                                <strong><i class="bi bi-info-circle me-2"></i>Indexing Details:</strong>
                                <div class="mt-2 text-muted">
                                    This ${category.sub_type.toLowerCase()} is indexed and available via the publisher's digital library.
                                </div>
                            </div>
                            ${actionButtonHtml}
                        </div>
                    </div>
                </div>
            </div>`;
    },


    /**
     * Renders Contact Details section
     * Target: #contact_details
     * Layout: Professional channels in a grid, Map in a separate row.
     */
    render_contact_details() {
        const data = SiteCore.get('contact_details');
        const section = document.getElementById('contact_details');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title}`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Identify and Clear Content Container
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;
        contentContainer.innerHTML = '';

        // 3. Filter data: Exclude keys ending in '_cv' and the 'location' key
        const filteredContacts = {};
        Object.keys(data.contacts).forEach(key => {
            if (!key.endsWith('_cv') && key !== 'location') {
                filteredContacts[key] = data.contacts[key];
            }
        });

        // data.contacts.location.link
        const locLink = (data.contacts.location.text === "Location")?`https://maps.google.com/?q=${data.contacts.location.text}`:data.contacts.location.link

        // 4. Build the HTML structure with separate rows for contacts and map
        const contactCard = document.createElement('div');
        contactCard.className = 'col-12';
        contactCard.setAttribute('data-aos', 'fade-up');

        contactCard.innerHTML = `
            <div class="card shadow-sm border-0" style="border-left: 5px solid var(--accent-color) !important; border-radius: 12px;">
                <div class="card-body p-4">
                    <div class="row">
                        <div class="col-12 mb-4">
                            <h6 class="fw-bold small text-uppercase mb-4" style="color: var(--accent-color); letter-spacing: 1px;">
                                <i class="bi bi-chat-dots me-2"></i>Professional & Research Channels
                            </h6>
                            <div class="row gy-3">
                                ${Object.values(filteredContacts).map(item => `
                                    <div class="col-lg-4 col-md-6">
                                        <div class="d-flex align-items-center p-3 bg-light rounded border h-100 transition-hover">
                                            <div class="icon-box me-3 text-primary" style="font-size: 22px;">
                                                <i class="${item.icon_class}"></i>
                                            </div>
                                            <div>
                                                <div class="fw-bold text-muted" style="font-size: 11px; text-transform: uppercase;">${item.title}</div>
                                                <a href="${item.link}" target="_blank" class="text-decoration-none fw-bold" style="color: var(--accent-color); font-size: 13px; word-break: break-all;">
                                                    ${item.text}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="row border-top pt-4 mt-2">
                        <div class="col-12">
                            <h6 class="fw-bold small text-uppercase mb-3" style="color: var(--accent-color); letter-spacing: 1px;">
                                <i class="bi bi-geo-alt me-2"></i>Primary Academic/Professional Location
                            </h6>
                            <div class="row">
                                <div class="col-lg-4 mb-3 mb-lg-0">
                                    <div class="p-3 bg-light rounded border h-100 d-flex flex-column justify-content-center">
                                        <div class="fw-bold" style="color: var(--heading-color);">${data.contacts.location.title}</div>
                                        <div class="text-muted small mt-1">${data.contacts.location.text}</div>
                                    </div>
                                </div>
                                <div class="col-lg-8">
                                    <div class="rounded overflow-hidden shadow-sm border" style="height: 300px;">
                                        <iframe
                                            src="${data.contacts.location.link}"
                                            frameborder="0"
                                            style="border:0; width: 100%; height: 100%;"
                                            allowfullscreen=""
                                            loading="lazy"
                                            referrerpolicy="no-referrer-when-downgrade">
                                        </iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        contentContainer.appendChild(contactCard);
        console.log("Contact Details section rendered with filtered keys and separate map row.");
    },




};
