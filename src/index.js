/*
@author: Dave

+-------------------------------------------------
|   Index.js is the main javascript file
|   Sets up firebase
+-------------------------------------------------
*/

import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions"

const fb = require("./api/firebase")


const functions = getFunctions(fb.app);
const delUser = httpsCallable(functions, "deleteUser"); // cloud functions

require("./prelobby")
require('./geolocation_getter')

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