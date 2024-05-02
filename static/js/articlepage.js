const article_id = document.getElementById('article_id').textContent;
// Get the like button and counter
const likeBtnEl = document.querySelector('.like-btn');
const likeCountEl = document.querySelector('.like-count');

// Get the dislike button and counter
const dislikeBtnEl = document.querySelector('.dislike-btn');
const dislikeCountEl = document.querySelector('.dislike-count');

// Get the comment section elements
const commentFormEl = document.querySelector('.comment-form');
const commentTextareaEl = commentFormEl.querySelector('textarea');
const commentsListEl = document.querySelector('.comments-list');

// Get the share button
const shareBtnEl = document.querySelector('.share-btn');

// Like functionality
let likeCount = likeCountEl.textContent; // Declare likeCount variable
let isLiked = false;

likeBtnEl.addEventListener('click', () => {
  if (!isLiked) {
    likeCount++;
    likeCountEl.textContent = likeCount;
    likeBtnEl.classList.add('active');
    isLiked = true;
  } else {
    likeCount--;
    likeCountEl.textContent = likeCount;
    likeBtnEl.classList.remove('active');
    isLiked = false;
  }
  const formData = new FormData();
  formData.append("likecount",likeCount);
  fetch(`/articlepage/${article_id}/`,{
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data =>{
    console.log("Message from django",data.Success);
  })
  .catch(error=>{
    console.log("Error: ",error);
  })
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