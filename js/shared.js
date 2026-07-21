import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const sharedFiles=document.getElementById("sharedFiles");

onAuthStateChanged(auth,async(user)=>{

if(!user){

window.location="login.html";
return;

}

const q=query(
collection(db,"sharedFiles"),
where("receiverId","==",user.uid)
);

const snap=await getDocs(q);

if(snap.empty){

sharedFiles.innerHTML="<h2>No files shared with you.</h2>";
return;

}

sharedFiles.innerHTML="";

snap.forEach(doc=>{

const file=doc.data();

sharedFiles.innerHTML+=`

<div class="fileCard">

<h2>📄 ${file.fileName}</h2>

<p><b>Shared By:</b> ${file.senderName}</p>

<p>${file.senderEmail}</p>

<div class="fileButtons">

<a href="${file.fileURL}" target="_blank">

<button>👁 Preview</button>

</a>

<a href="${file.fileURL}" download>

<button>⬇ Download</button>

</a>

</div>

</div>

`;

});

});