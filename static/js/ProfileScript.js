function selectProfilePic() {
  // Trigger click event on the hidden file input
  document.getElementById('profile-pic-input').click();
}
document.getElementById('profile-pic-input').addEventListener('change', function(event) {
  const file = event.target.files[0]; // Get the selected file
  const reader = new FileReader();

  reader.onload = function() {
      const imageDataUrl = reader.result;

      const profilePicPreview = document.querySelector('.profile-pic');
      profilePicPreview.src = imageDataUrl;

  };

  // Read the selected file as a data URL
  reader.readAsDataURL(file);
});

const tabLinks = document.querySelectorAll('.nav-tabs a');
const tabContents = document.querySelectorAll('.tab-content');

tabLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // Remove active class from all tabs and contents
    tabLinks.forEach(link => link.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to clicked tab and corresponding content
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
if(followBtn){
followBtn.addEventListener('click', function() {
  fetch(`/profile/${username}/`,{
    method: 'POST',
  })
  .then(Response=>Response.json())
  .then(data=>{
    console.log(data.isFollowing);
    if (!data.isFollowing) {
      // Unfollow action
      followBtn.textContent = 'Follow';
      followBtn.classList.remove('following');
      // Update the followers/following count (if needed)
      // ...
      document.querySelector('.follow').textContent = data.followers;
      document.querySelector('.following').textContent = data.following;

  } else {
      // Follow action
      followBtn.textContent = 'Unfollow';
      followBtn.classList.add('following');
      // Update the followers/following count (if needed)
      // ...
      document.querySelector('.follow').textContent = data.followers;
      document.querySelector('.following').textContent = data.following;
  }
  })
  .catch(error=>{
    console.log("error");
  })
});
}