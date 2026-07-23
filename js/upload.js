import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("file");
const status = document.getElementById("status");

let currentUser = null;

// Check Login
onAuthStateChanged(auth, (user) => {

    if (user) {

        currentUser = user;

    } else {

        window.location = "login.html";

    }

});

// Upload File
uploadBtn.onclick = async () => {

    const file = fileInput.files[0];

    if (!file) {

        alert("Please choose a file.");
        return;

    }

    status.innerHTML = "⏳ Uploading...";

    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", "cloudshare_upload");
    data.append("resource_type", "auto");

    try {

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/znmynusp/auto/upload",
            {
                method: "POST",
                body: data
            }
        );

        const result = await response.json();

        console.log(result);

        if (result.secure_url) {

            let fileURL = result.secure_url;

            // Fix PDF URL
            if (file.type === "application/pdf") {

                fileURL = result.secure_url.replace("/image/upload/", "/raw/upload/");

            }

            await addDoc(collection(db, "files"), {

                userId: currentUser.uid,
                userName: currentUser.displayName || "",
                email: currentUser.email,

                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,

                sizeKB: (file.size / 1024).toFixed(2),
                uploadDate: new Date().toLocaleString(),

                url: fileURL,
                publicId: result.public_id,

                sharedWith: [],
                favorite: false,

                createdAt: serverTimestamp()

            });

            status.innerHTML = "✅ Upload Successful!";
            fileInput.value = "";

        } else {

            console.log(result);
            status.innerHTML = "❌ Upload Failed";

        }

    } catch (err) {

        console.error(err);
        status.innerHTML = "❌ " + err.message;

    }

};
