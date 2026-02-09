import { db } from "./firebase-init.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadPost() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");  // Read the ID from URL

    if (!postId) {
        document.getElementById("post-container").innerHTML = "<h2>Post not found.</h2>";
        return;
    }

    // Fetch post using the ID
    const docRef = doc(db, "blogPosts", postId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        document.getElementById("post-container").innerHTML = "<h2>Post not found.</h2>";
        return;
    }

    const data = docSnap.data();

    // Fill page content
    document.getElementById("post-title").textContent = data.title;
    document.getElementById("post-image").src = data.image || "images/default.jpg";
    document.getElementById("post-content").innerHTML = data.content;
}

loadPost();