const form = document.getElementById("commentForm");
const commentList = document.getElementById("commentList");

let comments = JSON.parse(localStorage.getItem("comments")) || [];

// Render comments
function renderComments() {
  commentList.innerHTML = "";

  comments.forEach((c, index) => {
    const div = document.createElement("div");
    div.className = "comment-box";

    div.innerHTML = `
      <strong>${c.name}</strong>
      <p>${c.text}</p>

      <div class="comment-actions">
        <button onclick="likeComment(${index})">👍 ${c.likes}</button>
        <button onclick="dislikeComment(${index})">👎 ${c.dislikes}</button>
      </div>
    `;

    commentList.appendChild(div);
  });

  localStorage.setItem("comments", JSON.stringify(comments));
}

// Add comment
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const text = document.getElementById("comment").value;

  comments.push({
    name,
    text,
    likes: 0,
    dislikes: 0
  });

  form.reset();
  renderComments();
});

// Like
function likeComment(index) {
  comments[index].likes++;
  renderComments();
}

// Dislike
function dislikeComment(index) {
  comments[index].dislikes++;
  renderComments();
}

// Initial render
renderComments();