import { db, storage } from "./firebase-init.js";
import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";


async function publishPost() {
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("editor").innerHTML;  // Important: Rich text HTML
    const imageFile = document.getElementById("image").files[0];
    const statusBox = document.getElementById("status");

    if (!title || !content.trim()) {
        statusBox.innerHTML = "❌ Please enter title and content!";
        return;
    }

    statusBox.innerHTML = "⏳ Uploading…";

    let imageURL = "";

    try {
        // Upload image if selected
        if (imageFile) {
            const imageRef = ref(storage, `blog_images/${Date.now()}_${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            imageURL = await getDownloadURL(imageRef);
        }

        // Save to Firestore
        await addDoc(collection(db, "blogPosts"), {
            title: title,
            content: content,   // Rich text HTML stored
            image: imageURL,
            createdAt: serverTimestamp(),
        });

        statusBox.innerHTML = "✅ Blog Published Successfully!";

        // Clear fields
        document.getElementById("title").value = "";
        document.getElementById("editor").innerHTML = "";
        document.getElementById("image").value = "";

    } catch (error) {
        statusBox.innerHTML = "❌ Error: " + error.message;
        console.error(error);
    }
}

window.publishPost = publishPost;