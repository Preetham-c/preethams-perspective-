import { db } from "./firebase-init.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadPost() {
    const slug = window.location.pathname.split("/").filter(Boolean).pop(); 

    if (!slug) {
        document.getElementById("post-title").innerText = "Post Not Found";
        return;
    }

    const q = query(collection(db, "blogPosts"), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        document.getElementById("post-title").innerText = "Post Not Found";
        return;
    }

    const data = snapshot.docs[0].data();

    document.getElementById("post-title").innerText = data.title;
    document.getElementById("post-content").innerHTML = data.content;
    document.getElementById("post-image").src = data.image || "../images/default.jpg";

    // Update SEO
    document.title = data.title + " | Preetham Perspective";
    document.querySelector("meta[name='description']").setAttribute("content", data.metaDesc || data.title);
}

loadPost();