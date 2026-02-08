import { db } from "./firebase-init.js";
import {
    collection,
    query,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadBlogs() {
    const blogContainer = document.getElementById("blog-list");

    const q = query(
        collection(db, "blogPosts"),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);

    blogContainer.innerHTML = "";

    if (snapshot.empty) {
        blogContainer.innerHTML = "<p>No articles available yet.</p>";
        return;
    }

    snapshot.forEach((doc) => {
        const data = doc.data();

        // GENERATE CLEAN URL SLUG
        const slug = data.slug || "";

        blogContainer.innerHTML += `
            <div class="blog-card">
                <img src="${data.image || 'images/default.jpg'}" class="blog-thumb">

                <h3>${data.title}</h3>

                <p>${data.metaDesc || data.content.substring(0, 150)}...</p>

                <a href="post/${slug}" class="read-more">Read More →</a>
            </div>
        `;
    });
}

loadBlogs();