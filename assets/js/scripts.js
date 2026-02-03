/**
 * Emran Ali - Website Core Logic
 * Unified & Clean Refactor: January 2026
 */

(function () {
    "use strict";

    /**
     * --- 1. UI UTILITIES ---
     */
    const UI = {
        preloader: () => {
            const preloader = document.getElementById("preloader");
            if (preloader) {
                setTimeout(() => {
                    preloader.style.transition = "opacity 0.6s ease";
                    preloader.style.opacity = "0";
                    setTimeout(() => preloader.style.display = "none", 600);
                }, 1000);
            }
        },

        scrollTopButton: () => {
            const scrollTop = document.querySelector('.scroll-top');
            if (scrollTop) {
                const toggle = () => window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
                window.addEventListener('load', toggle);
                document.addEventListener('scroll', toggle);

                scrollTop.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.scrollTo({top: 0, behavior: 'smooth'});
                });
            }
        }
    };


    /**
     * --- 1. NAVIGATION & SCROLLSPY ---
     */
    function initNavigationBehavior() {
        const body = document.querySelector('body');
        const headerToggleBtn = document.querySelector('.header-toggle');
        const navLinks = document.querySelectorAll('#navmenu a');

        // --- THE FIX: Dynamic Offset Calculation ---
        const stickyBar = document.querySelector('.cv-sticky-bar');
        const headerOffset = stickyBar ? 85 : 0; // 85px for CV, 20px for Index

        // Mobile Toggle
        if (headerToggleBtn) {
            headerToggleBtn.replaceWith(headerToggleBtn.cloneNode(true));
            const newToggleBtn = document.querySelector('.header-toggle');
            newToggleBtn.addEventListener('click', function() {
                body.classList.toggle('mobile-nav-active');
                this.classList.toggle('bi-list');
                this.classList.toggle('bi-x');
            });
        }

        // Click Handler: Dropdowns vs Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const parentLi = this.parentElement;
                const hasSubmenu = parentLi.classList.contains('dropdown');

                if (hasSubmenu && (window.innerWidth < 1200 || this.getAttribute('href') === '#')) {
                    e.preventDefault();
                    e.stopPropagation();

                    document.querySelectorAll('.navmenu .dropdown').forEach(other => {
                        if (other !== parentLi) other.classList.remove('active', 'dropdown-active');
                    });

                    parentLi.classList.toggle('active');
                    parentLi.classList.toggle('dropdown-active');
                } else {
                    const targetId = this.getAttribute('href');
                    if (targetId && targetId.startsWith('#')) {
                        const target = document.querySelector(targetId);
                        if (target) {
                            e.preventDefault();
                            // Use the dynamic offset calculated above
                            window.scrollTo({
                                top: target.offsetTop - headerOffset,
                                behavior: "smooth"
                            });
                        }
                    }

                    // Change URL hash or section id display option
                    // const targetId = this.getAttribute('href');
                    if (targetId && targetId.startsWith('#')) {
                        const target = document.querySelector(targetId);

                        // Check if target exists to prevent errors
                        if (target) {
                            e.preventDefault();

                            // 1. Logic Fix: Compare the string targetId, not the object target
                            if (targetId === "#hero") {
                                // Removes hash when clicking home/hero
                                history.pushState(null, null, window.location.pathname);
                            } else {
                                // Update URL hash for all other sections
                                history.pushState(null, null, targetId);
                            }

                            // 2. Execute the scroll
                            window.scrollTo({
                                top: target.offsetTop - headerOffset,
                                behavior: "smooth"
                            });
                        } else {
                            console.warn(`Target section ${targetId} not found on this page.`);
                        }
                    }

                    if (body.classList.contains('mobile-nav-active')) {
                        body.classList.remove('mobile-nav-active');
                        const toggleBtn = document.querySelector('.header-toggle');
                        if (toggleBtn) { toggleBtn.classList.add('bi-list'); toggleBtn.classList.remove('bi-x'); }
                    }
                }
            });
        });


        // const runScrollSpy = () => {
        //     // 1. Position calculation with a standard offset
        //     const position = window.scrollY + (headerOffset + 25);
        //     let bestMatchLink = null;
        //
        //     // --- STEP 1: CONTENT SEARCH (Identifies sub-sections) ---
        //     navLinks.forEach(link => {
        //         const hash = link.hash;
        //         // //
        //         // const parts = fullHash.substring(1).split('-');
        //         // const sectionId = parts[0];
        //         // const itemId = parts[1];
        //         // EXCLUSION: We skip containers so they don't "steal" the highlight
        //         const isWrapper = ['#hero', '#all_cv_section', '#all_details_section', '#expertise_skills_achievements', '#all_cv_wrapper', '#', ''].includes(hash);
        //         if (isWrapper) return;
        //
        //         const section = document.querySelector(hash);
        //         if (section && position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        //             // Priority: If sections overlap, the one further down the page wins
        //             if (!bestMatchLink || section.offsetTop >= document.querySelector(bestMatchLink.hash).offsetTop) {
        //                 bestMatchLink = link;
        //             }
        //         }
        //     });
        //
        //     // --- STEP 2: THE FLICKER FIX (Fallback Logic) ---
        //     // We only force a fallback to Home if the user is in the "Top Zone" (scrollY < 200).
        //     // We REMOVED the "!bestMatchLink" check that caused the jump back to Home in gaps.
        //     if (window.scrollY < 200) {
        //         const isCV = !!document.getElementById('all_cv_section');
        //         const isDetails = window.location.pathname.includes('section_details.html');
        //
        //         if (isCV) {
        //             bestMatchLink = document.querySelector('#navmenu a[href="#all_cv_section"]');
        //         } else if (isDetails) {
        //             bestMatchLink = document.querySelector('#navmenu a[href="#about"]');
        //         } else {
        //             bestMatchLink = document.querySelector('#navmenu a[href="#hero"]');
        //         }
        //     }
        //
        //     // --- STEP 3: UPDATE (The Sticky Guard) ---
        //     // If we have a valid bestMatchLink (either found in search or in the Top Zone fallback), update the UI.
        //     // If we are in a gap deep in the page (bestMatchLink is null), we do NOTHING, keeping the last section active.
        //     if (bestMatchLink) {
        //         const linkActive = bestMatchLink.classList.contains('active');
        //         const parentActive = bestMatchLink.parentElement.classList.contains('active');
        //
        //         if (!linkActive || !parentActive) {
        //             document.querySelectorAll('#navmenu a.active, #navmenu li.active').forEach(el => {
        //                 el.classList.remove('active', 'dropdown-active');
        //             });
        //
        //             bestMatchLink.classList.add('active');
        //
        //             // RECURSIVE PARENT FIX: Confirmed fix for initial load/boldness
        //             let parent = bestMatchLink.parentElement;
        //             while (parent && parent.tagName !== 'NAV') {
        //                 if (parent.tagName === 'LI') {
        //                     parent.classList.add('active');
        //                     if (parent.classList.contains('dropdown')) parent.classList.add('dropdown-active');
        //                 }
        //                 parent = parent.parentElement;
        //             }
        //
        //             // Sync Header UI components
        //             const sectionId = bestMatchLink.hash.replace('#', '');
        //             if (typeof SiteSection !== 'undefined' && SiteSection.render_sticky_header) {
        //                 SiteSection.render_sticky_header(sectionId);
        //             }
        //
        //             // 4. URL SYNC: Update hash while preserving search parameters (?type=standard)
        //             if (window.location.hash !== bestMatchLink.hash) {
        //                 const searchParams = window.location.search;
        //                 const isHome = bestMatchLink.hash === '#hero' || bestMatchLink.hash === '#all_cv_section';
        //                 const newHash = isHome ? '' : bestMatchLink.hash;
        //                 history.replaceState(null, null, window.location.pathname + searchParams + newHash);
        //             }
        //         }
        //     }
        // };



        const runScrollSpy = () => {
            // 1. Position calculation with a standard offset
            const position = window.scrollY + (headerOffset + 25);
            let bestMatchLink = null;

            // --- STEP 1: CONTENT SEARCH (Identifies sub-sections) ---
            navLinks.forEach(link => {
                // const hash = link.hash;
                const fullHash = link.hash;
                const sectionId = fullHash;
                if (fullHash.includes('-')) {
                    const parts = fullHash.substring(1).split('-');
                    const sectionId = parts[0];
                    const itemId = parts[1];
                }
                // EXCLUSION: We skip containers so they don't "steal" the highlight
                const isWrapper = ['#hero', '#all_cv_section', '#all_details_section', '#expertise_skills_achievements', '#all_cv_wrapper', '#', ''].includes(sectionId);
                if (isWrapper) return;

                const section = document.querySelector(sectionId);
                if (section && position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                    // Priority: If sections overlap, the one further down the page wins
                    if (!bestMatchLink || section.offsetTop >= document.querySelector(bestMatchLink.hash).offsetTop) {
                        bestMatchLink = link;
                    }
                }
            });

            // --- STEP 2: THE FLICKER FIX (Fallback Logic) ---
            // We only force a fallback to Home if the user is in the "Top Zone" (scrollY < 200).
            // We REMOVED the "!bestMatchLink" check that caused the jump back to Home in gaps.
            if (window.scrollY < 200) {
                const isCV = !!document.getElementById('all_cv_section');
                const isDetails = window.location.pathname.includes('section_details.html');

                if (isCV) {
                    bestMatchLink = document.querySelector('#navmenu a[href="#all_cv_section"]');
                } else if (isDetails) {
                    bestMatchLink = document.querySelector('#navmenu a[href="#about"]');
                } else {
                    bestMatchLink = document.querySelector('#navmenu a[href="#hero"]');
                }
            }

            // --- STEP 3: UPDATE (The Sticky Guard) ---
            // If we have a valid bestMatchLink (either found in search or in the Top Zone fallback), update the UI.
            // If we are in a gap deep in the page (bestMatchLink is null), we do NOTHING, keeping the last section active.
            if (bestMatchLink) {
                const linkActive = bestMatchLink.classList.contains('active');
                const parentActive = bestMatchLink.parentElement.classList.contains('active');

                if (!linkActive || !parentActive) {
                    document.querySelectorAll('#navmenu a.active, #navmenu li.active').forEach(el => {
                        el.classList.remove('active', 'dropdown-active');
                    });

                    bestMatchLink.classList.add('active');

                    // RECURSIVE PARENT FIX: Confirmed fix for initial load/boldness
                    let parent = bestMatchLink.parentElement;
                    while (parent && parent.tagName !== 'NAV') {
                        if (parent.tagName === 'LI') {
                            parent.classList.add('active');
                            if (parent.classList.contains('dropdown')) parent.classList.add('dropdown-active');
                        }
                        parent = parent.parentElement;
                    }

                    // Sync Header UI components
                    const sectionId = bestMatchLink.hash.replace('#', '');
                    if (typeof SiteSection !== 'undefined' && SiteSection.render_sticky_header) {
                        SiteSection.render_sticky_header(sectionId);
                    }

                    // 4. URL SYNC: Update hash while preserving search parameters (?type=standard)
                    if (window.location.hash !== bestMatchLink.hash) {
                        const searchParams = window.location.search;
                        const isHome = bestMatchLink.hash === '#hero' || bestMatchLink.hash === '#all_cv_section';
                        const newHash = isHome ? '' : bestMatchLink.hash;
                        history.replaceState(null, null, window.location.pathname + searchParams + newHash);
                    }
                }
            }
        };


        window.addEventListener('scroll', runScrollSpy);
        setTimeout(runScrollSpy, 150); // Small delay allows browser to finish layout
        runScrollSpy();
    }


    /**
     * Advanced Hash Resolver for Split Tags (e.g., #academic_information-phd_cu_csm)
     * File: scripts.js
     */
    window.resolveHashScroll = () => {
        const fullHash = window.location.hash; // #section-item
        if (!fullHash) return;

        // Split the hash into section and specific ID
        const parts = fullHash.substring(1).split('-');
        const sectionId = parts[0];
        const itemId = parts[1];

        // 1. Manually scroll to the main section first so ScrollSpy/Menu updates
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement && !itemId) {
            window.scrollTo({ top: sectionElement.offsetTop - 80, behavior: 'smooth' });
        }

        // 2. If an item ID exists, wait for rendering and scroll to the specific card
        if (itemId) {
            setTimeout(() => {
                const itemElement = document.getElementById(itemId);
                if (itemElement) {
                    const headerOffset = 100;
                    const elementPosition = itemElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Apply highlight effect
                    itemElement.classList.add('target-highlight');
                    setTimeout(() => itemElement.classList.remove('target-highlight'), 3000);
                }
            }, 500); // Buffer for data-rendering
        }
    };

    /**
     * --- 3. GLOBAL ACTIONS ---
     */
    window.handleCopyAction = (btn, type) => {
        const text = btn.getAttribute('data-citation');
        navigator.clipboard.writeText(text).then(() => {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = `<i class="bi bi-check2-all me-1"></i> ${type} Copied`;
            btn.style.setProperty('background-color', '#ff0000', 'important'); // Green success color
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.style.removeProperty('background-color');
            }, 2000);
        });
    };


    /**
     * --- 4. EXTERNAL INITIALIZERS ---
     */
    window.initExternalLibraries = () => {
        initNavigationBehavior(); // Setup all nav logic

        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 600, easing: 'ease-in-out', once: true });
            AOS.refresh();
        }

        if (typeof PureCounter !== 'undefined') new PureCounter();

        // GLightbox
        if (typeof GLightbox !== 'undefined') GLightbox({selector: '.glightbox'});

        // Typed.js (Hero)
        const selectTyped = document.querySelector('.typed');
        if (selectTyped) {
            let typed_strings = selectTyped.getAttribute('data-typed-items').split(',');
            new Typed('.typed', {
                strings: typed_strings,
                loop: true,
                typeSpeed: 100,
                backSpeed: 50,
                backDelay: 2000
            });
        }
    };

    /**
     * Skill Bars Logic
     */
    window.initSkillBars = () => {
        const progressBars = document.querySelectorAll('.progress-bar');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const value = bar.getAttribute('aria-valuenow');
                    bar.style.width = value + '%';
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });
        progressBars.forEach(bar => observer.observe(bar));
    };

    /**
     * --- 5. LIFECYCLE HOOKS ---
     */
    document.addEventListener('DOMContentLoaded', () => {
        UI.preloader();
        UI.scrollTopButton();
    });

    window.hide_preloader = () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = "0";
            setTimeout(() => { preloader.style.display = "none"; }, 600);
        }
    };

    // Expose Navigation behavior to global window for dynamic loaders
    window.initNavigationBehavior = initNavigationBehavior;

})();