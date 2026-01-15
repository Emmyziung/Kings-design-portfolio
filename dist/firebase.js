import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

        const firebaseConfig = {
            apiKey: "AIzaSyBpmhtLdaoteX-7aV0m_1kMvuMTWuex-E4",
            authDomain: "kingsdesignn.firebaseapp.com",
            projectId: "kingsdesignn",
            storageBucket: "kingsdesignn.firebasestorage.app",
            messagingSenderId: "767602534908",
            appId: "1:767602534908:web:41cd5615909a3d0e5a2a79",
            measurementId: "G-EBD0V8S97L"
        };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
 const db = getFirestore(app);

export { db, auth, onAuthStateChanged , signInWithEmailAndPassword, signOut};