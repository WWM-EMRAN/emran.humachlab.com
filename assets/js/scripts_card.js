/**
 * scripts_card.js - Alternate Transparent Academic Card Deck Homepage Controller
 * Uses the existing JSON data and dynamic section renderers, but replaces the
 * diamond menu with a transparent academic card-deck menu.
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
        'volunteering_services.json', 'publications.json', 'contact_details.json',
        'ea_logo.json', 'copyright.json', 'diary.json', 'gallery.json'
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
                { label: 'Courses Training and Certificates', url: '#courses_trainings_certificates', icon_class: 'bi bi-journal-bookmark-fill' },
                { label: 'Projects', url: '#projects', icon_class: 'bi bi-lightbulb' },
                { label: 'Organisational Memberships', url: '#organisational_memberships', icon_class: 'bi bi-people' },
                { label: 'Sessions and Events', url: '#sessions_events', icon_class: 'bi bi-calendar-event' },
                { label: 'Languages', url: '#languages', icon_class: 'bi bi-translate' },
                { label: 'Portfolios', url: '#portfolios', icon_class: 'bi bi-window-sidebar' },
                { label: 'Volunteering Services', url: '#volunteering_services', icon_class: 'bx bxs-donate-heart' }
            ]
        },
        { label: 'Publications', url: '#publications', icon_class: 'bi bi-journal-richtext' },
        { label: 'Contact Details', url: '#contact_details', icon_class: 'bi bi-person-lines-fill' }
    ];

    // V23: symmetric card fan positions around the exact deck centre.
    // The original fan was visually a little right-heavy in the narrower middle panel.
    const CARD_POSITIONS = [
        [35, 236, -24], [113, 182, -16], [191, 148, -8], [269, 134, 0], [347, 148, 8], [425, 182, 16], [503, 236, 24]
    ];

    function $(id) { return document.getElementById(id); }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function normalizeUrl(item) {
        const raw = String(item?.url || item?.href || '').trim();
        if (raw && raw !== '#') return raw;
        const label = String(item?.label || item?.title || '').toLowerCase();
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

    function iconHtml(iconClass, fallback = 'bi bi-circle') {
        const cls = escapeHtml(iconClass || fallback);
        return `<i class="${cls}" aria-hidden="true"></i>`;
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

    function shortSectionText(item) {
        const label = String(item?.label || 'Section');
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
        const label = String(item?.label || 'Subsection');
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

    function renderTopMenu(menu, cardApi = null) {
        const nav = $('newHomeTopMenu');
        const toggle = $('newMobileMenuToggle');
        if (!nav || !Array.isArray(menu)) return;

        nav.innerHTML = menu.map((item, idx) => {
            const target = escapeHtml(getTargetHash(item) || normalizeUrl(item));
            const label = escapeHtml(item.label);
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
                        ${iconHtml(item.icon_class)}<span>${label}</span>${hasSubmenu ? '<i class="bi bi-chevron-down new-top-caret" aria-hidden="true"></i>' : ''}
                    </a>
                    ${submenuMarkup}
                </div>`;
        }).join('');

        function closeMobileMenu() {
            nav.classList.remove('is-open');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }

        if (toggle && !toggle.dataset.boundCardMenu) {
            toggle.dataset.boundCardMenu = '1';
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
                cardApi?.previewMenuItem?.(item, true);
                if (hasSubmenu) itemWrap.classList.add('is-submenu-open');
            });
            itemWrap.addEventListener('mouseleave', () => {
                itemWrap.classList.remove('is-submenu-open');
                cardApi?.clearMenuPreview?.();
            });
            itemWrap.addEventListener('focusin', () => {
                cardApi?.previewMenuItem?.(item, true);
                if (hasSubmenu) itemWrap.classList.add('is-submenu-open');
            });
            itemWrap.addEventListener('focusout', event => {
                if (!itemWrap.contains(event.relatedTarget)) {
                    itemWrap.classList.remove('is-submenu-open');
                    cardApi?.clearMenuPreview?.();
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
                cardApi?.selectMenuItem?.(item, true);
                if (hasSubmenu && mobile) {
                    event.preventDefault();
                    nav.querySelectorAll('.new-top-item.is-submenu-open').forEach(openItem => {
                        if (openItem !== parent) openItem.classList.remove('is-submenu-open');
                    });
                    parent.classList.toggle('is-submenu-open');
                    cardApi?.previewMenuItem?.(item, true);
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
                cardApi?.previewSubmenuItem?.(menu[topIdx], subIdx);
            });
            link.addEventListener('click', event => {
                const href = link.getAttribute('href');
                const topIdx = Number(link.dataset.topIndex);
                const subIdx = Number(link.dataset.subIndex);
                cardApi?.previewSubmenuItem?.(menu[topIdx], subIdx);
                if (href && href.startsWith('#') && document.querySelector(href)) {
                    event.preventDefault();
                    smoothScrollTo(href, true);
                    closeMobileMenu();
                }
            });
        });
    }

    function renderLeftSocialLinks(site) {
        const container = $('diamondLeftSocial');
        if (!container) return;
        const links = site?.social_links?.main || [];
        container.innerHTML = links.map(link => {
            const href = escapeHtml(link.url || link.href || '#');
            const label = escapeHtml(link.label || link.name || 'Profile');
            const icon = iconHtml(link.icon_class || link.icon || 'bi bi-link-45deg');
            return `<a href="${href}" target="_blank" rel="noreferrer" aria-label="${label}" title="${label}">${icon}</a>`;
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
        if (brandPhoto && assets?.images?.profile_image_pp) brandPhoto.src = assets.images.profile_image_pp;
        if (leftPhoto && assets?.images?.profile_image_pp) leftPhoto.src = assets.images.profile_image_pp;
        if (heroBg && assets?.images?.site_background) heroBg.src = assets.images.site_background;
        if (heroSlogan && slogans.length) {
            heroSlogan.innerHTML = slogans.map(item => `<span>${iconHtml(item.icon_class)} ${escapeHtml(item.text)}</span>`).join('');
        }
        if (heroRole && hero.title_researcher) heroRole.textContent = hero.title_researcher;
        if (heroInstitutes) {
            const institutes = [hero.title_institute_primary, hero.title_institute_secondary].filter(Boolean);
            if (institutes.length) heroInstitutes.innerHTML = institutes.map(escapeHtml).join('<br>');
        }
        if (heroTagline) heroTagline.textContent = hero.tagline || '';
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
        const stage = $('cardStage');
        if (!stage) return;
        stage.insertAdjacentHTML('beforeend', `
            <div class="diamond-menu-fallback">
                <strong>${escapeHtml(message || 'Dynamic menu fallback')}</strong><br>
                ${menu.map(item => `<a href="${escapeHtml(normalizeUrl(item))}">${escapeHtml(item.label)}</a>`).join('')}
            </div>`);
    }

    function createCardDeck(menu) {
        const deck = $('cardDeck');
        const activePill = $('cardActivePill');
        const titleIcon = $('cardTitleIcon');
        const sectionTitle = $('cardSectionTitle');
        const sectionText = $('cardSectionText');
        const openBtn = $('cardOpenSelected');
        const panelTitle = $('cardPanelTitle');
        const panelNote = $('cardPanelNote');
        const tabs = $('cardExpertiseTabs');
        const detailBox = $('cardDetailBox');
        if (!deck || !Array.isArray(menu) || menu.length < 3) {
            renderFallbackMenu(menu || FALLBACK_MENU, 'The card deck renderer needs at least three menu items.');
            return null;
        }

        let selectedIndex = 0;
        let previewIndex = -1;
        let selectedCardEl = null;
        let currentSubmenu = [];

        let resizeObserver = null;

        function fitDeckToStage() {
            const stage = deck.closest('.card-stage');
            if (!stage) return;

            // V26: use a safer scale and then correct the real rendered fan bounds.
            // This avoids the visual right-drift seen on mobile and gives desktop a
            // small left bias without allowing either edge to be cropped.
            const stageWidth = stage.clientWidth || 0;
            const stageHeight = stage.clientHeight || 0;
            const isMobile = window.matchMedia('(max-width: 760px)').matches;
            const isDesktop = window.matchMedia('(min-width: 981px)').matches;

            const visualFanWidth = isMobile ? 820 : 780;
            const visualFanHeight = isMobile ? 575 : 565;
            const sideAllowance = isMobile ? 26 : 44;
            const verticalAllowance = isMobile ? 28 : 24;
            const minScale = isMobile ? 0.36 : 0.42;

            const availableWidth = Math.max(240, stageWidth - sideAllowance);
            const availableHeight = Math.max(340, stageHeight - verticalAllowance);
            const widthScale = availableWidth / visualFanWidth;
            const heightScale = availableHeight / visualFanHeight;
            const scale = Math.min(1, Math.max(minScale, Math.min(widthScale, heightScale)));

            const preferredOffset = isDesktop ? -18 : (isMobile ? -10 : -8);
            deck.style.setProperty('--card-deck-scale', scale.toFixed(3));
            deck.style.setProperty('--card-deck-render-height', `${Math.ceil(530 * scale)}px`);
            deck.style.setProperty('--card-deck-x', `${preferredOffset}px`);
            deck.classList.add('is-fit-ready');

            requestAnimationFrame(() => correctDeckBounds(stage, preferredOffset, isMobile));
        }

        function correctDeckBounds(stage, preferredOffset, isMobile) {
            const cards = Array.from(deck.querySelectorAll('.academic-card'));
            if (!cards.length) return;

            const stageRect = stage.getBoundingClientRect();
            if (!stageRect.width) return;

            let minLeft = Infinity;
            let maxRight = -Infinity;
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                minLeft = Math.min(minLeft, rect.left);
                maxRight = Math.max(maxRight, rect.right);
            });
            if (!Number.isFinite(minLeft) || !Number.isFinite(maxRight)) return;

            const buffer = isMobile ? 10 : 14;
            const targetCenter = (stageRect.left + stageRect.right) / 2 + preferredOffset;
            const fanCenter = (minLeft + maxRight) / 2;
            let correction = targetCenter - fanCenter;

            // If the preferred center would crop an edge, containment wins.
            if (minLeft + correction < stageRect.left + buffer) {
                correction += (stageRect.left + buffer) - (minLeft + correction);
            }
            if (maxRight + correction > stageRect.right - buffer) {
                correction -= (maxRight + correction) - (stageRect.right - buffer);
            }

            const finalOffset = Math.round(preferredOffset + correction);
            deck.style.setProperty('--card-deck-x', `${finalOffset}px`);
        }

        function startDeckFitObserver() {
            fitDeckToStage();
            window.addEventListener('resize', fitDeckToStage, { passive: true });
            if ('ResizeObserver' in window) {
                const stage = deck.closest('.card-stage');
                resizeObserver = new ResizeObserver(fitDeckToStage);
                if (stage) resizeObserver.observe(stage);
            }
            requestAnimationFrame(fitDeckToStage);
        }

        function getPosition(idx) {
            if (idx < CARD_POSITIONS.length) return CARD_POSITIONS[idx];
            const center = 270;
            const spread = 72;
            const offset = idx - Math.floor(menu.length / 2);
            return [center + offset * spread, 164 + Math.abs(offset) * 20, offset * 8];
        }

        function baseTransform(idx) {
            return `rotate(${getPosition(idx)[2]}deg)`;
        }

        function raisedTransform(idx) {
            return `translateY(-30px) scale(1.15) rotate(${getPosition(idx)[2]}deg)`;
        }

        function renderIcon(iconClass) {
            if (titleIcon) titleIcon.innerHTML = iconHtml(iconClass);
        }

        function isExpertiseItem(item) {
            return Boolean(item?.submenu?.length) || String(item?.label || '').toLowerCase().includes('expertise');
        }

        function setCardVisualState() {
            [...deck.querySelectorAll('.academic-card')].forEach(card => {
                const idx = Number(card.dataset.index);
                card.classList.toggle('selected', idx === selectedIndex);
                card.classList.toggle('is-previewed', idx === previewIndex);
                if (idx === previewIndex) {
                    card.style.transform = raisedTransform(idx);
                    card.style.zIndex = '260';
                } else if (idx === selectedIndex) {
                    card.style.transform = baseTransform(idx);
                    card.style.zIndex = '160';
                } else {
                    card.style.transform = baseTransform(idx);
                    card.style.zIndex = String(idx + 1);
                }
            });
        }

        function applyItem(item, stateText, selected = false) {
            renderIcon(item.icon_class);
            if (sectionTitle) sectionTitle.textContent = item.label;
            if (sectionText) sectionText.textContent = shortSectionText(item);
            if (activePill) activePill.textContent = stateText;
            if (panelTitle) panelTitle.textContent = item.label;
            if (panelNote) panelNote.textContent = shortSectionText(item);
            if (openBtn) {
                openBtn.textContent = 'Open Section';
                openBtn.dataset.target = getTargetHash(item);
            }
            const exp = isExpertiseItem(item);
            currentSubmenu = exp ? (item.submenu || []) : [];
            renderTabs(currentSubmenu, exp);
            if (detailBox) {
                if (exp && currentSubmenu.length) {
                    detailBox.innerHTML = `<strong>${iconHtml(currentSubmenu[0].icon_class)} ${escapeHtml(currentSubmenu[0].label)}</strong><br>${escapeHtml(submenuText(currentSubmenu[0]))} <a href="${escapeHtml(getTargetHash(currentSubmenu[0]))}">Open subsection</a>`;
                } else {
                    detailBox.innerHTML = `<strong>${iconHtml(item.icon_class)} ${escapeHtml(item.label)}</strong><br>${escapeHtml(shortSectionText(item))}${selected ? ' This card is currently selected.' : ''}`;
                }
            }
        }

        function renderTabs(submenu, visible) {
            if (!tabs) return;
            tabs.innerHTML = '';
            tabs.classList.toggle('is-visible', Boolean(visible && submenu.length));
            if (!visible || !submenu.length) return;
            submenu.forEach((item, idx) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `card-tab${idx === 0 ? ' active' : ''}`;
                btn.innerHTML = `${iconHtml(item.icon_class)}<span>${escapeHtml(item.label)}</span>`;
                btn.addEventListener('click', () => {
                    tabs.querySelectorAll('.card-tab').forEach(tab => tab.classList.remove('active'));
                    btn.classList.add('active');
                    if (panelNote) panelNote.textContent = submenuText(item);
                    if (detailBox) detailBox.innerHTML = `<strong>${iconHtml(item.icon_class)} ${escapeHtml(item.label)}</strong><br>${escapeHtml(submenuText(item))} <a href="${escapeHtml(getTargetHash(item))}">Open subsection</a>`;
                });
                tabs.appendChild(btn);
            });
        }

        function selectIndex(idx, navigate = false) {
            selectedIndex = Math.max(0, Math.min(menu.length - 1, idx));
            previewIndex = -1;
            selectedCardEl = deck.querySelector(`[data-index="${selectedIndex}"]`);
            applyItem(menu[selectedIndex], `Selected card • ${menu[selectedIndex].label}`, true);
            setCardVisualState();
            if (navigate) smoothScrollTo(getTargetHash(menu[selectedIndex]), true);
        }

        function previewIndexFn(idx) {
            if (idx < 0 || idx >= menu.length) return;
            previewIndex = idx;
            applyItem(menu[idx], `Hovered card • ${menu[idx].label}`, false);
            setCardVisualState();
        }

        function clearPreview() {
            previewIndex = -1;
            applyItem(menu[selectedIndex], `Selected card • ${menu[selectedIndex].label}`, true);
            setCardVisualState();
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
            const idx = findMenuIndex(item);
            if (idx >= 0) previewIndexFn(idx);
            else applyItem(item, `${hovering ? 'Hovered menu' : 'Selected menu'} • ${item.label}`, false);
        }

        function clearMenuPreview() { clearPreview(); }

        function selectMenuItem(item, snap = true) {
            const idx = findMenuIndex(item);
            if (idx >= 0) selectIndex(idx, false);
            else applyItem(item, `Selected menu • ${item.label}`, true);
        }

        function previewSubmenuItem(parentItem, subIdx) {
            const idx = findMenuIndex(parentItem);
            if (idx >= 0) previewIndexFn(idx);
            const submenu = parentItem?.submenu || [];
            const item = submenu[subIdx];
            if (!item) return;
            if (tabs) {
                tabs.querySelectorAll('.card-tab').forEach((tab, tabIdx) => tab.classList.toggle('active', tabIdx === subIdx));
            }
            if (panelNote) panelNote.textContent = submenuText(item);
            if (detailBox) detailBox.innerHTML = `<strong>${iconHtml(item.icon_class)} ${escapeHtml(item.label)}</strong><br>${escapeHtml(submenuText(item))} <a href="${escapeHtml(getTargetHash(item))}">Open subsection</a>`;
        }

        deck.innerHTML = '';
        menu.forEach((item, idx) => {
            const [left, top, angle] = getPosition(idx);
            const card = document.createElement('article');
            card.className = 'academic-card';
            card.dataset.index = String(idx);
            card.style.left = `${left}px`;
            card.style.top = `${top}px`;
            card.style.transform = `rotate(${angle}deg)`;
            card.style.zIndex = String(idx + 1);
            card.innerHTML = `
                <div class="card-title">${escapeHtml(item.label)}</div>
                <div class="card-corner-icon color-icon">${iconHtml(item.icon_class)}</div>
                <div class="card-peek-icon color-icon">${iconHtml(item.icon_class)}</div>
                <div class="card-mid-icon color-icon">${iconHtml(item.icon_class)}</div>
                <div class="card-text">${escapeHtml(shortSectionText(item))}</div>`;
            card.addEventListener('mouseenter', () => previewIndexFn(idx));
            card.addEventListener('mouseleave', clearPreview);
            card.addEventListener('click', () => selectIndex(idx, false));
            deck.appendChild(card);
        });

        if (openBtn) {
            openBtn.addEventListener('click', () => {
                const target = openBtn.dataset.target || getTargetHash(menu[selectedIndex]);
                smoothScrollTo(target, true);
            });
        }

        startDeckFitObserver();
        selectIndex(0, false);
        return { selectSection: selectIndex, previewMenuItem, clearMenuPreview, selectMenuItem, previewSubmenuItem };
    }

    async function initCardHome() {
        try {
            if (typeof SiteCore === 'undefined' || typeof SiteUtil === 'undefined') {
                throw new Error('Core site modules are not available.');
            }
            await SiteCore.preloadAllData(DATA_BASE, DATA_FILES);
            if (typeof SiteUtil.syncGlobalMetrics === 'function') await SiteUtil.syncGlobalMetrics();
            const site = SiteCore.get('site') || {};
            const personal = SiteCore.get('personal_information') || {};
            hydrateHeroText(site, personal);
            renderLeftSocialLinks(site);
            renderLeftMenuFooter(site);
            if (typeof SiteCommon !== 'undefined' && typeof SiteCommon.init === 'function') SiteCommon.init('main');
            const menu = normalizeMenu(site?.navigation?.main_menu);
            const cardDeck = createCardDeck(menu);
            renderTopMenu(menu, cardDeck);
            window.CardDeckHome = cardDeck;
            if (typeof SiteIndex !== 'undefined' && typeof SiteIndex.init === 'function') SiteIndex.init();
            bindSmoothInternalLinks();
            if (typeof window.initExternalLibraries === 'function') {
                try { window.initExternalLibraries(); }
                catch (uiError) { console.error('Non-critical UI initialization error on index_card.html:', uiError); }
            }
        } catch (error) {
            console.error('Critical Load Error on index_card.html:', error);
            const menu = normalizeMenu(null);
            renderFallbackMenu(menu, 'Could not load dynamic JSON. Static fallback menu is shown.');
        } finally {
            if (typeof window.hide_preloader === 'function') window.hide_preloader();
        }
    }

    document.addEventListener('DOMContentLoaded', initCardHome);
})();
