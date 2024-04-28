const signupBttn = document.getElementById('#submit-signup')
const  popupWindow = document.querySelectorAll('.popup-window');

function showPopUp(){
      signupBttn.addEventListener('click', e=>{
        if(popupWindow.style.display==='none'){
            popupWindow.style.display='block';
        }
      })
};


// Get references to the relevant elements
const toolbarButtons = document.querySelectorAll('.toolbar-section button');
const writingArea = document.querySelector('.writing-area');
const articleThumbnailPreview = document.getElementById('article-thumbnail');
const articleHeadingInput = document.querySelector('.heading-input input');
const categorySelect = document.querySelector('.category-select select');
const articleHeadElement = document.getElementById('article-head');
const categoryNameElement = document.getElementById('cat-name');
const authorsNameElement = document.getElementById('authors-name');
const saveDraftButton = document.querySelector('.save-draft');
const publishButton = document.querySelector('.publish');

// Toolbar button click handlers
toolbarButtons.forEach(button => {
  button.addEventListener('click', () => {
    const command = button.querySelector('i').className.replace('icon-', '');
    document.execCommand(command, false, null);
  });
});

// Handle thumbnail upload
const thumbnailInput = document.getElementById('thumbnail-input');
thumbnailInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      articleThumbnailPreview.style.backgroundImage = `url(${reader.result})`;
    };
    reader.readAsDataURL(file);
  }
});

// Handle article heading input
articleHeadingInput.addEventListener('input', (event) => {
  articleHeadElement.textContent = event.target.value;
});

// Handle category selection
categorySelect.addEventListener('change', (event) => {
  categoryNameElement.textContent = event.target.value;
});

// Set author's name (you can replace this with your desired logic)
authorsNameElement.textContent = 'John Doe';

// Save draft functionality
saveDraftButton.addEventListener('click', () => {
  const draftData = {
    thumbnail: articleThumbnailPreview.style.backgroundImage,
    heading: articleHeadingInput.value,
    category: categorySelect.value,
    content: writingArea.innerHTML,
    author: authorsNameElement.textContent
  };

  // Save the draft data to local storage or send it to a server
  console.log('Draft saved:', draftData);
  // You can implement your desired logic here, such as sending the draft data to a server or storing it in local storage
});

// Publish article functionality
publishButton.addEventListener('click', () => {
  const articleData = {
    thumbnail: articleThumbnailPreview.style.backgroundImage,
    heading: articleHeadingInput.value,
    category: categorySelect.value,
    content: writingArea.innerHTML,
    author: authorsNameElement.textContent
  };
  // Publish the article data to the server
  if (!articleData.thumbnail || !articleData.heading || !articleData.category || !articleData.content || !articleData.author) {
    alert('Please fill in all fields before publishing.');
    return; // Exit function if any field is empty
}
else{
  console.log('Article published:', articleData);
  fetch('/publish/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        // Add any other headers if needed
    },
    body: JSON.stringify(articleData)
})
.then(response => response.json())
.then(data => {
    console.log('Response from Django:', data);
    // Handle the response from Django if needed
})
.catch(error => {
    console.error('Error sending data to Django:', error);
    // Handle errors if any
});
  // You can implement your desired logic here, such as sending the article data to a server for publishing
}
});