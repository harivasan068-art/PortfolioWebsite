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
});