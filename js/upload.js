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

// -------------------------------
// Check Login
// -------------------------------

onAuthStateChanged(auth, (user) => {

    if (user) {

        currentUser = user;

    } else {

        window.location = "login.html";

    }

});

// -------------------------------
// Upload
// -------------------------------

uploadBtn.onclick = async () => {

    if (!currentUser) {

        alert("Please login first.");
        return;

    }

    const file = fileInput.files[0];

    if (!file) {

        alert("Please choose a file.");
        return;

    }

    status.innerHTML = "⏳ Uploading...";

    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", "cloudshare_upload");

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

        if (!result.secure_url) {

            status.innerHTML = "❌ Upload Failed";
            console.log(result);
            return;

        }

        //--------------------------------------------------
        // Detect Resource Type
        //--------------------------------------------------

        let resourceType = result.resource_type || "image";

        let fileURL = result.secure_url;

        //--------------------------------------------------
        // RAW FILES
        //--------------------------------------------------

        if (resourceType === "raw") {

            fileURL = result.secure_url
                .replace("/image/upload/", "/raw/upload/")
                .replace("/video/upload/", "/raw/upload/");

        }

        //--------------------------------------------------
        // VIDEO FILES
        //--------------------------------------------------

        if (resourceType === "video") {

            fileURL = result.secure_url
                .replace("/image/upload/", "/video/upload/");

        }

        //--------------------------------------------------
        // IMAGE FILES
        //--------------------------------------------------

        if (resourceType === "image") {

            fileURL = result.secure_url
                .replace("/video/upload/", "/image/upload/");

        }

        //--------------------------------------------------
        // Save in Firestore
        //--------------------------------------------------

        await addDoc(collection(db, "files"), {

            userId: currentUser.uid,
            userName: currentUser.displayName || "User",
            email: currentUser.email,

            fileName: file.name,
            fileType: file.type,

            resourceType: resourceType,

            fileSize: file.size,
            sizeKB: (file.size / 1024).toFixed(2),

            uploadDate: new Date().toLocaleString(),

            url: fileURL,

            publicId: result.public_id,

            favorite: false,

            sharedWith: [],

            createdAt: serverTimestamp()

        });

        status.innerHTML = "✅ Upload Successful!";

        fileInput.value = "";

    }

    catch (err) {

        console.error(err);

        status.innerHTML = "❌ " + err.message;

    }

};
