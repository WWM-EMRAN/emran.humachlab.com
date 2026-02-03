/**
 * SiteCV - Curriculum Vitae Page Controller
 */
const SiteCV = {
    init(type) {
        console.log(`CV Initializing with '${type}' type...`);

        // 1. Hook the selector
        const selector = document.getElementById('cvTypeSelector');

        selector.value = type || 'standard';

         // 1. Force the <body> class to match the selected mode
        const body = document.querySelector('body');

        // 1.1. Remove ALL possible mode classes to ensure a clean state
        body.classList.remove('mode-standard', 'mode-one-page', 'mode-two-page', 'mode-detailed');

        // 1.2. Add the active mode class
        if (type === 'onePage') {
            body.classList.add('mode-one-page');
        } else {
            // Defaults to standard if type is 'standard', 'detailed', etc.
            body.classList.add('mode-standard');
        }

        // 2. Update the Selector UI
        // const selector = document.getElementById('cvTypeSelector');
        if (selector) {
            selector.value = type;
            // The listener you already have for window.location.href stays here...
           // Listen for changes and update URL
           selector.addEventListener('change', (e) => {
               const newType = e.target.value;
               window.location.href = `curriculum_vitae.html?type=${newType}`;
           });
        }

        // --- 0. DATA SYNCHRONIZATION ---

        // --- 1. RENDER ALL SECTIONS ---
        this.render_all_cv_type(type);


        console.log("CV Page synchronization complete.");
    },

   async render_all_cv_type(type){
      try {
            // Call each render contents for different CV type
            // CV types: standard, onePage, twoPage, detailed
            if (type === 'standard'){
                console.log("Rendering Standard CV...", type);
                SiteCV_Standard.init();
            }
            else if (type === 'onePage'){
                console.log("Rendering One-Page CV...", type);
                SiteCV_OnePage.init();
            }
            // else if (type === 'twoPage'){
            //     console.log("Rendering Two-Page CV...", type);
            //     SiteCV_TwoPage.init();
            // }
            // else if (type === 'detailed'){
            //     console.log("Rendering Details CV...", type);
            //     SiteCV_Details.init();
            // }
            else{
                console.error(`Invalid CV type: ${type}`);
            }

            // --- THE FIX: Hide preloader once finished ---
            // window.hide_preloader();
        }
        catch (error) {
            console.error("Render Error in CV page:", error);
            // window.hide_preloader(); // Hide anyway to stop the hang
        }
   }
};



