import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB3fz7xBS8Dg9JL7fUvSH1xgt1r82JEJZs",
    authDomain: "matomediatzz.firebaseapp.com",
    projectId: "matomediatzz",
    storageBucket: "matomediatzz.firebasestorage.app",
    messagingSenderId: "880502247416",
    appId: "1:880502247416:web:4f6b9474488b6726d1d00d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const isDashboard = window.location.pathname.includes("dashboard.html");

// --------------------------------------------------------------
// INDEX PAGE (fullscreen slideshow + auth card)
// --------------------------------------------------------------
if (!isDashboard) {
    const loginView = document.getElementById("login-view");
    const signupView = document.getElementById("signup-view");
    const showSignupLink = document.getElementById("show-signup");
    const showLoginLink = document.getElementById("show-login");

    if (showSignupLink) {
        showSignupLink.addEventListener("click", (e) => {
            e.preventDefault();
            loginView.style.display = "none";
            signupView.style.display = "block";
        });
    }
    if (showLoginLink) {
        showLoginLink.addEventListener("click", (e) => {
            e.preventDefault();
            signupView.style.display = "none";
            loginView.style.display = "block";
        });
    }

    // Login
    const loginBtn = document.getElementById("login-btn");
    const loginEmail = document.getElementById("login-email");
    const loginPassword = document.getElementById("login-password");
    const loginError = document.getElementById("login-error");
    if (loginBtn) {
        loginBtn.addEventListener("click", async () => {
            try {
                await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
                window.location.href = "dashboard.html";
            } catch (err) {
                loginError.innerText = err.message;
            }
        });
    }

    // Signup
    const signupBtn = document.getElementById("signup-btn");
    const signupEmail = document.getElementById("signup-email");
    const signupPassword = document.getElementById("signup-password");
    const signupError = document.getElementById("signup-error");
    if (signupBtn) {
        signupBtn.addEventListener("click", async () => {
            if (signupPassword.value.length < 6) {
                signupError.innerText = "Password must be at least 6 characters.";
                return;
            }
            try {
                await createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value);
                window.location.href = "dashboard.html";
            } catch (err) {
                signupError.innerText = err.message;
            }
        });
    }

    // Google (both views)
    const googleLoginBtn = document.getElementById("google-login-btn");
    const googleSignupBtn = document.getElementById("google-signup-btn");
    const googleAuth = async () => {
        try {
            await signInWithPopup(auth, provider);
            window.location.href = "dashboard.html";
        } catch (err) {
            if (loginError) loginError.innerText = err.message;
            if (signupError) signupError.innerText = err.message;
        }
    };
    if (googleLoginBtn) googleLoginBtn.addEventListener("click", googleAuth);
    if (googleSignupBtn) googleSignupBtn.addEventListener("click", googleAuth);
}

// --------------------------------------------------------------
// DASHBOARD PAGE (same as before – keep unchanged)
// --------------------------------------------------------------
if (isDashboard) {
    const userNameSpan = document.getElementById("user-name");
    const logoutBtn = document.getElementById("logout-btn");
    const servicesGrid = document.getElementById("services-grid");
    const requestsListDiv = document.getElementById("requests-list");

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = "index.html";
            return;
        }
        const displayName = user.displayName || user.email.split('@')[0];
        if (userNameSpan) userNameSpan.innerText = `Karibu, ${displayName}`;

        const services = [
            { icon: "fa-music", name: "Usambazaji wa Muziki", desc: "Boomplay, Spotify, Audiomack na majukwaa yote." },
            { icon: "fa-chart-line", name: "Social Media Growth", desc: "Ongeza followers, likes, views & streams." },
            { icon: "fa-user-lock", name: "Account Recovery", desc: "Rudisha akaunti iliyofungiwa au kuibiwa." },
            { icon: "fa-check-circle", name: "Blue Tick Verification", desc: "Instagram, TikTok, YouTube, Facebook." },
            { icon: "fa-globe", name: "Website & Blog", desc: "Tengeneza tovuti ya kitaalamu." },
            { icon: "fa-graduation-cap", name: "Elimu ya Mitandao", desc: "Jifunze kupata kipato mtandaoni." }
        ];

        servicesGrid.innerHTML = "";
        services.forEach(s => {
            const card = document.createElement("div");
            card.className = "service-card";
            card.innerHTML = `
                <div class="service-icon"><i class="fas ${s.icon}"></i></div>
                <h3>${s.name}</h3>
                <p>${s.desc}</p>
                <button class="service-btn" data-service="${s.name}">Omba Sasa</button>
            `;
            servicesGrid.appendChild(card);
        });

        const btns = document.querySelectorAll(".service-btn");
        btns.forEach(btn => {
            btn.addEventListener("click", async () => {
                const serviceName = btn.getAttribute("data-service");
                const phone = "255719558569";
                const message = `Huduma: ${serviceName}. Nimeomba kupitia website ya MATO MEDIA TZ.`;
                const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                window.open(url, "_blank");

                try {
                    await addDoc(collection(db, "requests"), {
                        userId: user.uid,
                        userEmail: user.email,
                        service: serviceName,
                        timestamp: new Date(),
                        status: "pending"
                    });
                    loadUserRequests(user.uid);
                } catch (e) {
                    console.warn("Firestore error:", e);
                }
            });
        });

        async function loadUserRequests(uid) {
            try {
                const q = query(collection(db, "requests"), where("userId", "==", uid), orderBy("timestamp", "desc"));
                const snapshot = await getDocs(q);
                if (snapshot.empty) {
                    requestsListDiv.innerHTML = "Hakuna maombi bado.";
                    return;
                }
                let html = "<ul>";
                snapshot.forEach(doc => {
                    const data = doc.data();
                    html += `<li><strong>${data.service}</strong> - ${data.timestamp?.toDate().toLocaleString() || "sasa hivi"} (${data.status})</li>`;
                });
                html += "</ul>";
                requestsListDiv.innerHTML = html;
            } catch (err) {
                requestsListDiv.innerHTML = "Haiwezi kuleta historia kwa sasa.";
            }
        }
        loadUserRequests(user.uid);
    });

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            await signOut(auth);
            window.location.href = "index.html";
        });
    }
}