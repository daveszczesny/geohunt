# Documentation Page


# print all game settings

const rtdb = require("./rtdb_functions");
const snapshot = rtdb.getSettingValue(lobbyname)

//    code to print out all available settings
    get(child(ref(database), lobbyname.value + "/settings/gameSettings/")).then((snapshot) => {

        Object.keys(snapshot.val()).forEach(setting =>{
            console.log(setting)
        })

    })