
import { getDatabase, onValue, update, ref, get, child } from "firebase/database";

const database = getDatabase();
const rtdb = require("./rtdb_functions")
const lobbytitle = document.getElementById('lobbyTitle');


// loads the lobby name onto the lobby title
export function loadLobbyName() {
    lobbytitle.innerHTML = document.getElementById("lobbyname").value
}


// we load the user into the lobby
// we check if they are host and add host icon if they are
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


// listener functions
// We listen to see if anything changes with the user
// and preform the necessary actions as a result
export function listener(lobbyname) {
    const lobRef = ref(database, lobbyname.value + "/users")
    onValue(lobRef, (snap) => {
        document.getElementById("myList").innerHTML = " ";
        snap.forEach(x => {
            loadUser(x.val()["display_name"], x.val()["host"])
        })

    })

    // when the game starts, update for every player
    onValue(ref(database, lobbyname.value + "/settings/start"), (snap) => {
        if (snap.val()) {
            document.getElementById("lobbyDiv").style = "display: none"
            document.getElementById("inGameSection").style = "display: block"
            

        }
    })

}


// display lobby
export function __displayLobby() {

    document.getElementById('lobbyDiv').style = 'display:block';
    document.getElementById('preLobbyDiv').style = 'display:none';
    loadStartButton();

    loadLobbyName();

}

// displays the start button for the host
export function loadStartButton() {
    const startGameBtn = document.getElementById("startGameBtn");
    startGameBtn.addEventListener('click', async () => {
        // change setting of lobby
        update(ref(database, lobbyname.value + "/settings/"), {
            start: true
        });

        // read game settings

        const snap_val = await rtdb.getSettingValue("hunter_selection", lobbyname);

        if (snap_val == "random") {
            // randomly allocates a hunter

            get(child(ref(database), lobbyname.value + "/users/")).then((snap) => {
                const random = Math.floor(Math.random() * Object.keys(snap.val()).length)

                update(ref(database, lobbyname.value + "/users/" + Object.keys(snap.val())[random]), {
                    team: "hunter"
                })
                document.getElementById("team").innerText = "a hunter";
                document.getElementById('roleArea').style = "background-color: rgb(200,0,0)";
            })
        }

    })
}