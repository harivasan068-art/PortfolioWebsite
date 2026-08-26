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
});