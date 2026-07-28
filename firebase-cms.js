/**
 * Optional ESM CMS loader. Fails quietly if modules are blocked (e.g. file://)
 * or Firestore rules deny public reads — static HTML content remains.
 */
import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

async function loadCms() {
    try {
        const docSnap = await getDoc(doc(db, 'cms', 'homepage'));
        if (!docSnap.exists()) return;
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
            const phoneEl2 = document.getElementById('dynPhoneNumber2');
            if (phoneEl2) phoneEl2.textContent = data.phoneNumber;
        }
    } catch (e) {
        // Non-fatal — page renders with static markup
        console.warn('CMS content not loaded:', e && e.message ? e.message : e);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCms);
} else {
    loadCms();
}
