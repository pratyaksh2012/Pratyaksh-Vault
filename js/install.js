let deferredPrompt;

const installBtn = document.getElementById("installBtn");

// Register Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./js/service-worker.js")
            .then(() => {
                console.log("Service Worker Registered");
            })
            .catch(err => {
                console.log(err);
            });
    });
}

// Show Install Button
window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();

    deferredPrompt = e;

    if (installBtn) {
        installBtn.style.display = "inline-block";
    }

});

// Install App
if (installBtn) {

    installBtn.addEventListener("click", async () => {

        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        console.log(outcome);

        deferredPrompt = null;

        installBtn.style.display = "none";

    });

}
