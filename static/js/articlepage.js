const article_id = document.getElementById('article_id').textContent;
const checkuser = document.getElementById('checkuser').textContent;

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
const commentBtnEl = document.querySelector('.submit-comment')


// Like and dislike functionality
likeBtnEl.addEventListener('click', () => {
  if(checkuser === 'AnonymousUser'){
    window.location.href = `/login`;  
  } else {
    fetch(`/articlepage/${article_id}/`, {
      method: 'POST',
      headers:{
        'X-action': 'like'
      }
    })
    .then(response => response.json())
    .then(data => {
      likeCountEl.textContent = data.likes_count;
      dislikeCountEl.textContent = data.dislikes_count;
    })
    .catch(error => {
      console.log("Error:", error);
    });
  }
});


dislikeBtnEl.addEventListener('click', () => {
  if(checkuser === 'AnonymousUser'){
    window.location.href = `/login`;  
  } else {
    fetch(`/articlepage/${article_id}/`, {
      method: 'POST',
      headers:{
        'X-action': 'dislike'
      }
    })
    .then(response => response.json())
    .then(data => {
      likeCountEl.textContent = data.likes_count;
      dislikeCountEl.textContent = data.dislikes_count;
    })
    .catch(error => {
      console.log("Error: ", error);
    });
  }
});



// Comment functionality
commentBtnEl.addEventListener('click', ()=>{
  console.log("submit comment clicksed");
})

// Share functionality
// shareBtnEl.addEventListener('click', () => {
  // Implement share functionality (e.g., open a sharing dialog, copy the URL)
  // console.log('Share button clicked');
// });