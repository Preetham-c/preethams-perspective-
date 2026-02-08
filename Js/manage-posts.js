import { db } from "./firebase-init.js";
import {
    collection,
    query,
    orderBy,
    getDocs,
    doc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadPosts() {
    const container = document.getElementById("post-list");

    const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    if (snap.empty) {
        container.innerHTML = "<p>No posts available.</p>";
        return;
    }

    snap.forEach((docSnap) => {
        const data = docSnap.data();
        const id = docSnap.id;

        container.innerHTML += `
            <div class="post-card">
                <h3>${data.title}</h3>
                <p><b>Slug:</b> ${data.slug}</p>

                <div class="btn-row">
                    <button class="edit-btn" onclick="editPost('${id}')">Edit</button>
                    <button class="delete-btn" onclick="deletePost('${id}')">Delete</button>
                </div>
            </div>
        `;
    });
}

window.editPost = function (id) {
    window.location.href = `admin.html?edit=${id}`;
};

window.deletePost = async function (id) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    await deleteDoc(doc(db, "blogPosts", id));

    alert("Deleted Successfully!");
    location.reload();
};

loadPosts();