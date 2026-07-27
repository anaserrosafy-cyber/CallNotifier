import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCFUl7qquf1JHF5z7wYo1Me4KveDEORCC4",
    authDomain: "callnotifier-7e7ea.firebaseapp.com",
    databaseURL: "https://callnotifier-7e7ea-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "callnotifier-7e7ea",
    storageBucket: "callnotifier-7e7ea.firebasestorage.app",
    messagingSenderId: "165647390009",
    appId: "1:165647390009:web:b4751828e2f76a570544e8"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export { ref, onValue };
