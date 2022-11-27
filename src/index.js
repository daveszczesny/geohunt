/*
@author: Dave

+-------------------------------------------------
|   Index.js is the main javascript file
|   Sets up firebase
+-------------------------------------------------
*/

import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions"

// firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAXm-1aMaGvQHRHIh6RC09aB8ZD8CJgpuk",
    authDomain: "geohunt-dff18.firebaseapp.com",
    projectId: "geohunt-dff18",
    storageBucket: "geohunt-dff18.appspot.com",
    messagingSenderId: "969092699325",
    appId: "1:969092699325:web:ce0294c9e7ce302197d3d4",
    measurementId: "G-JQBVMQ6NBN",
    databaseURL: "https://geohunt-dff18-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

const delUser = httpsCallable(functions, "deleteUser"); // cloud functions

require("./pre2");
require("./geolocation_getter")


// Things to do right after window loads
window.onload = () => {
    // makes the lobby screen invisible
    document.getElementById("lobbyDiv").style = "display: none"
    document.getElementById("wrongpassword").style = "display: none"
    document.getElementById("inGameSection").style = "display: none"
}


window.onunload = () =>
{
    delUser(); // cloud function
}