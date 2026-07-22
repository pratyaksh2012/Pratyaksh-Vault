import { auth, db } from "./firebase.js";

import {
collection,
doc,
getDocs,
setDoc,
onSnapshot,
query,
orderBy,
serverTimestamp,
where
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";



let currentUser=null;
let selectedUser=null;
let selectedContact=null;



// ELEMENTS

const searchBox=document.getElementById("searchBox");
const searchResults=document.getElementById("searchResults");
const contactList=document.getElementById("contactList");

const popup=document.getElementById("popup");
const nickname=document.getElementById("nickname");

const saveBtn=document.getElementById("saveContact");
const cancelBtn=document.getElementById("cancelPopup");

const sendBtn=document.getElementById("sendBtn");
const messageInput=document.getElementById("messageInput");
const messages=document.getElementById("messages");





// LOGIN

onAuthStateChanged(auth,(user)=>{


if(!user){

window.location.href="login.html";

return;

}


currentUser=user;

loadChats();


});







// SEARCH USERS

searchBox.addEventListener("keyup",async()=>{


let text=searchBox.value.trim().toLowerCase();

searchResults.innerHTML="";


if(text==="")return;



const snap=
await getDocs(collection(db,"users"));



snap.forEach((d)=>{


if(d.id===currentUser.uid)return;


let data=d.data();



if(data.name.toLowerCase().includes(text)){


let div=document.createElement("div");


div.className="user";


div.innerHTML=`

<span>${data.name}</span>

<button 
data-id="${d.id}"
data-name="${data.name}">
Add
</button>

`;


searchResults.appendChild(div);



}



});


});








// OPEN SAVE POPUP

searchResults.addEventListener("click",(e)=>{


if(e.target.tagName==="BUTTON"){



selectedContact={

uid:e.target.dataset.id,

name:e.target.dataset.name

};



nickname.value="";

popup.style.display="flex";


}


});








// CANCEL POPUP

cancelBtn.onclick=()=>{


popup.style.display="none";


};









// SAVE CONTACT AFTER SEARCH

saveBtn.onclick=async()=>{


if(!selectedContact){

alert("Select contact first");

return;

}



let nick=
nickname.value.trim()===""
?
selectedContact.name
:
nickname.value.trim();



await setDoc(


doc(

db,

"contacts",

currentUser.uid,

"list",

selectedContact.uid

),


{

uid:selectedContact.uid,

nickname:nick

}


);



popup.style.display="none";


alert("Contact Saved");


};












// LOAD CHAT LIST

function loadChats(){



const q=query(

collection(db,"chats"),

where(
"users",
"array-contains",
currentUser.uid
)

);



onSnapshot(q,(snapshot)=>{


contactList.innerHTML="";



snapshot.forEach((d)=>{


let chat=d.data();



let myIndex=
chat.users.indexOf(currentUser.uid);



let otherIndex=
myIndex===0?1:0;



let otherUID=
chat.users[otherIndex];



let otherName=
chat.userNames
?
chat.userNames[otherIndex]
:
"Unknown User";




let div=document.createElement("div");


div.className="contact";



div.innerHTML=`

<img src="https://cdn-icons-png.flaticon.com/512/149/149071.png">


<div>

<h4>${otherName}</h4>

<p>${chat.lastMessage || ""} ➡️</p>

</div>

`;



div.onclick=()=>{


selectedUser={

uid:otherUID,

nickname:otherName

};



openChat(selectedUser);


showSaveButton();


};



contactList.appendChild(div);



});



});


}










// OPEN CHAT

function openChat(user){


document.getElementById("contactName").innerText=
user.nickname;


document.getElementById("status").innerText=
"Online";



let chatId=

[currentUser.uid,user.uid]
.sort()
.join("_");



loadMessages(chatId);


}











// SAVE CONTACT BUTTON IN CHAT

function showSaveButton(){


let btn=document.getElementById("saveChatContact");


if(!btn)return;



btn.style.display="block";



btn.onclick=async()=>{


await setDoc(


doc(

db,

"contacts",

currentUser.uid,

"list",

selectedUser.uid

),


{

uid:selectedUser.uid,

nickname:selectedUser.nickname

}


);



alert("Contact Saved");


};



}











// SEND MESSAGE

sendBtn.onclick=async()=>{


if(!selectedUser){

alert("Select a user first");

return;

}



let text=
messageInput.value.trim();



if(text==="")return;



let chatId=

[currentUser.uid,selectedUser.uid]
.sort()
.join("_");



let messageId=
Date.now().toString();




await setDoc(


doc(

db,

"messages",

chatId,

"chat",

messageId

),


{

sender:currentUser.uid,

receiver:selectedUser.uid,

text:text,

time:new Date()

}


);





await setDoc(


doc(

db,

"chats",

chatId

),


{

users:[

currentUser.uid,

selectedUser.uid

],


userNames:[

currentUser.displayName || "User",

selectedUser.nickname

],


lastMessage:text,

lastSender:currentUser.uid,

time:serverTimestamp()


},


{

merge:true

}


);



messageInput.value="";


};











// LOAD MESSAGES

function loadMessages(chatId){


const q=query(

collection(

db,

"messages",

chatId,

"chat"

),

orderBy("time")

);



onSnapshot(q,(snap)=>{


messages.innerHTML="";



snap.forEach((d)=>{


let m=d.data();



let div=document.createElement("div");


div.className=

m.sender===currentUser.uid

?

"message sent"

:

"message received";



div.innerText=m.text;


messages.appendChild(div);



});


});


}
