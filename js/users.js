import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const usersList=document.getElementById("usersList");

onAuthStateChanged(auth,async(user)=>{

if(!user){

window.location="login.html";

return;

}

const snap=await getDocs(collection(db,"users"));

usersList.innerHTML="";

snap.forEach(doc=>{

const u=doc.data();

if(u.email===user.email) return;

usersList.innerHTML+=`

<div class="fileCard">

<h3>${u.name}</h3>

<p>${u.email}</p>

<button class="shareBtn" data-email="${u.email}">
Share Files
</button>

</div>

`;

});

});