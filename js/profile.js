import { auth } from "./firebase.js";

import {
onAuthStateChanged,
updateProfile,
sendPasswordResetEmail
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const profileName=document.getElementById("profileName");
const profileEmail=document.getElementById("profileEmail");

const changeNameBtn=document.getElementById("changeNameBtn");
const changePasswordBtn=document.getElementById("changePasswordBtn");

let currentUser;

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location="login.html";

return;

}

currentUser=user;

profileName.textContent=user.displayName||"CloudShare User";

profileEmail.textContent=user.email;

});

changeNameBtn.onclick=async()=>{

const newName=prompt("Enter new display name:");

if(!newName) return;

await updateProfile(currentUser,{

displayName:newName

});

alert("Name Updated.");

location.reload();

};

changePasswordBtn.onclick=async()=>{

await sendPasswordResetEmail(auth,currentUser.email);

alert("Password reset email sent.");

};