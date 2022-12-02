import { signInAnonymously, getAuth } from 'firebase/auth'
import { ref, getDatabase, get, child, remove } from 'firebase/database';

// general functions for rtdb
const rtdb = require('./rtdb_functions');


// DOMS
const displayName = document.getElementById('displayname');
var lobbyname = document.getElementById('lobbyname');
const btn = document.getElementById('loginbutton');
const password = document.getElementById('password');
const inLobby = require('./inlobby')

const database = getDatabase();
const auth = getAuth();

lobbyname.addEventListener('change', () => {
    lobbyname = document.getElementById('lobbyname');
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

btn.addEventListener('click',  () => {

    if (btn.value == 'join') {
        // check if password is correct
        get(child(ref(database), lobbyname.value + '/settings')).then((snap) => {
            if (password.value == snap.val()['password']) {
                signInAnonymously(auth).then(() => {
                    rtdb.writeUser(auth, displayName, lobbyname);
                })
                inLobby.listener(lobbyname)
                inLobby.__displayLobby();
                return;
            } else {
                document.getElementById('wrongpassword').style = 'display: block';
            }
        })

    }

    if (btn.value == 'create') {
        rtdb.createLobby(lobbyname, password);

        signInAnonymously(auth).then(() => {
            rtdb.writeUser(auth, displayName, lobbyname);
        })
        inLobby.listener(lobbyname)
        inLobby.__displayLobby();
        return;
    }

});


/*
+--------------------------------------------------------+
|   focus function to password input
|   checks rtdb to see if lobbyname exists as a
|   lobby
+--------------------------------------------------------+
*/
password.addEventListener('focus', () => {
  
    get(child(ref(database), lobbyname.value)).then((snap) => {

        if (snap.exists()) {

            // checks if the lobby is apart of garbage,
            // aka if the lobby has been left behind without any users.
            get(child(ref(database), lobbyname.value + '/users')).then(async (snap2) => {
                if (await (!snap2.exists())) {
                    remove(ref(database), lobbyname.value)
                    btn.value = 'create'
                } else {
                    btn.value = 'join'
                }
            });


        } else {

            btn.value = 'create'
        }
    })
})