import { auth, db } from "./firebase.js";

import {
    collection,
    doc,
    getDocs,
    setDoc,
    onSnapshot,
    query,
    orderBy
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


let currentUser = null;
let selectedUser = null;


// HTML ELEMENTS

const searchBox = document.getElementById("searchBox");
const searchResults = document.getElementById("searchResults");

const contactList = document.getElementById("contactList");

const popup = document.getElementById("popup");

const nickname = document.getElementById("nickname");

const saveBtn = document.getElementById("saveContact");

const cancelBtn = document.getElementById("cancelPopup");

const sendBtn = document.getElementById("sendBtn");

const messageInput = document.getElementById("messageInput");

const messages = document.getElementById("messages");


let selectedContact = null;


// LOGIN CHECK

onAuthStateChanged(auth,(user)=>{

    if(!user){

        window.location.href="login.html";
        return;

    }

    currentUser=user;

    loadContacts();

});




// SEARCH USERS

searchBox.addEventListener("keyup",async()=>{


    let text=searchBox.value.trim().toLowerCase();

    searchResults.innerHTML="";


    if(text==="") return;


    const snap =
    await getDocs(collection(db,"users"));



    snap.forEach((d)=>{


        if(d.id===currentUser.uid)
        return;



        const data=d.data();



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





// OPEN ADD CONTACT POPUP

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




// CANCEL

cancelBtn.onclick=()=>{

popup.style.display="none";

};




// SAVE CONTACT

saveBtn.onclick=async()=>{


    if(!selectedContact)
    return;



    let nick =
    nickname.value.trim()===""
    ? selectedContact.name
    : nickname.value.trim();



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






// LOAD CONTACTS

async function loadContacts(){


    contactList.innerHTML="";



    const snap =
    await getDocs(
        collection(
            db,
            "contacts",
            currentUser.uid,
            "list"
        )
    );



    snap.forEach((d)=>{


        let data=d.data();



        let div=document.createElement("div");


        div.className="contact";


        div.innerHTML=`

        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png">


        <div>

        <h4>${data.nickname}</h4>

        <p>Tap to Chat</p>

        </div>

        `;



        div.onclick=()=>{


            selectedUser=data;

            openChat(data);


        };



        contactList.appendChild(div);



    });



}





// OPEN CHAT

function openChat(user){


document.getElementById("contactName").innerText=
user.nickname;


document.getElementById("status").innerText=
"Online";



const chatId =
[currentUser.uid,user.uid]
.sort()
.join("_");



loadMessages(chatId);



}







// SEND MESSAGE

sendBtn.onclick=async()=>{


if(!selectedUser){

alert("Select a contact first");

return;

}



let text =
messageInput.value.trim();



if(text==="")
return;



const chatId =
[currentUser.uid,selectedUser.uid]
.sort()
.join("_");



const messageId =
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


sender:
currentUser.uid,


receiver:
selectedUser.uid,


text:text,


time:new Date()


}



);



messageInput.value="";


};








// REAL TIME MESSAGE LOADING

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



div.className =
m.sender===currentUser.uid
?
"message sent"
:
"message received";



div.innerHTML=m.text;



messages.appendChild(div);



});



});


}
