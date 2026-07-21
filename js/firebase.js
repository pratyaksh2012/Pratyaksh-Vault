// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyBNxE4G1N0v6ronOt88kmrNKLDJKADSXtE",

    authDomain: "cloudshare-pro-e3dc1.firebaseapp.com",

    projectId: "cloudshare-pro-e3dc1",

    storageBucket: "cloudshare-pro-e3dc1.firebasestorage.app",

    messagingSenderId: "814589791555",

    appId: "1:814589791555:web:37489444d27d2409481b06"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);