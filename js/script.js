document.addEventListener("DOMContentLoaded", () => {

    // Navigation

    document.querySelectorAll("nav a").forEach(link => {

        link.addEventListener("click", function(e){

            e.preventDefault();

            const text=this.textContent.trim();

            if(text==="Home"){

                window.scrollTo({
                    top:0,
                    behavior:"smooth"
                });

            }else{

                alert(text+" section will be available soon.");

            }

        });

    });

    // Login Button

    const login=document.querySelector(".login-btn");

    if(login){

        login.onclick=()=>{

            window.location.href="login.html";

        };

    }

    // Get Started

    const start=document.querySelector(".start");

    if(start){

        start.onclick=()=>{

            window.location.href="signup.html";

        };

    }

    // CTA Button

    const cta=document.querySelector(".cta-btn");

    if(cta){

        cta.onclick=()=>{

            window.location.href="signup.html";

        };

    }

    // Animation

    document.querySelectorAll("button").forEach(button=>{

        button.addEventListener("mouseenter",()=>{

            button.style.transform="scale(1.05)";

        });

        button.addEventListener("mouseleave",()=>{

            button.style.transform="scale(1)";

        });

    });

});