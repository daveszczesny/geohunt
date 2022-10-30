
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, update, increment, ref, onDisconnect, get, child } from "firebase/database";
import { doc, getFirestore } from "firebase/firestore"

const auth = getAuth();
const db = getFirestore();
const database = getDatabase();

const lobbytitle = document.getElementById('lobbyTitle');
const lobbyname = document.getElementById("lobbyname");


export function loadLobbyName() {
    lobbytitle.innerHTML = document.getElementById("lobbyname").value
}

export function loadUser(displayname, host) {
    const node = document.createElement("li");
    const userNode = document.createTextNode(displayname);

    document.getElementById("myList").appendChild(node);
    // adds host icon
    if (host) {
        const icon = document.createElement("i");
        icon.classList.add("fas");
        icon.classList.add("fa-crown")
        icon.setAttribute("style", "color:yellow;border:0;padding:0;position:relative;top:0.1%;left: 0%;")
        node.appendChild(icon)
    }
    node.appendChild(userNode);
}


export function listener(lobbyname) {
    const lobRef = ref(database, lobbyname.value + "/users")
    onValue(lobRef, (snap) => {
        document.getElementById("myList").innerHTML = " ";
        var foo = 0;
        snap.forEach(x => {
            loadUser(x.val()["display_name"], x.val()["host"])
            foo++;
        })
        
        update(ref(database, lobbyname.value + "/settings"), {
            playerCount: foo
        })

    })

    if (auth.currentUser != null) {
        const userAuth = auth.currentUser;
        const userRTDBRef = ref(database, lobbyname.value + "/users/" + auth.currentUser.uid)
        console.log("<REF> : " + lobbyname.value)
        const connectedRef = ref(database, ".info/connected");

        // actively listens for change of online status
        onValue(connectedRef, (snap) => {
            // if connection exists, user exists and their rtdb ref exists
            // it listens if that user disconnections.
            // removes instance of user on rtdb if they disconnect.
            if (snap.val() == true && userAuth !== null && userRTDBRef !== null) {
                onDisconnect(userRTDBRef, () => {

                    delUser()

                }).remove()
            }
        })
    }
}