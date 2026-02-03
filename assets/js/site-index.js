/**
 * site-index.js - Comprehensive Home Page Controller
 * Dynamically populates every section of index.html with cached JSON data.
 */
const SiteIndex = {
    init() {
        console.log("Initializing all Index Page modules...");

        // --- 0. DATA SYNCHRONIZATION ---

        // --- 1. RENDER ALL SECTIONS ---
        this.render_all_sections();


        console.log("Index Page synchronization complete.");
    },

    // Render all or catch rendering problem, also deal with preloader and page 404
    async render_all_sections() {
        try {
            // Call each section individually
            // --- 1. HERO & IDENTITY ---
            this.render_hero();
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

            // --- THE FIX: Hide preloader once finished ---
            // window.hide_preloader();
        }
        catch (error) {
            console.error("Render Error in index page:", error);
            // window.hide_preloader(); // Hide anyway to stop the hang
        }
    },



    /**
     * Hero Section Rendering
     * Targets: #hero
     */
    render_hero() {
        const data = SiteCore.get('personal_information');
        const siteData = SiteCore.get('site');
        const hero = document.getElementById('hero');
        if (!data || !hero) return;

        const heroData = data.hero;

        // 1. Fix: Dynamic Background Image
        const bgImg = hero.querySelector('img');
        if (bgImg && siteData?.assets?.images?.site_background) {
            bgImg.src = siteData.assets.images.site_background;

            // Ensure image is visible and not hidden by AOS or CSS
            bgImg.style.display = 'block';
            bgImg.style.opacity = '1';

            // REMOVE the gray background class so it doesn't "peek through"
            hero.classList.remove('light-background');
        }

        // 2. Main Name Title
        const h2 = hero.querySelector('h2');
        if (h2) h2.textContent = heroData.title_main;

        // 3. Typed.js
        const typed = hero.querySelector('.typed');
        if (typed && heroData.main_keywards?.hero_slogan) {
            const items = heroData.main_keywards.hero_slogan
                .map(s => `<i class="${s.icon_class}"></i> ${s.text}`)
                .join(', ');
            typed.setAttribute('data-typed-items', items);
            if (window.initTypedAnimation) window.initTypedAnimation();
        }

        // 4. Subtitle Paragraphs
        const paragraphs = hero.querySelectorAll('p');
        if (paragraphs[1]) paragraphs[1].textContent = heroData.title_researcher;
        if (paragraphs[2]) {
            paragraphs[2].innerHTML = `
            ${heroData.title_institute_primary}<br>
            ${heroData.title_institute_secondary}<br>
            ${heroData.tagline}
        `;
        }
    },


    /**
     * About Section Rendering
     * Targets: #about
     */
    render_about() {
        const data = SiteCore.get('personal_information');
        const about = document.getElementById('about');
        if (!data || !about) return;

        const summary = data.profile_summary;
        const fullText = data.about_full_text;

        // 1. Title & Intro
        const mainTitle = about.querySelector('.section-title h2');
        if (mainTitle) {
            mainTitle.innerHTML = `${summary.title} <a href="curriculum_vitae.html?type=standard"><i class="bx bx-printer ms-2"></i></a>`;
        }
        const intro = about.querySelector('.section-title h6');
        if (intro) intro.innerHTML = summary.intro_paragraph_html;

        // 2. Overview Content
        // Formal photo
        const formalPhotoWrap = about.querySelector('.formal-photo');
        if (formalPhotoWrap && data?.assets?.images?.profile_image_formal) {
            const link = formalPhotoWrap.querySelector('a');
            const img = formalPhotoWrap.querySelector('img');
            const photoPath = data.assets.images.profile_image_formal;

            if (link) link.href = photoPath;
            if (img) img.src = photoPath;
        }

        // Left & Right Columns
        const contentBox = about.querySelector('.content');
        if (contentBox) {
            const subtitle = contentBox.querySelector('h3');
            if (subtitle) subtitle.textContent = summary.subtitle;

            const uls = contentBox.querySelectorAll('ul');

            // Populate Left Column
            if (uls[0] && summary.key_points_left) {
                uls[0].innerHTML = summary.key_points_left.map((p,index) => `
                    <li data-aos="fade-in" data-aos-delay="100"><i class="${p.icon_class}"></i> <strong>${p.strong}:</strong> <span>${p.text}</span></li>
                `).join('');
            }

            // Populate Right Column (Handling potential links)
            if (uls[1] && summary.key_points_right) {
                uls[1].innerHTML = summary.key_points_right.map((p,index) => `
                    <li data-aos="fade-in" data-aos-delay="100"><i class="${p.icon_class}"></i> <strong>${p.strong}:</strong> 
                        <span>${p.link ? `<a href="${p.link}" target="_blank" rel="noreferrer">${p.text}</a>` : p.text}</span>
                    </li>
                `).join('');
            }
        }

        // 3. Research Area & Recent Works (Bottom List)
        const bottomList = about.querySelector('.col-lg-12 ul');
        if (bottomList) {
            const res = summary.research_area;
            const works = summary.recent_works;
            bottomList.innerHTML = `
                <li data-aos="fade-in" data-aos-delay="100"><i class="${res.icon_class} me-2 accent-color"></i> <strong>${res.title}:</strong> <span>${res.text}</span></li>
                <li data-aos="fade-in" data-aos-delay="100"><i class="${works.icon_class} me-2 accent-color"></i> <strong>${works.title}:</strong> <span>${works.text}</span></li>
            `;
        }

        // 4. Detailed "About Me" Section
        const aboutMeTitle = about.querySelector('.section-title:last-of-type h2');
        if (aboutMeTitle) aboutMeTitle.innerHTML = `<i class="${fullText.icon_class} ms-2"></i> ${fullText.title}`;

        const aboutMeText = about.querySelector('.section-title:last-of-type p');
        if (aboutMeText) aboutMeText.innerHTML = fullText.paragraph_html;
    },


    /**
     * Key Information (Metrics) Rendering
     * Targets: #key_information
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

        // 2. Update Metrics Grid
        const container = section.querySelector('.row.gy-4');
        if (container && data.metrics) {
            container.innerHTML = data.metrics.map((m, index)=> `
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

        // 3. Re-initialize PureCounter for dynamic elements
        if (typeof PureCounter !== 'undefined') {
            new PureCounter();
        }
    },


    /**
     * Renders Academic Information section
     * Target: #academic_information
     */
    render_academic_information() {
        const data = SiteCore.get('academic_information');
        const section = document.getElementById('academic_information');
        if (!data || !section) return;

        // 1. Update Section Header
        const header = section.querySelector('.section-title');
        if (header && data.section_info) {
            const h2 = header.querySelector('h2');
            if (h2) {
                h2.innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title} 
                    <a href="section_details.html#${data.section_info.hashtag}"><i class="bx bx-link ms-2"></i></a>`;
            }
            const h6 = header.querySelector('h6');
            if (h6) h6.textContent = data.section_info.details;
        }

        // 2. Identify Content Container
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;

        // 3. Clear and Populate Summary Box
        // Scope the search to the first row only to find the Summary ULs
        const summaryRow = contentContainer.querySelector('.row');
        if (summaryRow && data.summary) {
            const summaryTitle = summaryRow.querySelector('.resume-title');
            if (summaryTitle) summaryTitle.textContent = data.summary.title;

            const summaryLists = summaryRow.querySelectorAll('ul');
            if (summaryLists.length >= 2 && data.summary.status_list) {
                // Populate left and right summary columns
                summaryLists[0].innerHTML = data.summary.status_list[0]
                    .map(item => `<li class="mb-2" data-aos="fade-up" data-aos-delay="100"><i class="bi bi-check2-circle text-primary me-2"></i> ${item}</li>`)
                    .join('');
                summaryLists[1].innerHTML = data.summary.status_list[1]
                    .map(item => `<li class="mb-2" data-aos="fade-up" data-aos-delay="100"><i class="bi bi-check2-circle text-primary me-2"></i> ${item}</li>`)
                    .join('');
            }
        }

        // 4. THE FIX: Remove only TOP-LEVEL degree rows
        // We iterate through direct children to avoid deleting the inner row of the summary.
        const topLevelRows = Array.from(contentContainer.children).filter(el => el.classList.contains('row'));
        for (let i = 1; i < topLevelRows.length; i++) {
            topLevelRows[i].remove();
        }

        // 5. Rebuild Degree Levels
        const groupedDegrees = data.degrees.reduce((acc, deg) => {
            if (!acc[deg.degree_level]) acc[deg.degree_level] = [];
            acc[deg.degree_level].push(deg);
            return acc;
        }, {});

        Object.keys(groupedDegrees).forEach(level => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'row mt-5'; // Match static HTML spacing

            rowDiv.innerHTML = `
                <div class="col-lg-12">
                    <h2 class="pub-category-title" data-aos="fade-in" data-aos-delay="100"><i class="bi bi-mortarboard-fill me-2"></i> ${level}</h2>
                    ${groupedDegrees[level].map(deg => this._build_academic_item(data.section_info, deg)).join('')}
                </div>`;

            contentContainer.appendChild(rowDiv);
        });
    },

    /**
     * Helper to build individual degree items
     */
    _build_academic_item(section_info, degree) {
        // Collaboration Box
        const collabHtml = (degree.collaboration && degree.collaboration.length > 0) ? `
            <div class="collab-box rounded mb-3 p-3 bg-light border" data-aos="fade-up" data-aos-delay="100">
                <strong><i class="bi bi-people me-1"></i> Collaboration:</strong>
                <span class="ms-2">
                    ${degree.collaboration.map(c => `
                        <strong>${c.collaboration_type}:</strong> ${c.degree_major}, 
                        <a href="${c.institution_link}" target="_blank">${c.institution_name} <i class="bx bx-link-external ms-1 small"></i></a>, 
                        <span class="text-muted"> ${c.institution_location}</span>
                    `).join('; ')}
                </span>
            </div>` : '';

        const thesisHtml = degree.thesis_details?.thesis_title ?
            `<p class="mb-3" data-aos="fade-up" data-aos-delay="100"><strong><i class="bi bi-file-richtext me-1"></i> Thesis:</strong> ${degree.thesis_details.thesis_title} (${degree.thesis_details.thesis_length})</p>` : '';

        return `
            <div class="resume-item border-start ps-4 pb-5" id="${degree.degree_id}">
                <div class="d-flex justify-content-between align-items-start flex-wrap">
                    <div>
                        <h4 class="text-primary fw-bold mb-1" data-aos="fade-in" data-aos-delay="100"><a href="section_details.html#${section_info.hashtag}-${degree.degree_id}">${degree.degree_major} - (${degree.degree_short_name})</a></h4>
                        <p class="mb-1 ms-2 fw-bold" data-aos="fade-in" data-aos-delay="100">${degree.department_name}</p>
                        <h6 class="fw-bold" data-aos="fade-in" data-aos-delay="100">
                            <a href="${degree.institution_link}" target="_blank">${degree.institution_name} <i class="bx bx-link-external ms-1 small"></i></a>
                            <span class="text-muted small ms-2"><i class="bi bi-geo-alt me-1"></i> ${degree.institution_location}</span>
                        </h6>
                    </div>
                    <div class="text-md-end mb-3">
                        <span class="badge badge-dates d-block mb-1" data-aos="fade-in" data-aos-delay="100"><i class="bi bi-calendar3 me-1"></i> ${degree.timeframe_details.start_date} – ${degree.timeframe_details.end_date}</span>
                        <span class="badge badge-duration d-block mb-1" data-aos="fade-in" data-aos-delay="100"><i class="bi bi-hourglass-split me-1"></i> ${degree.timeframe_details.max_duration}</span>
                        <div class="d-flex gap-1 justify-content-md-end">
                            <span class="badge badge-institute" data-aos="fade-in" data-aos-delay="100"><i class="bi bi-person-workspace me-1"></i> ${degree.degree_type}</span>
                            <span class="badge badge-status" data-aos="fade-in" data-aos-delay="100"><i class="bx bx-medal me-1"></i> ${degree.timeframe_details.award_date}</span>
                        </div>
                    </div>
                </div>
                <div class="ms-2">
                    <p class="mb-2" data-aos="fade-up" data-aos-delay="100"><strong><i class="bi bi-magic me-1"></i> Specialisation:</strong> ${degree.specialisation}</p>
                    ${collabHtml}
                    <details class="details-box">
                        <summary data-aos="fade-in" data-aos-delay="100"><i class="bi bi-eye me-1"></i> More Details</summary>
                        <div class="ps-3 border-start mt-3">
                            <p data-aos="fade-up" data-aos-delay="100"><strong><i class="bi bi-mortarboard me-1"></i> Degree:</strong> ${degree.degree_short_name || degree.degree_major}</p>
                            ${degree.scholarship ? `<p data-aos="fade-up" data-aos-delay="100"><strong><i class="bi bi-gift me-1"></i> Scholarship/Funding:</strong> ${degree.scholarship.scholarship_name}</p>` : ''}
                            <p data-aos="fade-up" data-aos-delay="100"><strong><i class="bi bi-lightbulb me-1"></i> Research Topic:</strong> ${degree.research_topic}</p>
                            <p data-aos="fade-up" data-aos-delay="100"><strong><i class="bi bi-file-text me-1"></i> Details:</strong> ${degree.description_full}</p>
                            <p data-aos="fade-up" data-aos-delay="100"><strong><i class="bi bi-person-arms-up me-1"></i> Activities:</strong> ${degree.activities_involvement}</p>
                            ${thesisHtml}
                            <div class="mt-3">
                                <strong data-aos="fade-up" data-aos-delay="100"><i class="bx bxs-flask me-1"></i> Research and Projects:</strong>
                                <ul class="list-unstyled ms-4 mt-2">
                                    ${degree.research_projects.map(rp => `<li data-aos="fade-up" data-aos-delay="100"><i class="bi bi-dot text-primary me-2"></i> <strong>${rp.type}:</strong> ${rp.title}</li>`).join('')}
                                </ul>
                            </div>
                            <p class="mt-3 mb-1" data-aos="fade-up" data-aos-delay="100"><strong><i class="bi bi-tags me-1"></i> Skills:</strong> <span class="text-muted">${degree.related_skills}</span></p>
                        </div>
                    </details>
                </div>
            </div>`;
    },


    /**
     * Renders Professional Experiences section
     * Target: #professional_experiences
     */
    render_professional_experiences() {
        const data = SiteCore.get('professional_experiences');
        const section = document.getElementById('professional_experiences');
        if (!data || !section) return;

        // 1. Update Section Header
        const header = section.querySelector('.section-title');
        if (header && data.section_info) {
            const h2 = header.querySelector('h2');
            if (h2) {
                h2.innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title} 
                    <a href="section_details.html#${data.section_info.hashtag}"><i class="bx bx-link ms-2"></i></a>`;
            }
            const h6 = header.querySelector('h6');
            if (h6) h6.textContent = data.section_info.details;
        }

        // 2. Identify Content Container and Clear Rows
        const contentContainer = section.querySelectorAll('.container')[1];
        if (!contentContainer) return;

        // Clear all previous rows to rebuild
        contentContainer.innerHTML = '';

        // 3. Render Summary Box (Expertise & Interests)
        if (data.summary) {
            const summaryRow = document.createElement('div');
            summaryRow.className = 'row';

            const expertise = data.summary.expertise_list[0];
            const interests = data.summary.expertise_list[1];

            summaryRow.innerHTML = `
                <div class="col-lg-12">
                    <div class="collab-box rounded p-4 shadow-sm border-start border-4 border-primary" data-aos="fade-in" data-aos-delay="100">
                        <h3 class="resume-title mt-0" data-aos="fade-in" data-aos-delay="100">${expertise.title}</h3>
                        <ul class="list-unstyled ms-3 mb-4">
                            ${expertise.areas_of_expertise.map(item => `<li data-aos="fade-up" data-aos-delay="100"><i class="bi bi-check2-circle text-primary me-2"></i> ${item}</li>`).join('')}
                        </ul>

                        <h3 class="resume-title" data-aos="fade-in" data-aos-delay="100">${interests.title}</h3>
                        <div class="row mt-3">
                            ${interests.research_interests_columns.map(col => `
                                <div class="col-md-4 border-start-md">
                                    <ul class="list-unstyled ms-3">
                                        ${col.map(item => `<li data-aos="fade-up" data-aos-delay="100"><i class="bi bi-check2-circle text-primary me-2"></i> ${item}</li>`).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>`;
            contentContainer.appendChild(summaryRow);
        }

        // 4. Render Categorized Experiences
        if (data.experiences) {
            data.experiences.forEach(cat => {
                const catRow = document.createElement('div');
                catRow.className = 'row mt-4';

                let catHtml = `
                    <div class="col-lg-12">
                        <div class="resume-category-group mb-5">
                            <h2 class="pub-category-title" data-aos="fade-in" data-aos-delay="100"><i class="${cat.organisation[0]?.icon_class || 'bx bx-briefcase'} me-2"></i> ${cat.category}</h2>
                            ${cat.organisation.map(org => `
                                <div class="ms-3 mb-5">
                                    <h3 class="resume-title" data-aos="fade-in" data-aos-delay="100">
                                        <i class="bi bi-building me-1"></i>
                                        <a href="${org.link}" target="_blank">${org.organization} <i class="bx bx-link-external ms-1 small"></i></a>
                                        <span class="ms-2 small text-muted fw-normal"><i class="bi bi-geo-alt me-1"></i> ${org.location}</span>
                                    </h3>
                                    ${org.roles.map(role => this._build_professional_item(data.section_info, role)).join('')}
                                </div>
                            `).join('')}
                        </div>
                    </div>`;

                catRow.innerHTML = catHtml;
                contentContainer.appendChild(catRow);
            });
        }
    },

    /**
     * Helper to build individual professional role cards
     */
    _build_professional_item(section_info, role) {
        // Calculate dynamic duration using SiteUtil
        const duration = role.timeframe_details.duration || SiteUtil.calculateDuration(role.timeframe_details.start_date, role.timeframe_details.end_date);

        // Details and Responsibilities lists
        const detailsList = role.description_list?.length > 0 ? `
            <p data-aos="fade-up" data-aos-delay="100"><strong><i class="bi bi-file me-1"></i> Details:</strong></p>
            <ul class="list-unstyled ms-4">
                ${role.description_list.map(item => `<li data-aos="fade-up" data-aos-delay="100"><i class="bi bi-dot text-primary"></i> ${item}</li>`).join('')}
            </ul>` : '';

        const responsibilitiesList = role.responsibilities_list?.length > 0 ? `
            <p data-aos="fade-up" data-aos-delay="100"><strong><i class="bi bi-person-raised-hand me-1"></i> Responsibilities:</strong></p>
            <ul class="list-unstyled ms-4">
                ${role.responsibilities_list.map(item => `<li data-aos="fade-up" data-aos-delay="100"><i class="bi bi-dot text-primary"></i> ${item}</li>`).join('')}
            </ul>` : '';

        // Course Involvement (for Teaching/Training)
        const coursesHtml = role.course_involvement?.length > 0 ? `
            <p data-aos="fade-up" data-aos-delay="100"><strong><i class="bi bi-book me-1"></i> Course Involvement:</strong></p>
            <ul class="list-unstyled ms-4">
                ${role.course_involvement.map(c => `<li data-aos="fade-up" data-aos-delay="100"><i class="bi bi-dot text-primary"></i> ${c}</li>`).join('')}
            </ul>` : '';

        return `
            <div class="resume-item border-start ps-4 pb-4" id="${role.role_id}">
                <div class="d-flex justify-content-between align-items-start flex-wrap">
                    <h4 class="text-primary fw-bold mb-1" data-aos="fade-in" data-aos-delay="100"><a href="section_details.html#${section_info.hashtag}-${role.role_id}">${role.title}</a></h4>
                    <div class="text-md-end mb-3">
                        <span class="badge badge-dates d-block mb-1" data-aos="fade-in" data-aos-delay="100"><i class="bi bi-calendar3 me-1"></i> ${role.timeframe_details.start_date} – ${role.timeframe_details.end_date}</span>
                        <span class="badge badge-duration d-block mb-1" data-aos="fade-in" data-aos-delay="100"><i class="bi bi-hourglass-split me-1"></i> ${duration}</span>
                        <div class="d-flex gap-1 justify-content-md-end">
                            <span class="badge badge-institute" data-aos="fade-in" data-aos-delay="100"><i class="bi bi-person-workspace me-1"></i> ${role.role_type}</span>
                            ${role.timeframe_details.end_date === 'Present' ? `<span class="badge badge-status" data-aos="fade-in" data-aos-delay="100"><i class="bx bx-medal me-1"></i> Ongoing</span>` : ''}
                        </div>
                    </div>
                </div>
                <p class="mb-2" data-aos="fade-up" data-aos-delay="100"><strong><i class="bi bi-file-text me-1"></i> About Job:</strong> ${role.about_job}</p>
                <details class="details-box">
                    <summary data-aos="fade-in" data-aos-delay="100"><i class="bi bi-eye me-1"></i> More Details</summary>
                    <div class="ps-3 border-start mt-3">
                        ${detailsList}
                        ${responsibilitiesList}
                        ${coursesHtml}
                        ${role.related_skills ? `<p class="mt-3 mb-1" data-aos="fade-up" data-aos-delay="100"><strong><i class="bi bi-tags me-1"></i> Competencies:</strong> <span class="text-muted">${role.related_skills}</span></p>` : ''}
                    </div>
                </details>
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
                h2.innerHTML = `<i class="${info.icon_class}"></i> ${info.title} 
                    <a href="section_details.html#${info.hashtag}"><i class="bx bx-link ms-2"></i></a>`;
            }
            const h6 = header.querySelector('h6');
            if (h6) h6.textContent = info.details;
        }
    },

    /**
     * Renders the Skills and Tools subsection with dynamic progress bars
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
            const h2 = header.querySelector('h2');
            if (h2) {
                h2.innerHTML = `<i class="${info.icon_class}"></i> ${info.title} 
                    <a href="section_details.html#${info.hashtag}"><i class="bx bx-link ms-2"></i></a>`;
            }
            const h6 = header.querySelector('h6');
            if (h6) h6.textContent = info.details;
        }

        // 2. Clear and Render Skills Grid
        const skillsContent = section.querySelector('.skills-content');
        if (skillsContent && data.skills) {

            // --- THE FIX: Clear existing static progress bars ---
            skillsContent.innerHTML = '';

            // Split skills into two columns
            const mid = Math.ceil(data.skills.length / 2);
            const col1Data = data.skills.slice(0, mid);
            const col2Data = data.skills.slice(mid);

            const buildColumn = (items) => {
                return `
                    <div class="col-lg-6">
                        ${items.map((s, index) => `
                            <div class="progress" data-aos="fade-up" data-aos-delay="${(index % 4) * 100}">
                                <span class="skill">${s.category}: ${s.short_description} <i class="val">${s.level}%</i></span>
                                <div class="progress-bar-wrap">
                                    <div class="progress-bar" role="progressbar" 
                                         aria-valuenow="${s.level}" aria-valuemin="0" aria-valuemax="100" 
                                         style="width: ${s.level}%;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>`;
            };

            skillsContent.innerHTML = buildColumn(col1Data) + buildColumn(col2Data);
        }
    },


    /**
     * Renders Honors and Awards section
     * Target: #honors_awards
     */
    render_honors_awards() {
        const data = SiteCore.get('honors_awards');
        const section = document.getElementById('honors_awards');
        if (!data || !section) return;

        // 1. Update Section Header
        const header = section.querySelector('.section-title');
        if (header && data.section_info) {
            const h2 = header.querySelector('h2');
            if (h2) {
                h2.innerHTML = `<i class="${data.section_info.icon_class}"></i> ${data.section_info.title} 
                    <a href="section_details.html#${data.section_info.hashtag}"><i class="bx bx-link ms-2"></i></a>`;
            }
            const h6 = header.querySelector('h6');
            if (h6) h6.textContent = data.section_info.details;
        }

        // 2. Identify the Grid Container and Row
        // Target the second container which houses the grid
        const containers = section.querySelectorAll('.container');
        const gridContainer = containers[1];
        if (!gridContainer) return;

        const gridRow = gridContainer.querySelector('.row.gy-4');
        if (gridRow && data.honorsawards) {
            // --- THE FIX: Clear existing static service items ---
            gridRow.innerHTML = '';

            const awardsHtml = data.honorsawards.map((award, index) => {

                const delay = (index % 3) * 100;

                // Dynamic Status Badge: Check if date contains "Ongoing"
                const isOngoing = award.date && award.date.toLowerCase().includes('ongoing');
                const statusBadge = isOngoing
                    ? `<span class="badge badge-status"><i class="bx bx-medal me-1"></i> Ongoing</span>`
                    : '';

                return `
                    <div class="col-lg-4 col-md-6 service-item d-flex rounded-3" data-aos="fade-up" data-aos-delay="${delay}">
                        <div class="icon flex-shrink-0">
                            <i class="${award.icon_class || 'bi bi-award'}"></i>
                        </div>
                        <div>
                            <h4 class="title">
                                <a href="section_details.html#${data.section_info.hashtag}-${award.id_ref}" class="stretched-link">
                                    ${award.title}
                                </a>
                            </h4>
                            <div class="d-flex flex-wrap gap-1 mb-2">
                                <span class="badge badge-dates"><i class="bi bi-calendar3 me-1"></i> ${award.date}</span>
                                ${statusBadge}
                                <span class="badge badge-institute"><i class="bi bi-building me-1"></i> ${award.issuer_organization.name}</span>
                            </div>
                            <p class="description">${award.short_description}</p>
                        </div>
                    </div>`;
            }).join('');

            gridRow.innerHTML = awardsHtml;
        }
    },


    /**
     * Renders Courses, Trainings and Certificates section
     * Target: #courses_trainings_certificates
     */
    render_courses_trainings_certificates() {
        const data = SiteCore.get('courses_trainings_certificates');
        const section = document.getElementById('courses_trainings_certificates');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title} 
                <a href="section_details.html#${info.hashtag}"><i class="bx bx-link ms-2"></i></a>`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Dynamic Filter Menu Generation
        const filterList = section.querySelector('.portfolio-filters');
        if (filterList) {
            const menuData = SiteUtil.getFilterMenuData(data);

            // Always start with the 'All' filter
            let filterHtml = `<li data-filter="*" class="filter-active">All</li>`;

            // Append dynamic filters
            filterHtml += menuData.map(f => `
                <li data-filter="${f.tag}">${f.label}</li>
            `).join('');

            filterList.innerHTML = filterHtml;
        }

        // 3. Render Grid Items (Top 12)
        const gridContainer = section.querySelector('.isotope-container');
        if (gridContainer) {
            const topItems = SiteUtil.getTopCertificates(data, 12);
            gridContainer.innerHTML = '';

            const itemsHtml = topItems.map((item, index) => {
                const filterClasses = item.filter_tags.join(' ');
                const delay = (index % 3) * 100; // Staggered delay for rows of 3

                return `
                    <div class="col-lg-4 col-md-6 portfolio-item isotope-item ${filterClasses}" data-aos="fade-up" data-aos-delay="${delay}">
                        <div class="portfolio-content h-100">
                            <img src="${item.image_path}" class="img-fluid" alt="${item.title}">
                            <div class="portfolio-info">
                                <h4>${item.title}</h4>
                                <p>${item.source}</p>
                                <div class="portfolio-links">
                                    <a href="${item.image_path}" title="${item.title}" data-gallery="portfolio-gallery-cert" class="glightbox preview-link">
                                        <i class="bi bi-zoom-in"></i>
                                    </a>
                                    <a href="section_details.html${info.hashtag}-${item.id_ref}" title="More Details" class="details-link">
                                        <i class="bi bi-link-45deg"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }).join('');

            gridContainer.innerHTML = itemsHtml;
        }
    },

    /**
     * Renders Projects section
     * Target: #projects
     */
    render_projects() {
        const data = SiteCore.get('projects');
        const section = document.getElementById('projects');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title} 
                <a href="section_details.html#${info.hashtag}"><i class="bx bx-link ms-2"></i></a>`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Identify the Grid Container Row
        // Target the second container in the section which holds the project grid
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;

        const gridRow = contentContainer.querySelector('.row.gy-4');
        if (gridRow && data.projects) {

            // --- THE FIX: Clear existing static project items ---
            gridRow.innerHTML = '';

            const projectsHtml = data.projects.map((project, index) => {
                // Dynamic Status Badge logic
                const isOngoing = project.status.toLowerCase().includes('ongoing');
                const statusBadge = isOngoing
                    ? `<span class="badge badge-status"><i class="bx bx-medal me-1"></i> Ongoing</span>`
                    : `<span class="badge badge-status">${project.status}</span>`;

                const delay = (index % 3) * 100; // Staggered AOS delay

                return `
                    <div class="col-lg-4 col-md-6 service-item d-flex rounded-3" data-aos="fade-up" data-aos-delay="${delay}">
                        <div class="icon flex-shrink-0">
                            <i class="${project.icon_class || 'bi bi-lightbulb'}"></i>
                        </div>
                        <div>
                            <h4 class="title">
                                <a href="section_details.html#${info.hashtag}-${project.id_ref}" class="stretched-link">
                                    ${project.role}
                                </a>
                            </h4>
                            <div class="d-flex flex-wrap gap-1 mb-2">
                                <span class="badge badge-dates">
                                    <i class="bi bi-calendar3 me-1"></i> 
                                    ${project.timeframe_details.start_date} – ${project.timeframe_details.end_date}
                                </span>
                                ${statusBadge}
                            </div>
                            <p class="description">${project.short_description}</p>
                        </div>
                    </div>`;
            }).join('');

            gridRow.innerHTML = projectsHtml;
        }
    },


    /**
     * Renders Organisational Memberships section
     * Target: #organisational_memberships
     */
    render_organisational_memberships() {
        const data = SiteCore.get('organisational_memberships');
        const section = document.getElementById('organisational_memberships');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title} 
                <a href="section_details.html#${info.hashtag}"><i class="bx bx-link ms-2"></i></a>`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Identify the Grid Container Row
        const gridRow = section.querySelector('.row.gy-4');
        if (gridRow && data.memberships) {

            // --- THE FIX: Clear existing static membership items ---
            gridRow.innerHTML = '';

            const membershipsHtml = data.memberships.map((mem, index) => {
                // Extract Organization Name or Abbreviation
                const org = mem.membership_organization[0] || {};
                const orgName = org.name || "N/A";

                // Logic to extract short name from parenthesis if available (e.g., "ACS" from "Australian Computer Society (ACS)")
                const match = orgName.match(/\(([^)]+)\)/);
                const displayOrg = match ? match[1] : orgName;

                const delay = (index % 3) * 100; // Staggered AOS delay

                return `
                    <div class="col-lg-4 col-md-6 service-item d-flex rounded-3" data-aos="fade-up" data-aos-delay="${delay}">
                        <div class="icon flex-shrink-0">
                            <i class="${mem.icon_class || 'bi bi-people'}"></i>
                        </div>
                        <div>
                            <h4 class="title">
                                <a href="section_details.html#${info.hashtag}-${mem.id_ref}" class="stretched-link">
                                    ${mem.title}
                                </a>
                            </h4>
                            <div class="d-flex flex-wrap gap-1 mb-2">
                                <span class="badge badge-dates">
                                    <i class="bi bi-calendar3 me-1"></i> 
                                    ${mem.timeframe_details.start_date} – ${mem.timeframe_details.end_date}
                                </span>
                                <span class="badge badge-institute">
<!--                                    <i class="bi bi-building me-1"></i> ${displayOrg}-->
                                    <i class="bi bi-building me-1"></i> ${orgName}
                                </span>
                            </div>
                            <p class="description">${mem.description_full.split('.')[0]}.</p>
                        </div>
                    </div>`;
            }).join('');

            gridRow.innerHTML = membershipsHtml;
        }
    },


    /**
     * Renders Sessions and Events section
     * Target: #sessions_events
     */
    render_sessions_events() {
        const data = SiteCore.get('sessions_events');
        const section = document.getElementById('sessions_events');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title} 
                <a href="section_details.html#${info.hashtag}"><i class="bx bx-link ms-2"></i></a>`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Identify the Grid Container Row
        // Target the second container which holds the events grid
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;

        const gridRow = contentContainer.querySelector('.row.gy-4');
        if (gridRow && data.sessionsevents) {

            // --- THE FIX: Clear existing static session items ---
            gridRow.innerHTML = '';

            const eventsHtml = data.sessionsevents.map((event, index) => {
                // Logic to extract short name from parenthesis (e.g., "HSTU" from "University (HSTU)")
                const orgFullName = event.organization || "N/A";
                const match = orgFullName.match(/\(([^)]+)\)/);
                const displayOrg = match ? match[1] : orgFullName.split(',')[0]; // Fallback to first part of name

                const delay = (index % 2) * 100; // Staggered delay for 2-column layout

                return `
                    <div class="col-lg-6 col-md-6 service-item d-flex rounded-3" data-aos="fade-up" data-aos-delay="${delay}">
                        <div class="icon flex-shrink-0">
                            <i class="${event.icon_class || 'bi bi-calendar-event'}"></i>
                        </div>
                        <div>
                            <h4 class="title">
                                <a href="section_details.html#${info.hashtag}-${event.id_ref}" class="stretched-link">
                                    ${event.title}
                                </a>
                            </h4>
                            <div class="d-flex flex-wrap gap-1 mb-2">
                                <span class="badge badge-dates">
                                    <i class="bi bi-calendar3 me-1"></i> ${event.date}
                                </span>
                                <span class="badge badge-status">
                                    <i class="bi bi-info-circle me-1"></i> ${event.type}
                                </span>
                            </div>
                            <div class="mb-2">
                                <span class="badge badge-institute">
