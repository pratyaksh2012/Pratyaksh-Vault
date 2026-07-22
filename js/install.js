let deferredPrompt;

const overlay = document.getElementById("installOverlay");
const installBtn = document.getElementById("installNow");
const continueBtn = document.getElementById("continueBrowser");

// Register Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js");
    });
}

// Hide overlay if app is already installed
if (
    window.matchMedia("(display-mode: standalone)").matches ||
    localStorage.getItem("pvInstalled") === "true"
) {
    if (overlay) overlay.style.display = "none";
}

// Browser says app can be installed
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (overlay) {
        overlay.style.display = "flex";
    }
});

// Install button
if (installBtn) {
    installBtn.onclick = async () => {

        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            localStorage.setItem("pvInstalled", "true");
        }

        overlay.style.display = "none";
        deferredPrompt = null;
    };
}

// Continue in browser
if (continueBtn) {
    continueBtn.onclick = () => {
        overlay.style.display = "none";
    };
}

// App installed
window.addEventListener("appinstalled", () => {
    localStorage.setItem("pvInstalled", "true");

    if (overlay) {
        overlay.style.display = "none";
    }
});