import { db } from "./firebase-init.js";
import { collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadBlogs() {
    const blogContainer = document.getElementById("blog-list");

    const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    blogContainer.innerHTML = ""; // clear existing content

    snapshot.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;

        blogContainer.innerHTML += `
            <div class="blog-card">
                <img src="${data.image || 'images/default.jpg'}" style="width:100%; border-radius:5px;">
                <h3>${data.title}</h3>
                <p>${data.content.substring(0, 150)}...</p>
                <a href="post.html?id=${id}" class="read-more">Read More</a>
                <hr>
            </div>
        `;
    });
}

loadBlogs();
