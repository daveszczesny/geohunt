
import { getDatabase, onValue, update, ref } from "firebase/database";

const database = getDatabase();

const lobbytitle = document.getElementById('lobbyTitle');


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
        snap.forEach(x => {
            loadUser(x.val()["display_name"], x.val()["host"])
        })

    })

    onValue(ref(database, lobbyname.value + "/settings/start"), (snap) => {
        if (snap.val()) {
            document.getElementById("lobbyDiv").style = "display: none"
            document.getElementById("inGameSection").style = "display: block"
            
            
        }
    })

}

