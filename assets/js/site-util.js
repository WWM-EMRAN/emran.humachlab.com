/**
 * site-util.js - Global Utilities
 */
const SiteUtil = {
    /**
     * Returns the provided year or the current year if set to 'AUTO'.
     */
    getCopyrightYear(yearValue) {
        if (!yearValue) return new Date().getFullYear();
        const strYear = String(yearValue).toUpperCase();
        return strYear === 'AUTO' ? new Date().getFullYear() : yearValue;
    },

    /**
     * Ported from site-loader-old.js
     */
    calculateUniqueYears(intervals) {
        if (!intervals || intervals.length === 0) return 0;

        intervals.sort((a, b) => a.start - b.start);
        const merged = [intervals[0]];

        for (let i = 1; i < intervals.length; i++) {
            const last = merged[merged.length - 1];
            const current = intervals[i];
            if (current.start <= last.end) {
                last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()));
            } else {
                merged.push(current);
            }
        }

        const totalMs = merged.reduce((sum, interval) => sum + (interval.end - interval.start), 0);
        return Math.floor(totalMs / (1000 * 60 * 60 * 24 * 365.25));
    },

    /**
     * Master Synchronization Logic
     */
    async syncGlobalMetrics() {
        console.log("Syncing metrics across modules...");
        const keyInfo = SiteCore.get('key_information');
        if (!keyInfo) return;

        // 1. Calculate Teaching Years
        const teachingIntervals = [];
        const prof = SiteCore.get('professional_experiences');
        if (prof?.experiences) {
            prof.experiences.forEach(cat => {
                if (cat.category.includes("Teaching") || cat.category.includes("Training")) {
                    cat.organisation.forEach(org => {
                        org.roles.forEach(role => {
                            const start = new Date(role.timeframe_details.start_date);
                            const endStr = role.timeframe_details.end_date;
                            const end = (endStr === "Present") ? new Date() : new Date(endStr);
                            if (!isNaN(start) && !isNaN(end)) teachingIntervals.push({ start, end });
                        });
                    });
                }
            });
        }

        // FIXED: Call using SiteUtil instead of 'this' to avoid TypeError
        const totalTeachingYears = SiteUtil.calculateUniqueYears(teachingIntervals);

        // 2. Count Items
        const totalProjects = SiteCore.get('projects')?.projects?.length || 0;
        let totalPubs = 0;
        const pubs = SiteCore.get('publications')?.publications;
        if (pubs) Object.values(pubs).forEach(cat => { if (cat.items) totalPubs += cat.items.length; });

        const totalInstitutions = SiteCore.get('academic_information')?.degrees?.length || 0;
        const totalCerts = SiteCore.get('courses_trainings_certificates')?.coursestrainingscertificates?.length || 0;

        // 3. Update memory object
        keyInfo.metrics.forEach(m => {
            const desc = m.description.toLowerCase();
            const strong = m.strong_text.toLowerCase();
            if (desc.includes("teaching")) m.value = totalTeachingYears || m.value;
            if (strong.includes("projects")) m.value = totalProjects || m.value;
            if (strong.includes("publications")) m.value = totalPubs || m.value;
            if (desc.includes("academic and research")) m.value = totalInstitutions || m.value;
            if (strong.includes("certificates")) m.value = totalCerts || m.value;
        });
    },

    /**
     * Calculates duration between two dates.
     * Ported from site-loader-old.js
     */
    calculateDuration(startDateStr, endDateStr) {
        const start = new Date(startDateStr);
        let end = (endDateStr === "Present" || !endDateStr) ? new Date() : new Date(endDateStr);

        if (isNaN(start)) return "";
        end.setDate(end.getDate() + 1);

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        let duration = "";
        if (years > 0) duration += `${years} yr${years > 1 ? 's' : ''} `;
        if (months > 0) duration += `${months} mo${months > 1 ? 's' : ''}`;
        return duration === "" ? "1 mo" : duration.trim();
    },

    /**
     * Filters and sorts certificates for the index page.
     * Returns the top X items based on serial_no.
     */
    getTopCertificates(data, limit = 12) {
        if (!data || !data.coursestrainingscertificates) return [];

        // 1. Create a copy and sort by serial_no numerically
        const sorted = [...data.coursestrainingscertificates].sort((a, b) => {
            const numA = parseInt(a.serial_no) || 999; // Fallback for missing serials
            const numB = parseInt(b.serial_no) || 999;
            return numA - numB;
        });

        // 2. Return only the top 'limit' items
        return sorted.slice(0, limit);
    },

    /**
     * Extracts unique filter tags and maps them to readable labels
     */
    getFilterMenuData(data) {
        if (!data || !data.coursestrainingscertificates) return [];

        const tags = new Set();
        data.coursestrainingscertificates.forEach(item => {
            if (item.filter_tags) {
                item.filter_tags.forEach(tag => tags.add(tag));
            }
        });

        // Mapping for specific tags to pretty labels
        const filterMap = {
            'filter-cert': 'Certificate',
            'filter-cour': 'Course',
            'filter-train': 'Training',
            'filter-conf': 'Conference',
            'filter-boot': 'Bootcamp'
        };

        return Array.from(tags).map(tag => ({
            tag: `.${tag}`,
            label: filterMap[tag] || tag.replace('filter-', '').replace(/^\w/, c => c.toUpperCase())
        }));
    },

    /**
     * Get current URL path and parameter details
     */
    getCurrentPathDetails() {
        // 0. Main URL and origin
        const url = window.location.href;
        const origin = window.location.origin;

        // 1. File Name Fallback
        const pathName = window.location.pathname;
        // If path is just "/" or empty, default to "index.html"
        const fileName = pathName.substring(pathName.lastIndexOf('/') + 1) || 'index.html';

        // 2. Query Parameter Fallback (Mode)
        const urlParams = new URLSearchParams(window.location.search);
        // Pase all parameters to dictionary
        const allParams = Object.fromEntries(urlParams) || {};

        // 3. Hash/Fragment Fallback (Section)
        // If #about is missing, hash will be an empty string ""
        const hashStr = window.location.hash || '';
        // Split hash values
        const hashes = hashStr.split('#').filter(Boolean);
        // const hashes = hashStr.split('#');

        console.log("====> CURRENT URL INFO:",
                            "\nURL              = ", url,
                            "\nORIGIN           = ", origin,
                            "\nPATH             = ", pathName,
                            "\nFILE             = ", fileName,
                            "\nGET PARAMETERS   = ", allParams,
                            "\nHASH VALS        = ", hashes);

        // let hashStr = "#home#about";
        // let parts = hashStr.split('#');
        // console.log('===>', allParams, hashes); // true
        // console.log('--->', allParams.mode, hashes[0]); // true

        return [url, origin, pathName, fileName, allParams, hashes];
    },

};


