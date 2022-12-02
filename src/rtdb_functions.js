// read game function


import {get, child, ref, getDatabase} from "firebase/database";


export function getSettingValue(setting, lobbyname){
    get(child(ref(getDatabase()), lobbyname.value + "/settings/gameSettings/")).then((snapshot) => {
        return snapshot.val()[setting];
    });
}