import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "./firebase.js";

const db=getFirestore(app);

const search=document.getElementById("searchBox");

const results=document.getElementById("searchResults");

search.addEventListener("keyup",async()=>{

const snap=await getDocs(collection(db,"users"));

results.innerHTML="";

snap.forEach(doc=>{

const user=doc.data();

if(user.name.toLowerCase().includes(search.value.toLowerCase())){

results.innerHTML+=`

<div class="user">

${user.name}

<button>Add</button>

</div>

`;

}

});

});
