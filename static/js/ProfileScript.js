function selectProfilePic() {
  document.getElementById('profile-pic-input').click();
  document.getElementById('profile-pic-input').addEventListener('change', function (event) {
    const file = event.target.files[0]; // Get the selected file
    const reader = new FileReader();

    reader.onload = function () {
      const imageDataUrl = reader.result;

      const profilePicPreview = document.querySelector('.profile-pic');
      profilePicPreview.src = imageDataUrl;

    };

    reader.readAsDataURL(file);
    const formdata = new FormData();
    formdata.append('pfp', file);

    fetch(`/profile/${username}/`, {
      method: 'POST',
      headers: {
        'X-action': 'updatepfp'
      },
      body: formdata
    })
      .then(response => response.json())
      .then(data => {
        console.log("success");
      })
      .catch(error => {
        console.log('ERROR: ', error);
      });
  });
}

const tabLinks = document.querySelectorAll('.nav-tabs a');
const tabContents = document.querySelectorAll('.tab-content');

tabLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    tabLinks.forEach(link => link.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    const targetTab = e.currentTarget.dataset.tab;
    e.currentTarget.classList.add('active');
    document.getElementById(targetTab).classList.add('active');
  });
});
const followBtn = document.getElementById('followBtn');
const username = document.getElementById('profileusername').textContent;
const followers = document.querySelector('.follow').textContent;
const following = document.querySelector('.following').textContent;
// console.log(followers,following);
let isFollowing = false
if (followBtn) {
  followBtn.addEventListener('click', function () {
    fetch(`/profile/${username}/`, {
      method: 'POST',
      headers:{
        'X-action': 'follow'
      }
    })
      .then(Response => Response.json())
      .then(data => {
        console.log(data.isFollowing);
        if (!data.isFollowing) {
          followBtn.textContent = 'Follow';
          followBtn.classList.remove('following');
          document.querySelector('.follow').textContent = data.followers;
          document.querySelector('.following').textContent = data.following;

        } else {
          followBtn.textContent = 'Unfollow';
          followBtn.classList.add('following');
          document.querySelector('.follow').textContent = data.followers;
          document.querySelector('.following').textContent = data.following;
        }
      })
      .catch(error => {
        console.log("error");
      })
  });
}


function deletearticle(event, article_id) {
  event.preventDefault();

  const card = document.querySelector(`[data-article="${article_id}"]`);

  const confirmModal = document.createElement('div');
  confirmModal.classList.add('confirm-modal');
  confirmModal.innerHTML = `
    <div class="confirm-modal-content">
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this article?</p>
      <div class="confirm-modal-buttons">
        <button id="confirmDeleteBtn">Yes, Delete</button>
        <button id="cancelDeleteBtn">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(confirmModal);

  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  confirmDeleteBtn.addEventListener('click', () => {
    card.parentNode.removeChild(card);

    const formdata = new FormData();
    formdata.append('articleId', article_id);

    fetch(`/profile/${username}/`, {
      method: 'POST',
      headers: {
        'X-action': 'deletearticle'
      },
      body: formdata
    })
      .then(response => response.json())
      .then(data => {
        console.log("success");
      })
      .catch(error => {
        console.log('ERROR: ', error);
      });

    document.body.removeChild(confirmModal);
  });

  cancelDeleteBtn.addEventListener('click', () => {
    document.body.removeChild(confirmModal);
  });
}

function handleFormSubmission() {
  const username = document.getElementById('profileusername').textContent;

  // Collect form data
  var formData = {
    firstname: document.getElementById('firstname').value,
    lastname: document.getElementById('lastname').value,
    bio: document.getElementById('bio-input').value,
    username: document.getElementById('user-name').value,
    email: document.getElementById('gender').value // Assuming 'gender' field is for email
  };

  // Remove empty fields from form data
  Object.keys(formData).forEach(key => formData[key] === '' && delete formData[key]);
  // console.log('dfdfdf');
  fetch(`/profile/${username}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-action': 'updateprofile'
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('User details updated successfully!');
    })
    .catch(error => {
      console.error('Error updating user details:', error.message);
    });
}
let socialmedia_name = '';
function addsocialmedia(name) {
  document.getElementById('inputsocial').value = '';
  document.getElementById('error-message').innerText = '';
  let iconHTML = '';
  let popupWindow = null;
  popupWindow = document.querySelector('.instagram-popup-window-link');
  // console.log('dsgdhgv');
  if (name === 'Instagram') {
    socialmedia_name = 'instasocial';
    iconHTML = '<i class="fa fa-instagram"></i>Instagram';
  } else if (name === 'Facebook') {
    socialmedia_name = 'fb';
    iconHTML = '<i class="fa fa-facebook"></i>Facebook';
  } else if (name === 'Twitter') {
    socialmedia_name = 'twittersocial';
    iconHTML = '<i class="fa fa-twitter"></i>Twitter';
  } else if (name === 'Email') {
    socialmedia_name = 'mail';
    iconHTML = '<i class="fa fa-envelope"></i>Email';
  }

  // Update the icon and text
  const iconElement = document.querySelector(`#insta`);

  iconElement.innerHTML = iconHTML;

  popupWindow.style.visibility = 'visible';

}
function cancelLink() {
  popupWindow = document.querySelector('.instagram-popup-window-link');
  popupWindow.style.visibility = 'hidden';
}