<!--                                    <i class="bi bi-building me-1"></i> ${displayOrg}-->
                                    <i class="bi bi-building me-1"></i> ${orgFullName}
                                </span>
                            </div>
                            <p class="description">${event.description}</p>
                        </div>
                    </div>`;
            }).join('');

            gridRow.innerHTML = eventsHtml;
        }
    },


    /**
     * Renders Languages section
     * Target: #languages
     */
    render_languages() {
        const data = SiteCore.get('languages');
        const section = document.getElementById('languages');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title} 
                <a href="section_details.html#${info.hashtag}"><i class="bx bx-link ms-2"></i></a>`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Clear and Render Language Cards
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;

        const gridRow = contentContainer.querySelector('.row.gy-4');
        if (gridRow && data.languages) {

            // Wipe existing static items
            gridRow.innerHTML = '';

            const languagesHtml = data.languages.map((lan, index) => {
                const delay = (index % 3) * 100;

                // Process LRWS Badges (Listening, Reading, Writing, Speaking)
                // We take the breakdown from the first test score entry
                const breakdown = lan.test_scores[0]?.proficiency_breakdown || {};
                const lrwsHtml = Object.entries(breakdown).map(([key, value]) => {
                    const label = key.charAt(0).toUpperCase(); // L, R, W, S
                    return `<span class="badge badge-lrws border">${label}: ${value}</span>`;
                }).join('');

                // Process specific test score (e.g., IELTS)
                const test = lan.test_scores[0];
                const testInfoHtml = (test && test.test_name) ? `
                    <div class="mt-2">
                        <div class="mb-2">
                            <small class="fw-bold text-primary">
                                <i class="bi bi-check-circle-fill me-1"></i> ${test.test_name} (${test.test_year}): ${test.test_score}
                            </small>
                        </div>
                        <div class="d-flex flex-wrap gap-1">${lrwsHtml}</div>
                    </div>` : `
                    <div class="d-flex flex-wrap gap-1 mt-auto">${lrwsHtml}</div>`;

                return `
                    <div class="col-lg-4 col-md-6 service-item d-flex rounded-3" data-aos="fade-up" data-aos-delay="${delay}">
                        <div class="icon flex-shrink-0 d-flex align-items-center justify-content-center">
                            <i class="bx bx-conversation"></i>
                        </div>
                        <div>
                            <h4 class="title">
                                <a href="section_details.html#${info.hashtag}-${lan.id_ref}" class="stretched-link">
                                    ${lan.language}
                                </a>
                                <span class="${lan.icon_class} flag-icon ms-2"></span>
                            </h4>
                            <div class="d-flex flex-wrap gap-1 mb-2">
                                <span class="badge badge-status">${lan.status}</span>
                                <span class="badge badge-dates">${lan.proficiency_level}</span>
                            </div>
                            <p class="description mb-3">${lan.details}</p>
                            ${testInfoHtml}
                        </div>
                    </div>`;
            }).join('');

            gridRow.innerHTML = languagesHtml;
        }
    },


    /**
     * Renders Portfolios section
     * Target: #portfolios
     */
    render_portfolios() {
        const data = SiteCore.get('portfolios');
        const section = document.getElementById('portfolios');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title} 
                <a href="section_details.html#${info.hashtag}"><i class="bx bx-link ms-2"></i></a>`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Clear and Render Portfolio Grid
        const gridRow = section.querySelector('.row.gy-4');
        if (gridRow && data.portfolios) {

            // Wipe existing static portfolio items
            gridRow.innerHTML = '';

            const portfoliosHtml = data.portfolios.map((item, index) => {
                const delay = (index % 3) * 100; // Staggered AOS delay

                return `
                    <div class="col-lg-4 col-md-6 service-item d-flex rounded-3" data-aos="fade-up" data-aos-delay="${delay}">
                        <div class="icon flex-shrink-0">
                            <i class="${item.icon_class || 'bx bxl-github'}"></i>
                        </div>
                        <div>
                            <h4 class="title">
