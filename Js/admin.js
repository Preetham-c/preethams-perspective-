import { db, storage } from "./firebase-init.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Function to publish blog post
async function publishPost() {
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const imageFile = document.getElementById("image").files[0];
    const statusBox = document.getElementById("status");

    if (!title || !content) {
        statusBox.innerHTML = "❌ Please enter title and content!";
        return;
    }

    statusBox.innerHTML = "⏳ Uploading...";

    let imageURL = "";

    try {
        // If image exists, upload to Firebase Storage
        if (imageFile) {
            const imageRef = ref(storage, `blog_images/${Date.now()}_${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            imageURL = await getDownloadURL(imageRef);
        }

        // Save post to Firestore
        await addDoc(collection(db, "blogPosts"), {
            title: title,
            content: content,
            image: imageURL,
            createdAt: serverTimestamp()
        });

        statusBox.innerHTML = "✅ Blog Published Successfully!";

        // Clear fields
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";
        document.getElementById("image").value = "";

    } catch (error) {
        statusBox.innerHTML = "❌ Error: " + error.message;
        console.error(error);
    }
}

window.publishPost = publishPost;
