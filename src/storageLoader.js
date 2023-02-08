import { getStorage, ref } from "firebase/storage";

const storage = getStorage();

export function loadImage(icon){
    return ref(storage, icon);
}