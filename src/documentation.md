# Documentation Page

## index.js

Sets up firebase, its config and a few other stuff
Contains firebase cloud function init and window.onunload() function
Runs prelobby and geolocation_getter scripts

## prelobby.js

Almost everything to do with the pre lobby page
Sets up the password and button functionality

##
## rtdb_function.js
##

Important script that allows us to call to the real time database
Here are the functions that it contains

# getSettingValue('<setting name>', <lobby>) returns snapshot.val()['setting'], which is the value of that setting

# getAllSettings(<lobby>) returns snapshot.val(), allowing user to check each setting or have them all print out

# writeUser(auth, <display_name>, <lobby>), sets up a new user in <lobby>

# createLobby(<lobby>, <password>), creates a new lobby


## inlobby.js

A lot of the functions in this script, are once of scripts and will not be needed for other usages
Read comments in script to understand what each function does.

## geolocation_getter.js

Responsible for the google maps. Inits the map and loads it to the user


# print all game settings

const rtdb = require("./rtdb_functions");
const snapshot = rtdb.getSettingValue(lobbyname);
snapshot.forEach(setting => {
    console.log(setting)
});

