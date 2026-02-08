import { auth } from "./firebase-init.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const status = document.getElementById("status");

    status.innerHTML = "⏳ Logging in...";

    try {
        await signInWithEmailAndPassword(auth, email, password);

        status.innerHTML = "✅ Login successful!";
        window.location.href = "admin.html";
    } 
    catch (error) {
        status.innerHTML = "❌ " + error.message;
    }
}

window.login = login;
