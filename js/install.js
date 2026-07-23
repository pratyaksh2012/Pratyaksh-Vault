let deferredPrompt;

const installBtn = document.getElementById("installBtn");

// =========================
// Register Service Worker
// =========================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("./service-worker.js")

        .then(() => {

            console.log("Service Worker Registered");

        })

        .catch((err) => {

            console.log("Service Worker Error:", err);

        });

    });

}

// =========================
// Detect Install Prompt
// =========================

window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();

    deferredPrompt = e;

    if (installBtn) {

        installBtn.style.display = "inline-block";

    }

});

// =========================
// Install Button
// =========================

if (installBtn) {

    installBtn.addEventListener("click", async () => {

        // Browser supports install prompt
        if (deferredPrompt) {

            deferredPrompt.prompt();

            const { outcome } = await deferredPrompt.userChoice;

            console.log("Install Result:", outcome);

            deferredPrompt = null;

            installBtn.style.display = "none";

        }

        // Browser does not support install prompt
        else {

            alert(
                "Install prompt is not available on this browser.\n\n" +
                "If you are using Chrome on Windows 7, this feature is not supported.\n\n" +
                "You can still install the app from a supported browser by using:\n\n" +
                "Menu (⋮) → Install App / Add to Home Screen."
            );

        }

    });

}
