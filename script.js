// ==========================================================================
// Hari Vasan Portfolio Master JavaScript Logic
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Initialize AOS Animate On Scroll Library
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 900,
            once: true,
            offset: 80
        });
    }

    // Initialize EmailJS
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
        if (window.scrollY > 50) {
            navbar?.classList.add("scrolled");
        } else {
            navbar?.classList.remove("scrolled");
        }

        if (window.scrollY > 400) {
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
        menuToggle.addEventListener("click", () => {
            navLinksMenu.classList.toggle("active");
            const icon = menuToggle.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-bars");
                icon.classList.toggle("fa-times");
            }
        });

        // Close menu when link is clicked
        navLinksMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinksMenu.classList.remove("active");
                const icon = menuToggle.querySelector("i");
                if (icon) {
                    icon.classList.add("fa-bars");
                    icon.classList.remove("fa-times");
                }
            });
        });
    }

    // ==========================================================================
    // 3. Dynamic Typing Animation
    // ==========================================================================
    const roles = [
        "AI & ML Engineer",
        "Web Developer",
        "Tech Innovator",
        "Public Relations Officer",
        "Problem Solver"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.getElementById("typing");

    function typeEffect() {
        if (!typingElement) return;

        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = 1800; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 400; // Pause before typing next
        }

        setTimeout(typeEffect, speed);
    }

    typeEffect();

    // ==========================================================================
    // 4. Counter Up Animation (Trigger on Viewport Entry)
    // ==========================================================================
    const counters = document.querySelectorAll(".counter");
    let animatedCounters = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            const duration = 1500;
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const currentCount = Math.floor(progress * target);

                counter.innerText = currentCount + "+";

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target + "+";
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    const statsSection = document.querySelector(".stats-section");

    if (statsSection && counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedCounters) {
                    animateCounters();
                    animatedCounters = true;
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // ==========================================================================
    // 5. Skill Progress Bars Animation
    // ==========================================================================
    const skillProgressBars = document.querySelectorAll(".skill-progress");

    if (skillProgressBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.getAttribute("data-progress");
                    if (progress) {
                        entry.target.style.width = progress;
                    }
                }
            });
        }, { threshold: 0.3 });

        skillProgressBars.forEach(bar => skillsObserver.observe(bar));
    }

    // ==========================================================================
    // 6. Project Category Filtering
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
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.9)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 300);
                }
            });
        });
    });

    // ==========================================================================
    // 7. Dark / Light Theme Toggle with LocalStorage Memory
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
    // 8. Contact Form Handler (Direct Gmail Web App + FormSubmit + EmailJS)
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

        const subject = nameVal ? `Portfolio Message from ${nameVal}` : "Portfolio Inquiry";
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
                alert("Please fill out all fields.");
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            }

            let sentSuccessfully = false;

            // Attempt 1: Direct FormSubmit endpoint
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
                        _subject: `New Portfolio Message from ${nameVal}`
                    })
                });

                if (response.ok) {
                    sentSuccessfully = true;
                }
            } catch (err) {
                console.warn("FormSubmit endpoint failed:", err);
            }

            // Attempt 2: EmailJS
            if (!sentSuccessfully && typeof emailjs !== "undefined") {
                try {
                    await emailjs.send("service_b9krrna", "template_7tyksk8", {
                        name: nameVal,
                        email: emailVal,
                        message: messageVal,
                        reply_to: emailVal,
                        to_name: "Hari Vasan"
                    }, "60vg5CdeRJjgUJNRv");
                    sentSuccessfully = true;
                } catch (err) {
                    console.warn("EmailJS attempt failed:", err);
                }
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }

            // Always open Gmail Compose tab with pre-filled details as a 100% guarantee
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=harivasan068@gmail.com&su=${encodeURIComponent("Portfolio Message from " + nameVal)}&body=${encodeURIComponent("Hi Hari,\n\n" + messageVal + "\n\nFrom:\nName: " + nameVal + "\nEmail: " + emailVal)}`;
            window.open(gmailUrl, "_blank");

            alert("Opening Gmail compose window to send your message directly to harivasan068@gmail.com! Simply click Send in Gmail.");
            contactForm.reset();
        });
    }

    // ==========================================================================
    // 9. Particles Background Configuration
    // ==========================================================================
    if (typeof particlesJS !== "undefined") {
        particlesJS("particles-js", {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#00f2fe" },
                shape: { type: "circle" },
                opacity: { value: 0.4, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 140,
                    color: "#00f2fe",
                    opacity: 0.25,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.8,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 160, line_linked: { opacity: 0.6 } },
                    push: { particles_nb: 3 }
                }
            },
            retina_detect: true
        });
    }

    // ==========================================================================
    // 10. Accent Theme Color Selector Logic
    // ==========================================================================
    const accentDots = document.querySelectorAll(".accent-dot");
    
    const setAccentColor = (accentName) => {
        document.body.setAttribute("data-accent", accentName);
        accentDots.forEach(dot => {
            if (dot.getAttribute("data-accent") === accentName) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
        localStorage.setItem("accentColorPreference", accentName);
    };

    const savedAccent = localStorage.getItem("accentColorPreference");
    if (savedAccent) {
        setAccentColor(savedAccent);
    }

    accentDots.forEach(dot => {
        dot.addEventListener("click", () => {
            const accent = dot.getAttribute("data-accent");
            if (accent) setAccentColor(accent);
        });
    });

    // ==========================================================================
    // 11. Interactive Project Detail Modals Dataset & Handler
    // ==========================================================================
    const projectsData = {
        hafa: {
            title: "HafA DIGITAL — Field & Production Operations Platform",
            badge: "Full-Stack Operations Platform",
            role: "Role: Full-Stack Lead Developer",
            image: "images/hafa.png",
            desc: "A real-time operations management platform designed for a digital marketing agency to streamline on-field shoot coordination, post-production pipelines, and staff attendance.",
            features: [
                "Automated Field Attendance: Integrated GPS Geofence and Haversine distance verification alongside live WebRTC selfie photo capture for ground dispatches.",
                "End-to-End Production Ledger: Interactive task ledger tracking multi-stage deliverables (Shop, Model, Cameraman, Editor, Delivery status) with dynamic KPI analytics.",
                "Bi-directional Cloud Sync: Custom webhook integrations via Google Apps Script to synchronize attendance and shoot logs directly into structured cloud spreadsheets.",
                "Role-Based Access Control (RBAC): Admin Dashboard vs. Field Employee views with secure credential & profile management."
            ],
            tags: ["React", "Tailwind CSS", "Firebase Auth", "Firestore", "Google Apps Script", "Geolocation API", "Vercel"],
            links: [
                { text: "Live Demo (hafadigital.in)", url: "https://hafadigital.in", isPrimary: true, icon: "fas fa-external-link-alt" }
            ]
        },
        event: {
            title: "Event Registration & Attendance System",
            badge: "Web Application",
            role: "Role: Full-Stack Developer",
            image: "images/event.png",
            desc: "Comprehensive web platform engineered with Flask and SQLite to automate college event registrations, admin attendance tracking, and ticket verification.",
            features: [
                "Real-time QR Code Ticket Generation for instant check-in verification at event entry.",
                "Google OAuth 2.0 Integration for secure single sign-on student authentication.",
                "Admin Control Dashboard with real-time participant analytics and CSV report generation.",
                "Hosted live on Render cloud platform with automated deployment pipelines."
            ],
            tags: ["Flask", "Python", "SQLite", "Google OAuth", "QR Code", "Render"],
            links: [
                { text: "Live Demo", url: "https://eventregistrationwebsite.onrender.com", isPrimary: true, icon: "fas fa-external-link-alt" },
                { text: "GitHub Source", url: "https://github.com/harivasan068-art/EventRegistrationWebsite", isPrimary: false, icon: "fab fa-github" }
            ]
        },
        movie: {
            title: "AI Movie Recommendation Engine",
            badge: "AI & Machine Learning",
            role: "Role: Machine Learning Engineer",
            image: "images/movie.png",
            desc: "Intelligent content-based recommendation model built with Python and Scikit-Learn to suggest relevant films based on user preference vectors and metadata similarity.",
            features: [
                "Cosine Similarity Algorithm analyzing genre combinations, cast vectors, keywords, and director metadata.",
                "Feature Extraction & Data Preprocessing pipeline powered by Pandas and NumPy.",
                "Scalable model deployment ready for web frontend integration.",
                "Evaluated accuracy against TMDB 5000 movie dataset metrics."
            ],
            tags: ["Python", "Scikit-Learn", "Machine Learning", "Pandas", "NumPy"],
            links: [
                { text: "View Repository", url: "https://github.com/harivasan068-art", isPrimary: true, icon: "fab fa-github" }
            ]
        },
        happiness: {
            title: "Global Happiness Index Analytics",
            badge: "Data Science",
            role: "Role: Data Analyst",
            image: "images/happiness.png",
            desc: "Data analytics project investigating global happiness factors, GDP per capita, social support, and life expectancy across 150+ nations.",
            features: [
                "Exploratory Data Analysis (EDA) uncovering regional trends and key predictors of well-being.",
                "Interactive Heatmap Visualizations built using Matplotlib and Seaborn.",
                "Regression Analysis evaluating impact of economic vs. social variables on national happiness ranks."
            ],
            tags: ["Python", "Pandas", "Matplotlib", "Seaborn", "Data Science"],
            links: [
                { text: "View Repository", url: "https://github.com/harivasan068-art", isPrimary: true, icon: "fab fa-github" }
            ]
        },
        hotel: {
            title: "Hotel Management Desktop System",
            badge: "Java & Systems",
            role: "Role: Systems Developer",
            image: "images/hotel.png",
            desc: "Desktop management application built with Object-Oriented Java to handle hotel room reservations, guest check-ins/check-outs, and billing invoices.",
            features: [
                "Object-Oriented Design (OOP) implementing encapsulation, inheritance, and modular data models.",
                "Room Availability Matrix tracking single, double, and suite bookings in real time.",
                "Automated Billing & Receipt Generator for guest checkout operations."
            ],
            tags: ["Java", "OOP", "Database Management", "UI Layout"],
            links: [
                { text: "View Source", url: "https://github.com/harivasan068-art", isPrimary: true, icon: "fab fa-github" }
            ]
        },
        portfolio: {
            title: "Personal AI Portfolio Website",
            badge: "Web Application",
            role: "Role: UI/UX Designer & Developer",
            image: "images/portfolio.png",
            desc: "Modern personal showcase website engineered with obsidian glassmorphism UI, theme accent customizers, and interactive modals.",
            features: [
                "Futuristic Obsidian Dark Theme with animated background particles and glow spheres.",
                "Dynamic Theme Accent Color Switcher (Cyan, Violet, Emerald, Crimson).",
                "Interactive Project Detail Modals and filterable project grid.",
                "Fail-safe Contact Form with direct Gmail compose integration."
            ],
            tags: ["HTML5", "Vanilla CSS", "JavaScript", "Glassmorphism", "EmailJS"],
            links: [
                { text: "View Repository", url: "https://github.com/harivasan068-art/PortfolioWebsite", isPrimary: true, icon: "fab fa-github" }
            ]
        },
        techspark: {
            title: "TechSpark PR & Leadership Activities",
            badge: "Leadership & Community",
            role: "Role: Public Relations Officer @ TechSpark",
            image: "images/techspark.jpeg",
            desc: "Leadership and public relations management for TechSpark technical club at Rajalakshmi Institute of Technology.",
            features: [
                "Organized and coordinated 5+ major technical events, coding contests, and hackathons.",
                "Managed technical student community engagement reaching over 830+ participants.",
                "Executed creative social media campaigns, sponsorship outreach, and event promotions."
            ],
            tags: ["Leadership", "Public Relations", "Event Management", "Outreach"],
            links: [
                { text: "Contact for Collaboration", url: "#contact", isPrimary: true, icon: "fas fa-handshake" }
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

    // Attach click listeners to all open-modal-btn buttons
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

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && projectModal?.classList.contains("active")) {
            closeModal();
        }
    });

    // ==========================================================================
    // Academic Presentation Achievement Showcase & Interactive Modals
    // ==========================================================================
    
    // 1. Showcase Tab Viewport Switcher
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

    let currentShowcaseView = "presentation";

    const updateShowcaseView = (viewMode) => {
        currentShowcaseView = viewMode;

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
                spotlightMainImg.style.opacity = "0.4";
                setTimeout(() => {
                    spotlightMainImg.src = mediaData[viewMode].img;
                    spotlightMainImg.alt = mediaData[viewMode].alt;
                    if (spotlightCaptionTag) spotlightCaptionTag.textContent = mediaData[viewMode].tag;
                    if (spotlightCaptionTitle) spotlightCaptionTitle.textContent = mediaData[viewMode].title;
                    spotlightMainImg.style.opacity = "1";
                }, 150);
            }
        }
    };

    showcaseTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const viewMode = tab.getAttribute("data-view");
            if (viewMode) updateShowcaseView(viewMode);
        });
    });

    // Dual view card clicks
    document.querySelectorAll(".dual-item").forEach(item => {
        item.addEventListener("click", () => {
            const target = item.getAttribute("data-show-target");
            if (target) {
                openCertModal(target);
            }
        });
    });

    // 2. Interactive 3D Card Tilt & Ambient Specular Glow
    const academicCard = document.getElementById("academic-card");
    const academicGlow = document.querySelector(".academic-card-glow");

    if (academicCard) {
        academicCard.addEventListener("mousemove", (e) => {
            const rect = academicCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 4;

            academicCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

            if (academicGlow) {
                const glowX = (x / rect.width) * 100;
                const glowY = (y / rect.height) * 100;
                academicGlow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(0, 242, 254, 0.16), transparent 50%), radial-gradient(circle at 75% 70%, rgba(0, 223, 196, 0.08), transparent 45%)`;
            }
        });

        academicCard.addEventListener("mouseleave", () => {
            academicCard.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
            if (academicGlow) {
                academicGlow.style.background = `radial-gradient(circle at 25% 30%, rgba(0, 242, 254, 0.12), transparent 45%), radial-gradient(circle at 75% 70%, rgba(0, 223, 196, 0.08), transparent 45%)`;
            }
        });
    }

    // 3. Interactive Focus Area Pill-Tags
    const techPills = document.querySelectorAll(".tech-pill");
    const insightContent = document.getElementById("insight-content");
    const tagInsightCard = document.getElementById("tag-insight-card");

    const tagInsights = {
        uan: "<strong>Underwater Acoustic Networks:</strong> Overcoming extreme acoustic propagation delay (~1500 m/s), low bandwidth, and harsh multi-path transmission conditions through intelligent node discovery.",
        energy: "<strong>Energy Efficiency:</strong> Dynamic residual battery weighting prevents early node death and balances workload across deep-sea clusters, saving over 28% total network energy.",
        cluster: "<strong>Cluster-Based Routing:</strong> Multi-hop inter-cluster forwarding with adaptive cluster-head rotation prevents hot-spot depletion near surface sinks.",
        iot: "<strong>IoT:</strong> Seamless acoustic-to-RF gateway communication for real-time telemetry from Autonomous Underwater Vehicles (AUVs) and sea-floor sensor nodes.",
        protocol: "<strong>Protocol Design:</strong> Cross-layer MAC & network optimization with synchronized sleep duty-cycles reducing collision overhead and packet drop rates."
    };

    techPills.forEach(pill => {
        pill.addEventListener("click", () => {
            const tagKey = pill.getAttribute("data-tag");
            if (!tagKey || !tagInsights[tagKey]) return;

            techPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");

            if (insightContent && tagInsightCard) {
                tagInsightCard.style.opacity = "0.5";
                tagInsightCard.style.transform = "translateY(2px)";
                setTimeout(() => {
                    insightContent.innerHTML = tagInsights[tagKey];
                    tagInsightCard.style.opacity = "1";
                    tagInsightCard.style.transform = "translateY(0)";
                }, 150);
            }
        });
    });

    // 4. Interactive Certificate & Media Viewer Modal
    const certModalViewer = document.getElementById("cert-modal-viewer");
    const certModalClose = document.getElementById("cert-modal-close");
    const certStageImg = document.getElementById("cert-stage-img");
    const certModalHeading = document.getElementById("cert-modal-heading");
    const modalTabCert = document.getElementById("modal-tab-cert");
    const modalTabPres = document.getElementById("modal-tab-pres");
    const zoomInBtn = document.getElementById("zoom-in-btn");
    const zoomOutBtn = document.getElementById("zoom-out-btn");
    const zoomResetBtn = document.getElementById("zoom-reset-btn");

    let currentZoom = 1;

    const setCertModalMedia = (type) => {
        currentZoom = 1;
        if (certStageImg) certStageImg.style.transform = `scale(${currentZoom})`;

        if (type === "presentation") {
            if (certStageImg) {
                certStageImg.src = "images/icgetei-presentation.jpg";
                certStageImg.alt = "ICGETEI 2026 Presentation Photo - Harivasan V";
            }
            if (certModalHeading) certModalHeading.textContent = "Presentation Session — ICGETEI 2026";
            modalTabPres?.classList.add("active");
            modalTabCert?.classList.remove("active");
        } else {
            if (certStageImg) {
                certStageImg.src = "images/icgetei-certificate.jpg";
                certStageImg.alt = "Certificate of Participation ICGETEI 2026 - Harivasan V";
            }
            if (certModalHeading) certModalHeading.textContent = "Certificate of Participation — ICGETEI 2026";
            modalTabCert?.classList.add("active");
            modalTabPres?.classList.remove("active");
        }
    };

    const openCertModal = (mediaType = "certificate") => {
        setCertModalMedia(mediaType);
        certModalViewer?.classList.add("active");
        certModalViewer?.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    };

    const closeCertModal = () => {
        certModalViewer?.classList.remove("active");
        certModalViewer?.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "auto";
        currentZoom = 1;
        if (certStageImg) certStageImg.style.transform = `scale(1)`;
    };

    modalTabCert?.addEventListener("click", () => setCertModalMedia("certificate"));
    modalTabPres?.addEventListener("click", () => setCertModalMedia("presentation"));

    // Zoom handlers
    zoomInBtn?.addEventListener("click", () => {
        if (currentZoom < 2.5) {
            currentZoom += 0.25;
            if (certStageImg) certStageImg.style.transform = `scale(${currentZoom})`;
        }
    });

    zoomOutBtn?.addEventListener("click", () => {
        if (currentZoom > 0.6) {
            currentZoom -= 0.25;
            if (certStageImg) certStageImg.style.transform = `scale(${currentZoom})`;
        }
    });

    zoomResetBtn?.addEventListener("click", () => {
        currentZoom = 1;
        if (certStageImg) certStageImg.style.transform = `scale(1)`;
    });

    // Triggers for certificate modal
    document.getElementById("btn-view-cert")?.addEventListener("click", () => openCertModal("certificate"));
    document.getElementById("showcase-expand-top-btn")?.addEventListener("click", () => {
        openCertModal(currentShowcaseView === "certificate" ? "certificate" : "presentation");
    });
    document.getElementById("spotlight-single")?.addEventListener("click", () => {
        openCertModal(currentShowcaseView === "certificate" ? "certificate" : "presentation");
    });

    if (certModalClose) certModalClose.addEventListener("click", closeCertModal);
    if (certModalViewer) {
        certModalViewer.addEventListener("click", (e) => {
            if (e.target === certModalViewer) closeCertModal();
        });
    }

    // 5. Interactive Paper Abstract Modal
    const abstractModalViewer = document.getElementById("abstract-modal-viewer");
    const abstractModalClose = document.getElementById("abstract-modal-close");
    const btnReadAbstract = document.getElementById("btn-read-abstract");
    const copyCitationBtn = document.getElementById("copy-citation-btn");
    const bibtexCitation = document.getElementById("bibtex-citation");

    const openAbstractModal = () => {
        abstractModalViewer?.classList.add("active");
        abstractModalViewer?.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    };

    const closeAbstractModal = () => {
        abstractModalViewer?.classList.remove("active");
        abstractModalViewer?.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "auto";
    };

    btnReadAbstract?.addEventListener("click", openAbstractModal);
    if (abstractModalClose) abstractModalClose.addEventListener("click", closeAbstractModal);
    if (abstractModalViewer) {
        abstractModalViewer.addEventListener("click", (e) => {
            if (e.target === abstractModalViewer) closeAbstractModal();
        });
    }

    // Copy BibTeX button
    copyCitationBtn?.addEventListener("click", () => {
        if (bibtexCitation) {
            navigator.clipboard.writeText(bibtexCitation.textContent).then(() => {
                const originalHtml = copyCitationBtn.innerHTML;
                copyCitationBtn.innerHTML = `<i class="fas fa-check" style="color: #10b981;"></i> <span>Copied!</span>`;
                copyCitationBtn.style.borderColor = "#10b981";
                setTimeout(() => {
                    copyCitationBtn.innerHTML = originalHtml;
                    copyCitationBtn.style.borderColor = "";
                }, 2200);
            }).catch(err => {
                console.error("Clipboard copy failed:", err);
            });
        }
    });

    // Global ESC key listener for newly added modals
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (certModalViewer?.classList.contains("active")) closeCertModal();
            if (abstractModalViewer?.classList.contains("active")) closeAbstractModal();
        }
    });
});