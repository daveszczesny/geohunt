import { getDatabase, increment, ref, set, update } from "firebase/database";

const database = getDatabase();

/*
+-----------------------------------------------+
|   Writes user to rtdb
+-----------------------------------------------+
*/
export function writeUser(uid, displayname, lobbyname, host){
    // update(ref(database, lobbyname.value + "/settings"),{
    //     playerCount: increment(1)
    // })

    set(ref(database, lobbyname.value+"/users/" + uid), {
        display_name: displayname.value,
        host: host
    });
}


export function createLobby(lobbyname, password){
    //todo
    // encrypt password

    set(ref(database, lobbyname.value+"/settings"), {
        playerCount: 0,
        password: password.value
    })

}