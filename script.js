// ===============================
// Typing Animation
// ===============================

const roles = [
    "AI & ML Engineer",
    "Web Developer",
    "Tech Innovator",
    "TechSpark Leader",
    "Problem Solver"
];

let roleIndex = 0;
let charIndex = 0;

const typing = document.getElementById("typing");

function typeText() {

    if (charIndex < roles[roleIndex].length) {

        typing.textContent += roles[roleIndex].charAt(charIndex);

        charIndex++;

        setTimeout(typeText, 100);

    } else {

        setTimeout(eraseText, 1500);

    }
}

function eraseText() {

    if (charIndex > 0) {

        typing.textContent =
            roles[roleIndex].substring(0, charIndex - 1);

        charIndex--;

        setTimeout(eraseText, 50);

    } else {

        roleIndex++;

        if (roleIndex >= roles.length) {
            roleIndex = 0;
        }

        setTimeout(typeText, 300);
    }
}


// ===============================
// Counter Animation
// ===============================

const counters =
    document.querySelectorAll(".counter");

counters.forEach(counter => {

    counter.innerText = "0";

    const updateCounter = () => {

        const target =
            +counter.getAttribute("data-target");

        const c =
            +counter.innerText;

        const increment =
            target / 100;

        if (c < target) {

            counter.innerText =
                `${Math.ceil(c + increment)}`;

            setTimeout(updateCounter, 20);

        } else {

            counter.innerText = target;

        }

    };

    updateCounter();

});


// ===============================
// Particles Background
// ===============================

if (typeof particlesJS !== "undefined") {

    particlesJS("particles-js", {

        particles: {

            number: {
                value: 80
            },

            color: {
                value: "#00e5ff"
            },

            shape: {
                type: "circle"
            },

            opacity: {
                value: 0.5
            },

            size: {
                value: 3
            },

            move: {
                enable: true,
                speed: 2
            }

        }

    });

}


// ===============================
// Dark Mode Toggle
// ===============================

const themeBtn =
    document.getElementById("theme-toggle");

if (themeBtn) {

    themeBtn.onclick = () => {

        document.body.classList.toggle("light");

        if (document.body.classList.contains("light")) {

            themeBtn.innerHTML = "☀️";

        } else {

            themeBtn.innerHTML = "🌙";

        }

    };

}


// ===============================
// Mobile Menu
// ===============================

const menuToggle =
    document.querySelector(".menu-toggle");

const navLinks =
    document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");

    });

}


// ===============================
// Page Load
// ===============================

window.addEventListener("load", () => {

    // Start Typing Animation
    typeText();

    // Hide Loader (if exists)
    const loader =
        document.getElementById("loader");

    if (loader) {

        loader.style.display = "none";

    }

});

// ===============================
// Contact Form - EmailJS
// ===============================

emailjs.init("60vg5CdeRJjgUJNRv");

const contactForm = document.getElementById("contact-form");

if(contactForm){

contactForm.addEventListener("submit", function(e){

e.preventDefault();

emailjs.send(
"service_b9krrna",
"template_7tyksk8",
{
name: document.getElementById("name").value,
email: document.getElementById("email").value,
message: document.getElementById("message").value
}
)

.then(function(){

alert("✅ Message Sent Successfully!");

contactForm.reset();

})

.catch(function(error){

alert("❌ Failed to Send Message");

console.log("EmailJS Error:", error);

});

});

}