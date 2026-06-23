/**
 * scripts_new.js - Alternate Diamond Homepage Controller
 * Uses the existing JSON data and dynamic section renderers, but replaces the
 * classic sidebar/hero entry point with a 3D diamond menu and an orbit submenu.
 */
(function () {
    'use strict';

    const DATA_BASE = './assets/data/';
    const DATA_FILES = [
        'site.json', 'personal_information.json', 'key_information.json',
        'academic_information.json', 'professional_experiences.json',
        'expertise_skills_achievements.json', 'skills_tools.json',
        'honors_awards.json', 'courses_trainings_certificates.json',
        'projects.json', 'organisational_memberships.json',
        'sessions_events.json', 'languages.json', 'portfolios.json',
        'volunteering_services.json', 'publications.json',
        'contact_details.json', 'ea_logo.json', 'copyright.json',
        'diary.json', 'gallery.json'
    ];

    const FALLBACK_MENU = [
        { label: 'Home', url: '#hero', icon_class: 'bx bx-home' },
        { label: 'About', url: '#about', icon_class: 'bi bi-person' },
        { label: 'Academic Information', url: '#academic_information', icon_class: 'bi bi-mortarboard' },
        { label: 'Professional Experiences', url: '#professional_experiences', icon_class: 'bi bi-briefcase' },
        {
            label: 'Expertise Skills and Achievements',
            url: '#expertise_skills_achievements',
            icon_class: 'bi bi-trophy',
            is_dropdown: true,
            submenu: [
                { label: 'Skills and Tools', url: '#skills_tools', icon_class: 'bi bi-tools' },
                { label: 'Honors and Awards', url: '#honors_awards', icon_class: 'bi bi-award' },
                { label: 'Courses Training and Certificates', url: '#courses_trainings_certificates', icon_class: 'bx bi-journal-bookmark-fill' },
                { label: 'Projects', url: '#projects', icon_class: 'bi bi-lightbulb' },
                { label: 'Organisational Memberships', url: '#organisational_memberships', icon_class: 'bi bi-people' },
                { label: 'Sessions and Events', url: '#sessions_events', icon_class: 'bi bi-calendar-event' },
                { label: 'Languages', url: '#languages', icon_class: 'bi bi-translate' },
                { label: 'Portfolios', url: '#portfolios', icon_class: 'bi bi-window-sidebar' },
                { label: 'Volunteering Services', url: '#volunteering_services', icon_class: 'bx bxs-donate-heart' }
            ]
        },
        { label: 'Publications', url: '#publications', icon_class: 'bx bi-journal-richtext' },
        { label: 'Contact Details', url: '#contact_details', icon_class: 'bi bi-person-lines-fill' }
    ];

    function $(id) {
        return document.getElementById(id);
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function normalizeMenu(menu) {
        const source = Array.isArray(menu) && menu.length ? menu : FALLBACK_MENU;
        return source.map(item => ({
            label: item.label || item.title || 'Section',
            url: normalizeUrl(item),
            icon_class: item.icon_class || item.icon || 'bi bi-circle',
            is_dropdown: Boolean(item.is_dropdown || item.submenu?.length),
            submenu: Array.isArray(item.submenu) ? item.submenu.map(sub => ({
                label: sub.label || sub.title || 'Subsection',
                url: normalizeUrl(sub),
                icon_class: sub.icon_class || sub.icon || 'bi bi-circle'
            })) : []
        }));
    }

    function normalizeUrl(item) {
        const raw = String(item.url || item.href || '').trim();
        if (raw && raw !== '#') return raw;
        const label = String(item.label || item.title || '').toLowerCase();
        if (label.includes('expertise')) return '#expertise_skills_achievements';
        if (label.includes('contact')) return '#contact_details';
        if (label.includes('professional')) return '#professional_experiences';
        if (label.includes('academic')) return '#academic_information';
        if (label.includes('publication')) return '#publications';
        if (label.includes('about')) return '#about';
        return '#hero';
    }

    function getTargetHash(item) {
        const url = normalizeUrl(item);
        if (url.startsWith('#')) return url;
        if (url.includes('#')) return '#' + url.split('#').pop();
        return '';
    }

    function smoothScrollTo(hash, pushState = true) {
        if (!hash || hash === '#') return false;
        const target = document.querySelector(hash);
        if (!target) return false;
        const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 8);
        window.scrollTo({ top, behavior: 'smooth' });
        if (pushState) {
            if (hash === '#hero') history.pushState(null, '', window.location.pathname);
            else history.pushState(null, '', hash);
        }
        return true;
    }

    function orderDiamondMenuForLeftSequence(menu) {
        // Geometry index 0 is the front/center facet. Decreasing indices move left
        // in the initial view, so reverse the remaining menu items to show:
        // Home, then About to the left, Academic to its left, and so on.
        if (!Array.isArray(menu) || menu.length < 2) return menu || [];
        return [menu[0], ...menu.slice(1).reverse()];
    }

    function renderTopMenu(menu, diamondApi = null) {
        const nav = $('newHomeTopMenu');
        const toggle = $('newMobileMenuToggle');
        if (!nav || !Array.isArray(menu)) return;

        nav.innerHTML = menu.map((item, idx) => {
            const target = escapeHtml(getTargetHash(item) || normalizeUrl(item));
            const label = escapeHtml(item.label);
            const icon = iconHtml(item.icon_class);
            const hasSubmenu = Boolean(item.submenu?.length);
            const submenuMarkup = hasSubmenu ? `
                <div class="new-top-submenu" role="menu" aria-label="${label} submenu">
                    ${item.submenu.map((sub, subIdx) => {
                        const subTarget = escapeHtml(getTargetHash(sub) || normalizeUrl(sub));
                        return `<a href="${subTarget}" data-top-index="${idx}" data-sub-index="${subIdx}" role="menuitem">${iconHtml(sub.icon_class)}<span>${escapeHtml(sub.label)}</span></a>`;
                    }).join('')}
                </div>` : '';
            return `
                <div class="new-top-item${hasSubmenu ? ' has-submenu' : ''}" data-top-index="${idx}">
                    <a class="new-top-main-link" href="${target}" data-top-index="${idx}">
                        ${icon}<span>${label}</span>${hasSubmenu ? '<i class="bi bi-chevron-down new-top-caret" aria-hidden="true"></i>' : ''}
                    </a>
                    ${submenuMarkup}
                </div>`;
        }).join('');

        function closeMobileMenu() {
            nav.classList.remove('is-open');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }

        if (toggle && !toggle.dataset.boundDiamondMenu) {
            toggle.dataset.boundDiamondMenu = '1';
            toggle.addEventListener('click', () => {
                const open = nav.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', String(open));
            });
        }

        nav.querySelectorAll('.new-top-item').forEach(itemWrap => {
            const idx = Number(itemWrap.dataset.topIndex);
            const item = menu[idx];
            const hasSubmenu = itemWrap.classList.contains('has-submenu');

            itemWrap.addEventListener('mouseenter', () => {
                diamondApi?.previewMenuItem?.(item, true);
                if (hasSubmenu) itemWrap.classList.add('is-submenu-open');
            });
            itemWrap.addEventListener('mouseleave', () => {
                itemWrap.classList.remove('is-submenu-open');
                diamondApi?.clearMenuPreview?.();
            });
            itemWrap.addEventListener('focusin', () => {
                diamondApi?.previewMenuItem?.(item, true);
                if (hasSubmenu) itemWrap.classList.add('is-submenu-open');
            });
            itemWrap.addEventListener('focusout', event => {
                if (!itemWrap.contains(event.relatedTarget)) {
                    itemWrap.classList.remove('is-submenu-open');
                    diamondApi?.clearMenuPreview?.();
                }
            });
        });

        nav.querySelectorAll('.new-top-main-link').forEach(link => {
            link.addEventListener('click', event => {
                const idx = Number(link.dataset.topIndex);
                const item = menu[idx];
                const parent = link.closest('.new-top-item');
                const hasSubmenu = parent?.classList.contains('has-submenu');
                const mobile = window.matchMedia('(max-width: 980px)').matches;
                const href = link.getAttribute('href');

                nav.querySelectorAll('.new-top-main-link').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
                diamondApi?.selectMenuItem?.(item, true);

                if (hasSubmenu && mobile) {
                    event.preventDefault();
                    nav.querySelectorAll('.new-top-item.is-submenu-open').forEach(openItem => {
                        if (openItem !== parent) openItem.classList.remove('is-submenu-open');
                    });
                    parent.classList.toggle('is-submenu-open');
                    diamondApi?.previewMenuItem?.(item, true);
                    return;
                }

                if (href && href.startsWith('#') && document.querySelector(href)) {
                    event.preventDefault();
                    smoothScrollTo(href, true);
                    closeMobileMenu();
                }
            });
        });

        nav.querySelectorAll('.new-top-submenu a').forEach(link => {
            link.addEventListener('mouseenter', () => {
                const topIdx = Number(link.dataset.topIndex);
                const subIdx = Number(link.dataset.subIndex);
                diamondApi?.previewSubmenuItem?.(menu[topIdx], subIdx);
            });
            link.addEventListener('click', event => {
                const href = link.getAttribute('href');
                const topIdx = Number(link.dataset.topIndex);
                const subIdx = Number(link.dataset.subIndex);
                diamondApi?.previewSubmenuItem?.(menu[topIdx], subIdx);
                if (href && href.startsWith('#') && document.querySelector(href)) {
                    event.preventDefault();
                    smoothScrollTo(href, true);
                    closeMobileMenu();
                }
            });
        });
    }

    function shortSectionText(item) {
        const label = String(item.label || 'Section');
        const text = label.toLowerCase();
        if (text.includes('home')) return 'Landing overview and first impression for the personal website.';
        if (text.includes('about')) return 'Profile summary, biography, identity, and academic introduction.';
        if (text.includes('academic')) return 'Degrees, research programs, academic milestones, and institutional information.';
        if (text.includes('professional')) return 'Teaching, research, software development, collaboration, and professional roles.';
        if (text.includes('expertise')) return 'Skills, tools, awards, projects, memberships, events, languages, portfolios, and volunteering.';
        if (text.includes('publication')) return 'Journal articles, conference papers, research outputs, citations, and academic writing.';
        if (text.includes('contact')) return 'Email, social links, professional profiles, and contact pathways.';
        return `Open the ${label} section.`;
    }

    function submenuText(item) {
        const label = String(item.label || 'Subsection');
        const text = label.toLowerCase();
        if (text.includes('skills')) return 'Technical tools, software platforms, programming skills, and research implementation capabilities.';
        if (text.includes('honors') || text.includes('awards')) return 'Scholarships, recognitions, academic awards, and professional achievements.';
        if (text.includes('courses') || text.includes('training') || text.includes('certificate')) return 'Specialised training, certificates, courses, and continuing professional development.';
        if (text.includes('project')) return 'Academic, research, software, development, and applied implementation projects.';
        if (text.includes('membership')) return 'Professional associations, academic communities, student organisations, and memberships.';
        if (text.includes('session') || text.includes('event')) return 'Talks, seminars, workshops, sessions, conferences, and organised events.';
        if (text.includes('language')) return 'Language knowledge, communication capability, and multilingual profile information.';
        if (text.includes('portfolio')) return 'Showcase items, selected works, external platforms, and portfolio links.';
        if (text.includes('volunteer')) return 'Volunteering, service, community work, and non-commercial professional contributions.';
        return `Open the ${label} subsection.`;
    }

    function wrapTitle(text, maxChars) {
        const words = String(text || '').split(/\s+/).filter(Boolean);
        const lines = [];
        let current = '';
        words.forEach(word => {
            const test = current ? `${current} ${word}` : word;
            if (test.length > maxChars && current) {
                lines.push(current);
                current = word;
            } else {
                current = test;
            }
        });
        if (current) lines.push(current);
        return lines;
    }

    function iconHtml(iconClass, fallback = 'bi bi-circle') {
        const cls = escapeHtml(iconClass || fallback);
        return `<i class="${cls}" aria-hidden="true"></i>`;
    }

    function renderLeftSocialLinks(site) {
        const socialBox = $('diamondLeftSocial');
        const links = site?.social_links?.main || [];
        if (!socialBox || !Array.isArray(links)) return;

        socialBox.innerHTML = links.map(link => {
            const platform = escapeHtml(link.platform || 'social');
            const url = escapeHtml(link.url || '#');
            const icon = iconHtml(link.icon_class || 'bi bi-link-45deg');
            const label = escapeHtml(link.label || link.platform || 'Social link');
            const externalAttrs = String(link.url || '').startsWith('http')
                ? ' target="_blank" rel="noreferrer"'
                : '';
            return `<a href="${url}"${externalAttrs} class="${platform}" aria-label="${label}">${icon}</a>`;
        }).join('');
    }

    function renderLeftMenuFooter(site) {
        const footerBox = $('diamondLeftMenuFooter');
        const meta = site?.footer_meta?.menu_footer;
        const assets = site?.assets || {};
        if (!footerBox || !meta) return;

        const rawYear = meta.copyright_year || new Date().getFullYear();
        const year = (typeof SiteUtil !== 'undefined' && typeof SiteUtil.getCopyrightYear === 'function')
            ? SiteUtil.getCopyrightYear(rawYear)
            : (rawYear === 'auto' ? new Date().getFullYear() : rawYear);

        const logoPage = escapeHtml(meta.copyright_logo_url || 'ea_logo');
        const textPage = escapeHtml(meta.copyright_text_url || 'copyright');
        const owner = escapeHtml(meta.copyright_owner || '');
        const logoSrc = escapeHtml(assets?.icons?.logo_png || assets?.icons?.favicon_png || './assets/img/Emran_Ali_Logo_Fav.png');
        const links = Array.isArray(meta.links) ? meta.links : [];

        footerBox.innerHTML = `
            <div class="copyright text-center-force">
                <p>
                    © Copyright · ${escapeHtml(year)}
                    <strong>
                        <span>
                            <a href="page_details.html?page=${logoPage}">
                                <img src="${logoSrc}" alt="Logo" class="img-fluid rounded-circle logo-sm">
                            </a>
                            <a href="page_details.html?page=${textPage}"> ${owner} </a>
                        </span>
                    </strong>
                </p>
            </div>
            <div class="credits text-center-force">
                ${links.map(link => `<a href="page_details.html?page=${escapeHtml(link.url || '#')}"> ${escapeHtml(link.label || '')} </a>`).join(' | ')}
            </div>`;
    }


    function cleanupDuplicateHeroTaglines() {
        const tagline = $('diamondHeroTagline');
        const leftPanel = document.querySelector('.diamond-left-panel');
        if (!tagline || !leftPanel) return;

        const text = tagline.textContent.trim().replace(/\s+/g, ' ');
        if (!text) return;

        // Keep only the official JSON-filled tagline placeholder.
        // This prevents older hard-coded/fallback copies from appearing beside it.
        [...leftPanel.querySelectorAll('.diamond-tagline')].forEach(node => {
            if (node !== tagline) node.remove();
        });

        [...leftPanel.querySelectorAll('p, div, span')].forEach(node => {
            if (node === tagline || tagline.contains(node) || node.contains(tagline)) return;
            const nodeText = (node.textContent || '').trim().replace(/\s+/g, ' ');
            if (nodeText === text) node.remove();
        });
    }

    function hydrateHeroText(site, personal) {
        const assets = site?.assets || {};
        const hero = personal?.hero || {};
        const slogans = hero?.main_keywards?.hero_slogan || [];
        const brandText = document.querySelector('.new-brand-text');
        const brandPhoto = $('newBrandPhoto');
        const leftPhoto = $('diamondLeftPhoto');
        const heroBg = $('newHeroBackground');
        const heroSlogan = $('diamondHeroSlogan');
        const heroRole = $('diamondHeroRole');
        const heroInstitutes = $('diamondHeroInstitutes');
        const heroTagline = $('diamondHeroTagline');

        const displayName = hero.title_main || personal?.name || 'Emran Ali';
        if (brandText) brandText.textContent = displayName;
        if (brandPhoto && assets?.images?.profile_image_pp) {
            brandPhoto.src = assets.images.profile_image_pp;
        }
        if (leftPhoto && assets?.images?.profile_image_pp) {
            leftPhoto.src = assets.images.profile_image_pp;
        }
        if (heroBg && assets?.images?.site_background) {
            heroBg.src = assets.images.site_background;
        }

        if (heroSlogan && slogans.length) {
            heroSlogan.innerHTML = slogans.map(item => {
                return `<span>${iconHtml(item.icon_class)} ${escapeHtml(item.text)}</span>`;
            }).join('');
        }
        if (heroRole && hero.title_researcher) heroRole.textContent = hero.title_researcher;
        if (heroInstitutes) {
            const institutes = [hero.title_institute_primary, hero.title_institute_secondary].filter(Boolean);
            if (institutes.length) heroInstitutes.innerHTML = institutes.map(escapeHtml).join('<br>');
        }
        if (heroTagline && hero.tagline) {
            heroTagline.textContent = hero.tagline;
            heroTagline.style.display = '';
        }
        cleanupDuplicateHeroTaglines();
    }

    function bindSmoothInternalLinks() {
        document.addEventListener('click', event => {
            if (event.defaultPrevented) return;
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            if (document.querySelector(href)) {
                event.preventDefault();
                smoothScrollTo(href, true);
            }
        });
    }

    function renderFallbackMenu(menu, message) {
        const stage = $('diamondStage');
        if (!stage) return;
        const html = `
            <div class="diamond-menu-fallback">
                <strong>${escapeHtml(message || 'Dynamic menu fallback')}</strong><br>
                ${menu.map(item => `<a href="${escapeHtml(normalizeUrl(item))}">${escapeHtml(item.label)}</a>`).join('')}
            </div>`;
        stage.insertAdjacentHTML('beforeend', html);
    }

    function createDiamondMenu(menu, assets) {
        const activePill = $('diamondActivePill');
        const sectionTitle = $('diamondSectionTitle');
        const sectionText = $('diamondSectionText');
        const titleIcon = $('diamondTitleIcon');
        const openBtn = $('diamondOpenSelected');
        const pauseBtn = $('diamondPauseToggle');
        const stage = $('diamondStage');
        const scene = $('diamondScene');
        const gemWrap = $('diamondGemWrap');
        const gemSvg = $('diamondGemSvg');
        const apexGlow = $('diamondApexGlow');
        const orbitArea = $('diamondOrbitArea');
        const orbitCore = $('diamondOrbitCore');
        const orbitNodes = $('diamondOrbitNodes');
        const skillDetail = $('diamondSkillDetail');
        const orbitPanelTitle = $('orbitPanelTitle');
        const orbitPanelNote = $('orbitPanelNote');
        const orbitPanel = document.querySelector('.diamond-orbit-panel');

        if (!stage || !scene || !gemSvg || !gemWrap || !Array.isArray(menu) || menu.length < 3) {
            renderFallbackMenu(menu, 'The diamond renderer needs at least three menu items.');
            return null;
        }

        const svgNS = 'http://www.w3.org/2000/svg';
        const N = menu.length;
        const Rg = 178;
        const Rt = 88;
        const Ht = 96;
        const Hp = 292;
        const TILT = 20;
        const FOCAL = 980;
        const CX = 320;
        const CY = 290;

        let selectedIndex = 0;
        let hoverFace = -1;
        let hoverTable = false;
        let selectedTable = false;
        let selectedSkill = 0;
        let dragging = false;
        let moved = false;
        let startX = 0;
        let startRot = 0;
        let rotY = 0;
        let auto = true;
        let orbitPaused = false;
        let globalPaused = false;
        let orbitInnerPhase = 0;
        let orbitOuterPhase = 0;
        let snapAnimating = false;
        let snapTargetRotY = 0;
        let currentSubmenu = [];
        let activeOrbitKey = '';
        let orbitCleared = false;
        let externalPreviewActive = false;

        const baseGeo = (() => {
            const table = [];
            const girdle = [];
            for (let k = 0; k < N; k++) {
                const a = (k - 0.5) * 2 * Math.PI / N;
                table.push([Rt * Math.sin(a), -Ht, -Rt * Math.cos(a)]);
                girdle.push([Rg * Math.sin(a), 0, -Rg * Math.cos(a)]);
            }
            return { table, girdle, apex: [0, Hp, 0] };
        })();

        const LIGHT = (() => {
            const l = [0.32, -0.5, -0.8];
            const len = Math.hypot(...l) || 1;
            return l.map(v => v / len);
        })();

        gemSvg.setAttribute('viewBox', '0 0 640 680');
        gemSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        gemSvg.innerHTML = '';

        function mkPoly() {
            const p = document.createElementNS(svgNS, 'polygon');
            p.setAttribute('stroke-linejoin', 'round');
            gemSvg.appendChild(p);
            return p;
        }

        const tablePoly = mkPoly();
        const crownPolys = Array.from({ length: N }, mkPoly);
        const pavPolys = Array.from({ length: N }, mkPoly);
        const glyphGroups = [];
        const titleGroups = [];

        menu.forEach(item => {
            const glyphGroup = document.createElementNS(svgNS, 'g');
            glyphGroup.setAttribute('pointer-events', 'none');
            glyphGroup.style.opacity = '1';
            glyphGroup.style.transition = 'opacity .18s linear, filter .18s linear';

            const glyphObject = document.createElementNS(svgNS, 'foreignObject');
            glyphObject.setAttribute('x', '0');
            glyphObject.setAttribute('y', '0');
            glyphObject.setAttribute('width', '128');
            glyphObject.setAttribute('height', '150');
            const glyphBox = document.createElement('div');
            glyphBox.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
            glyphBox.className = 'diamond-svg-icon-wrap';
            glyphBox.innerHTML = iconHtml(item.icon_class);
            glyphObject.appendChild(glyphBox);
            glyphGroup.appendChild(glyphObject);
            gemSvg.appendChild(glyphGroup);
            glyphGroups.push(glyphGroup);

            const titleGroup = document.createElementNS(svgNS, 'g');
            titleGroup.setAttribute('pointer-events', 'none');
            titleGroup.style.opacity = '1';
            titleGroup.style.transition = 'opacity .18s linear, filter .18s linear';
            const lines = wrapTitle(item.label, N > 7 ? 8 : 10).slice(0, 4);
            const lineH = 12.8;
            const startY = 22;
            lines.forEach((line, li) => {
                const t = document.createElementNS(svgNS, 'text');
                t.setAttribute('class', 'diamond-svg-line');
                t.setAttribute('x', '64');
                t.setAttribute('y', String(startY + li * lineH));
                t.setAttribute('text-anchor', 'middle');
                t.setAttribute('font-size', N > 7 ? '10.4' : '11.4');
                t.setAttribute('font-weight', '900');
                t.setAttribute('fill', '#f5fafe');
                t.setAttribute('paint-order', 'stroke');
                t.setAttribute('stroke', 'rgba(4,9,18,.72)');
                t.setAttribute('stroke-width', '2.8');
                t.setAttribute('stroke-linejoin', 'round');
                t.textContent = line;
                titleGroup.appendChild(t);
            });
            gemSvg.appendChild(titleGroup);
            titleGroups.push(titleGroup);
        });

        const tableLogoGroup = document.createElementNS(svgNS, 'g');
        tableLogoGroup.setAttribute('pointer-events', 'none');
        tableLogoGroup.style.opacity = '0.98';
        tableLogoGroup.style.filter = 'drop-shadow(0 0 8px rgba(0,0,0,.45))';
        const tableLogo = document.createElementNS(svgNS, 'image');
        tableLogo.setAttribute('href', assets?.icons?.logo_ori_png || './assets/img/Emran_Ali_Logo_Original.png');
        tableLogo.setAttribute('x', '-52');
        tableLogo.setAttribute('y', '-52');
        tableLogo.setAttribute('width', '104');
        tableLogo.setAttribute('height', '104');
        tableLogo.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        tableLogoGroup.appendChild(tableLogo);
        gemSvg.appendChild(tableLogoGroup);

        function rot3(point, rotYdeg, tiltXdeg) {
            const [x, y, z] = point;
            const ry = rotYdeg * Math.PI / 180;
            const rx = tiltXdeg * Math.PI / 180;
            const x1 = x * Math.cos(ry) + z * Math.sin(ry);
            const z1 = -x * Math.sin(ry) + z * Math.cos(ry);
            const y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
            const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
            return [x1, y2, z2];
        }

        function proj3(point) {
            const [x, y, z] = point;
            const s = FOCAL / (FOCAL + z);
            return [CX + x * s, CY + y * s, z, s];
        }

        function faceNormal(p0, p1, p2) {
            const u = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
            const v = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];
            const n = [
                u[1] * v[2] - u[2] * v[1],
                u[2] * v[0] - u[0] * v[2],
                u[0] * v[1] - u[1] * v[0]
            ];
            const len = Math.hypot(n[0], n[1], n[2]) || 1;
            return [n[0] / len, n[1] / len, n[2] / len];
        }

        function currentCenterIndexSafe() {
            const step = 360 / N;
            const v = ((-rotY) % 360 + 360) % 360;
            return Math.round(v / step) % N;
        }

        function shortestAngleDelta(target, current) {
            return ((target - current + 540) % 360) - 180;
        }

        function frontRotationForFacet(idx) {
            // Geometry index 0 is front at rotY = 0. For every other facet,
            // use the nearest equivalent rotation that places that exact
            // geometry index at the front/centre of the diamond.
            const step = 360 / N;
            const baseTarget = -(idx * step);
            return rotY + shortestAngleDelta(baseTarget, rotY);
        }

        function snapFacetToFront(idx, animate = true) {
            snapTargetRotY = frontRotationForFacet(idx);
            auto = false;
            if (animate) {
                snapAnimating = true;
            } else {
                rotY = snapTargetRotY;
                snapAnimating = false;
            }
        }

        function setRotationPaused(paused) {
            globalPaused = Boolean(paused);
            auto = !globalPaused;
            if (pauseBtn) {
                pauseBtn.textContent = globalPaused ? 'Resume rotation' : 'Pause rotation';
                pauseBtn.setAttribute('aria-pressed', String(globalPaused));
            }
        }

        function renderIcon(iconClass) {
            if (titleIcon) titleIcon.innerHTML = iconHtml(iconClass);
        }

        function isExpertiseItem(item) {
            return Boolean(item?.submenu?.length) || String(item?.label || '').toLowerCase().includes('expertise');
        }

        function setOrbitEnabled(enabled) {
            // Keep the right panel visible for every main menu item.
            // Non-Expertise sections show the selected item details plus an empty/disabled orbit map.
            if (orbitPanel) orbitPanel.classList.remove('orbit-hidden');
            if (orbitArea) {
                orbitArea.classList.toggle('is-disabled', !enabled);
                orbitArea.setAttribute('aria-hidden', 'false');
            }
            if (skillDetail) skillDetail.setAttribute('aria-hidden', 'false');
            if (!enabled && orbitNodes) orbitNodes.innerHTML = '';
        }

        function applyPanelItem(item, stateText, allowOrbit = false) {
            const isExp = isExpertiseItem(item) && allowOrbit;
            renderIcon(item.icon_class);
            if (sectionTitle) sectionTitle.textContent = item.label;
            if (sectionText) sectionText.textContent = shortSectionText(item);
            if (activePill) activePill.textContent = stateText;
            if (openBtn) {
                openBtn.textContent = 'Open Section';
                openBtn.dataset.target = getTargetHash(item);
            }

            if (isExp) {
                currentSubmenu = item.submenu || [];
                if (orbitPanelTitle) orbitPanelTitle.textContent = item.label;
                if (orbitPanelNote) orbitPanelNote.textContent = 'Click a rotating planet to open the matching subsection.';
                if (orbitCore) orbitCore.innerHTML = 'Expertise<br>Skills &<br>Achievements';
                const nextOrbitKey = `${item.label}:${currentSubmenu.map(sub => sub.label).join('|')}`;
                if (nextOrbitKey !== activeOrbitKey) {
                    activeOrbitKey = nextOrbitKey;
                    selectedSkill = Math.min(selectedSkill, Math.max(0, currentSubmenu.length - 1));
                    renderOrbitSubmenu(currentSubmenu);
                }
                orbitCleared = false;
                setOrbitEnabled(true);
            } else {
                currentSubmenu = [];
                activeOrbitKey = '';
                if (orbitPanelTitle) orbitPanelTitle.textContent = item.label;
                if (orbitPanelNote) orbitPanelNote.textContent = shortSectionText(item);
                if (orbitCore) orbitCore.innerHTML = 'Empty<br>Solar<br>System';
                if (skillDetail) {
                    skillDetail.innerHTML = `<strong>${iconHtml(item.icon_class)} ${escapeHtml(item.label)}</strong><br>${escapeHtml(shortSectionText(item))}`;
                }
                orbitCleared = true;
                setOrbitEnabled(false);
            }
        }

        function syncPanel(idx, forceSelected = false, hovering = false) {
            const item = menu[idx] || menu[0];
            const stateText = hovering
                ? `Hovered facet • ${item.label}`
                : (forceSelected || idx === selectedIndex ? `Selected facet • ${item.label}` : `Centered facet • ${item.label}`);

            // Show the solar-system submenu whenever Expertise is the active view,
            // including during auto-rotation when the Expertise facet reaches the front.
            // Non-Expertise sections still keep the submenu hidden.
            const allowOrbit = true;
            applyPanelItem(item, stateText, allowOrbit);
        }

        function findMenuIndex(item) {
            if (!item) return -1;
            const target = getTargetHash(item);
            const label = String(item.label || '').toLowerCase();
            return menu.findIndex(candidate => {
                const candidateTarget = getTargetHash(candidate);
                return (target && candidateTarget === target) || String(candidate.label || '').toLowerCase() === label;
            });
        }

        function previewMenuItem(item, hovering = true) {
            if (!item) return;
            externalPreviewActive = true;
            if (!globalPaused) auto = false;
            applyPanelItem(item, `${hovering ? 'Hovered menu' : 'Selected menu'} • ${item.label}`, true);
        }

        function clearMenuPreview() {
            externalPreviewActive = false;
            syncPanel(selectedIndex, true, false);
            if (!globalPaused && !stage.matches(':hover')) auto = true;
        }

        function selectMenuItem(item, snap = true) {
            const idx = findMenuIndex(item);
            externalPreviewActive = false;
            if (idx >= 0) selectSection(idx, snap, false);
            else previewMenuItem(item, false);
        }

        function previewSubmenuItem(parentItem, subIdx) {
            if (!parentItem?.submenu?.length) return;
            previewMenuItem(parentItem, true);
            currentSubmenu = parentItem.submenu;
            updateSkillDetail(subIdx, true);
        }

        function selectSection(idx, snap = true, navigate = false) {
            selectedTable = false;
            externalPreviewActive = false;
            hoverTable = false;
            selectedIndex = Math.max(0, Math.min(N - 1, idx));

            if (snap) {
                // Immediate, deterministic snap: clicking a face must bring that exact
                // geometry index to the front even if rotation is currently paused.
                snapAnimating = false;
                rotY = -(selectedIndex * (360 / N));
                setRotationPaused(true);
            }

            syncPanel(selectedIndex, true, false);
            render();
            if (navigate) smoothScrollTo(getTargetHash(menu[selectedIndex]), true);
        }

        function renderOrbitSubmenu(submenu) {
            if (!orbitNodes) return;
            orbitNodes.innerHTML = '';
            if (!submenu || !submenu.length) {
                if (skillDetail) skillDetail.textContent = 'No submenu items were found for this menu entry.';
                return;
            }
            const innerCount = Math.ceil(submenu.length / 2);
            const outerCount = submenu.length - innerCount;
            submenu.forEach((item, idx) => {
                const node = document.createElement('button');
                const inner = idx < innerCount;
                node.type = 'button';
                node.className = `orbit-node-new${idx === selectedSkill ? ' active' : ''}`;
                node.dataset.idx = String(idx);
                node.dataset.inner = inner ? '1' : '0';
                node.dataset.local = String(inner ? idx : idx - innerCount);
                node.dataset.count = String(inner ? innerCount : Math.max(1, outerCount));
                node.dataset.radius = inner ? '103' : '158';
                node.innerHTML = `${iconHtml(item.icon_class)}<span>${escapeHtml(item.label)}</span>`;
                node.addEventListener('mouseenter', () => {
                    orbitPaused = true;
                    updateSkillDetail(idx, false);
                });
                node.addEventListener('mouseleave', () => {
                    orbitPaused = false;
                });
                node.addEventListener('click', () => {
                    updateSkillDetail(idx, true);
                    smoothScrollTo(getTargetHash(item), true);
                });
                orbitNodes.appendChild(node);
            });
            selectedSkill = Math.min(selectedSkill, submenu.length - 1);
            updateOrbitPositions();
            updateSkillDetail(selectedSkill, false);
        }

        function updateSkillDetail(idx, makeActive) {
            if (!currentSubmenu.length) return;
            selectedSkill = Math.max(0, Math.min(currentSubmenu.length - 1, idx));
            if (makeActive) updateOrbitActive();
            else updateOrbitActive();
            const item = currentSubmenu[selectedSkill];
            const target = getTargetHash(item);
            const targetText = target ? ` <a href="${escapeHtml(target)}">Open subsection</a>` : '';
            if (skillDetail) {
                skillDetail.innerHTML = `<strong>${iconHtml(item.icon_class)} ${escapeHtml(item.label)}</strong><br>${escapeHtml(submenuText(item))}${targetText}`;
            }
        }

        function updateOrbitActive() {
            if (!orbitNodes) return;
            [...orbitNodes.querySelectorAll('.orbit-node-new')].forEach(node => {
                node.classList.toggle('active', Number(node.dataset.idx) === selectedSkill);
            });
        }

        function updateOrbitPositions() {
            if (!orbitNodes) return;
            const nodes = [...orbitNodes.querySelectorAll('.orbit-node-new')];
            nodes.forEach(node => {
                const idx = Number(node.dataset.idx);
                const inner = node.dataset.inner === '1';
                const local = Number(node.dataset.local);
                const count = Math.max(1, Number(node.dataset.count));
                let radius = Number(node.dataset.radius);
                if (window.innerWidth < 640) radius = inner ? 86 : 132;
                else if (window.innerWidth < 980) radius = inner ? 98 : 146;
                const base = (local / count) * Math.PI * 2 - Math.PI / 2;
                const phase = inner ? orbitInnerPhase : orbitOuterPhase;
                const angle = base + phase;
                const w = node.offsetWidth || 104;
                const h = node.offsetHeight || 44;
                const x = Math.cos(angle) * radius - w / 2;
                const y = Math.sin(angle) * radius - h / 2;
                const scale = idx === selectedSkill ? ' scale(1.05)' : '';
                node.style.transform = `translate(${x}px, ${y}px)${scale}`;
            });
        }

        function render() {
            const rt = baseGeo.table.map(p => rot3(p, -rotY, TILT));
            const rg = baseGeo.girdle.map(p => rot3(p, -rotY, TILT));
            const ra = rot3(baseGeo.apex, -rotY, TILT);
            const pt = rt.map(proj3);
            const pg = rg.map(proj3);
            const pa = proj3(ra);
            const drawList = [];

            for (let k = 0; k < N; k++) {
                const k2 = (k + 1) % N;
                const p3 = [rt[k], rt[k2], rg[k2], rg[k]];
                const p2 = [pt[k], pt[k2], pg[k2], pg[k]];
                const n = faceNormal(p3[0], p3[1], p3[2]);
                const depth = (p3[0][2] + p3[1][2] + p3[2][2] + p3[3][2]) / 4;
                drawList.push({ el: crownPolys[k], p2, n, depth, type: 'crown', idx: k });
            }
            for (let k = 0; k < N; k++) {
                const k2 = (k + 1) % N;
                const p3 = [rg[k], rg[k2], ra];
                const p2 = [pg[k], pg[k2], pa];
                const n = faceNormal(p3[0], p3[1], p3[2]);
                const depth = (p3[0][2] + p3[1][2] + p3[2][2]) / 3;
                drawList.push({ el: pavPolys[k], p2, n, depth, type: 'pavilion', idx: k });
            }
            {
                const n = faceNormal(rt[0], rt[1], rt[2]);
                const depth = rt.reduce((s, p) => s + p[2], 0) / N;
                drawList.push({ el: tablePoly, p2: pt, n, depth, type: 'table', idx: -1 });
            }

            drawList.sort((a, b) => b.depth - a.depth);
            drawList.forEach(f => {
                f.el.setAttribute('points', f.p2.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' '));
                const dot = f.n[0] * LIGHT[0] + f.n[1] * LIGHT[1] + f.n[2] * LIGHT[2];
                const bright = Math.max(0.05, Math.min(1, 0.5 + 0.62 * dot));
                let h;
                let s;
                let lBase;
                let lRange;
                let alpha;
                if (f.type === 'crown') {
                    h = 220; s = 12; lBase = 10; lRange = 32; alpha = Math.max(0.48, Math.min(0.97, 0.52 + bright * 0.45));
                } else if (f.type === 'pavilion') {
                    h = 225; s = 10; lBase = 3; lRange = 20; alpha = 0.90;
                } else {
                    h = 220; s = 8; lBase = 34; lRange = 30; alpha = 0.96;
                }

                let extraL = 0;
                let strokeCol = 'rgba(255,255,255,.4)';
                let strokeW = 1.1;
                if (f.type !== 'table') {
                    if (f.idx === selectedIndex) { extraL += 8; strokeCol = 'rgba(255,255,255,.86)'; strokeW = 1.8; }
                    if (f.idx === hoverFace) { extraL += 18; strokeCol = 'rgba(235,238,245,.98)'; strokeW = 2.5; }
                    if (f.idx === hoverFace || f.idx === selectedIndex) alpha = 0.97;
                } else {
                    if (selectedTable) { extraL += 8; strokeCol = 'rgba(255,255,255,.88)'; strokeW = 1.8; }
                    if (hoverTable) { extraL += 18; strokeCol = 'rgba(235,238,245,.95)'; strokeW = 2.4; alpha = 0.99; }
                }
                const lightness = Math.max(2, Math.min(94, lBase + bright * lRange + extraL));
                f.el.setAttribute('fill', `hsla(${h},${s}%,${lightness}%,${alpha})`);
                f.el.setAttribute('stroke', strokeCol);
                f.el.setAttribute('stroke-width', String(strokeW));
                gemSvg.appendChild(f.el);

                if (f.type === 'crown') {
                    const TL = f.p2[0], TR = f.p2[1], GR = f.p2[2], GL = f.p2[3];
                    const Wmid = [(TR[0] + GR[0]) / 2 - (TL[0] + GL[0]) / 2, (TR[1] + GR[1]) / 2 - (TL[1] + GL[1]) / 2];
                    const Dspine = [(GL[0] + GR[0]) / 2 - (TL[0] + TR[0]) / 2, (GL[1] + GR[1]) / 2 - (TL[1] + TR[1]) / 2];
                    const Omid = [(TL[0] + TR[0]) / 2, (TL[1] + TR[1]) / 2];
                    const O = [Omid[0] - Wmid[0] / 2, Omid[1] - Wmid[1] / 2];
                    const LW = 128, LH = 150;
                    const a = Wmid[0] / LW, b = Wmid[1] / LW, c = Dspine[0] / LH, d = Dspine[1] / LH, e = O[0], g = O[1];
                    const grp = glyphGroups[f.idx];
                    grp.setAttribute('transform', `matrix(${a.toFixed(4)},${b.toFixed(4)},${c.toFixed(4)},${d.toFixed(4)},${e.toFixed(1)},${g.toFixed(1)})`);
                    const raw = ((((f.idx * 360 / N) + rotY) % 360) + 360) % 360;
                    const rel = Math.abs(((raw + 180) % 360) - 180);
                    const isHot = f.idx === hoverFace || f.idx === selectedIndex;
                    grp.style.opacity = String(isHot ? 1 : (rel < 38 ? 1 : (rel < 100 ? 0.86 : 0.58)));
                    grp.style.filter = isHot ? 'drop-shadow(0 0 12px rgba(235,238,245,.70))' : 'drop-shadow(0 0 6px rgba(0,0,0,.62))';
                    gemSvg.appendChild(grp);
                }

                if (f.type === 'pavilion') {
                    const L = f.p2[0], R = f.p2[1], A = f.p2[2];
                    const W = [R[0] - L[0], R[1] - L[1]];
                    const M = [(L[0] + R[0]) / 2, (L[1] + R[1]) / 2];
                    const D = [A[0] - M[0], A[1] - M[1]];
                    const LW = 128, LH = 170;
                    const O = [M[0] - W[0] / 2 + D[0] * 0.045, M[1] - W[1] / 2 + D[1] * 0.045];
                    const a = W[0] / LW, b = W[1] / LW, c = D[0] / LH, d = D[1] / LH, e = O[0], g = O[1];
                    const grp = titleGroups[f.idx];
                    grp.setAttribute('transform', `matrix(${a.toFixed(4)},${b.toFixed(4)},${c.toFixed(4)},${d.toFixed(4)},${e.toFixed(1)},${g.toFixed(1)})`);
                    const raw = ((((f.idx * 360 / N) + rotY) % 360) + 360) % 360;
                    const rel = Math.abs(((raw + 180) % 360) - 180);
                    const isHot = f.idx === hoverFace || f.idx === selectedIndex;
                    grp.style.opacity = String(isHot ? 1 : (rel < 38 ? 1 : (rel < 100 ? 0.82 : 0.54)));
                    grp.style.filter = isHot ? 'drop-shadow(0 0 12px rgba(235,238,245,.70))' : 'drop-shadow(0 0 6px rgba(0,0,0,.68))';
                    gemSvg.appendChild(grp);
                }
            });

            const logoCenter = proj3(rot3([0, -Ht, 0], -rotY, TILT));
            const logoX = proj3(rot3([60, -Ht, 0], -rotY, TILT));
            const logoY = proj3(rot3([0, -Ht, -60], -rotY, TILT));
            const ax = (logoX[0] - logoCenter[0]) / 60;
            const ay = (logoX[1] - logoCenter[1]) / 60;
            const bx = (logoY[0] - logoCenter[0]) / 60;
            const by = (logoY[1] - logoCenter[1]) / 60;
            tableLogoGroup.setAttribute('transform', `matrix(${ax.toFixed(4)},${ay.toFixed(4)},${bx.toFixed(4)},${by.toFixed(4)},${logoCenter[0].toFixed(1)},${logoCenter[1].toFixed(1)})`);
            tableLogoGroup.style.opacity = (hoverTable || selectedTable) ? '1' : '0.96';
            gemSvg.appendChild(tableLogoGroup);

            if (!snapAnimating && !externalPreviewActive && hoverFace === -1 && !dragging && !hoverTable) syncPanel(currentCenterIndexSafe(), false, false);
        }

        function placeApexGlow() {
            if (!apexGlow) return;
            const pa = proj3(rot3(baseGeo.apex, 0, TILT));
            apexGlow.style.left = `${pa[0]}px`;
            apexGlow.style.top = `${pa[1]}px`;
            gemWrap.appendChild(apexGlow);
        }

        function onFacetEnter(idx) {
            hoverFace = idx;
            hoverTable = false;
            auto = false;
            syncPanel(idx, false, true);
            render();
        }

        function onFacetLeave() {
            hoverFace = -1;
            if (!dragging && !stage.matches(':hover') && !globalPaused) auto = true;
            syncPanel(currentCenterIndexSafe(), false, false);
            render();
        }

        crownPolys.forEach((poly, idx) => {
            poly.style.cursor = 'pointer';
            poly.addEventListener('mouseenter', () => onFacetEnter(idx));
            poly.addEventListener('mouseleave', onFacetLeave);
            poly.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                moved = false;
                selectSection(idx, true, false);
            });
        });
        pavPolys.forEach((poly, idx) => {
            poly.style.cursor = 'pointer';
            poly.addEventListener('mouseenter', () => onFacetEnter(idx));
            poly.addEventListener('mouseleave', onFacetLeave);
            poly.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                moved = false;
                selectSection(idx, true, false);
            });
        });
        tablePoly.style.cursor = 'pointer';
        tablePoly.addEventListener('mouseenter', () => {
            hoverTable = true;
            hoverFace = -1;
            auto = false;
            syncPanel(0, false, true);
            render();
        });
        tablePoly.addEventListener('mouseleave', () => {
            hoverTable = false;
            if (!dragging && !stage.matches(':hover') && !globalPaused) auto = true;
            syncPanel(currentCenterIndexSafe(), false, false);
            render();
        });
        tablePoly.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            moved = false;
            selectedTable = true;
            selectSection(0, true, false);
        });

        function down(x) {
            dragging = true;
            auto = false;
            snapAnimating = false;
            moved = false;
            startX = x;
            startRot = rotY;
            scene.style.cursor = 'grabbing';
        }

        function move(x) {
            if (!dragging) return;
            const dx = x - startX;
            if (Math.abs(dx) > 3) moved = true;
            rotY = startRot + dx * .42;
            render();
        }

        function up() {
            if (!dragging) return;
            dragging = false;
            scene.style.cursor = 'grab';
            if (!stage.matches(':hover') && hoverFace === -1 && !globalPaused) auto = true;
        }

        stage.addEventListener('mouseenter', () => { if (!globalPaused) auto = false; });
        stage.addEventListener('mouseleave', () => {
            hoverFace = -1;
            hoverTable = false;
            if (!dragging && !globalPaused) auto = true;
            render();
        });
        scene.addEventListener('mousedown', event => down(event.clientX));
        window.addEventListener('mousemove', event => move(event.clientX));
        window.addEventListener('mouseup', up);
        scene.addEventListener('touchstart', event => down(event.touches[0].clientX), { passive: true });
        window.addEventListener('touchmove', event => { if (event.touches?.length) move(event.touches[0].clientX); }, { passive: true });
        window.addEventListener('touchend', up);

        if (orbitArea) {
            orbitArea.addEventListener('mouseenter', () => { orbitPaused = true; auto = false; });
            orbitArea.addEventListener('mouseleave', () => { orbitPaused = false; if (!globalPaused && !stage.matches(':hover')) auto = true; });
        }

        if (openBtn) {
            openBtn.addEventListener('click', () => {
                const target = openBtn.dataset.target || getTargetHash(menu[selectedIndex]);
                smoothScrollTo(target, true);
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                setRotationPaused(!globalPaused);
            });
        }

        placeApexGlow();
        selectSection(0, false, false);
        setRotationPaused(false);

        (function loop() {
            if (snapAnimating && !dragging) {
                const delta = shortestAngleDelta(snapTargetRotY, rotY);
                if (Math.abs(delta) < 0.2) {
                    rotY = snapTargetRotY;
                    snapAnimating = false;
                    syncPanel(selectedIndex, true, false);
                } else {
                    rotY += delta * 0.22;
                }
                render();
            } else if (auto && !dragging && hoverFace === -1 && !orbitPaused && !globalPaused) {
                rotY += 0.18;
                render();
            }
            if (!orbitPaused && !globalPaused) {
                orbitInnerPhase += 0.0105;
                orbitOuterPhase -= 0.0075;
            }
            updateOrbitPositions();
            requestAnimationFrame(loop);
        })();

        return { selectSection, render, previewMenuItem, clearMenuPreview, selectMenuItem, previewSubmenuItem };
    }

    async function initNewHome() {
        try {
            if (typeof SiteCore === 'undefined' || typeof SiteUtil === 'undefined') {
                throw new Error('Core site modules are not available.');
            }

            await SiteCore.preloadAllData(DATA_BASE, DATA_FILES);
            if (typeof SiteUtil.syncGlobalMetrics === 'function') {
                await SiteUtil.syncGlobalMetrics();
            }

            const site = SiteCore.get('site') || {};
            const personal = SiteCore.get('personal_information') || {};
            hydrateHeroText(site, personal);
            renderLeftSocialLinks(site);
            renderLeftMenuFooter(site);

            if (typeof SiteCommon !== 'undefined' && typeof SiteCommon.init === 'function') {
                SiteCommon.init('main');
            }

            const menu = normalizeMenu(site?.navigation?.main_menu);
            const diamondMenu = orderDiamondMenuForLeftSequence(menu);
            const diamond = createDiamondMenu(diamondMenu, site?.assets || {});
            renderTopMenu(menu, diamond);
            window.DiamondNewHome = diamond;

            if (typeof SiteIndex !== 'undefined' && typeof SiteIndex.init === 'function') {
                SiteIndex.init();
            }

            bindSmoothInternalLinks();

            if (typeof window.initExternalLibraries === 'function') {
                try {
                    window.initExternalLibraries();
                } catch (uiError) {
                    console.error('Non-critical UI initialization error on index_new.html:', uiError);
                }
            }
        } catch (error) {
            console.error('Critical Load Error on index_new.html:', error);
            const menu = normalizeMenu(null);
            renderFallbackMenu(menu, 'Could not load dynamic JSON. Static fallback menu is shown.');
        } finally {
            if (typeof window.hide_preloader === 'function') {
                window.hide_preloader();
            }
        }
    }

    document.addEventListener('DOMContentLoaded', initNewHome);
})();
