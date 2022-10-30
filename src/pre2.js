/*
@author: Dave
*/

import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth"
import { onDisconnect, onValue, ref, getDatabase, get, child, remove } from "firebase/database";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot } from "firebase/firestore"

// consts
const auth = getAuth();
const db = getFirestore();
const database = getDatabase();




// DOMS
const displayName = document.getElementById('displayname');
const lobbyname = document.getElementById('lobbyname');
const btn = document.getElementById('loginbutton');
const password = document.getElementById("password");
const inLobby = require("./inlobby")


const colRef = collection(db, "lobbys");

/*
+--------------------------------------------------------+
|   focus function to password input
|   checks rtdb to see if lobbyname exists as a
|   lobby
+--------------------------------------------------------+
*/
password.addEventListener('focus', () => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, lobbyname.value)).then((snap) => {

        if (snap.exists()) {

            // checks if the lobby is apart of garbage,
            // aka if the lobby has been left behind without any users.
            get(child(dbRef, lobbyname.value + "/users")).then((snap2)=>{
                if(!snap2.exists()){
                    remove(dbRef, lobbyname.value)
                }
            });

            console.log(snap.val());
            btn.value = "join"
        } else {
            btn.value = "create"
        }
    })
})

/*
+--------------------------------------------------------+
|   Button on click event
|   if button text is join
|       we run through all lobbys until we find
|       the one that matches the lobbyname and password
|       once found, we create user on database
|       and display the lobby
|    else we create the lobby
+--------------------------------------------------------+
*/

const rtdb = require("./rtdb_users")

btn.addEventListener('click', async () => {

    if (btn.value == "join") {
        // check if password is correct
        const dbRef = ref(getDatabase());
        get(child(dbRef, lobbyname.value + "/settings")).then((snap) => {
            if (password.value == snap.val()["password"]) {
                signInAnonymously(auth).then(async () => {
                    rtdb.writeUser(auth.currentUser.uid, displayName, lobbyname, false);
                })
                inLobby.listener(lobbyname)
                __displayLobby();
                return;
            } else {
                document.getElementById("wrongpassword").style = "display: block";
            }
        })

    }

    if (btn.value == "create") {
        rtdb.createLobby(lobbyname, password);

        signInAnonymously(auth).then(async () => {
            rtdb.writeUser(auth.currentUser.uid, displayName, lobbyname, true);
        })
        inLobby.listener(lobbyname)
        __displayLobby();
        return;
    }

});

/*
    Private functions
    Start with __, "double underscore"
*/


// Function to change the current display from the login to the lobby menu
function __displayLobby() {
    // displays lobby
    document.getElementById("lobbyDiv").style = "display:block";
    document.getElementById("preLobbyDiv").style = "display:none";


    inLobby.loadLobbyName();
}
