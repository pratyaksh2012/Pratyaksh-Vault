import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
updateProfile
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
doc,
setDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ---------- SIGNUP ----------

const signupBtn=document.getElementById("signupBtn");

if(signupBtn){

signupBtn.onclick=async()=>{

const name=document.getElementById("name").value;
const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

try{

const userCredential=await createUserWithEmailAndPassword(auth,email,password);

await updateProfile(userCredential.user,{
displayName:name
});

await setDoc(doc(db,"users",userCredential.user.uid),{

name,
email,
createdAt:new Date().toISOString()

});

alert("Account Created Successfully!");

window.location="login.html";

}catch(err){

alert(err.message);

}

}

}

// ---------- LOGIN ----------

const loginBtn=document.getElementById("loginBtn");

if(loginBtn){

loginBtn.onclick=async()=>{

const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

try{

await signInWithEmailAndPassword(auth,email,password);

window.location="dashboard.html";

}catch(err){

alert(err.message);

}

}

}