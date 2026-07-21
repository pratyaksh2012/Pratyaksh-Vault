import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    doc,
    writeBatch
} 
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const fileList = document.getElementById("fileList");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location = "login.html";
        return;
    }

    const q = query(
        collection(db, "files"),
        where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        fileList.innerHTML = "<h3>No files uploaded yet.</h3>";
        return;
    }

    fileList.innerHTML = "";

    snapshot.forEach((doc) => {

        const file = doc.data();

        fileList.innerHTML += `

        <div class="fileCard">

            <h2>📄 ${file.fileName}</h2>

            <p><b>Type :</b> ${file.fileType}</p>

            <p><b>Size :</b> ${file.sizeKB || "Unknown"} KB</p>

            <p><b>Uploaded :</b> ${file.uploadDate || "Unknown"}</p>

            <div class="fileButtons">

                <a href="${file.url}" target="_blank">
                    <button>👁 Preview</button>
                </a>

                <a href="${file.url}" download>
                    <button>⬇ Download</button>
                </a>

               <button class="shareBtn"
onclick="location.href='share.html?id=${doc.id}'">
📤 Share
</button>

                <button class="deleteBtn"
                data-id="${doc.id}">
                🗑 Delete
                </button>

            </div>

        </div>

        `;

    });

});
document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("deleteBtn")) return;

    const fileId = e.target.dataset.id;

    if (!confirm("Delete this file permanently?")) return;

    try{
const batch = writeBatch(db);


        // Delete from files collection
        batch.delete(doc(db, "files", fileId));

        // Delete every share record
        const sharedQuery = query(
            collection(db, "sharedFiles"),
            where("fileId", "==", fileId)
        );

        const sharedSnap = await getDocs(sharedQuery);

        sharedSnap.forEach((sharedDoc)=>{

            batch.delete(sharedDoc.ref);

        });

        await batch.commit();

        // Remove card instantly
        e.target.closest(".fileCard").remove();

        if(fileList.children.length===0){

            fileList.innerHTML="<h3>No files uploaded yet.</h3>";

        }

        alert("✅ File deleted successfully.");

    }

    catch(err){

        console.error(err);

        alert("Delete failed.");

    }

});
const searchBox = document.getElementById("searchBox");

searchBox.addEventListener("keyup", () => {

    const search = searchBox.value.toLowerCase();

    document.querySelectorAll(".fileCard").forEach(card => {

        const text = card.innerText.toLowerCase();

        card.style.display = text.includes(search)
            ? "block"
            : "none";

    });

});