<!--                                <a href="section_details.html?section=portfolios&id=${item.id_ref}" class="stretched-link">-->
                                <a href="section_details.html#${info.hashtag}-${item.id_ref}">
                                    ${item.title}
                                </a>
                            </h4>
                            <div class="mb-2">
                                <span class="badge badge-status">
<!--                                <span class="badge badge-important">-->
                                    <a href="${item.portfolio_url}" target="_blank" rel="noreferrer">
                                        <i class="bi bi-github me-1"></i> ${item.type} Link <i class="bx bx-link-external"></i>
                                    </a>
                                </span>
                            </div>
                            <p class="description">${item.description}</p>
                        </div>
                    </div>`;
            }).join('');

            gridRow.innerHTML = portfoliosHtml;
        }
    },


    /**
     * Renders Volunteering Services section
     * Target: #volunteering_services
     */
    render_volunteering_services() {
        const data = SiteCore.get('volunteering_services');
        const section = document.getElementById('volunteering_services');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title} 
                <a href="section_details.html#${info.hashtag}"><i class="bx bx-link ms-2"></i></a>`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Identify the Grid Container Row
        const containers = section.querySelectorAll('.container');
        const contentContainer = containers[1];
        if (!contentContainer) return;

        const gridRow = contentContainer.querySelector('.row.gy-4');
        if (gridRow && data.volunteerings) {

            // Wipe existing static volunteering items
            gridRow.innerHTML = '';

            const volunteeringHtml = data.volunteerings.map((vol, index) => {
                // Shorten organization name (e.g., "Stanford Online" from "Stanford Online, Stanford University")
                const orgFullName = vol.organization || "N/A";
                const match = orgFullName.match(/\(([^)]+)\)/);
                const displayOrg = match ? match[1] : orgFullName.split(',')[0];

                const delay = (index % 2) * 100; // Staggered delay for 2-column grid

                return `
                    <div class="col-lg-6 col-md-6 service-item d-flex rounded-3" data-aos="fade-up" data-aos-delay="${delay}">
                        <div class="icon flex-shrink-0">
                            <i class="${vol.icon_class || 'bi bi-person-heart'}"></i>
                        </div>
                        <div>
                            <h4 class="title">
                                <a href="section_details.html#${info.hashtag}-${vol.id_ref}" class="stretched-link">
                                    ${vol.title}
                                </a>
                            </h4>
                            <div class="d-flex flex-wrap gap-1 mb-2">
                                <span class="badge badge-dates">
                                    <i class="bi bi-calendar3 me-1"></i> 
                                    ${vol.timeframe_details.start_date} – ${vol.timeframe_details.end_date}
                                </span>
                                <span class="badge badge-status text-wrap text-start">
                                    <i class="bi bi-info-circle-fill me-1"></i> ${vol.cause}
                                </span>
                            </div>
                            <div class="mb-2">
                                <span class="badge badge-institute">
<!--                                    <i class="bi bi-building me-1"></i> ${displayOrg}-->
                                    <i class="bi bi-building me-1"></i> ${orgFullName}
                                </span>
                            </div>
                            <p class="description">${vol.summary_text}</p>
                        </div>
                    </div>`;
            }).join('');

            gridRow.innerHTML = volunteeringHtml;
        }
    },


    /**
     * Renders Publications section
     * Target: #publications
     */
    render_publications() {
        const data = SiteCore.get('publications');
        const section = document.getElementById('publications');
        if (!data || !section) return;

        // 1. Update Section Header
        const info = data.section_info;
        const header = section.querySelector('.section-title');
        if (header && info) {
            header.querySelector('h2').innerHTML = `<i class="${info.icon_class}"></i> ${info.title} 
                <a href="section_details.html#${info.hashtag}"><i class="bx bx-link ms-2"></i></a>`;
            header.querySelector('h6').textContent = info.details;
        }

        // 2. Identify and Clear Content Container
        const contentCol = section.querySelector('.container .row .col-lg-12');
        if (!contentCol) return;
        contentCol.innerHTML = ''; // Wipe static placeholders

        // 3. Render Categories (Journals, Conferences, Posters)
        const categories = data.publications;

        Object.keys(categories).forEach(catKey => {
            const category = categories[catKey];
            const items = category.items || [];
            if (items.length === 0) return;

            // Build Category Group
            const catGroup = document.createElement('div');
            catGroup.className = 'resume-category-group mb-5';

            let catHeaderHtml = `
                <h2 class="pub-category-title">
                    <i class="${category.icon_class} me-2"></i> ${category.type}: ${category.sub_type} (${items.length})
                </h2>`;

            const itemsHtml = items.map(pub => {
                return `
                    <div class="resume-item border-start ps-4 pb-4" id="${pub.id_ref}" data-aos="fade-up">
                        <div class="d-flex justify-content-between align-items-start flex-wrap">
                            <h4 class="text-primary fw-bold mb-1 pe-3">
                                <a href="section_details.html#${info.hashtag}-${pub.id_ref}">${pub.title}</a>
                            </h4>
                            <div class="d-flex gap-1 justify-content-md-end flex-wrap mb-2">
                                <button class="badge border-0 badge-dates" 
                                        onclick="handleCopyAction(this, 'Citation')" 
                                        data-citation='${pub.citation_text.replace(/<[^>]*>/g, "").replace(/'/g, "&apos;")}'>
                                    <i class="bi bi-clipboard-plus me-1"></i> Copy Citation
                                </button>
                                <a href="${pub.journal_link}" target="_blank" class="badge badge-status d-block">
                                    <i class="bi bi-box-arrow-up-right me-1"></i> View Online
                                </a>
                            </div>
                        </div>
                        <p class="mb-3">${pub.citation_text}</p>
                        <details class="details-box">
                             <summary><i class="bi bi-eye me-1"></i> View Abstract</summary>
                            <div class="ps-3 border-start mt-3">
                                <p class="text-muted small"><strong>Abstract:</strong> ${pub.abstract}</p>
                            </div>
                        </details>
                    </div>`;
            }).join('');

            catGroup.innerHTML = catHeaderHtml + itemsHtml;
            contentCol.appendChild(catGroup);
        });
    },


    /**
     * Renders Contact Details section
     * Target: #contact_details
     */
    render_contact_details() {
        const data = SiteCore.get('contact_details');
        const section = document.getElementById('contact_details');
        if (!data || !section) return;

        // 1. Update Section Header
        const header = section.querySelector('.section-title');
        if (header && data.section_info) {
            header.querySelector('h2').innerHTML = `
                <i class="${data.section_info.icon_class}"></i> ${data.section_info.title} 
                <a href="section_details.html#${data.section_info.hashtag}"><i class="bx bx-link ms-2"></i></a>`;
            header.querySelector('h6').textContent = data.section_info.details;
        }

        const gridRow = section.querySelector('.row.gy-4');
        if (gridRow && data.contacts) {
            gridRow.innerHTML = ''; // Clear static placeholders

            // --- THE FIX: Filter out keys containing '_cv' ---
            const filteredKeys = Object.keys(data.contacts).filter(key => !key.includes('_cv'));

            const contactsHtml = filteredKeys.map((key, index) => {
                const contact = data.contacts[key];
                const delay = (index % 3) * 100;
                const locLink = (contact.title === "Location")?`https://maps.google.com/?q=${contact.text}`:contact.link

                return `
                    <div class="col-lg-4 col-md-6 service-item d-flex rounded-3" data-aos="fade-up" data-aos-delay="${delay}">
                        <div class="icon flex-shrink-0">
                            <i class="${contact.icon_class}"></i>
                        </div>
                        <div>
                            <h4 class="title">
                                <a href="${locLink}" target="_blank" rel="noreferrer" class="stretched-link">
                                    ${contact.title}
                                </a>
                            </h4>
                            <p class="description">${contact.text}</p>
                        </div>
                    </div>`;
            }).join('');

            // 2. Append the Map Iframe specifically from the location key
            const mapHtml = `
                <div class="col-lg-12 mt-4" data-aos="fade-up">
                    <div class="h-100 overflow-hidden rounded-3 shadow-sm border">
                        <iframe
                            src="${data.contacts.location.link}"
                            frameborder="0"
                            style="border:0; width: 100%; height: 300px;"
                            allowfullscreen=""
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>`;

            gridRow.innerHTML = contactsHtml + mapHtml;
        }
    }


};