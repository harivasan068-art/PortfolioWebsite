// ==========================================================================
// Hari Vasan Portfolio Master JavaScript Logic
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Initialize AOS Animate On Scroll Library
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 700,
            once: true,
            offset: 60
        });
    }

    // Initialize EmailJS if present
    if (typeof emailjs !== "undefined") {
        try {
            emailjs.init({ publicKey: "60vg5CdeRJjgUJNRv" });
        } catch (e) {
            emailjs.init("60vg5CdeRJjgUJNRv");
        }
    }

    // ==========================================================================
    // 1. Navbar Scroll Effect & Scroll-to-Top Button
    // ==========================================================================
    const navbar = document.getElementById("navbar");
    const scrollTopBtn = document.getElementById("scroll-top");
    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            navbar?.classList.add("scrolled");
        } else {
            navbar?.classList.remove("scrolled");
        }

        if (window.scrollY > 350) {
            scrollTopBtn?.classList.add("visible");
        } else {
            scrollTopBtn?.classList.remove("visible");
        }

        // Active link highlight on scroll
        const sections = document.querySelectorAll("section[id]");
        let currentSectionId = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ==========================================================================
    // 2. Mobile Navigation Toggle
    // ==========================================================================
    const menuToggle = document.getElementById("menu-toggle");
    const navLinksMenu = document.getElementById("nav-links");

    if (menuToggle && navLinksMenu) {
        const toggleMenu = (open) => {
            const shouldOpen = typeof open === "boolean" ? open : !navLinksMenu.classList.contains("active");
            navLinksMenu.classList.toggle("active", shouldOpen);
            document.body.style.overflow = shouldOpen ? "hidden" : "";
            const icon = menuToggle.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-bars", !shouldOpen);
                icon.classList.toggle("fa-times", shouldOpen);
            }
        };

        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when a link is clicked
        navLinksMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                toggleMenu(false);
            });
        });

        // Close when clicking outside navbar
        document.addEventListener("click", (e) => {
            if (navLinksMenu.classList.contains("active") && !navbar?.contains(e.target)) {
                toggleMenu(false);
            }
        });
    }

    // ==========================================================================
    // 3. Dark / Light Theme Toggle with LocalStorage Memory
    // ==========================================================================
    const themeBtn = document.getElementById("theme-toggle");

    const setTheme = (isLight) => {
        if (isLight) {
            document.body.classList.add("light-theme");
            if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem("themePreference", "light");
        } else {
            document.body.classList.remove("light-theme");
            if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem("themePreference", "dark");
        }
    };

    const savedTheme = localStorage.getItem("themePreference");
    if (savedTheme === "light") {
        setTheme(true);
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const isCurrentlyLight = document.body.classList.contains("light-theme");
            setTheme(!isCurrentlyLight);
        });
    }

    // ==========================================================================
    // 4. Project Category Filtering
    // ==========================================================================
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");

            projectCards.forEach(card => {
                const category = card.getAttribute("data-category");

                if (filterValue === "all" || category === filterValue) {
                    card.style.display = "flex";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 30);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.96)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 200);
                }
            });
        });
    });

    // ==========================================================================
    // 5. Contact Form Handler (Direct Gmail Web App + FormSubmit)
    // ==========================================================================
    const contactForm = document.getElementById("contact-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const gmailComposeBtn = document.getElementById("gmail-compose-btn");

    function updateGmailLink() {
        if (!gmailComposeBtn) return;
        const nameVal = nameInput?.value.trim() || "";
        const emailVal = emailInput?.value.trim() || "";
        const messageVal = messageInput?.value.trim() || "";

        const subject = nameVal ? `Inquiry from ${nameVal}` : "Software Engineering Inquiry";
        const body = `Hi Hari,\n\n${messageVal}\n\nFrom:\nName: ${nameVal}\nEmail: ${emailVal}`;

        gmailComposeBtn.href = `https://mail.google.com/mail/?view=cm&fs=1&to=harivasan068@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    [nameInput, emailInput, messageInput].forEach(input => {
        input?.addEventListener("input", updateGmailLink);
    });

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nameVal = nameInput?.value.trim() || "";
            const emailVal = emailInput?.value.trim() || "";
            const messageVal = messageInput?.value.trim() || "";

            if (!nameVal || !emailVal || !messageVal) {
                alert("Please fill out all required fields.");
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            }

            let sent = false;

            try {
                const response = await fetch("https://formsubmit.co/ajax/harivasan068@gmail.com", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        name: nameVal,
                        email: emailVal,
                        message: messageVal,
                        _subject: `Portfolio Message from ${nameVal}`
                    })
                });

                if (response.ok) {
                    sent = true;
                }
            } catch (err) {
                console.warn("FormSubmit fetch error:", err);
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }

            // Also open Gmail compose as a direct, reliable bridge
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=harivasan068@gmail.com&su=${encodeURIComponent("Portfolio Message from " + nameVal)}&body=${encodeURIComponent("Hi Hari,\n\n" + messageVal + "\n\nFrom:\nName: " + nameVal + "\nEmail: " + emailVal)}`;
            window.open(gmailUrl, "_blank");

            alert("Thank you! Opening your Gmail compose window to send directly to harivasan068@gmail.com.");
            contactForm.reset();
        });
    }

    // ==========================================================================
    // 6. Interactive Project Detail Modals Dataset & Handler
    // ==========================================================================
    const projectsData = {
        hafa: {
            title: "HafA DIGITAL — Agency Operations Platform",
            badge: "Full-Stack Production System",
            role: "Role: Full-Stack Lead Developer",
            image: "images/hafa.png",
            desc: "A production-grade operations management web application built for a digital marketing agency to streamline shoot logistics, editor assignments, client deliverables, and employee check-in verification.",
            features: [
                "Automated Field Attendance: Haversine-based GPS geofence radius check combined with live WebRTC selfie capture for real-time employee attendance verification.",
                "Production Deliverables Ledger: Multi-stage tracking (Shop, Model, Cameraman, Editor, Review, Delivery) with filterable status views and operational KPIs.",
                "Bi-directional Cloud Sync: Custom Google Apps Script webhooks syncing on-field reports directly into central cloud spreadsheets.",
                "Role-Based Access: Dedicated views for agency leadership and field operational crew."
            ],
            tags: ["React", "Tailwind CSS", "Firebase Auth", "Firestore", "Google Apps Script", "Geolocation API", "Vercel"],
            links: [
                { text: "Live Site (hafadigital.in)", url: "https://hafadigital.in", isPrimary: true, icon: "fas fa-external-link-alt" }
            ]
        },
        event: {
            title: "Event Registration & QR Verification System",
            badge: "Web Application",
            role: "Role: Full-Stack Developer",
            image: "images/event.png",
            desc: "Comprehensive web platform engineered with Flask and SQLite to handle college symposium registrations, automated QR-code badge delivery, and single-click scanner verification at event gates.",
            features: [
                "Dynamic QR Code Generation: Generates unique encrypted QR verification tokens per registrant sent via email for instant check-in verification.",
                "Google OAuth 2.0 Integration: Secure student sign-on preventing duplicate entries.",
                "Administrative Dashboard: Real-time attendance counting, seat capacity monitoring, and CSV attendance export.",
                "Cloud Deployment: Containerized and hosted live on Render platform with persistent database storage."
            ],
            tags: ["Flask", "Python", "SQLite", "Google OAuth 2.0", "QR Code", "Render"],
            links: [
                { text: "Live Demo", url: "https://eventregistrationwebsite.onrender.com", isPrimary: true, icon: "fas fa-external-link-alt" },
                { text: "GitHub Source", url: "https://github.com/harivasan068-art/EventRegistrationWebsite", isPrimary: false, icon: "fab fa-github" }
            ]
        },
        movie: {
            title: "Content-Based Movie Recommendation Engine",
            badge: "Machine Learning",
            role: "Role: Machine Learning Engineer",
            image: "images/movie.png",
            desc: "Machine learning model built with Python and Scikit-Learn to compute high-accuracy similarity metrics across multidimensional film metadata vectors.",
            features: [
                "Cosine Similarity Algorithm: Calculates distance metrics across multi-attribute text vectors (genres, cast, keywords, directors).",
                "Text Preprocessing Pipeline: Stopword removal, stemming, and vectorization using Scikit-Learn CountVectorizer.",
                "Dataset Evaluation: Benchmarked against the TMDB 5000 movie dataset for recommendation relevancy.",
                "Modular Architecture: Clean Python codebase ready for web API integration."
            ],
            tags: ["Python", "Scikit-Learn", "Pandas", "NumPy", "Cosine Similarity"],
            links: [
                { text: "GitHub Repository", url: "https://github.com/harivasan068-art", isPrimary: true, icon: "fab fa-github" }
            ]
        },
        happiness: {
            title: "Global Happiness Index Analytics",
            badge: "Data Science",
            role: "Role: Data Analyst",
            image: "images/happiness.png",
            desc: "Exploratory data analysis and statistical study evaluating global well-being factors, GDP per capita, healthy life expectancy, and social trust across 150+ countries.",
            features: [
                "Exploratory Data Analysis (EDA): Uncovering regional trends and strongest predictors of population life satisfaction.",
                "Correlation Heatmaps & Visualizations: Built using Matplotlib and Seaborn for clear graphical communication.",
                "Multivariate Regression: Comparing relative impact of economic indicators versus societal safety nets."
            ],
            tags: ["Python", "Pandas", "Matplotlib", "Seaborn", "Data Science"],
            links: [
                { text: "GitHub Repository", url: "https://github.com/harivasan068-art", isPrimary: true, icon: "fab fa-github" }
            ]
        },
        hotel: {
            title: "Hotel Operations Management Desktop System",
            badge: "Java OOP Application",
            role: "Role: Systems Developer",
            image: "images/hotel.png",
            desc: "Desktop operations platform built with Object-Oriented Java to manage hotel room allocation, guest registration, and automated billing generation.",
            features: [
                "Object-Oriented Design: Implemented encapsulation, inheritance, and modular data models for clean maintenance.",
                "Real-time Room Availability Matrix: Tracking occupied, booked, and maintenance states for single, double, and suite rooms.",
                "Automated Invoicing: Generates itemized guest billing statements upon checkout."
            ],
            tags: ["Java", "OOP Design", "Database Management", "Desktop UI"],
            links: [
                { text: "View Source Code", url: "https://github.com/harivasan068-art", isPrimary: true, icon: "fab fa-github" }
            ]
        },
        techspark: {
            title: "TechSpark Technical Community Leadership",
            badge: "Community & Leadership",
            role: "Role: Public Relations Officer @ TechSpark",
            image: "images/techspark.jpeg",
            desc: "Public relations, marketing campaigns, and logistics coordination for TechSpark technical club at Rajalakshmi Institute of Technology.",
            features: [
                "Organized and coordinated 5+ major college technical events, coding contests, and hackathons.",
                "Managed technical student community engagement reaching over 830+ active participants.",
                "Led creative social media promotions, speaker outreach, and corporate sponsorship communications."
            ],
            tags: ["Leadership", "Event Operations", "Public Relations", "Outreach"],
            links: [
                { text: "Get In Touch", url: "#contact", isPrimary: true, icon: "fas fa-envelope" }
            ]
        }
    };

    const projectModal = document.getElementById("project-modal");
    const modalClose = document.getElementById("modal-close");
    const modalImg = document.getElementById("modal-img");
    const modalBadge = document.getElementById("modal-badge");
    const modalTitle = document.getElementById("modal-title");
    const modalRole = document.getElementById("modal-role");
    const modalDesc = document.getElementById("modal-desc");
    const modalFeatures = document.getElementById("modal-features");
    const modalTags = document.getElementById("modal-tags");
    const modalLinks = document.getElementById("modal-links");

    const openModal = (projectId) => {
        const data = projectsData[projectId];
        if (!data || !projectModal) return;

        modalImg.src = data.image;
        modalImg.alt = data.title;
        modalBadge.textContent = data.badge;
        modalTitle.textContent = data.title;
        modalRole.textContent = data.role;
        modalDesc.textContent = data.desc;

        // Render features
        modalFeatures.innerHTML = data.features.map(f => `<li>${f}</li>`).join("");

        // Render tags
        modalTags.innerHTML = data.tags.map(t => `<span class="tag">${t}</span>`).join("");

        // Render links
        modalLinks.innerHTML = data.links.map(l => `
            <a href="${l.url}" ${l.url.startsWith("#") ? "" : 'target="_blank"'} class="project-btn ${l.isPrimary ? 'project-btn-primary' : 'project-btn-secondary'}">
                <i class="${l.icon}"></i> ${l.text}
            </a>
        `).join("");

        projectModal.classList.add("active");
        projectModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        if (!projectModal) return;
        projectModal.classList.remove("active");
        projectModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "auto";
    };

    document.querySelectorAll(".open-modal-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const projectId = btn.getAttribute("data-project");
            if (projectId) openModal(projectId);
        });
    });

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    if (projectModal) {
        projectModal.addEventListener("click", (e) => {
            if (e.target === projectModal) closeModal();
        });
    }

    // ==========================================================================
    // 7. Academic Presentation Achievement Showcase & Interactive Modals
    // ==========================================================================
    const showcaseTabs = document.querySelectorAll(".showcase-tab");
    const spotlightSingle = document.getElementById("spotlight-single");
    const spotlightDual = document.getElementById("spotlight-dual");
    const spotlightMainImg = document.getElementById("spotlight-main-img");
    const spotlightCaptionTag = document.getElementById("spotlight-caption-tag");
    const spotlightCaptionTitle = document.getElementById("spotlight-caption-title");

    const mediaData = {
        presentation: {
            img: "images/icgetei-presentation.jpg",
            alt: "Harivasan V presenting research at ICGETEI 2026 conference",
            tag: "ICGETEI 2026 Live Session",
            title: "Oral Presentation on Energy-Aware Routing in Acoustic Networks"
        },
        certificate: {
            img: "images/icgetei-certificate.jpg",
            alt: "Certificate of Participation ICGETEI 2026 - Harivasan V",
            tag: "Official Credential",
            title: "Certificate of Participation & Research Presentation"
        }
    };

    const updateShowcaseView = (viewMode) => {
        showcaseTabs.forEach(tab => {
            const isMatch = tab.getAttribute("data-view") === viewMode;
            tab.classList.toggle("active", isMatch);
            tab.setAttribute("aria-selected", isMatch ? "true" : "false");
        });

        if (viewMode === "dual") {
            spotlightSingle?.classList.remove("active");
            spotlightDual?.classList.add("active");
        } else {
            spotlightDual?.classList.remove("active");
            spotlightSingle?.classList.add("active");

            if (mediaData[viewMode] && spotlightMainImg) {
                spotlightMainImg.style.opacity = "0.5";
                setTimeout(() => {
                    spotlightMainImg.src = mediaData[viewMode].img;
                    spotlightMainImg.alt = mediaData[viewMode].alt;
                    if (spotlightCaptionTag) spotlightCaptionTag.textContent = mediaData[viewMode].tag;
                    if (spotlightCaptionTitle) spotlightCaptionTitle.textContent = mediaData[viewMode].title;
                    spotlightMainImg.style.opacity = "1";
                }, 120);
            }
        }
    };

    showcaseTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const view = tab.getAttribute("data-view");
            if (view) updateShowcaseView(view);
        });
    });

    // Dual view items click triggers
    document.querySelectorAll(".dual-item").forEach(item => {
        item.addEventListener("click", () => {
            const target = item.getAttribute("data-show-target");
            if (target) updateShowcaseView(target);
        });
    });

    // Interactive Tech Tag Insights in Research Section
    const tagInsights = {
        uan: "<strong>Underwater Acoustic Networks:</strong> Overcoming extreme acoustic propagation delay (~1500 m/s), narrow bandwidth, and multi-path transmission conditions through dynamic node discovery.",
        energy: "<strong>Energy Efficiency:</strong> Addressing non-rechargeable underwater battery limitations via synchronized sleep-wake duty cycles and balanced forwarder selection.",
        cluster: "<strong>Cluster-Based Routing:</strong> Dynamic cluster-head election factoring residual battery, depth metrics, and link quality to prevent premature node death.",
        iot: "<strong>IoT Systems:</strong> Connecting oceanographic environmental sensors to surface gateway buoys for real-time telemetry back to land stations.",
        protocol: "<strong>Protocol Design:</strong> Formulated state machines and packet handshakes evaluated in NS-3 / Aqua-Sim simulation frameworks."
    };

    const techPills = document.querySelectorAll(".tech-pill");
    const insightContent = document.getElementById("insight-content");

    techPills.forEach(pill => {
        pill.addEventListener("click", () => {
            techPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            const tag = pill.getAttribute("data-tag");
            if (tag && tagInsights[tag] && insightContent) {
                insightContent.innerHTML = tagInsights[tag];
            }
        });
    });

    // ==========================================================================
    // 8. Certificate Modal HD Viewer
    // ==========================================================================
    const certModalViewer = document.getElementById("cert-modal-viewer");
    const certModalClose = document.getElementById("cert-modal-close");
    const certStageImg = document.getElementById("cert-stage-img");
    const modalTabCert = document.getElementById("modal-tab-cert");
    const modalTabPres = document.getElementById("modal-tab-pres");
    const certModalHeading = document.getElementById("cert-modal-heading");

    let currentZoom = 1;

    const applyZoom = () => {
        if (certStageImg) {
            certStageImg.style.transform = `scale(${currentZoom})`;
        }
    };

    const openCertModal = (initialMode = "cert") => {
        if (!certModalViewer) return;
        currentZoom = 1;
        applyZoom();

        if (initialMode === "pres") {
            if (certStageImg) certStageImg.src = "images/icgetei-presentation.jpg";
            if (certModalHeading) certModalHeading.textContent = "Live Presentation — ICGETEI 2026";
            modalTabPres?.classList.add("active");
            modalTabCert?.classList.remove("active");
        } else {
            if (certStageImg) certStageImg.src = "images/icgetei-certificate.jpg";
            if (certModalHeading) certModalHeading.textContent = "Certificate of Participation — ICGETEI 2026";
            modalTabCert?.classList.add("active");
            modalTabPres?.classList.remove("active");
        }

        certModalViewer.classList.add("active");
        certModalViewer.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    };

    const closeCertModal = () => {
        if (!certModalViewer) return;
        certModalViewer.classList.remove("active");
        certModalViewer.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "auto";
    };

    document.getElementById("btn-view-cert")?.addEventListener("click", () => openCertModal("cert"));
    document.getElementById("showcase-expand-top-btn")?.addEventListener("click", () => openCertModal("pres"));
    document.getElementById("spotlight-expand-trigger")?.addEventListener("click", (e) => {
        e.stopPropagation();
        openCertModal("pres");
    });

    modalTabCert?.addEventListener("click", () => {
        if (certStageImg) certStageImg.src = "images/icgetei-certificate.jpg";
        if (certModalHeading) certModalHeading.textContent = "Certificate of Participation — ICGETEI 2026";
        modalTabCert.classList.add("active");
        modalTabPres?.classList.remove("active");
    });

    modalTabPres?.addEventListener("click", () => {
        if (certStageImg) certStageImg.src = "images/icgetei-presentation.jpg";
        if (certModalHeading) certModalHeading.textContent = "Live Presentation — ICGETEI 2026";
        modalTabPres.classList.add("active");
        modalTabCert?.classList.remove("active");
    });

    document.getElementById("zoom-in-btn")?.addEventListener("click", () => {
        if (currentZoom < 2.5) {
            currentZoom += 0.25;
            applyZoom();
        }
    });

    document.getElementById("zoom-out-btn")?.addEventListener("click", () => {
        if (currentZoom > 0.75) {
            currentZoom -= 0.25;
            applyZoom();
        }
    });

    document.getElementById("zoom-reset-btn")?.addEventListener("click", () => {
        currentZoom = 1;
        applyZoom();
    });

    if (certModalClose) certModalClose.addEventListener("click", closeCertModal);
    if (certModalViewer) {
        certModalViewer.addEventListener("click", (e) => {
            if (e.target === certModalViewer) closeCertModal();
        });
    }

    // ==========================================================================
    // 9. Paper Abstract Modal
    // ==========================================================================
    const abstractModal = document.getElementById("abstract-modal-viewer");
    const abstractClose = document.getElementById("abstract-modal-close");
    const btnReadAbstract = document.getElementById("btn-read-abstract");
    const copyCitationBtn = document.getElementById("copy-citation-btn");

    if (btnReadAbstract && abstractModal) {
        btnReadAbstract.addEventListener("click", () => {
            abstractModal.classList.add("active");
            abstractModal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        });
    }

    if (abstractClose && abstractModal) {
        abstractClose.addEventListener("click", () => {
            abstractModal.classList.remove("active");
            abstractModal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "auto";
        });

        abstractModal.addEventListener("click", (e) => {
            if (e.target === abstractModal) {
                abstractModal.classList.remove("active");
                abstractModal.setAttribute("aria-hidden", "true");
                document.body.style.overflow = "auto";
            }
        });
    }

    // BibTeX Copy
    if (copyCitationBtn) {
        copyCitationBtn.addEventListener("click", () => {
            const bibtexCode = document.getElementById("bibtex-citation")?.innerText || "";
            navigator.clipboard.writeText(bibtexCode).then(() => {
                copyCitationBtn.innerHTML = '<i class="fas fa-check"></i> <span>Copied!</span>';
                setTimeout(() => {
                    copyCitationBtn.innerHTML = '<i class="fas fa-copy"></i> <span>Copy BibTeX</span>';
                }, 2000);
            });
        });
    }

    // ==========================================================================
    // 10. Interactive Resume Modal Viewer
    // ==========================================================================
    const resumeModal = document.getElementById("resume-modal-viewer");
    const resumeModalClose = document.getElementById("resume-modal-close");
    const btnPreviewResume = document.getElementById("btn-preview-resume");
    const heroResumeBtn = document.getElementById("hero-resume-btn");

    const openResumeModal = (e) => {
        if (resumeModal) {
            if (e) e.preventDefault();
            resumeModal.classList.add("active");
            resumeModal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        }
    };

    const closeResumeModal = () => {
        if (resumeModal) {
            resumeModal.classList.remove("active");
            resumeModal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "auto";
        }
    };

    btnPreviewResume?.addEventListener("click", openResumeModal);
    heroResumeBtn?.addEventListener("click", openResumeModal);

    if (resumeModalClose) resumeModalClose.addEventListener("click", closeResumeModal);
    if (resumeModal) {
        resumeModal.addEventListener("click", (e) => {
            if (e.target === resumeModal) closeResumeModal();
        });
    }

    // Escape Key closes all open modals
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
            closeCertModal();
            closeResumeModal();
            if (abstractModal?.classList.contains("active")) {
                abstractModal.classList.remove("active");
                abstractModal.setAttribute("aria-hidden", "true");
                document.body.style.overflow = "auto";
            }
        }
    });
});