const SiteCV_Standard = {
    init() {
        console.log("Initializing all Standard CV Page modules...");

        // --- 0. DATA SYNCHRONIZATION ---

        // --- 1. RENDER ALL SECTIONS ---
        this.render_all_standatdCV_sections();


        console.log("Standard CV Page synchronization complete.");
    },

    // Render all or catch rendering problem, also deal with preloader and page 404
    async render_all_standatdCV_sections() {
        try {
            // Call each section individually
            // --- 1. HEADER & IDENTITY ---
            this.render_header();
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

            // --- 7. FOOTER ---
            this.render_footer();

            // --- THE FIX: Hide preloader once finished ---
            window.hide_preloader();
        }
        catch (error) {
            console.error("Render Error in index page:", error);
            window.hide_preloader(); // Hide anyway to stop the hang
        }
    },

    render_header() {
        const personal = SiteCore.get('personal_information');
        const site = SiteCore.get('site');

        if (!personal || !site) return;
        console.log("render_header: ", personal, site, "");

        const headerSection = document.querySelector("#cv-header");
        if (!headerSection) return;

        // Correct path: personal.hero.main_keywards.hero_slogan
        const sloganArray = personal.hero?.main_keywards?.hero_slogan || [];
        const sloganText = sloganArray.map(s => s.text).join(' | ');

        // Extract specific contact links from site.json social_links.main array
        const links = site.social_links?.main || [];
        const teams = links.find(l => l.platform === 'teams');
        const email = links.find(l => l.platform === 'email');
        const website = links.find(l => l.platform === 'website');

        // Helper to clean display text for the links
        const getLabel = (linkObj) => {
            if (!linkObj) return "";
            return linkObj.url
                .replace('mailto:', '')
                .replace('https://', '')
                .replace('http://', '')
                .split('?')[0]
                .split('/')[0];
        };

        headerSection.innerHTML = `
            <div class="row text-center mb-2 flex-center-middle">
                <div class="col-2">
                    <a href="${personal.assets.images.profile_image_formal}" class="img-fluid glightbox rounded-0" data-gallery="profile-gallery">
                        <img src="${personal.assets.images.profile_image_formal}" alt="Profile" class="img-fluid cv-profile-img-border" style="width: 100%;">
                    </a>
                </div>
                <div class="col-10">
                    <h1 class="cv-name-header m-0">${personal.name}</h1>
                    <p class="cv-accent-subtitle lead m-0 text-center">${sloganText}</p>
                    <p class="m-0 small text-center text-muted">
                        <strong><i class="${teams?.icon_class || 'bi bi-microsoft-teams'}"></i></strong> 
                        <a href="${teams?.url || '#'}" target="_blank"> ${getLabel(teams) || 'wwm.emran'} </a> |
                        
                        <strong><i class="${email?.icon_class || 'bi bi-envelope'}"></i></strong> 
                        <a href="${email?.url || '#'}" target="_blank"> ${getLabel(email)} </a> |
                        
                        <strong><i class="${website?.icon_class || 'bi bi-globe'}"></i></strong> 
                        <a href="${website?.url || '#'}" target="_blank"> ${getLabel(website)} </a>
                    </p>
                </div>
            </div>
        `;
    },

    // render_about() {
    //     const personal = SiteCore.get('personal_information');
    //     if (!personal || !personal.profile_summary) return;
    //
    //     console.log("render_about: ", personal, "");
    //
    //     const aboutSection = document.querySelector("#about");
    //     if (!aboutSection) return;
    //
    //     const summary = personal.profile_summary;
    //
    //     aboutSection.innerHTML = `
    //         <h5 class="cv-section-title">${summary.title || 'Profile Summary'}</h5>
    //         <p class="small text-justify mb-2">
    //             ${summary.intro_paragraph_short}
    //         </p>
    //     `;
    // },
    //
    // render_key_information() {
    //     // Retrieve data from SiteCore cache
    //     const data = SiteCore.get('key_information');
    //     if (!data || !data.metrics) return;
    //
    //     console.log("render_key_information: ", data, "");
    //
    //     // Target the specific section and grid in the HTML
    //     // const section = document.querySelector("#key_information");
    //     const section = document.querySelector("#about #key_information");
    //     const grid = document.querySelector("#key-info-grid");
    //     if (!section || !grid) return;
    //
    //     // Update the section title dynamically
    //     const titleEl = section.querySelector(".cv-section-title");
    //     if (titleEl) titleEl.textContent = data.section_info.title;
    //
    //     // Split the metrics array into two columns for the 2-column layout
    //     const midPoint = Math.ceil(data.metrics.length / 2);
    //     const leftColMetrics = data.metrics.slice(0, midPoint);
    //     const rightColMetrics = data.metrics.slice(midPoint);
    //
    //     // Helper to generate the HTML for each individual metric item
    //     const renderCol = (metrics) => {
    //         return metrics.map(m => `
    //             <div>
    //                 <i class="${m.icon_class} me-2"></i>
    //                 <strong>${m.value} ${m.strong_text}</strong> ${m.description}
    //             </div>
    //         `).join('');
    //     };
    //
    //     // Inject the columns into the grid
    //     grid.innerHTML = `
    //         <div class="col-6">
    //             ${renderCol(leftColMetrics)}
    //         </div>
    //         <div class="col-6">
    //             ${renderCol(rightColMetrics)}
    //         </div>
    //     `;
    // },



    render_about() {
        const personal = SiteCore.get('personal_information');
        if (!personal || !personal.profile_summary) return;

        const aboutSection = document.querySelector("#about");
        if (!aboutSection) return;

        // TARGET SPECIFIC ELEMENTS TO PRESERVE NESTED SECTIONS
        const titleEl = aboutSection.querySelector(".cv-section-title");
        const introEl = aboutSection.querySelector("p.small");

        const summary = personal.profile_summary;

        if (titleEl) titleEl.textContent = summary.title || 'Profile Summary';
        if (introEl) introEl.textContent = summary.intro_paragraph_short;
    },


    render_key_information() {
        const data = SiteCore.get('key_information');
        if (!data || !data.metrics) return;

        const section = document.querySelector("#key_information");
        const grid = document.querySelector("#key-info-grid");
        if (!section || !grid) return;

        // Use textContent for safety
        const titleEl = section.querySelector(".cv-section-title");
        if (titleEl && data.section_info) titleEl.textContent = data.section_info.title;

        const midPoint = Math.ceil(data.metrics.length / 2);
        const leftColMetrics = data.metrics.slice(0, midPoint);
        const rightColMetrics = data.metrics.slice(midPoint);

        const renderCol = (metrics) => {
            return metrics.map(m => `
                <div>
                    <i class="${m.icon_class} me-2"></i>
                    <strong>${m.value} ${m.label || m.strong_text}</strong> ${m.description}
                </div>
            `).join('');
        };

        grid.innerHTML = `
            <div class="col-6">${renderCol(leftColMetrics)}</div>
            <div class="col-6">${renderCol(rightColMetrics)}</div>
        `;
    },






    render_academic_information() {
        const data = SiteCore.get('academic_information');
        console.log("render_academic_information: ", data, "");

        if (!data || !data.degrees) return;

        const section = document.querySelector("#academic_information");
        if (!section) return;

        // Update Section Title
        const titleEl = section.querySelector(".cv-section-title");
        if (titleEl) titleEl.textContent = data.section_info.title;

        // Build the Degrees HTML
        const degreesHTML = data.degrees.map((degree, index) => {
            // Determine spacing class: last item has no bottom margin
            const marginClass = (index === data.degrees.length - 1) ? "mb-0" : "mb-3";

            // Prepare Collaboration HTML if it exists
            const collabHTML = (degree.collaboration && degree.collaboration.length > 0)
                ? degree.collaboration.map(c => `
                    <div class="mt-1">
                        <strong class="text-muted">${c.collaboration_type}:</strong> 
                        ${c.degree_major ? c.degree_major + ' with ' : ''}${c.institution_name}, ${c.institution_location}
                    </div>`).join('')
                : "";

            // Prepare Thesis HTML if a title is provided
            const thesisHTML = (degree.thesis_details && degree.thesis_details.thesis_title)
                ? `<div class="mt-1"><strong class="text-muted">Thesis:</strong> ${degree.thesis_details.thesis_title}.</div>`
                : "";

            return `
                <div class="${marginClass} small" id="${degree.degree_id}">
                    <div class="d-flex justify-content-between">
                        <h6 class="text-uppercase fw-bold small m-0">
                            <i class="${degree.icon_class || 'bi bi-mortarboard'} me-2"></i>
                            ${degree.degree_level} in ${degree.degree_major}
                        </h6>
                        <span class="text-muted">${degree.timeframe_details.start_date} – ${degree.timeframe_details.end_date}</span>
                    </div>
                    <div class="d-flex justify-content-between italic">
                        <span>${degree.institution_name} – <span class="text-muted">${degree.institution_location}</span></span>
                        <span class="text-muted">${degree.timeframe_details.award_date}</span>
                    </div>
                    ${collabHTML}
                    <div class="mt-1"><strong class="text-muted">Specialisation:</strong> ${degree.specialisation}</div>
                    ${thesisHTML}
                </div>
            `;
        }).join('');

        // Inject content into the section, preserving the title
        const titleHTML = titleEl ? titleEl.outerHTML : '';
        section.innerHTML = titleHTML + degreesHTML;
    },

    render_professional_experiences() {
        const data = SiteCore.get('professional_experiences');
        console.log("render_professional_experiences: ", data, "");

        if (!data || !data.experiences) return;

        const section = document.querySelector("#professional_experiences");
        if (!section) return;

        // 1. UPDATE TITLE DYNAMICALLY: Set text content before capturing HTML
        const titleEl = section.querySelector(".cv-section-title");
        if (titleEl) titleEl.textContent = data.section_info.title;
        const titleHTML = titleEl ? titleEl.outerHTML : `<h5 class="cv-section-title">${data.section_info.title}</h5>`;

        // 2. Helper to map category names to icons based on static design
        const getCategoryIcon = (category) => {
            const cat = category.toLowerCase();
            if (cat.includes('research')) return 'bx bxs-flask';
            if (cat.includes('training')) return 'bi bi-person-video';
            if (cat.includes('teaching')) return 'bi bi-vector-pen';
            if (cat.includes('industrial')) return 'bi bi-file-earmark-code';
            return 'bi bi-briefcase';
        };

        // 3. Render experiences using nested maps for categories, organisations, and roles
        const experiencesHTML = data.experiences.map(cat => {
            const orgsHTML = cat.organisation.map(org => {
                const rolesHTML = org.roles.map(role => {
                    const timeframe = role.timeframe_details;

                    // --- DURATION CALCULATION ---
                    // Calls the utility function to calculate duration from start and end dates
                    const calculatedDuration = SiteUtil.calculateDuration(timeframe.start_date, timeframe.end_date);
                    const durationStr = calculatedDuration ? ` (${calculatedDuration})` : "";

                    return `
                        <div class="role-entry mb-2">
                            <div class="d-flex justify-content-between">
                                <span class="fw-bold text-muted">
                                    <i class="bi bi-briefcase me-2"></i>${role.title}
                                </span>
                                <span class="text-muted">
                                    ${timeframe.start_date} – ${timeframe.end_date}${durationStr}
                                </span>
                            </div>
                            <div class="mt-1 text-justify">
                                <strong class="text-muted">About Job:</strong> ${role.about_job}
                            </div>
                        </div>
                    `;
                }).join('');

                return `
                    <div class="ms-2 mb-3 mt-1">
                        <div class="fw-bold text-dark">
                            <i class="bi bi-building me-2"></i>
                            ${org.organization} 
                            <span class="fw-normal text-muted">— ${org.location}</span>
                        </div>
                        <div class="ms-2 mt-1 small">
                            ${rolesHTML}
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="mb-3">
                    <h6 class="text-uppercase fw-bold small m-0">
                        <i class="${getCategoryIcon(cat.category)} me-2"></i>${cat.category} 
                    </h6>
                    ${orgsHTML}
                </div>
            `;
        }).join('');

        // 4. Inject content into the section
        section.innerHTML = titleHTML + experiencesHTML;
    },

    render_expertise_skills_achievements() {
        const data = SiteCore.get('expertise_skills_achievements');
        console.log("render_expertise_skills_achievements: ", data, "");
        // This module typically handles high-level initialization for the expertise group.
    },

    render_skills_tools() {
        const data = SiteCore.get('skills_tools');
        console.log("render_skills_tools: ", data, "");

        if (!data || !data.skills) return;

        const section = document.querySelector("#skills_tools");
        const grid = document.querySelector("#skills-grid");
        if (!section || !grid) return;

        // Update the section title dynamically
        const titleEl = section.querySelector(".cv-section-title");
        if (titleEl) titleEl.textContent = data.section_info.title;

        // Split the skills array into two columns for the 2-column grid layout
        const midPoint = Math.ceil(data.skills.length / 2);
        const leftColSkills = data.skills.slice(0, midPoint);
        const rightColSkills = data.skills.slice(midPoint);

        // Helper to generate the HTML for each skill item
        const renderItems = (items) => {
            return items.map(s => `
                <div class="mb-2">
                    <i class="${s.icon_class} me-2"></i><strong>${s.category}:</strong>
                    <span class="text-dark">${s.short_description}</span>
                </div>
            `).join('');
        };

        // Inject the columns into the grid
        grid.innerHTML = `
            <div class="col-6">
                ${renderItems(leftColSkills)}
            </div>
            <div class="col-6">
                ${renderItems(rightColSkills)}
            </div>
        `;
    },

    render_honors_awards() {
        const data = SiteCore.get('honors_awards');
        console.log("render_honors_awards: ", data, "");

        if (!data || !data.honorsawards) return;

        const section = document.querySelector("#honors_awards");
        const listContainer = document.querySelector("#awards-list");
        if (!section || !listContainer) return;

        // Update section title dynamically
        const titleEl = section.querySelector(".cv-section-title");
        if (titleEl) titleEl.textContent = data.section_info.title;

        // Build the Awards HTML
        const awardsHTML = data.honorsawards.map((award, index) => {
            // Last item in the provided static HTML uses mb-0
            const marginClass = (index === data.honorsawards.length - 1) ? "mb-0" : "mb-2";

            return `
                <div class="${marginClass} small" id="${award.id_ref}">
                    <div class="d-flex justify-content-between">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="${award.icon_class || 'bi bi-award'} me-2"></i>
                            ${award.title}
                        </span>
                        <span class="text-muted">${award.date}</span>
                    </div>
                    <div class="italic text-muted">${award.issuer_organization.name}</div>
                    <div class="mt-1">${award.short_description}</div>
                </div>
            `;
        }).join('');

        listContainer.innerHTML = awardsHTML;
    },

    render_courses_trainings_certificates() {
        const data = SiteCore.get('courses_trainings_certificates');
        console.log("render_courses_trainings_certificates: ", data, "");

        if (!data || !data.coursestrainingscertificates) return;

        const section = document.querySelector("#courses_trainings_certificates");
        const listContainer = document.querySelector("#certificates-list");
        if (!section || !listContainer) return;

        // 1. Update the section title dynamically
        const titleEl = section.querySelector(".cv-section-title");
        if (titleEl) titleEl.textContent = data.section_info.title;

        // 2. Map through the certificates array to generate HTML
        const certsHTML = data.coursestrainingscertificates.map((cert, index) => {
            // Spacing: Last item uses mb-0, others use mb-2
            const marginClass = (index === data.coursestrainingscertificates.length - 1) ? "mb-0" : "mb-2";

            // Construct the issuer string (e.g., "Kaggle / Google")
            const details = cert.details;
            const offering = details.offering_organization;
            const funding = details.funding_organization;
            // const issuer = funding ? `${offering} / ${funding}` : offering;


            return `
                <div class="${marginClass} small" id="${cert.id_ref}">
                    <div class="d-flex justify-content-between">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="${cert.icon_class || 'bi bi-journal-bookmark-fill'} me-2"></i>
                            ${cert.title}
                        </span>
                        <span class="text-muted">${details.date}</span>
                    </div>
                    <div class="italic text-muted">Issued by: ${offering} | Funded by: ${funding}</div>
                </div>
            `;
        }).join('');

        // 3. Inject the generated content
        listContainer.innerHTML = certsHTML;
    },

    render_projects() {
        const data = SiteCore.get('projects');
        console.log("render_projects: ", data, "");

        if (!data || !data.projects) return;

        const section = document.querySelector("#projects");
        const listContainer = document.querySelector("#projects-list");
        if (!section || !listContainer) return;

        // 1. Update the section title dynamically from JSON
        const titleEl = section.querySelector(".cv-section-title");
        if (titleEl) titleEl.textContent = data.section_info.title;

        // 2. Map through the projects array to generate HTML
        const projectsHTML = data.projects.map((project, index) => {
            // Apply mb-0 to the last item and mb-3 to others for spacing
            const marginClass = (index === data.projects.length - 1) ? "mb-0" : "mb-3";

            // Calculate the timeframe duration using the utility helper
            const timeframe = project.timeframe_details;
            const calculatedDuration = SiteUtil.calculateDuration(timeframe.start_date, timeframe.end_date);
            const durationStr = calculatedDuration ? ` (${calculatedDuration})` : "";

            return `
                <div class="${marginClass} small" id="${project.id_ref}">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="${project.icon_class || 'bi bi-lightbulb'} me-2"></i>${project.role}
                        </span>
                        <span class="text-muted text-end">
                            ${timeframe.start_date} – ${timeframe.end_date}${durationStr} | <span class="italic">${project.status}</span>
                        </span>
                    </div>
                    <div class="mt-1 text-justify">
                        ${project.short_description}
                    </div>
                </div>
            `;
        }).join('');

        // 3. Inject the dynamic list into the container
        listContainer.innerHTML = projectsHTML;
    },

    render_organisational_memberships() {
        const data = SiteCore.get('organisational_memberships');
        console.log("render_organisational_memberships: ", data, "");

        if (!data || !data.memberships) return;

        const section = document.querySelector("#organisational_memberships");
        const listContainer = document.querySelector("#memberships-list");
        if (!section || !listContainer) return;

        // 1. Update the section title dynamically
        const titleEl = section.querySelector(".cv-section-title");
        if (titleEl) titleEl.textContent = data.section_info.title;

        // 2. Map through memberships to generate HTML
        const membershipsHTML = data.memberships.map((membership, index) => {
            // Apply mb-0 to the last item and mb-2 to others
            const marginClass = (index === data.memberships.length - 1) ? "mb-0" : "mb-2";

            // Calculate duration using the utility helper
            const timeframe = membership.timeframe_details;
            const calculatedDuration = SiteUtil.calculateDuration(timeframe.start_date, timeframe.end_date);
            const durationStr = calculatedDuration ? ` (${calculatedDuration})` : "";

            // Handle multiple organization details if provided (usually one)
            const org = membership.membership_organization[0];
            const orgName = org ? org.name : "";

            return `
                <div class="${marginClass} small" id="${membership.id_ref}">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="${membership.icon_class || 'bi bi-people'} me-2"></i>${membership.title}
                        </span>
                        <span class="text-muted text-end">
                            ${timeframe.start_date} – ${timeframe.end_date}${durationStr}
                        </span>
                    </div>
                    <div class="italic text-muted">${orgName}</div>
                    <div class="mt-1">${membership.description_full}</div>
                </div>
            `;
        }).join('');

        // 3. Inject the generated content
        listContainer.innerHTML = membershipsHTML;
    },

    render_sessions_events() {
        const data = SiteCore.get('sessions_events');
        console.log("render_sessions_events: ", data, "");

        if (!data || !data.sessionsevents) return;

        const section = document.querySelector("#sessions_events");
        const listContainer = document.querySelector("#sessions-list");
        if (!section || !listContainer) return;

        // 1. Update the section title dynamically
        const titleEl = section.querySelector(".cv-section-title");
        if (titleEl) titleEl.textContent = data.section_info.title;

        // 2. Map through sessions and events to generate HTML
        const sessionsHTML = data.sessionsevents.map((item, index) => {
            // Spacing logic: mb-0 for the last item, mb-3 for others
            const marginClass = (index === data.sessionsevents.length - 1) ? "mb-0" : "mb-3";

            return `
                <div class="${marginClass} small" id="${item.id_ref}">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="${item.icon_class || 'bi bi-mic'} me-2"></i>${item.title}
                        </span>
                        <span class="text-muted text-end">
                            ${item.date} | <span class="italic">${item.type}</span>
                        </span>
                    </div>
                    <div class="italic text-muted">${item.organization}</div>
                    <div class="mt-1 text-justify">
                        ${item.description}
                    </div>
                </div>
            `;
        }).join('');

        // 3. Inject the generated content into the list container
        listContainer.innerHTML = sessionsHTML;
    },

    render_languages() {
        const data = SiteCore.get('languages');
        console.log("render_languages: ", data, "");

        if (!data || !data.languages) return;

        const section = document.querySelector("#languages");
        const listContainer = document.querySelector("#languages-list");
        if (!section || !listContainer) return;

        // 1. Update the section title dynamically
        const titleEl = section.querySelector(".cv-section-title");
        if (titleEl) titleEl.textContent = data.section_info.title;

        // 2. Map through languages to generate HTML
        const languagesHTML = data.languages.map((item, index) => {
            // Spacing logic: mb-0 for the last item, mb-2 for others
            const marginClass = (index === data.languages.length - 1) ? "mb-0" : "mb-2";

            // Determine the status/test score display for the right side
            let statusDisplay = item.status;
            const test = item.test_scores && item.test_scores.length > 0 ? item.test_scores[0] : null;

            if (test && test.test_name) {
                statusDisplay += ` | <span class="italic">${test.test_name} (${test.test_year}): ${test.test_score}</span>`;
            } else {
                statusDisplay += ` | <span class="italic">${item.proficiency_level}</span>`;
            }

            // Construct description with proficiency breakdown if available
            let description = item.details;
            if (test && test.proficiency_breakdown) {
                const pb = test.proficiency_breakdown;
                const scores = `Proficiency scores: L: ${pb.listening}, R: ${pb.reading}, W: ${pb.writing}, S: ${pb.speaking}.`;
                // Append scores to description, ensuring professional formatting
                description = `${description.replace('Professional · ', '')} ${scores}`;
            }

            return `
                <div class="${marginClass} small" id="${item.id_ref}">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="${item.icon_class} me-2"></i>${item.language}
                        </span>
                        <span class="text-muted text-end">${statusDisplay}</span>
                    </div>
                    <div class="mt-1">
                        ${description}
                    </div>
                </div>
            `;
        }).join('');

        // 3. Inject the generated content
        listContainer.innerHTML = languagesHTML;
    },

    render_portfolios() {
        const data = SiteCore.get('portfolios');
        console.log("render_portfolios: ", data, "");

        if (!data || !data.portfolios) return;

        const section = document.querySelector("#portfolios");
        const listContainer = document.querySelector("#portfolio-list");
        if (!section || !listContainer) return;

        // 1. Update the section title dynamically from JSON
        const titleEl = section.querySelector(".cv-section-title");
        if (titleEl) titleEl.textContent = data.section_info.title;

        // 2. Map through the portfolios array to generate HTML
        const portfoliosHTML = data.portfolios.map((item, index) => {
            // Spacing: mb-0 for the last item, mb-3 for others
            const marginClass = (index === data.portfolios.length - 1) ? "mb-0" : "mb-3";

            // Extract the GitHub handle/repo name from the URL
            // Example: https://github.com/WWM-EMRAN/DIHC_Downloader -> @WWM-EMRAN/DIHC_Downloader
            const handle = item.portfolio_url.replace('https://github.com/', '@');

            return `
                <div class="${marginClass} small" id="${item.id_ref}">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="${item.icon_class || 'bi bi-github'} me-1"></i>${item.title}
                        </span>
                    </div>
                    <div class="d-flex justify-content-between align-items-baseline">
                        <span class="small italic text-muted text-end">${handle}</span>
                    </div>
                    <div class="mt-1">
                        ${item.description}
                    </div>
                </div>
            `;
        }).join('');

        // 3. Inject the generated content into the list container
        listContainer.innerHTML = portfoliosHTML;
    },

    render_volunteering_services() {
        const data = SiteCore.get('volunteering_services');
        console.log("render_volunteering_services: ", data, "");

        if (!data || !data.volunteerings) return;

        const section = document.querySelector("#volunteering_services");
        const listContainer = document.querySelector("#volunteering-list");
        if (!section || !listContainer) return;

        // 1. Update the section title dynamically from JSON
        const titleEl = section.querySelector(".cv-section-title");
        if (titleEl) titleEl.textContent = data.section_info.title;

        // 2. Map through volunteering items to generate HTML
        const volunteerHTML = data.volunteerings.map((item, index) => {
            // Spacing: mb-0 for the last item, mb-3 for others
            const marginClass = (index === data.volunteerings.length - 1) ? "mb-0" : "mb-3";

            // Calculate duration using the utility helper
            const timeframe = item.timeframe_details;
            const calculatedDuration = SiteUtil.calculateDuration(timeframe.start_date, timeframe.end_date);
            const durationStr = calculatedDuration ? ` (${calculatedDuration})` : "";

            // Determine status (Completed/Ongoing) based on end date
            const endDate = timeframe.end_date || "Present";
            const statusStr = (endDate.toLowerCase() === 'present') ? "Ongoing" : "Completed";

            return `
                <div class="${marginClass} small" id="${item.id_ref}">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <span class="fw-bold text-dark text-uppercase">
                            <i class="${item.icon_class || 'bi bi-person-heart'} me-2"></i>${item.title}
                        </span>
                        <span class="text-muted text-end">
                            ${timeframe.start_date} – ${endDate}${durationStr} | <span class="italic">${statusStr}</span>
                        </span>
                    </div>
                    <div class="italic text-muted">${item.organization}</div>
                    <div class="mt-1 text-justify">
                        ${item.summary_text}
                    </div>
                </div>
            `;
        }).join('');

        // 3. Inject the generated content into the list container
        listContainer.innerHTML = volunteerHTML;
    },

    render_publications() {
        const data = SiteCore.get('publications');
        console.log("render_publications: ", data, "");

        if (!data || !data.publications) return;

        const section = document.querySelector("#publications");
        if (!section) return;

        // 1. Update the overall section title
        const titleEl = section.querySelector(".cv-section-title");
        if (titleEl) titleEl.textContent = data.section_info.title;

        // 2. Helper function to render a specific publication category
        const renderCategory = (catKey) => {
            const category = data.publications[catKey];
            if (!category || !category.items || category.items.length === 0) return "";

            const itemsHTML = category.items.map((item, index) => {
                // Apply mb-0 to the last item in the list, others get mb-3
                const marginClass = (index === category.items.length - 1) ? "mb-0" : "mb-3";

                // Determine the link key based on the category type
                const link = item.journal_link || item.conference_link || "";
                const linkHTML = link ? `<br><span class="text-primary small italic">DOI/Link: ${link}</span>` : "";

                // Construct the year from citation_text if possible
                const yearMatch = item.citation_text.match(/\b(20\d{2})\b/);
                const yearStr = yearMatch ? yearMatch[1] : "";

                return `
                    <div class="${marginClass}" id="${item.id_ref}">
                        <div class="d-flex justify-content-between align-items-baseline">
                            <span class="fw-bold text-muted"><i class="${item.icon_class || 'bi bi-file-earmark-text'} me-2"></i>${item.title}</span>
                            <span class="text-muted text-end">
                                ${yearStr} | <span class="italic">${category.type}</span> | 
                                <span class="italic">
                                    <button class="badge border-0 badge-dates" 
                                            onclick="handleCopyAction(this, 'Citation')" 
                                            data-citation='${item.citation_text.replace(/<[^>]*>/g, "").replace(/'/g, "&apos;")}'>
                                        <i class="bi bi-clipboard-plus me-1"></i> 
                                    </button>
                                </span>
                                   
                            </span>
                        </div>
                        <div class="mt-1 text-justify" id="${item.id_ref}_text">
                            ${item.citation_text}
                            ${linkHTML}
                        </div>
                    </div>
                `;
            }).join('');

            // Return the full block for this category
            return `
                <div class="mt-3" id="pub-${catKey}">
                    <h6 class="text-uppercase fw-bold small m-0">
                        <i class="${category.icon_class} me-2"></i>${category.sub_type} (${category.items.length})
                    </h6>
                    <div class="ms-2 mt-2 small">
                        ${itemsHTML}
                    </div>
                </div>
            `;
        };

        // 3. Assemble and inject all categories
        const journalsHTML = renderCategory('journals');
        const conferencesHTML = renderCategory('conferences');
        const postersHTML = renderCategory('posters');

        // Preserve the dynamic title and append the calculated category blocks
        const titleHTML = titleEl ? titleEl.outerHTML : `<h5 class="cv-section-title">${data.section_info.title}</h5>`;
        section.innerHTML = titleHTML + journalsHTML + conferencesHTML + postersHTML;
    },

    render_contact_details() {
        // Retrieve contact data from the SiteCore cache
        const data = SiteCore.get('contact_details');
        console.log("render_contact_details: ", data, "");

        if (!data || !data.contacts) return;

        const section = document.querySelector("#contact_details");
        const grid = document.querySelector("#contacts-grid");
        if (!section || !grid) return;

        // 1. Update the section title dynamically from the JSON
        const titleEl = section.querySelector(".cv-section-title");
        if (titleEl) titleEl.textContent = data.section_info.title;

        const c = data.contacts;

        // 2. Generate the HTML for the two-column contact grid
        // The left column contains Location, Email, and LinkedIn
        const leftCol = `
            <div class="col-6">
                <div class="small"><strong>Location:</strong> <a href="${c.location.link}" target="_blank"> ${c.location.text} </a></div>
                <div class="small"><strong>Email:</strong> <a href="${c.email.link}" target="_blank"> ${c.email.text} </a></div>
                <div class="small"><strong>LinkedIn:</strong> <a href="${c.linkedin.link}" target="_blank"> ${c.linkedin.text} </a></div>
            </div>
        `;

        // The right column contains Google Scholar, MS Teams, and the personal Website
        const rightCol = `
            <div class="col-6">
                <div class="small"><strong>Scholar:</strong> <a href="${c.google_scholar_cv.link}" target="_blank">${c.google_scholar_cv.text}</a></div>
                <div class="small"><strong>MS Teams:</strong> <a href="${c.teams.link}" target="_blank"> ${c.teams.text} </a> </div>
                <div class="small"><strong>Website:</strong> <a href="${c.website.link}" target="_blank"> ${c.website.text.replace('https://', '')} </a></div>
            </div>
        `;

        // 3. Inject the combined columns into the grid container
        grid.innerHTML = leftCol + rightCol;
    },

    render_footer() {
        const personal = SiteCore.get('personal_information');
        const site = SiteCore.get('site');
        console.log("render_footer initialized...", site, personal);
        const footerSection = document.querySelector("#cv-footer");

        if (!personal || !footerSection) return;

        // 4. DYNAMIC FOOTER: Update date to current date
        const currentDate = new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        footerSection.innerHTML = `
            <p class="mb-0 small italic">I hereby certify that the information provided is true and correct to the best of my knowledge.</p>
            <br /><br />
            <div class="cv-footer-container">
                <img src="assets/img/Emran_Ali_Logo_Fav.png" class="standard-footer-logo" alt="Branding Logo">
            </div>
            <div class="d-flex justify-content-between mt-2 text-dark text-uppercase">
                <span class="small">Generated: <span>${currentDate}</span></span>
                <span class="fw-bold">${personal.name}</span>
            </div>
        `;
    }


};



const SiteCV_OnePage = {
    init() {
        console.log("Initializing all One-Page CV Page modules...");

        // --- 0. DATA SYNCHRONIZATION ---

        // --- 1. RENDER ALL SECTIONS ---
        this.render_all_onePageCV_sections();


        console.log("One-Page CV Page synchronization complete.");
    },

    // Render all or catch rendering problem, also deal with preloader and page 404
    async render_all_onePageCV_sections() {
        try {
            // Call each section individually
            // --- 1. SIDEBAR SECTIONS ---
            this.render_sidebar_image()
            this.render_sidebar_contacts()

            this.render_sidebar_expertise()
            this.render_sidebar_research_areas()

            this.render_sidebar_personal_skills()
            this.render_sidebar_programming()
            this.render_sidebar_languages()
            this.render_sidebar_memberships()
            this.render_sidebar_logo()

            // --- 2. MAIN BODY SECTIONS ---
            this.render_header()
            this.render_key_info_grid()

            // this.render_academic_information()
            this.render_academic_information_v2()

            // this.render_professional_experiences()
            // this.render_professional_experiences_v2()
            this.render_professional_experiences_v3()
            // this.render_professional_experiences_v4()

            this.render_honors_awards()
            this.render_courses_trainings_certificates()
            this.render_portfolios()
            this.render_volunteering_services()
            this.render_publications()

        }
        catch (error) {
            console.error("Render Error in One-page CV page:", error);
            window.hide_preloader(); // Hide anyway to stop the hang
        }
    },

    // Sidebar sections
    render_sidebar_image() {
        const personal = SiteCore.get('personal_information');
        if (!personal) return;

        const imageContainer = document.querySelector("#one-page-section .cv-sidebar .text-center.mb-4");
        if (!imageContainer) return;

        console.log("render_sidebar_image: ", personal, "");

        // Injects the formal profile image with glightbox support
        imageContainer.innerHTML = `
            <a href="${personal.assets.images.profile_image_formal}" class="glightbox" data-gallery="profile-gallery">
                <img src="${personal.assets.images.profile_image_formal}"
                     alt="${personal.name} - CV"
                     class="rounded-circle border border-2 shadow-sm"
                     style="width: 70%;">
            </a>
        `;
    },

    render_sidebar_contacts() {
    const data = SiteCore.get('contact_details');
    if (!data || !data.contacts) return;
    console.log("render_sidebar_contacts: ", data, "");

    const contactsList = document.querySelector("#one-page-section .cv-sidebar .sidebar-list.mb-4");
    if (!contactsList) return;

    // UPDATE HEADER: Dynamically sets the title and icon from the JSON
    const header = contactsList.previousElementSibling;
    if (header && header.classList.contains('sidebar-title')) {
        header.innerHTML = `<i class="${data.section_info.icon_class} me-2"></i>${data.section_info.title}`;
    }

    const contactData = data.contacts;
    const keys = Object.keys(contactData);

    // Filtering logic: remove base key if a corresponding '_cv' key exists
    // This ensures only the CV-optimized versions (like google_scholar_cv) are rendered
    const finalKeys = keys.filter(k => !keys.includes(k + "_cv"));

    // Visual ordering based on the original design: Location, Teams, Email, LinkedIn, Scholar, ResearchGate, Website
    const preferredOrder = ['location', 'teams', 'email', 'linkedin', 'google_scholar_cv', 'researchgate_cv', 'website'];
    finalKeys.sort((a, b) => preferredOrder.indexOf(a) - preferredOrder.indexOf(b));

    const html = finalKeys.map(key => {
        const item = contactData[key];
        if (!item) return '';

        // Modification for location link
        if (key === 'location') {
            item.link = `http://googleusercontent.com/maps.google.com/${item.text}`;
        }

        // Determine formatting classes and attributes based on the static structure
        const isTruncated = key.includes('linkedin') || key.includes('scholar') || key.includes('researchgate');
        const liClass = isTruncated ? 'class="text-truncate"' : '';
        const relAttr = (key === 'teams' || key === 'location') ? 'rel="noreferrer"' : '';

        // Clean display text to maintain the compact sidebar aesthetic
        let displayText = item.text;
        if (key === 'website') displayText = displayText.replace('https://', '').replace('http://', '');
        if (key === 'teams' && displayText.includes('@')) displayText = displayText.split('@')[0];

        return `<li ${liClass}><i class="${item.icon_class}"></i> <a href="${item.link}" target="_blank" ${relAttr}> ${displayText} </a> </li>`;
    }).join('');

    contactsList.innerHTML = html;
},

    render_sidebar_expertise(limit = 5) {
        const data = SiteCore.get('professional_experiences');
        if (!data || !data.summary || !data.summary.expertise_list) return;
        console.log("render_sidebar_expertise: ", data, "");

        const sidebar = document.querySelector("#one-page-section .cv-sidebar");
        const titles = sidebar?.querySelectorAll(".sidebar-title");
        const lists = sidebar?.querySelectorAll(".sidebar-list");

        // Substring match and property check to ensure correct data object
        const expObj = data.summary.expertise_list.find(item =>
            item.title?.toLowerCase().includes('expertise') && item.cv_expertise
        );

        if (expObj && titles[1] && lists[1]) {
            titles[1].innerHTML = `<i class="bi bi-tools me-2"></i>${expObj.title}`;
            // Apply limit via .slice() before mapping
            lists[1].innerHTML = expObj.cv_expertise.slice(0, limit).map(skill => `
                <li><i class="bi bi-dot"></i> ${skill} </li>
            `).join('');
        }
    },

    render_sidebar_research_areas(limit = 5) {
        const data = SiteCore.get('professional_experiences');
        if (!data || !data.summary || !data.summary.expertise_list) return;
        console.log("render_sidebar_research_areas: ", data, "");

        const sidebar = document.querySelector("#one-page-section .cv-sidebar");
        const titles = sidebar?.querySelectorAll(".sidebar-title");
        const lists = sidebar?.querySelectorAll(".sidebar-list");

        const resObj = data.summary.expertise_list.find(item =>
            item.title?.toLowerCase().includes('research area') && item.cv_research_areas
        );

        if (resObj && titles[2] && lists[2]) {
            titles[2].innerHTML = `<i class="bi bi-search me-2"></i>${resObj.title}`;
            // Limit the number of research areas displayed
            lists[2].innerHTML = resObj.cv_research_areas.slice(0, limit).map(area => `
                <li><i class="bi bi-dot"></i> ${area} </li>
            `).join('');
        }
    },

    render_sidebar_personal_skills(limit = 5) {
        const data = SiteCore.get('skills_tools');
        if (!data || !data.skills) return;
        console.log("render_sidebar_personal_skills: ", data, "");

        const sidebar = document.querySelector("#one-page-section .cv-sidebar");
        const titles = sidebar?.querySelectorAll(".sidebar-title");
        const lists = sidebar?.querySelectorAll(".sidebar-list");

        // Combine categories using substring matching
        const softSkills = data.skills.find(s => s.category?.toLowerCase().includes('soft'));
        const management = data.skills.find(s => s.category?.toLowerCase().includes('manage'));

        const combinedItems = [];
        if (softSkills) combinedItems.push(...softSkills.short_description.split(', '));
        if (management) combinedItems.push(...management.short_description.split(', '));

        if (titles[3] && lists[3]) {
            titles[3].innerHTML = `<i class="bi bi-person-workspace me-2"></i>Personal Skills`;
            // Limit combined skills list
            lists[3].innerHTML = combinedItems.slice(0, limit).map(item => `
                <li><i class="bi bi-dot"></i> ${item} </li>
            `).join('');
        }
    },

    render_sidebar_programming(limit = 10) {
        const data = SiteCore.get('skills_tools');
        if (!data || !data.skills) return;
        console.log("render_sidebar_programming: ", data, "");

        const sidebar = document.querySelector("#one-page-section .cv-sidebar");
        if (!sidebar) return;

        const titles = sidebar.querySelectorAll(".sidebar-title");
        const contents = sidebar.querySelectorAll(".sidebar-list");

        // Substring match for the programming category
        const prog = data.skills.find(s => s.category?.toLowerCase().includes('programming'));

        if (prog && titles[4] && contents[4]) {
            // Use the dynamic category title from JSON
            titles[4].innerHTML = `<i class="bi bi-file-earmark-code me-2"></i>${prog.category}`;

            // Split the comma-separated string, apply the limit, and join back
            const skillItems = prog.short_description.split(', ');
            contents[4].textContent = skillItems.slice(0, limit).join(', ');
        }
    },

    render_sidebar_languages(limit = 3) {
        const data = SiteCore.get('languages');
        if (!data || !data.languages) return;
        console.log("render_sidebar_languages: ", data, "");

        const sidebar = document.querySelector("#one-page-section .cv-sidebar");
        const titles = sidebar?.querySelectorAll(".sidebar-title");
        const contents = sidebar?.querySelectorAll(".sidebar-list");

        if (titles[5] && contents[5]) {
            titles[5].innerHTML = `<i class="${data.section_info.icon_class} me-2"></i>${data.section_info.title}`;
            // Slice language array before mapping to string
            contents[5].textContent = data.languages.slice(0, limit).map(l =>
                `${l.language} (${l.status})`
            ).join(', ');
        }
    },

    render_sidebar_memberships(limit = 3) {
        const data = SiteCore.get('organisational_memberships');
        if (!data || !data.memberships) return;
        console.log("render_sidebar_memberships: ", data, "");

        const sidebar = document.querySelector("#one-page-section .cv-sidebar");
        const titles = sidebar?.querySelectorAll(".sidebar-title");
        const lists = sidebar?.querySelectorAll(".sidebar-list");

        if (titles[6] && lists[6]) {
            titles[6].innerHTML = `<i class="${data.section_info.icon_class} me-2"></i>${data.section_info.title}`;
            // Limit memberships list
            lists[6].innerHTML = data.memberships.slice(0, limit).map(m => `
                <li><i class="bi bi-dot"></i> ${m.title} </li>
            `).join('');
        }
    },

    // Sidebar sections
    render_sidebar_logo() {
        const site = SiteCore.get('site');
        if (!site) return;

        const imageContainer = document.querySelector("#one-page-section .cv-sidebar .cv-sidebar-footer-container");
        if (!imageContainer) return;

        console.log("render_sidebar_logo: ", site, "");

        // Injects the formal profile image with glightbox support
        imageContainer.innerHTML = `
            <img src="${site.assets.icons.logo_png}" alt="${site.site_info.author} - CV" class="sidebar-footer-logo" alt="Branding Overlay">
        `;
    },


    //  Main body sections
    render_header() {
    const data = SiteCore.get('personal_information');
    if (!data) return;
    console.log("render_header: ", data, "");

    const headerSection = document.querySelector("#one-page-section .header-section");
    if (!headerSection) return;

    // 1. Update Name
    const nameEl = headerSection.querySelector(".one-page-name");
    if (nameEl) nameEl.textContent = data.name;

    // 2. Update Subtitle using the hero_slogan array
    // The slogan items are stored within main_keywards.hero_slogan
    const subtitleEl = headerSection.querySelector(".one-page-subtitle");
    if (subtitleEl) {
        const sloganArray = data.hero?.main_keywards?.hero_slogan || [];
        // Map through the array to extract the 'text' property and join them with " | "
        const sloganText = sloganArray.map(item => item.text).join(" | ");
        subtitleEl.textContent = sloganText;
    }

    // 3. Update Summary Body using the short introduction
    const summaryEl = headerSection.querySelector(".cv-one-page-body");
    if (summaryEl) {
        // Targets 'intro_paragraph_short' as the primary source for the one-page summary
        summaryEl.textContent = data.profile_summary?.intro_paragraph_short || "";
    }
},

    render_key_info_grid() {
        const data = SiteCore.get('key_information');
        if (!data || !data.metrics) return;
        console.log("render_cv_info_grid: ", data, "");

        const gridContainer = document.querySelector("#one-page-section .cv-info-grid");
        if (!gridContainer) return;

        // Map through the pre-calculated metrics array
        gridContainer.innerHTML = data.metrics.map(metric => {
            // Logic to reconstruct the "12 Years" style for duration-based metrics
            const isDuration = metric.strong_text.toLowerCase().includes('years');
            const boldPart = isDuration ? `${metric.value} ${metric.strong_text}` : metric.value;

            // Determine label: If duration, derive category from description. Otherwise, use strong_text
            let label = metric.strong_text;
            if (isDuration) {
                label = metric.description
                    .replace(/of /gi, "")
                    .replace(/ experience/gi, "")
                    .trim();
                label = label.charAt(0).toUpperCase() + label.slice(1);
            }

            return `
                <div class="col-3">
                    <div class="cv-info-card">
                        <strong>${boldPart}</strong><br>${label}
                    </div>
                </div>
            `;
        }).join('');
    },


    render_academic_information() {
        const data = SiteCore.get('academic_information');
        if (!data || !data.degrees) return;
        console.log("render_academic_information: ", data, "");

        const mainBody = document.querySelector("#one-page-section .cv-main-body");
        if (!mainBody) return;

        // Locates the Academic Information section header
        const sectionHeader = Array.from(mainBody.querySelectorAll(".main-section-title"))
            .find(el => el.textContent.toLowerCase().includes("academic") || el.textContent.toLowerCase().includes("education"));

        if (!sectionHeader) return;

        // 1. Update the section title and icon dynamically
        sectionHeader.className = "main-section-title mt-0";
        sectionHeader.innerHTML = `<i class="${data.section_info.icon_class} me-2"></i>${data.section_info.title}`;

        // 2. Map all degrees from JSON to the requested flat HTML structure
        const educationHTML = data.degrees.map(item => {
            // Extracting years for the compact date span
            const startYear = item.timeframe_details.start_date.match(/\d{4}/)?.[0] || "";
            const endYear = item.timeframe_details.end_date.match(/\d{4}/)?.[0] || item.timeframe_details.end_date;
            const dateSpan = `${startYear} – ${endYear}`;

            // Construct Collaboration info (e.g., Joint Programs)
            let collabHTML = "";
            if (item.collaboration && item.collaboration.length > 0) {
                const collab = item.collaboration[0];
                collabHTML = `<span class="text-muted">${collab.collaboration_type} Program with ${collab.institution_name}. </span>`;
            }

            // Construct Thesis line
            const thesisHTML = item.thesis_details?.thesis_title
                ? `<br>Thesis: ${item.thesis_details.thesis_title}`
                : "";

            // Mapping degree short names to full descriptive titles as per your requested format
            let displayTitle = item.degree_short_name;
            if (displayTitle === "PhD in CSM") displayTitle = "PhD in Computational Science & Mathematical Modelling";
            else if (displayTitle === "PhD in IT") displayTitle = "PhD in Information Technology";
            else if (displayTitle === "MRes in IT") displayTitle = "Master of Science (by Research) in Information Technology";
            else if (displayTitle === "BSc in CSE") displayTitle = "Bachelor of Science in Computer Science and Engineering";

            return `
                <div class="mb-2 cv-item-compact">
                    <div class="d-flex justify-content-between fw-bold">
                        <span><i class="bi bi-mortarboard me-1"></i>${displayTitle}</span>
                        <span class="small-date">${dateSpan}</span>
                    </div>
                    <div class="italic">${item.institution_name}, ${item.institution_location}. ${collabHTML}</div>
                    <div class="cv-item-detail">
                        Specialisation: ${item.specialisation}
                        ${thesisHTML}
                    </div>
                </div>
            `;
        }).join('');

        // 3. FIX: Remove ALL existing items after the header until the next section header
        let currentSibling = sectionHeader.nextElementSibling;
        while (currentSibling && !currentSibling.classList.contains('main-section-title')) {
            let toDelete = currentSibling;
            currentSibling = currentSibling.nextElementSibling;
            toDelete.remove();
        }

        // 4. Inject all newly generated degree blocks after the header
        sectionHeader.insertAdjacentHTML('afterend', educationHTML);
    },

    render_academic_information_v2() {
    const data = SiteCore.get('academic_information');
    if (!data || !data.degrees) return;
    console.log("render_academic_information_v2: ", data, "");

    const mainBody = document.querySelector("#one-page-section .cv-main-body");
    if (!mainBody) return;

    const sectionHeader = Array.from(mainBody.querySelectorAll(".main-section-title"))
        .find(el => el.textContent.toLowerCase().includes("academic") || el.textContent.toLowerCase().includes("education"));

    if (!sectionHeader) return;

    // 1. Update Header
    sectionHeader.className = "main-section-title mt-0";
    sectionHeader.innerHTML = `<i class="${data.section_info.icon_class} me-2"></i>${data.section_info.title}`;

    // 2. Logic to group degrees by research_topic
    const grouped = [];
    const topicMap = {};

    data.degrees.forEach(deg => {
        const topic = deg.research_topic;
        // Group if topic is identical and not empty
        if (topic && topic !== "" && topicMap[topic]) {
            const entry = topicMap[topic];
            // Add the other university and location if not already present
            const instInfo = `${deg.institution_name}, ${deg.institution_location}`;
            if (!entry.institutions.includes(instInfo)) {
                entry.institutions.push(instInfo);
            }
            // Combine the major titles (e.g., CSM & IT)
            if (!entry.majors.includes(deg.degree_major)) {
                entry.majors.push(deg.degree_major);
            }
        } else {
            const entry = {
                level: deg.degree_level,
                majors: [deg.degree_major],
                institutions: [`${deg.institution_name}, ${deg.institution_location}`],
                date: `${deg.timeframe_details.start_date.match(/\d{4}/)?.[0]} – ${deg.timeframe_details.end_date.match(/\d{4}/)?.[0] || deg.timeframe_details.end_date}`,
                specialisation: deg.specialisation,
                thesis: deg.thesis_details?.thesis_title,
                isJoint: deg.collaboration && deg.collaboration.length > 0
            };
            if (topic && topic !== "") topicMap[topic] = entry;
            grouped.push(entry);
        }
    });

    // 3. Generate HTML blocks
    const educationHTML = grouped.map(g => {
        // Construct a clean display title based on the level and combined majors
        const combinedMajors = g.majors.join(' & ');
        const displayTitle = `${g.level.replace(/_XX/g, '')} in ${combinedMajors}`;

        // Combine institutions: "Coventry University, UK & Deakin University, Australia"
        const instLine = g.institutions.join(' & ');

        // Include the joint program note if applicable
        const jointNote = g.isJoint ? `<span class="text-muted">Cotutelle (Joint) Program.</span>` : "";
        const thesisLine = g.thesis ? `<br>Thesis: ${g.thesis}` : "";

        return `
            <div class="mb-2 cv-item-compact">
                <div class="d-flex justify-content-between fw-bold">
                    <span><i class="bi bi-mortarboard me-1"></i>${displayTitle}</span>
                    <span class="small-date">${g.date}</span>
                </div>
                <div class="italic">${instLine}. ${jointNote}</div>
                <div class="cv-item-detail">
                    Specialisation: ${g.specialisation}
                    ${thesisLine}
                </div>
            </div>
        `;
    }).join('');

    // 4. Cleanup: Remove ALL existing items between headers
    let currentSibling = sectionHeader.nextElementSibling;
    while (currentSibling && !currentSibling.classList.contains('main-section-title')) {
        let toDelete = currentSibling;
        currentSibling = currentSibling.nextElementSibling;
        toDelete.remove();
    }

    // 5. Inject new consolidated blocks
    sectionHeader.insertAdjacentHTML('afterend', educationHTML);
},

    render_professional_experiences() {
        const data = SiteCore.get('professional_experiences');
        if (!data || !data.experiences) return;
        console.log("render_professional_experiences: ", data, "");

        const mainBody = document.querySelector("#one-page-section .cv-main-body");
        if (!mainBody) return;

        // Locate the Professional Experiences section header
        const sectionHeader = Array.from(mainBody.querySelectorAll(".main-section-title"))
            .find(el => el.textContent.toLowerCase().includes("professional") || el.textContent.toLowerCase().includes("experience"));

        if (!sectionHeader) return;

        // 1. Update Section Header
        sectionHeader.className = "main-section-title mt-0";
        sectionHeader.innerHTML = `<i class="${data.section_info.icon_class || 'bi bi-briefcase'} me-2"></i>${data.section_info.title}`;

        // 2. Map through categories (Research, Training, Teaching, Industrial)
        const experiencesHTML = data.experiences.map(cat => {
            // Define category-specific icons based on your template
            let catIcon = "bi bi-briefcase";
            if (cat.category.includes("Research")) catIcon = "bx bxs-flask";
            else if (cat.category.includes("Training")) catIcon = "bi bi-person-video";
            else if (cat.category.includes("Teaching")) catIcon = "bi bi-vector-pen";
            else if (cat.category.includes("Industrial")) catIcon = "bi bi-file-earmark-code";

            const orgsHTML = cat.organisation.map(org => {
                // Combine all role titles within this organization (e.g., "Role A / Role B")
                const combinedRoles = org.roles.map(r => r.title).join(' / ');

                // Determine the overarching date range for the organization
                const startDates = org.roles.map(r => r.timeframe_details.start_date);
                const endDates = org.roles.map(r => r.timeframe_details.end_date);

                // Helper to get year/present from date string
                const getYear = (str) => str.match(/\d{4}/)?.[0] || str;
                const dateSpan = `${getYear(startDates[startDates.length - 1])} – ${getYear(endDates[0])}`;

                // Generate bullet points for job descriptions
                const descriptionBullets = org.roles
                    .filter(r => r.about_job)
                    .map(r => `<li>${r.about_job}</li>`)
                    .join('');

                return `
                    <div class="ms-2">
                        <div class="fw-bold text-dark"><i class="bi bi-building me-2"></i>${org.organization}, <span class="text-muted italic">${org.location}</span></div>
                        <div class="d-flex justify-content-between">
                            <span><i class="bi bi-briefcase me-2"></i>${combinedRoles}</span>
                            <span class="small-date">${dateSpan}</span>
                        </div>
                        <div class="cv-item-detail">
                            <ul>${descriptionBullets}</ul>
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="mb-2 cv-item-compact">
                    <div class="fw-bold text-dark"><i class="${catIcon} me-2"></i>${cat.category}</div>
                    ${orgsHTML}
                </div>
            `;
        }).join('');

        // 3. Cleanup: Remove existing items and inject new blocks
        let currentSibling = sectionHeader.nextElementSibling;
        while (currentSibling && !currentSibling.classList.contains('main-section-title')) {
            let toDelete = currentSibling;
            currentSibling = currentSibling.nextElementSibling;
            toDelete.remove();
        }
        sectionHeader.insertAdjacentHTML('afterend', experiencesHTML);
    },

    render_professional_experiences_v2() {
        const data = SiteCore.get('professional_experiences');
        if (!data || !data.experiences) return;
        console.log("render_professional_experiences_v2: ", data, "");

        const mainBody = document.querySelector("#one-page-section .cv-main-body");
        if (!mainBody) return;

        // Locate the Professional Experiences section header
        const sectionHeader = Array.from(mainBody.querySelectorAll(".main-section-title"))
            .find(el => el.textContent.toLowerCase().includes("professional") || el.textContent.toLowerCase().includes("experience"));

        if (!sectionHeader) return;

        // 1. Update Section Header dynamically
        sectionHeader.className = "main-section-title mt-0";
        sectionHeader.innerHTML = `<i class="${data.section_info.icon_class || 'bi bi-briefcase'} me-2"></i>${data.section_info.title}`;

        // 2. Map through categories (Research, Training, Teaching, Industrial)
        const experiencesHTML = data.experiences.map(cat => {
            // Define category-specific icons based on keywords
            let catIcon = "bi bi-briefcase";
            if (cat.category.includes("Research")) catIcon = "bx bxs-flask";
            else if (cat.category.includes("Training")) catIcon = "bi bi-person-video";
            else if (cat.category.includes("Teaching")) catIcon = "bi bi-vector-pen";
            else if (cat.category.includes("Industrial")) catIcon = "bi bi-file-earmark-code";

            const orgsHTML = cat.organisation.map(org => {
                // Combine all unique role titles within this organization
                const roleTitles = [...new Set(org.roles.map(r => r.title))].join(' / ');

                // Calculate overall date range (oldest start to newest end)
                const getYear = (str) => str.match(/\d{4}/)?.[0] || str;
                const startYear = getYear(org.roles[org.roles.length - 1].timeframe_details.start_date);
                const endYear = getYear(org.roles[0].timeframe_details.end_date);
                const dateSpan = `${startYear} – ${endYear}`;

                // Combine all "about_job" descriptions into a single paragraph
                const combinedParagraph = org.roles
                    .filter(r => r.about_job)
                    .map(r => r.about_job.trim())
                    .join('. ') + (org.roles.length > 0 ? '.' : '');

                return `
                    <div class="ms-2">
                        <div class="fw-bold text-dark"><i class="bi bi-building me-2"></i>${org.organization}, <span class="text-muted italic">${org.location}</span></div>
                        <div class="d-flex justify-content-between">
                            <span><i class="bi bi-briefcase me-2"></i>${roleTitles}</span>
                            <span class="small-date">${dateSpan}</span>
                        </div>
                        <div class="cv-item-detail">
                            <p class="cv-one-page-body text-justify mb-1">${combinedParagraph}</p>
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="mb-2 cv-item-compact">
                    <div class="fw-bold text-dark"><i class="${catIcon} me-2"></i>${cat.category}</div>
                    ${orgsHTML}
                </div>
            `;
        }).join('');

        // 3. Cleanup: Remove ALL existing items between headers
        let currentSibling = sectionHeader.nextElementSibling;
        while (currentSibling && !currentSibling.classList.contains('main-section-title')) {
            let toDelete = currentSibling;
            currentSibling = currentSibling.nextElementSibling;
            toDelete.remove();
        }

        // 4. Inject new consolidated blocks
        sectionHeader.insertAdjacentHTML('afterend', experiencesHTML);
    },

    render_professional_experiences_v3() {
        const data = SiteCore.get('professional_experiences');
        if (!data || !data.experiences) return;

        const mainBody = document.querySelector("#one-page-section .cv-main-body");
        if (!mainBody) return;

        const sectionHeader = Array.from(mainBody.querySelectorAll(".main-section-title"))
            .find(el => el.textContent.toLowerCase().includes("professional") || el.textContent.toLowerCase().includes("experience"));

        if (!sectionHeader) return;

        // 1. Update Header
        sectionHeader.className = "main-section-title mt-0";
        sectionHeader.innerHTML = `<i class="${data.section_info.icon_class || 'bi bi-briefcase'} me-2"></i>${data.section_info.title.replace(/_XX/g, '')}`;

        // 2. Aggregate all organizations across all categories
        const orgMap = {};
        data.experiences.forEach(category => {
            category.organisation.forEach(org => {
                const orgName = org.organization.replace(/_XX/g, '').trim();
                if (!orgMap[orgName]) {
                    orgMap[orgName] = {
                        name: orgName,
                        location: org.location.replace(/_XX/g, '').trim(),
                        roles: [],
                        icon: org.icon_class || 'bi bi-building'
                    };
                }
                // Add all roles from this category to the organization
                orgMap[orgName].roles.push(...org.roles);
            });
        });

        // 3. Generate HTML for each unique organization
        const experiencesHTML = Object.values(orgMap).map(org => {
            // Group similar role titles (v3 logic: merge PhD and MRes)
            const roleGroups = {};
            org.roles.forEach(r => {
                const cleanTitle = r.title.replace(/_XX/g, '').trim();
                const match = cleanTitle.match(/^(.*?)\s*\((.*?)\)$/);
                const base = match ? match[1].trim() : cleanTitle;
                const suffix = match ? match[2].replace(/Student|Researcher/g, '').trim() : "";

                if (!roleGroups[base]) roleGroups[base] = [];
                if (suffix && !roleGroups[base].includes(suffix)) roleGroups[base].push(suffix);
            });

            const consolidatedRoles = Object.keys(roleGroups).map(base => {
                return roleGroups[base].length > 0
                    ? `${base} (${roleGroups[base].join(' & ')})`
                    : base;
            }).join(' / ');

            // Calculate overarching date span for the organization
            const getYear = (str) => str.match(/\d{4}/)?.[0] || str;
            const startDates = org.roles.map(r => getYear(r.timeframe_details.start_date));
            const endDates = org.roles.map(r => getYear(r.timeframe_details.end_date));
            const dateSpan = `${startDates.sort()[0]} – ${endDates.includes('Present') ? 'Present' : endDates.sort().reverse()[0]}`;

            // Merge all "about_job" lines into a single paragraph
            const combinedParagraph = org.roles
                .filter(r => r.about_job)
                .map(r => r.about_job.replace(/_XX/g, '').trim())
                .join('. ') + '.';

            return `
                <div class="mb-2 cv-item-compact">
                    <div class="fw-bold text-dark">
                        <i class="bi bi-building me-2"></i>${org.name}, 
                        <span class="text-muted italic">${org.location}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span><i class="bi bi-briefcase me-2"></i>${consolidatedRoles}</span>
                        <span class="small-date">${dateSpan}</span>
                    </div>
                    <div class="cv-item-detail">
                        <p class="cv-one-page-body text-justify mb-1">${combinedParagraph}</p>
                    </div>
                </div>
            `;
        }).join('');

        // 4. Cleanup and Inject
        let currentSibling = sectionHeader.nextElementSibling;
        while (currentSibling && !currentSibling.classList.contains('main-section-title')) {
            let toDelete = currentSibling;
            currentSibling = currentSibling.nextElementSibling;
            toDelete.remove();
        }
        sectionHeader.insertAdjacentHTML('afterend', experiencesHTML);
    },

    render_professional_experiences_v4() {
        const data = SiteCore.get('professional_experiences');
        if (!data || !data.experiences) return;
        console.log("render_professional_experiences: ", data, "");

        const mainBody = document.querySelector("#one-page-section .cv-main-body");
        if (!mainBody) return;

        // Locate the Professional Experiences section header
        const sectionHeader = Array.from(mainBody.querySelectorAll(".main-section-title"))
            .find(el => el.textContent.toLowerCase().includes("professional") || el.textContent.toLowerCase().includes("experience"));

        if (!sectionHeader) return;

        // 1. Update Section Header
        sectionHeader.className = "main-section-title mt-0";
        sectionHeader.innerHTML = `<i class="${data.section_info.icon_class || 'bi bi-briefcase'} me-2"></i>${data.section_info.title}`;

        // 2. Map through categories (Research, Training, Teaching, Industrial)
        const experiencesHTML = data.experiences.map(cat => {
            // Define category-specific icons based on your template
            let catIcon = "bi bi-briefcase";
            if (cat.category.includes("Research")) catIcon = "bx bxs-flask";
            else if (cat.category.includes("Training")) catIcon = "bi bi-person-video";
            else if (cat.category.includes("Teaching")) catIcon = "bi bi-vector-pen";
            else if (cat.category.includes("Industrial")) catIcon = "bi bi-file-earmark-code";

            const orgsHTML = cat.organisation.map(org => {
                // Combine all role titles within this organization (e.g., "Role A / Role B")
                const combinedRoles = org.roles.map(r => r.title).join(' / ');

                // Determine the overarching date range for the organization
                const startDates = org.roles.map(r => r.timeframe_details.start_date);
                const endDates = org.roles.map(r => r.timeframe_details.end_date);

                // Helper to get year/present from date string
                const getYear = (str) => str.match(/\d{4}/)?.[0] || str;
                const dateSpan = `${getYear(startDates[startDates.length - 1])} – ${getYear(endDates[0])}`;

                // Generate bullet points for job descriptions
                const descriptionBullets = org.roles
                    .filter(r => r.about_job)
                    .map(r => `<li>${r.about_job}</li>`)
                    .join('');

                return `
                    <div class="ms-2">
                        <div class="fw-bold text-dark"><i class="bi bi-building me-2"></i>${org.organization}, <span class="text-muted italic">${org.location}</span></div>
                        <div class="d-flex justify-content-between">
                            <span><i class="bi bi-briefcase me-2"></i>${combinedRoles}</span>
                            <span class="small-date">${dateSpan}</span>
                        </div>
<!--                        <div class="cv-item-detail">-->
<!--                            <ul>${descriptionBullets}</ul>-->
<!--                        </div>-->
                    </div>
                `;
            }).join('');

            return `
                <div class="mb-2 cv-item-compact">
                    <div class="fw-bold text-dark"><i class="${catIcon} me-2"></i>${cat.category}</div>
                    ${orgsHTML}
                </div>
            `;
        }).join('');

        // 3. Cleanup: Remove existing items and inject new blocks
        let currentSibling = sectionHeader.nextElementSibling;
        while (currentSibling && !currentSibling.classList.contains('main-section-title')) {
            let toDelete = currentSibling;
            currentSibling = currentSibling.nextElementSibling;
            toDelete.remove();
        }
        sectionHeader.insertAdjacentHTML('afterend', experiencesHTML);
    },


    render_honors_awards(limit = 7) {
        const data = SiteCore.get('honors_awards');
        if (!data || !data.honorsawards) return;
        console.log("render_awards: ", data, "");

        // Target the main body of the one-page CV
        const mainBody = document.querySelector("#one-page-section .cv-main-body");
        if (!mainBody) return;

        // In the one-page template, the awards list is the div following the "Honors and Awards" heading
        const sectionHeader = Array.from(mainBody.querySelectorAll(".main-section-title"))
            .find(el => el.textContent.includes("Honors and Awards"));

        const listContainer = sectionHeader?.nextElementSibling;
        if (!listContainer) return;

        // 1. Update the section title dynamically
        sectionHeader.innerHTML = `<i class="${data.section_info.icon_class} me-2"></i>${data.section_info.title}`;

        // 2. Map through the awards array to generate the compact rows
        const awardsHTML = data.honorsawards.slice(0, limit).map(item => {
            // Extract the year from the date string
            const yearMatch = item.date.match(/\b(20\d{2})\b/);
            const yearStr = yearMatch ? yearMatch[1] : "";

            // Combine title with the associated organization for context
            const orgName = item.associated_organization?.name || item.issuer_organization?.name || "";
            const displayName = orgName ? `<strong>${item.title}</strong> – ${orgName}` : `<strong>${item.title}</strong>`;

            return `
                <div class="d-flex justify-content-between">
                    <span><i class="${item.icon_class || 'bi bi-award'} me-1"></i>${displayName}</span>
                    <span class="small-date">${yearStr}</span>
                </div>
            `;
        }).join('');

        // 3. Inject the generated rows into the container
        listContainer.innerHTML = awardsHTML;
    },

    render_courses_trainings_certificates(limit = 5) {
        const data = SiteCore.get('courses_trainings_certificates');
        if (!data || !data.coursestrainingscertificates) return;
        console.log("render_courses_trainings_certificates: ", data, "");

        const mainBody = document.querySelector("#one-page-section .cv-main-body");
        if (!mainBody) return;

        // Locate the section header and the content container
        const sectionHeader = Array.from(mainBody.querySelectorAll(".main-section-title"))
            .find(el => el.textContent.toLowerCase().includes("courses") || el.textContent.toLowerCase().includes("training"));

        const container = sectionHeader?.nextElementSibling;
        if (!container) return;

        // 1. Update the section title and icon dynamically
        sectionHeader.innerHTML = `<i class="${data.section_info.icon_class || 'bi bi-patch-check'} me-2"></i>${data.section_info.title}`;

        // 2. Map through the top certificates using the provided limit
        const topCerts = data.coursestrainingscertificates.slice(0, limit);
        const certsHTML = topCerts.map(cert => {
            const details = cert.details;
            const offering = details.offering_organization;
            const funding = details.funding_organization;
            // Construct the issuer string (e.g., "Google/Kaggle" or "Udacity")
            const issuer = funding ? `${offering}/${funding}` : offering;

            return `<div class="mb-1"><strong>${issuer}:</strong> ${cert.title}</div>`;
        }).join('');

        // 3. Handle the "additional certifications" summary
        const totalCount = data.coursestrainingscertificates.length;
        const remainingCount = totalCount - limit;
        let additionalHTML = "";

        if (remainingCount > 0) {
            // Use the pre-calculated summary from the section info if available
            const summaryText = data.section_info.additional_summary || "additional certifications in Python, Data Science, and BCI.";
            additionalHTML = `<div class="text-muted italic">+${remainingCount} ${summaryText}</div>`;
        }

        // 4. Inject the generated rows into the container
        container.innerHTML = certsHTML + additionalHTML;
    },

    render_portfolios(limit = 3) {
        const data = SiteCore.get('portfolios');
        if (!data || !data.portfolios) return;
        console.log("render_portfolios: ", data, "");

        const mainBody = document.querySelector("#one-page-section .cv-main-body");
        if (!mainBody) return;

        // Locate the correct section header using substring matching
        const sectionHeader = Array.from(mainBody.querySelectorAll(".main-section-title"))
            .find(el => el.textContent.toLowerCase().includes("portfolio") || el.textContent.toLowerCase().includes("project"));

        const container = sectionHeader?.nextElementSibling;
        if (!container) return;

        // Update section title and icon from the portfolios JSON
        sectionHeader.innerHTML = `<i class="${data.section_info.icon_class} me-2"></i>${data.section_info.title}`;

        // Map the portfolio items (Title and Description) to a compact list
        const portfolioHTML = data.portfolios.slice(0, limit).map(port => {
            const link = `@${port.portfolio_url?.split('/').pop() ?? 'link'}`;
            return `
                <div class="mb-2 text-justify">
                    <i class="${port.icon_class}"></i><strong> ${port.title}</strong>: <span>${link}</span>
                </div>
            `;
        }).join('');

        container.innerHTML = portfolioHTML;
    },

    render_volunteering_services(limit = 2) {
        const data = SiteCore.get('volunteering_services');
        // Updated check: the JSON key is 'volunteerings'
        if (!data || !data.volunteerings) return;
        console.log("render_volunteering_services: ", data, "");

        const mainBody = document.querySelector("#one-page-section .cv-main-body");
        if (!mainBody) return;

        const sectionHeader = Array.from(mainBody.querySelectorAll(".main-section-title"))
            .find(el => el.textContent.toLowerCase().includes("volunteer") || el.textContent.toLowerCase().includes("service"));

        const container = sectionHeader?.nextElementSibling;
        if (!container) return;

        // 1. Update title and icon from section_info
        sectionHeader.innerHTML = `<i class="${data.section_info.icon_class} me-2"></i>${data.section_info.title}`;

        // 2. Map through 'volunteerings'
        const volunteeringHTML = data.volunteerings.slice(0, limit).map(item => {
            // Extract year from timeframe_details.start_date
            const dateStr = item.timeframe_details?.start_date || "";
            const yearMatch = dateStr.match(/\b(20\d{2})\b/);
            const yearStr = yearMatch ? yearMatch[1] : "";

            return `
                <div class="d-flex justify-content-between mb-1">
                    <span>
                        <i class="bi bi-dot"></i>
                        <strong>${item.title}</strong> – ${item.organization}
                    </span>
                    <span class="small-date">${yearStr}</span>
                </div>
            `;
        }).join('');

        container.innerHTML = volunteeringHTML;
    },

    render_publications() {
        const data = SiteCore.get('publications');
        if (!data || !data.publications) return;
        console.log("render_publications summary: ", data, "");

        const mainBody = document.querySelector("#one-page-section .cv-main-body");
        if (!mainBody) return;

        // Locates the Publications section header within the main body
        const sectionHeader = Array.from(mainBody.querySelectorAll(".main-section-title"))
            .find(el => el.textContent.toLowerCase().includes("publication"));

        if (!sectionHeader) return;

        // 1. Update Header to match requested snippet style
        sectionHeader.className = "main-section-title mt-0";
        sectionHeader.innerHTML = `<i class="${data.section_info.icon_class || 'bi bi-file-richtext'} me-2"></i>${data.section_info.title}`;

        // 2. Extract counts for Journals, Conferences, and Posters
        const jCount = data.publications.journals?.items?.length || 0;
        const cCount = data.publications.conferences?.items?.length || 0;
        const pCount = data.publications.posters?.items?.length || 0;

        // 3. Construct the summary grid HTML exactly as requested
        const summaryHTML = `
            <div class="row g-1 mb-2 text-center" style="font-size: 8px; line-height: 1.1;">
                <div class="col-3">
                    <div class="cv-info-card">
                        <strong>${jCount}</strong><br>Journal(s)
                    </div>
                </div>
                <div class="col-3">
                    <div class="cv-info-card">
                        <strong>${cCount}</strong><br>Conference(s)
                    </div>
                </div>
                <div class="col-3">
                    <div class="cv-info-card">
                        <strong>${pCount}</strong><br>Poster(s)
                    </div>
                </div>
            </div>
        `;

        // 4. Replace the existing list container with the summary cards
        if (sectionHeader.nextElementSibling) {
            sectionHeader.nextElementSibling.outerHTML = summaryHTML;
        }
    }



};