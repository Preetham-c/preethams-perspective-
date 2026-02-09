import { db } from "./firebase-init.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadPost() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    if (!postId) {
        document.getElementById("post-title").innerText = "Post Not Found";
        return;
    }

    const docRef = doc(db, "blogPosts", postId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
        document.getElementById("post-title").innerText = "Post Not Found";
        return;
    }

    const data = snap.data();

    document.getElementById("post-title").innerText = data.title;
    document.getElementById("post-content").innerHTML = data.content;
    document.getElementById("post-image").src = data.image || "images/default.jpg";

    // SEO Fix
    document.title = `${data.title} | Preetham Perspective`;
    document.querySelector("meta[name='description']").setAttribute("content", data.metaDesc || data.title);
}

loadPost();