import { db } from "./firebase-init.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadPost() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    if (!postId) {
        document.getElementById("post-container").innerHTML = "<h2>Post not found.</h2>";
        return;
    }

    const docRef = doc(db, "blogPosts", postId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        document.getElementById("post-container").innerHTML = "<h2>Post not found.</h2>";
        return;
    }

    const data = docSnap.data();

    document.getElementById("post-title").textContent = data.title;
    document.getElementById("post-content").innerHTML = data.content.replace(/\n/g, "<br>");
    document.getElementById("post-image").src = data.image || "images/default.jpg";
}

loadPost();
