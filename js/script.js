document.addEventListener("DOMContentLoaded", () => {

    // Navigation

    document.querySelectorAll("nav a").forEach(link => {

        link.addEventListener("click", function(e){

            const text = this.textContent.trim();

            if(text === "Home"){

                e.preventDefault();

                window.location.href = "index.html";

            }

            else if(text === "Features"){

                e.preventDefault();

                window.location.href = "features.html";

            }

            else if(text === "About"){

                e.preventDefault();

                window.location.href = "about.html";

            }

        });

    });

    // Login Button

    const login = document.querySelector(".login-btn");

    if(login){

        login.onclick = () => {

            window.location.href = "login.html";

        };

    }

    // Get Started

    const start = document.querySelector(".start");

    if(start){

        start.onclick = () => {

            window.location.href = "signup.html";

        };

    }

    // CTA Button

    const cta = document.querySelector(".cta-btn");

    if(cta){

        cta.onclick = () => {

            window.location.href = "signup.html";

        };

    }

    // Button Animation

    document.querySelectorAll("button").forEach(button => {

        button.addEventListener("mouseenter", () => {

            button.style.transform = "scale(1.05)";

        });

        button.addEventListener("mouseleave", () => {

            button.style.transform = "scale(1)";

        });

    });

});
