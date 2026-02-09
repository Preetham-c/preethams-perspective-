import { db, storage } from "./firebase-init.js";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

let editor = document.getElementById("editor");

/* --------------------------------
   1️⃣ AUTO SLUG GENERATOR
-----------------------------------*/
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .trim();
}
window.generateSlug = generateSlug;

/* --------------------------------
   2️⃣ IMAGE COMPRESSION
-----------------------------------*/
async function compressImage(file) {
    return new Promise((resolve) => {
        const img = document.createElement("img");
        const canvas = document.createElement("canvas");
        const reader = new FileReader();

        reader.onload = (e) => (img.src = e.target.result);
        reader.readAsDataURL(file);

        img.onload = () => {
            const MAX_WIDTH = 1200;
            const scale = MAX_WIDTH / img.width;

            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
                (blob) => resolve(blob),
                "image/jpeg",
                0.8
            );
        };
    });
}

/* --------------------------------
   3️⃣ INSERT IMAGE INTO EDITOR (FIXED)
-----------------------------------*/
window.insertImage = async function () {
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async () => {
        let file = fileInput.files[0];
        if (!file) return;

        // Compress image
        let compressed = await compressImage(file);

        // Upload to Firebase
        const imgRef = ref(storage, `editor_images/${Date.now()}_${file.name}`);
        await uploadBytes(imgRef, compressed);
        const url = await getDownloadURL(imgRef);

        // Ensure cursor focus
        editor.focus();

        // Insert image into the editor where cursor is
        document.execCommand(
            "insertHTML",
            false,
            `<img src="${url}" style="max-width:100%; border-radius:6px; margin:10px 0;">`
        );
    };

    fileInput.click();
};

/* --------------------------------
   4️⃣ SAVE OR UPDATE BLOG POST
-----------------------------------*/
window.publishPost = async function () {
    const title = document.getElementById("title").value.trim();
    const metaDesc = document.getElementById("metaDesc").value.trim();
    const keywords = document.getElementById("keywords").value.trim();
    const slug = generateSlug(title);
    const content = editor.innerHTML.trim();
    const mainImageFile = document.getElementById("mainImage").files[0];
    const statusBox = document.getElementById("status");

    if (!title || !content) {
        statusBox.innerHTML = "❌ Title & Content required!";
        return;
    }

    statusBox.innerHTML = "⏳ Uploading blog...";

    let imageURL = "";
    if (mainImageFile) {
        const compressedMain = await compressImage(mainImageFile);
        const imageRef = ref(storage, `blog_images/${Date.now()}_${mainImageFile.name}`);
        await uploadBytes(imageRef, compressedMain);
        imageURL = await getDownloadURL(imageRef);
    }

    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");

    if (editId) {
        // UPDATE EXISTING POST
        const docRef = doc(db, "blogPosts", editId);

        await updateDoc(docRef, {
            title,
            metaDesc,
            keywords,
            content,
            slug,
            image: imageURL || undefined,
            updatedAt: serverTimestamp()
        });

        statusBox.innerHTML = "✅ Updated Successfully!";
    } else {
        // CREATE NEW POST
        await addDoc(collection(db, "blogPosts"), {
            title,
            metaDesc,
            keywords,
            content,
            slug,
            image: imageURL,
            createdAt: serverTimestamp()
        });

        statusBox.innerHTML = "✅ Published Successfully!";
    }

    // Reset form
    document.getElementById("title").value = "";
    editor.innerHTML = "";
    document.getElementById("mainImage").value = "";
};

/* --------------------------------
   5️⃣ LOAD BLOG FOR EDIT MODE
-----------------------------------*/
window.loadEditPost = async function () {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");
    if (!editId) return;

    const docRef = doc(db, "blogPosts", editId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return;

    const data = snap.data();

    document.getElementById("title").value = data.title;
    document.getElementById("metaDesc").value = data.metaDesc || "";
    document.getElementById("keywords").value = data.keywords || "";
    editor.innerHTML = data.content || "";

    document.querySelector("h2").textContent = "Edit Blog Post";
    document.querySelector(".publishBtn").textContent = "Update Post";
};

/* --------------------------------
   6️⃣ DELETE POST
-----------------------------------*/
window.deletePost = async function (id) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    await deleteDoc(doc(db, "blogPosts", id));
    alert("Deleted Successfully!");
    location.reload();
};

/* --------------------------------
   7️⃣ AUTO-SAVE DRAFT EVERY 5 SEC
-----------------------------------*/
setInterval(() => {
    localStorage.setItem("draft_title", document.getElementById("title").value);
    localStorage.setItem("draft_content", editor.innerHTML);
    localStorage.setItem("draft_meta", document.getElementById("metaDesc").value);
}, 5000);

// Restore draft on page load
window.onload = () => {
    if (localStorage.getItem("draft_title")) {
        document.getElementById("title").value = localStorage.getItem("draft_title");
    }
    if (localStorage.getItem("draft_content")) {
        editor.innerHTML = localStorage.getItem("draft_content");
    }
    if (localStorage.getItem("draft_meta")) {
        document.getElementById("metaDesc").value = localStorage.getItem("draft_meta");
    }

    loadEditPost();
};