import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const docRef = doc(db, "cms", "homepage");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            if (data.heroTitle) {
                const titleEl = document.getElementById('dynHeroTitle');
                if (titleEl) titleEl.innerHTML = data.heroTitle;
            }
            if (data.heroSubtitle) {
                const subEl = document.getElementById('dynHeroSubtitle');
                if (subEl) subEl.innerHTML = data.heroSubtitle;
            }
            if (data.phoneNumber) {
                const phoneEl = document.getElementById('dynPhoneNumber');
                if (phoneEl) phoneEl.textContent = data.phoneNumber;
            }
        }
    } catch (e) {
        console.error("Error loading CMS content", e);
    }
});
