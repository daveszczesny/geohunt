/*
@author: Dave
*/

import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth"
import { onDisconnect, onValue, ref, getDatabase, get, child, remove, update } from "firebase/database";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot } from "firebase/firestore"

// consts
const auth = getAuth();
const db = getFirestore();
const database = getDatabase();




// DOMS
const displayName = document.getElementById('displayname');
var lobbyname = document.getElementById('lobbyname');
const btn = document.getElementById('loginbutton');
const password = document.getElementById("password");
const inLobby = require("./inlobby")


/*
Temp start button
*/
const startGameBtn = document.getElementById("startGameBtn");
startGameBtn.addEventListener('click', () => {
    // change setting of lobby
    update(ref(database, lobbyname.value + "/settings/"), {
        start: true
    });


    // read game settings

    get(child(ref(database), lobbyname.value + "/settings/gameSettings/")).then((snapshot) => {
        if (snapshot.val()["hunter_selection"] == "random") {
            // randomly allocates a hunter

            get(child(ref(database), lobbyname.value + "/users/")).then((snap) => {
                const random = Math.floor(Math.random() * Object.keys(snap.val()).length)

                update(ref(database, lobbyname.value + "/users/" + Object.keys(snap.val())[random]), {
                    team: "hunter"
                })

            })
        }
    })

    // code to print out all available settings
    // get(child(ref(database), lobbyname.value + "/settings/gameSettings/")).then((snapshot) => {

    //     Object.keys(snapshot.val()).forEach(setting =>{
    //         console.log(setting)
    //     })

    // })



})

lobbyname.addEventListener("change", () => {
    lobbyname = document.getElementById("lobbyname");
})



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
            get(child(dbRef, lobbyname.value + "/users")).then(async (snap2) => {
                if (await (!snap2.exists())) {
                    remove(dbRef, lobbyname.value)
                    btn.value = "create"
                } else {
                    btn.value = "join"
                }
            });


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
                    rtdb.writeUser(auth, displayName, lobbyname);
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

        signInAnonymously(auth).then(() => {
            rtdb.writeUser(auth, displayName, lobbyname);
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


//const userRTDBRef = ref(database, lobbyname.value + "/users/" + auth.currentUser.uid)


