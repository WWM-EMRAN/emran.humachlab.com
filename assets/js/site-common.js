/**
 * site-common.js - Global UI Controller
 * Handles elements shared across all pages (Sidebar, Header, Footers, Metadata).
 */
const SiteCommon = {
    init(menuType='main') {
        console.log("Initializing Global Site Elements...");
        const siteData = SiteCore.get('site');
        const personalData = SiteCore.get('personal_information');

        if (!siteData || !personalData) {
            console.error("Missing core data for common elements.");
            return;
        }

        this.updateMetadata(siteData.site_info, siteData.assets);
        this.renderHeader(personalData, siteData);
        this.renderNavigation(siteData.navigation, menuType);
        this.renderFooters(siteData.footer_meta, siteData.assets);
    },

    /** Updates <title> and Favicon */
    updateMetadata(info, assets) {
        if (info?.title) document.title = info.title;

        // Update favicon if exists
        let favicon = document.querySelector('link[rel="icon"]');
        if (favicon && assets?.icons?.logo_png) {
            favicon.href = assets.icons.logo_png;
        }
    },

    /** Renders Sidebar Name, Photo, and Social Links */
    renderHeader(personal, site) {
        // Site Name
        const nameEl = document.querySelector('#header .sitename');
        if (nameEl) nameEl.textContent = personal.name;

        // Profile Images
        const profileImgWrap = document.querySelector('#header .profile-img');
        if (profileImgWrap && site?.assets?.images?.profile_image_pp) {
            const link = profileImgWrap.querySelector('a');
            const img = profileImgWrap.querySelector('img');
            const photoPath = site.assets.images.profile_image_pp;

            if (link) link.href = photoPath;
            if (img) img.src = photoPath;
        }

        const logoImg = document.querySelector('#header .logo img');
        if (logoImg && site.assets.icons.logo_png) {
            logoImg.src = site.assets.icons.logo_png;
        }

        // Social Links
        const socialBox = document.querySelector('#header .social-links');
        if (socialBox && site.social_links?.main) {
            socialBox.innerHTML = site.social_links.main.map(link => `
                <a href="${link.url}" target="_blank" class="${link.platform}">
                    <i class="${link.icon_class}"></i>
                </a>
            `).join('');
        }
    },

    /** Renders the Sidebar Navigation Menu */
    renderNavigation(nav, menuType) {
        const navContainer = document.getElementById('navmenu');
        if (!navContainer || !nav?.main_menu || !nav?.short_menu) return;

        selected_menu = (menuType==="main") ? nav.main_menu : nav.short_menu;
        console.log("Rendering Navigation Menu: " + selected_menu)

        let html = '<ul>';
        selected_menu.forEach(item => {
            const activeClass = (item.url === '#hero' || item.url === 'index.html') ? 'active' : '';

            if (item.is_dropdown && item.submenu?.length > 0) {
                html += `
                    <li class="dropdown">
                        <a href="${item.url}" class="${activeClass} scrollto">
                            <i class="${item.icon_class} navicon"></i> <span>${item.label}</span>
                            <i class="bi bi-chevron-down toggle-dropdown"></i>
                        </a>
                        <ul>
                            ${item.submenu.map(sub => `
                                <li><a href="${sub.url}" class="scrollto"><i class="${sub.icon_class} navicon"></i> <span>${sub.label}</span></a></li>
                            `).join('')}
                        </ul>
                    </li>`;
            } else {
                html += `<li><a href="${item.url}" class="${activeClass} scrollto"><i class="${item.icon_class} navicon"></i> <span>${item.label}</span></a></li>`;
            }
        });
        html += '</ul>';
        navContainer.innerHTML = html;
    },

    /** Renders Sidebar Footer and Main Page Footer */
    renderFooters(meta, assets) {
        // 1. Sidebar Menu Footer
        const menuFooter = document.getElementById('menu_footer');
        if (menuFooter && meta.menu_footer) {
            const footer = meta.menu_footer;

            // USE HELPER: Process the year via SiteUtil
            const year = SiteUtil.getCopyrightYear(footer.copyright_year);

            menuFooter.innerHTML = `
                <div class="container">
                    <div class="copyright">
                        <p>© Copyright · ${year} <strong><span>
                            <a href="page_details.html?page=${footer.copyright_logo_url}">
                                <img style="height: 20px;" src="${assets.icons.logo_png}" alt="Logo" class="img-fluid rounded-circle">
                            </a>
                            <a href="page_details.html?page=${footer.copyright_text_url}">${footer.copyright_owner}</a>
                        </span></strong></p>
                    </div>
                    <div class="credits">
                        ${footer.links.map(l => `<a href="page_details.html?page=${l.url}">${l.label}</a>`).join(' | ')}
                    </div>
                </div>`;
        }

        // 2. Global Page Footer
        const pageFooter = document.getElementById('footer');
        if (pageFooter && meta.main_page_footer) {
            const mainF = meta.main_page_footer;
            pageFooter.innerHTML = `
                <div class="container">
                    <div class="copyright text-center">
                        <p>© Copyright <strong class="px-1 sitename">${mainF.sitename}</strong> All Rights Reserved</p>
                    </div>
                    <div class="credits">
                        Designed by <a target="_blank" href="${mainF.design_link}">${mainF.design_credit}</a>
                    </div>
                </div>`;
        }
    }
};