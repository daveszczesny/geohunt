
import { child, getDatabase, onValue, onDisconnect, ref, set, get, update } from "firebase/database";

const database = getDatabase();

/*
+-----------------------------------------------+
|   Writes user to rtdb
+-----------------------------------------------+
*/ 
export function writeUser(auth, displayname, lobbyname) {

    set(ref(database, lobbyname.value + "/users/" + auth.currentUser.uid), {
        display_name: displayname.value,
        host: false,
        location: null,
        team: "hunted"
    });
    require("./geolocation_getter")
    get(child(ref(database), lobbyname.value + "/users")).then((snap)=>{  
        if(Object.keys(snap.val()).length == 1){
            
            update(ref(database, lobbyname.value + "/users/" + auth.currentUser.uid), {
                host: true
            })
            document.getElementById("startGameDiv").style="display: block";
            
            
        }

    })


    const userRTDBRef = ref(database, lobbyname.value + "/users/" + auth.currentUser.uid)
    const connectedRef = ref(database, ".info/connected");

    // actively listens for change of online status
    onValue(connectedRef, () => {
        // if connection exists, user exists and their rtdb ref exists
        // it listens if that user disconnections.
        // removes instance of user on rtdb if they disconnect.
        onDisconnect(userRTDBRef).remove();
    })
}


export function createLobby(lobbyname, password) {
    //todo
    // encrypt password

    set(ref(database, lobbyname.value + "/settings"), {
        password: password.value,
        start: false,
        gameSettings: {
            hunter_selection: "random",
            in_game_names: true
        }
    })

}