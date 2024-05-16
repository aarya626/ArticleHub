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
const commentBtnEl = document.querySelector('.submit-comment')

// Like and dislike functionality
likeBtnEl.addEventListener('click', () => {
  if (checkuser === 'AnonymousUser') {
    window.location.href = `/login`;
  } else {
    fetch(`/articlepage/${article_id}/`, {
      method: 'POST',
      headers: {
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
  if (checkuser === 'AnonymousUser') {
    window.location.href = `/login`;
  } else {
    fetch(`/articlepage/${article_id}/`, {
      method: 'POST',
      headers: {
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
commentBtnEl.addEventListener('click', () => {
  const comment = commentFormEl.querySelector('textarea').value;
  if (comment == '') {
    document.getElementById('emptyerror').innerHTML = '<p>Please enter a message.</p>'
    return;
  }
  const commentdata = new FormData();
  commentdata.append('comment', comment);
  fetch(`/articlepage/${article_id}/`, {
    method: 'POST',
    headers: {
      'X-action': 'comment'
    },
    body: commentdata
  })
    .then(response => response.json())
    .then(data => {
      commentFormEl.querySelector('textarea').value = '';
      document.getElementById('newcomment').innerHTML = `<div class="comment">
    <img src="${data.profile}" class="comment-avatar">
    <div class="comment-details">
      <h3 class="comment-author">${data.username}</h3>
      <p class="comment-timestamp">${data.timesince}</p>
      <p class="comment-content">${comment}</p>
    </div>
  </div>`
    })
    .catch(error => {
      console.log("Error: ", error);
    });
})
const playButton = document.getElementById('speaker');
const articleContent = document.getElementById('articlecontent');
let speechSynthesis = window.speechSynthesis;
let speechUtterance = new SpeechSynthesisUtterance();

playButton.addEventListener('click', () => {
  let content = articleContent.textContent;
  if (content) {
    speechUtterance.text = content;
    speechSynthesis.speak(speechUtterance);
  }
});

// Share functionality
// shareBtnEl.addEventListener('click', () => {
// Implement share functionality (e.g., open a sharing dialog, copy the URL)
// console.log('Share button clicked');
// });

function googleTranslator() {
  new google.translate.TranslateElement("google_translate");
}


const shareBtn = document.querySelector('.share-btn');
const shareDiv = document.querySelector('.share-div');

shareBtn.addEventListener('click', toggleShareDiv);

function toggleShareDiv() {
  if (shareDiv.style.visibility === 'hidden') {
    shareDiv.style.visibility = 'visible';
    document.addEventListener('click', hideShareDivOutside);
  } else {
    shareDiv.style.visibility = 'hidden';
    document.removeEventListener('click', hideShareDivOutside);
  }
}

function hideShareDivOutside(event) {
  const isClickInsideShareDiv = shareDiv.contains(event.target);
  const isClickInsideShareBtn = shareBtn.contains(event.target);

  if (!isClickInsideShareDiv && !isClickInsideShareBtn) {
    shareDiv.style.visibility = 'hidden';
    document.removeEventListener('click', hideShareDivOutside);
  }
}

document.getElementById("copy-url-btn").addEventListener("click", function() {
  var urlField = document.getElementById("url-field");
  urlField.select();
  document.execCommand("copy");

  // Create a new popup element
  var popup = document.createElement("div");
  popup.className = "popup";
  popup.textContent = "URL copied to clipboard";

  // Append the popup to the document body
  document.body.appendChild(popup);

  // Remove the popup after 3 seconds
  setTimeout(function() {
    popup.remove();
  },500);
});