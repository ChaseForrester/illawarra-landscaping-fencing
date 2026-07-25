import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyALD61yWGLsmydK-reGPGREOSTER6awW48",
    authDomain: "illawarra-landscaping-fencing.firebaseapp.com",
    projectId: "illawarra-landscaping-fencing",
    storageBucket: "illawarra-landscaping-fencing.firebasestorage.app",
    messagingSenderId: "523999857031",
    appId: "1:523999857031:web:67ddddb4c51f6366e72b22"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);