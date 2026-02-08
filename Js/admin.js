import { db, storage } from "./firebase-init.js";
import {
    collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

let editor = document.getElementById("editor");

// Insert Image in editor
window.insertImage = async function () {
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async () => {
        let file = fileInput.files[0];
        if (!file) return;

        const imgRef = ref(storage, `editor_images/${Date.now()}_${file.name}`);
        await uploadBytes(imgRef, file);
        const url = await getDownloadURL(imgRef);

        // Insert where cursor is
        document.execCommand("insertImage", false, url);

        // Make image resizable
        let imgs = editor.querySelectorAll("img");
        imgs.forEach(img => {
            img.style.maxWidth = "100%";
            img.style.resize = "both";
            img.style.overflow = "auto";
        });
    };

    fileInput.click();
};

// Publish Blog Post
window.publishPost = async function () {
    const title = document.getElementById("title").value.trim();
    const content = editor.innerHTML.trim();
    const mainImage = document.getElementById("mainImage").files[0];
    const metaDesc = document.getElementById("metaDesc").value.trim();
    const keywords = document.getElementById("keywords").value.trim();
    const statusBox = document.getElementById("status");

    if (!title || !content) {
        statusBox.innerHTML = "❌ Title & Content required!";
        return;
    }

    statusBox.innerHTML = "⏳ Uploading...";

    let mainImageURL = "";

    if (mainImage) {
        const mRef = ref(storage, `blog_images/${Date.now()}_${mainImage.name}`);
        await uploadBytes(mRef, mainImage);
        mainImageURL = await getDownloadURL(mRef);
    }

    await addDoc(collection(db, "blogPosts"), {
        title,
        content,
        image: mainImageURL,
        metaDesc,
        keywords,
        createdAt: serverTimestamp()
    });

    statusBox.innerHTML = "✅ Published!";
};