import { auth, db } from "./firebase.js";

import {
collection,
doc,
getDocs,
getDoc,
setDoc,
query,
where
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

let currentUser = null;
let selectedUser = null;

// HTML Elements

const searchBox = document.getElementById("searchBox");
const searchResults = document.getElementById("searchResults");

const contactList = document.getElementById("contactList");

const popup = document.getElementById("popup");

const nickname = document.getElementById("nickname");

const saveBtn = document.getElementById("saveContact");

const cancelBtn = document.getElementById("cancelPopup");

let selectedContact = null;

// Check Login

onAuthStateChanged(auth, (user)=>{

if(!user){

window.location.href="login.html";

return;

}

currentUser=user;

loadContacts();

});

// SEARCH USERS

searchBox.addEventListener("keyup",async()=>{

const text=searchBox.value.trim().toLowerCase();

searchResults.innerHTML="";

if(text==="") return;

const snap=await getDocs(collection(db,"users"));

snap.forEach((d)=>{

if(d.id===currentUser.uid) return;

const data=d.data();

if(data.name.toLowerCase().includes(text)){

const div=document.createElement("div");

div.className="user";

div.innerHTML=`

<span>${data.name}</span>

<button data-id="${d.id}" data-name="${data.name}">

Add

</button>

`;

searchResults.appendChild(div);

}

});

});

// OPEN POPUP

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

// CLOSE POPUP

cancelBtn.onclick=()=>{

popup.style.display="none";

};

// SAVE CONTACT

saveBtn.onclick=async()=>{

if(!selectedContact) return;

const nick=

nickname.value.trim()===""

?selectedContact.name

:nickname.value.trim();

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

loadContacts();

};
// =============================
// LOAD CONTACTS
// =============================

async function loadContacts() {

    contactList.innerHTML = "";

    const snap = await getDocs(
        collection(db, "contacts", currentUser.uid, "list")
    );

    snap.forEach((d) => {

        const data = d.data();

        const div = document.createElement("div");

        div.className = "contact";

        div.innerHTML = `
            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png">

            <div>

                <h4>${data.nickname}</h4>

                <p>Tap to Chat</p>

            </div>
        `;

        div.onclick = () => {

            selectedUser = data;

            openChat(data);

        };

        contactList.appendChild(div);

    });

}

// =============================
// OPEN CHAT
// =============================

async function openChat(user) {

    document.getElementById("contactName").innerText =
        user.nickname;

    document.getElementById("status").innerText =
        "Online";

    document.getElementById("messages").innerHTML = "";

}

// =============================
// SEND MESSAGE
// =============================

document.getElementById("sendBtn").onclick = async () => {

    if (!selectedUser) {

        alert("Select a contact first.");

        return;

    }

    const text =
        document.getElementById("messageInput").value.trim();

    if (text == "") return;

    const chatId =
        [currentUser.uid, selectedUser.uid]
        .sort()
        .join("_");

    const id = Date.now().toString();

    await setDoc(

        doc(db,
            "messages",
            chatId,
            "chat",
            id
        ),

        {

            sender: currentUser.uid,

            receiver: selectedUser.uid,

            text: text,

            time: new Date()

        }

    );

    document.getElementById("messageInput").value = "";

    loadMessages(chatId);

};

// =============================
// LOAD MESSAGES
// =============================

async function loadMessages(chatId) {

    const messages =
        document.getElementById("messages");

    messages.innerHTML = "";

    const snap =
        await getDocs(
            collection(
                db,
                "messages",
                chatId,
                "chat"
            )
        );

    snap.forEach((d) => {

        const m = d.data();

        const div =
            document.createElement("div");

        div.className =
            m.sender == currentUser.uid
            ? "message sent"
            : "message received";

        div.innerHTML = `

            ${m.text}

        `;

        messages.appendChild(div);

    });

}

// =============================
// REFRESH CHAT
// =============================

setInterval(() => {

    if (!selectedUser) return;

    const chatId =
        [currentUser.uid, selectedUser.uid]
        .sort()
        .join("_");

    loadMessages(chatId);

}, 1500);
