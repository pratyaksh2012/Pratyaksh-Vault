import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// =======================
// Elements
// =======================

const username = document.getElementById("username");
const email = document.getElementById("email");
const logoutBtn = document.getElementById("logoutBtn");

const uploadBtn = document.getElementById("upload");
const uploadPageBtn = document.getElementById("uploadPageBtn");

const myFilesBtn = document.getElementById("myFiles");
const myFilesPageBtn = document.getElementById("myFilesBtn");

const usersBtn = document.getElementById("usersBtn");
const sharedBtn = document.getElementById("sharedBtn");
const profileBtn = document.getElementById("profileBtn");
const darkModeBtn = document.getElementById("darkModeBtn");

const currentTime = document.getElementById("currentTime");

const totalFiles = document.getElementById("totalFiles");
const sharedFiles = document.getElementById("sharedFiles");
const storageUsed = document.getElementById("storageUsed");
const recentFiles = document.getElementById("recentFiles");

// =======================
// Clock
// =======================

function updateClock() {
    const now = new Date();
    currentTime.textContent =
        now.toLocaleDateString() +
        " | " +
        now.toLocaleTimeString();
}

updateClock();
setInterval(updateClock,1000);

// =======================
// Login
// =======================

onAuthStateChanged(auth, async (user)=>{

    if(!user){
        window.location="login.html";
        return;
    }

    username.textContent =
        user.displayName || "CloudShare User";

    email.textContent = user.email;

    // Files
    const q=query(
        collection(db,"files"),
        where("userId","==",user.uid)
    );

    const snap=await getDocs(q);

    totalFiles.textContent=snap.size;

    let totalSize=0;

    recentFiles.innerHTML="";

    snap.forEach(doc=>{

        const file=doc.data();

        totalSize += Number(file.sizeKB || file.size || 0);

        recentFiles.innerHTML += `
<div class="userCard">

<b>📄 ${file.fileName}</b>

<br>

${file.fileType}

•

${file.sizeKB || file.size || 0} KB

</div>
`;

    });

    storageUsed.textContent=totalSize+" KB";

    // Shared
    const sq=query(
        collection(db,"sharedFiles"),
        where("receiverEmail","==",user.email)
    );

    const ss=await getDocs(sq);

    sharedFiles.textContent=ss.size;

    if(snap.empty){
        recentFiles.innerHTML="<p>No files uploaded yet.</p>";
    }

});

// Navigation

if(uploadBtn) uploadBtn.onclick=()=>window.location="upload.html";
if(uploadPageBtn) uploadPageBtn.onclick=()=>window.location="upload.html";

if(myFilesBtn) myFilesBtn.onclick=()=>window.location="myfiles.html";
if(myFilesPageBtn) myFilesPageBtn.onclick=()=>window.location="myfiles.html";

if(usersBtn) usersBtn.onclick=()=>window.location="users.html";
if(sharedBtn) sharedBtn.onclick=()=>window.location="shared.html";

if(profileBtn){
    profileBtn.onclick=()=>window.location="profile.html";
}

if(darkModeBtn){

    darkModeBtn.onclick=()=>{

        document.body.classList.toggle("dark");

    };

}

logoutBtn.onclick=async()=>{

    await signOut(auth);

    window.location="login.html";

};