function addLink() {
  const link = document.getElementById('inputsocial').value;
  const icon = document.getElementById(`${socialmedia_name}`);

  const instagramRegex = /^https?:\/\/(?:www\.)?instagram\.com\/([a-zA-Z0-9_]+)/;
  const facebookRegex = /^https?:\/\/(?:www\.)?facebook\.com\/([a-zA-Z0-9_]+)/;
  const twitterRegex = /^https?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(socialmedia_name == 'instasocial'){
  if (instagramRegex.test(link)) {
    icon.style.display = 'block';
    icon.href = link;
    document.getElementById('error-message').style.display = 'none';
    const popupWindow = document.querySelector('.instagram-popup-window-link');
    popupWindow.style.visibility = 'hidden';
    updatelinks(link);
  }
    else {
      const errorMessage = document.getElementById('error-message');
      errorMessage.innerText = 'Please enter a valid URL.';
      errorMessage.style.display = 'block';
    }
  }
  else if(socialmedia_name == 'fb'){
    if (facebookRegex.test(link)) {
      icon.style.display = 'block';
      icon.href = link;
      document.getElementById('error-message').style.display = 'none';
      const popupWindow = document.querySelector('.instagram-popup-window-link');
      popupWindow.style.visibility = 'hidden';
      updatelinks(link);
    }
      else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.innerText = 'Please enter a valid URL.';
        errorMessage.style.display = 'block';
      }
    }
    else if(socialmedia_name == 'twittersocial'){
      if (twitterRegex.test(link)) {
        icon.style.display = 'block';
        icon.href = link;
        document.getElementById('error-message').style.display = 'none';
        const popupWindow = document.querySelector('.instagram-popup-window-link');
        popupWindow.style.visibility = 'hidden';
        updatelinks(link);
      }
        else {
          const errorMessage = document.getElementById('error-message');
          errorMessage.innerText = 'Please enter a valid URL.';
          errorMessage.style.display = 'block';
        }
      }
      else if(socialmedia_name == 'mail'){
        if (emailRegex.test(link)) {
          icon.style.display = 'block';
          
        icon.href = link;
        document.getElementById('error-message').style.display = 'none';
        const popupWindow = document.querySelector('.instagram-popup-window-link');
        popupWindow.style.visibility = 'hidden';
        updatelinks(link);
    }
  
}
}


function updatelinks(link){
  const formdata = new FormData();
  formdata.append('link',link);
  formdata.append('socialmedia_name',socialmedia_name);
  fetch(`/profile/${username}/`,{
    method:'POST',
    body:formdata,
    headers:{
      'X-action':'addlinks'
    }
  })
  .then(response=>response.json())
  .then(data=>{
    console.log(data);
  })
  .catch(error=>{
    console.log(error);
  })

}


function bookmarkArticle(event, articleId) {
  const bookmarkBtns = document.querySelectorAll(`.bookmark-btn${articleId}`);
  event.preventDefault();
  bookmarkBtns.forEach(bookmarkBtn => {
      const bookmarkIcon = bookmarkBtn.querySelector('.bookmark-icon');
      bookmarkIcon.classList.toggle('bookmarked');
  });

  const formdata = new FormData()
  formdata.append('articleId',articleId)
  fetch('/',{method:'POST',body:formdata})
  .then(response=>response.json())
  .then(data=>{
      console.log("success");
  })
  .catch(error=>{
      console.log('ERROR: ',error);
  })
}