let deferredPrompt;

const installBtn = document.getElementById("installBtn");

// Register Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => {
                console.log("Service Worker Registered");
            })
            .catch(err => {
                console.log(err);
            });
    });
}

// Show Install Button
window.addEventListener("beforeinstallprompt
