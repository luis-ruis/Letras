import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAuB8ITbJCMWqZ9D3xAYeI1MAFgfp2pL9k",
    authDomain: "fir-crud-ea9f5.firebaseapp.com",
    projectId: "fir-crud-ea9f5",
    storageBucket: "fir-crud-ea9f5.appspot.com",
    messagingSenderId: "96715788231",
    appId: "1:96715788231:web:7ccc6de351392ac05f13e2"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const getTask = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'songs'));
        const songs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title || "",
            artist: doc.data().artist || "",
            tone: doc.data().tone || "",
            bpm: doc.data().bpm || "",
            description: doc.data().description || "",
            lyrics: doc.data().lyrics || "",
            spotify: doc.data().spotify || "",
            youtube: doc.data().youtube || ""
        }));

        return songs; // Retorna directamente el array procesado
    } catch (error) {
        console.error("Error al obtener los documentos:", error);
    }
};

export const saveSong = async (title, artist, tone, bpm, description, lyrics, spotify, youtube) => {
    try {
        await addDoc(collection(db, 'songs'), {
            title: title || "",
            artist: artist || "",
            tone: tone || "",
            bpm: bpm || "",
            description: description || "",
            lyrics: lyrics || "",
            spotify: spotify || "",
            youtube: youtube || ""
        });
        console.log("Canción agregada exitosamente");
    } catch (error) {
        console.error("Error al agregar la canción:", error);
    }
};


export const saveTask = (title, description) => {
    addDoc(collection(db, 'songs'), {title:'lyrics', description:'description'});
}

export const deleteTask = (id) => deleteDoc(doc(db, 'tasks'), id);