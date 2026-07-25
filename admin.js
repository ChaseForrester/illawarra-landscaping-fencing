import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const loginSection = document.getElementById('login-section');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const cmsForm = document.getElementById('cms-form');

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.style.display = 'none';
        dashboard.style.display = 'block';
        loadCMSData();
    } else {
        loginSection.style.display = 'block';
        dashboard.style.display = 'none';
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        document.getElementById('login-error').innerText = "Invalid credentials";
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// Load CMS Data
async function loadCMSData() {
    const docRef = doc(db, "cms", "homepage");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('heroTitle').value = data.heroTitle || "";
        document.getElementById('heroSubtitle').value = data.heroSubtitle || "";
        document.getElementById('phoneNumber').value = data.phoneNumber || "";
    }
}

// Save CMS Data
cmsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = cmsForm.querySelector('button');
    btn.innerText = "Saving...";
    const data = {
        heroTitle: document.getElementById('heroTitle').value,
        heroSubtitle: document.getElementById('heroSubtitle').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        updatedAt: new Date()
    };
    try {
        await setDoc(doc(db, "cms", "homepage"), data, { merge: true });
        document.getElementById('save-status').innerText = "Changes saved successfully!";
        setTimeout(() => document.getElementById('save-status').innerText = "", 3000);
    } catch (error) {
        document.getElementById('save-status').innerText = "Error saving changes. Check permissions.";
        document.getElementById('save-status').style.color = "red";
    }
    btn.innerText = "Save Changes";
});