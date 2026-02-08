import { db } from "./firebase-init.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadPosts() {
    const container = document.getElementById("manage-list");
    const snapshot = await getDocs(collection(db, "blogPosts"));

    container.innerHTML = "";

    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const id = docSnap.id;

        container.innerHTML += `
            <div class="post-card">
                <h3>${data.title}</h3>
                
                <button onclick="editPost('${id}')">✏ Edit</button>
                <button onclick="deletePost('${id}')">🗑 Delete</button>
            </div>
        `;
    });
}

window.deletePost = async function(id) {
    if (confirm("Are you sure you want to delete this post?")) {
        await deleteDoc(doc(db, "blogPosts", id));
        alert("Deleted!");
        loadPosts();
    }
};

window.editPost = function(id) {
    window.location.href = `admin.html?edit=${id}`;
};

loadPosts();