import { getAuth, signInAnonymously } from "firebase/auth"
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, arrayUnion, getDocs, FieldValue, increment } from "firebase/firestore"

const db = getFirestore();
const auth = getAuth();
const rtdb = require("./rtdb_users")

/*
+--------------------------------------------------------+
|   Signs user in anonymously
|   Writes to rtdb the users uid, display name and lobby
+--------------------------------------------------------+

*/
export function createUserOnDB(lobbyname, displayname, host) {
    signInAnonymously(auth).then(async () => {

        const user = auth.currentUser;
        rtdb.writeUser(user.uid, displayname, lobbyname, host);

        addUserToLobby(lobbyname)
    })

    const foo = "123123"
    console.log(`${foo}`);

}

// todo: delete, not used
/*
    We no longer have use of this function
    This function appends the user to the players list
        on the lobby's players field
    This is no longer used
*/
export async function addUserToLobby(lobbyname) {
    const docRef = doc(db, "lobbys", lobbyname);
    const userAuth = auth.currentUser;

    // checks if user has been found correctly
    if (!userAuth) {
        alert("User not found!");
        return;
    }
    // updates lobby array of users
    await updateDoc(docRef, {
        playersCount: increment(1)
    })
}
