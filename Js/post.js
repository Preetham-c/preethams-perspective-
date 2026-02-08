import { db } from "./firebase-init.js";
import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadPost() {
    const path = window.location.pathname;
    const slug = path.split("/post/")[1]?.replace(".html", "");

    if (!slug) {
        document.getElementById("post-container").innerHTML = "<h2>Post not found.</h2>";
        return;
    }

    // Fetch blog post using slug
    const q = query(
        collection(db, "blogPosts"),
        where("slug", "==", slug)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
        document.getElementById("post-container").innerHTML = "<h2>Post not found.</h2>";
        return;
    }

    const data = snap.docs[0].data();

    // Update content
    document.getElementById("post-title").textContent = data.title;
    document.getElementById("post-content").innerHTML = data.content;
    document.getElementById("post-image").src = data.image || "images/default.jpg";

    // SEO Updates
    document.title = data.title + " | Preetham's Perspective";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = data.metaDesc || "";

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.content = data.keywords || "";
}

loadPost();