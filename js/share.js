import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    getDocs,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const fileTitle = document.getElementById("fileTitle");
const usersContainer = document.getElementById("usersContainer");
const status = document.getElementById("status");
const shareBtn = document.getElementById("shareBtn");

const params = new URLSearchParams(window.location.search);
const fileId = params.get("id");

if (!fileId) {

    fileTitle.innerHTML = "❌ No file selected.";

    throw new Error("No File ID");

}

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location = "login.html";
        return;

    }

    try {

        const snap = await getDoc(doc(db, "files", fileId));

        if (!snap.exists()) {

            fileTitle.innerHTML = "❌ File not found.";
            return;

        }

        const file = snap.data();

        fileTitle.innerHTML = "📄 " + file.fileName;

        const size =
            file.sizeKB ??
            file.fileSize ??
            0;

        usersContainer.innerHTML = `

<h3>File Loaded Successfully</h3>

<p><b>Type:</b> ${file.fileType}</p>

<p><b>Size:</b> ${size} KB</p>

<hr>
<button id="selectAllBtn">
✅ Select All Users
</button>

<h2>Select Users</h2>

`;

        const usersSnapshot = await getDocs(collection(db, "users"));

        usersSnapshot.forEach((userDoc) => {

            const u = userDoc.data();

            if (u.email === user.email) return;

            usersContainer.innerHTML += `

<div class="userCard">

<label>

<input
type="checkbox"
class="userCheck"
data-id="${userDoc.id}"
data-name="${u.name || "Unknown User"}"
data-email="${u.email || ""}">

<b>${u.name || "Unknown User"}</b><br>

<small>${u.email || ""}</small>

</label>

</div>

`;

        });
const selectAllBtn = document.getElementById("selectAllBtn");

selectAllBtn.onclick = () => {

    const checkboxes = document.querySelectorAll(".userCheck");

    checkboxes.forEach(box => {

        box.checked = true;

    });

};
        shareBtn.onclick = async () => {

            const checks = document.querySelectorAll(".userCheck:checked");

            if (checks.length === 0) {

                alert("Select at least one user.");
                return;

            }

            for (const check of checks) {
console.log(file);
                await addDoc(collection(db, "sharedFiles"), {

                    fileId: fileId,

                    fileName: file.fileName,
                    fileType: file.fileType,
                    fileURL: file.url,
                    fileSize: file.sizeKB || file.fileSize,

                    senderId: user.uid,
                    senderName: user.displayName || "CloudShare User",
                    senderEmail: user.email,

                    receiverId: check.dataset.id,
                    receiverName: check.dataset.name,
                    receiverEmail: check.dataset.email,

                    sharedAt: Date.now()

                });

            }

            status.innerHTML = "✅ File shared successfully.";

            alert("File Shared Successfully!");

        };

    }

    catch (err) {

        console.log(err);

        status.innerHTML = err.message;

    }

});