/**
 * Global 404 View Renderer
 * Replaces the entire <main> content with a standalone error page.
 * File: site-util.js
 */
window.render_404_page = (missingItemName = "Page") => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    // 1. Completely overwrite the main content to break out of any section IDs
    mainElement.innerHTML = `
        <div id="notfound-container" class="d-flex align-items-center justify-content-center" style="min-height: 80vh;">
            <div class="error-content text-center" data-aos="fade-up">
                <img src="assets/img/Emran_Ali_Logo2.gif" alt="Emran Ali Logo" style="height: 130px;" class="mb-4">
                <h1 class="display-1 fw-bold text-primary">404</h1>
                <h2 class="fw-bold mb-3">Oops! ${missingItemName} Not Found</h2>
                <p class="text-secondary mb-4 mx-auto" style="max-width: 500px;">
                    The information you are looking for might have been removed, 
                    had its name changed, or is temporarily unavailable in our database.
                </p>
                <div class="d-flex flex-wrap justify-content-center gap-3">
                    <a href="./" class="btn btn-primary px-4 py-2 fw-bold rounded-pill">
                        <i class="bi bi-house-door me-2"></i> Back to Homepage
                    </a>
                    <a href="javascript:history.back()" class="btn btn-outline-secondary px-4 py-2 fw-bold rounded-pill">
                        <i class="bi bi-backspace me-2"></i> Back to Previous Page
                    </a>
                </div>
            </div>
        </div>
    `;

    // 2. Hide the sticky header if it exists on page_details.html
    const stickyHeader = document.getElementById('section_details-header');
    if (stickyHeader) stickyHeader.style.display = 'none';

    // 3. Refresh AOS for the new content
    if (typeof AOS !== 'undefined') AOS.init();
    window.hide_preloader();
};


