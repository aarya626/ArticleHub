// Get the like/dislike buttons and counters
const likeBtnEl = document.querySelector('.like-btn');
const dislikeBtnEl = document.querySelector('.dislike-btn');
const likeCountEl = document.querySelector('.like-count');
const dislikeCountEl = document.querySelector('.dislike-count');

// Get the comment section elements
const commentFormEl = document.querySelector('.comment-form');
const commentTextareaEl = commentFormEl.querySelector('textarea');
const commentsListEl = document.querySelector('.comments-list');

// Get the share button
const shareBtnEl = document.querySelector('.share-btn');

// Like/Dislike functionality
let likeCount = 0;
let dislikeCount = 0;

likeBtnEl.addEventListener('click', () => {
  likeCount++;
  likeCountEl.textContent = likeCount;
  likeBtnEl.classList.add('active');
  dislikeBtnEl.classList.remove('active');
});

dislikeBtnEl.addEventListener('click', () => {
  dislikeCount++;
  dislikeCountEl.textContent = dislikeCount;
  dislikeBtnEl.classList.add('active');
  likeBtnEl.classList.remove('active');
});

// Comment functionality
commentFormEl.addEventListener('submit', (event) => {
  event.preventDefault();
  const commentText = commentTextareaEl.value.trim();
  if (commentText) {
    const commentEl = document.createElement('li');
    commentEl.textContent = commentText;
    commentsListEl.appendChild(commentEl);
    commentTextareaEl.value = '';
  }
});

// Share functionality
shareBtnEl.addEventListener('click', () => {
  // Implement share functionality (e.g., open a sharing dialog, copy the URL)
  console.log('Share button clicked');
});
// Get the comment section elements
// const commentFormEl = document.querySelector('.comment-form');
// const commentTextareaEl = commentFormEl.querySelector('textarea');
// const commentsListEl = document.querySelector('.comments-list');

// Get all the reply buttons
const replyBtns = document.querySelectorAll('.reply-comment');

// Add event listeners to the reply buttons
replyBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    const commentEl = event.target.closest('.comment');
    const replyFormEl = document.createElement('div');
    replyFormEl.classList.add('reply-form');
    replyFormEl.innerHTML = `
      <textarea placeholder="Add a reply..."></textarea>
      <button class="submit-reply">Submit</button>
    `;
    commentEl.appendChild(replyFormEl);

    // Add event listener to the submit reply button
    const submitReplyBtn = replyFormEl.querySelector('.submit-reply');
    submitReplyBtn.addEventListener('click', () => {
      const replyText = replyFormEl.querySelector('textarea').value.trim();
      if (replyText) {
        const replyEl = document.createElement('div');
        replyEl.classList.add('reply');
        replyEl.innerHTML = `
          <img src="user-avatar-3.jpg" alt="User Avatar" class="reply-avatar">
          <div class="reply-details">
            <h4 class="reply-author">Jane Doe</h4>
            <p class="reply-content">${replyText}</p>
          </div>
        `;
        commentEl.appendChild(replyEl);
        replyFormEl.remove();
      }
    });
  });
});

// Comment submission functionality (unchanged)
commentFormEl.addEventListener('submit', (event) => {
  event.preventDefault();
  const commentText = commentTextareaEl.value.trim();
  if (commentText) {
    const commentEl = document.createElement('div');
    commentEl.classList.add('comment');
    commentEl.innerHTML = `
      <img src="user-avatar-1.jpg" alt="User Avatar" class="comment-avatar">
      <div class="comment-details">
        <h3 class="comment-author">John Doe</h3>
        <p class="comment-timestamp">2 hours ago</p>
        <p class="comment-content">${commentText}</p>
        <div class="comment-actions">
          <button class="like-comment">
            <i class="fas fa-thumbs-up"></i>
            <span class="like-count">0</span>
          </button>
          <button class="dislike-comment">
            <i class="fas fa-thumbs-down"></i>
            <span class="dislike-count">0</span>
          </button>
          <button class="reply-comment">Reply</button>
        </div>
      </div>
    `;
    commentsListEl.appendChild(commentEl);
    commentTextareaEl.value = '';
  }
});