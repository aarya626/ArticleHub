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
const headingSelect = document.getElementById('headingSelect');

toolbarButtons.forEach(button => {
  button.addEventListener('click', () => {
    const command = button.querySelector('i').className.replace('icon-', '');
    if (command === 'heading') {
      headingSelect.classList.toggle('show');
    } else if (command === 'underline') {
      document.execCommand('underline', false, null);
    } else {
      document.execCommand(command, false, null);
    }
  });
});

headingSelect.addEventListener('change', () => {
  const selectedHeadingLevel = headingSelect.value;
  document.execCommand('formatBlock', false, selectedHeadingLevel);
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


// Save draft functionality
saveDraftButton.addEventListener('click', () => {
  const draftData = {
    thumbnail: articleThumbnailPreview.style.backgroundImage,
    heading: articleHeadingInput.value,
    category: categorySelect.value,
    content: writingArea.innerHTML,
  };

  console.log('Draft saved:', draftData);
});

// Publish article functionality
publishButton.addEventListener('click', () => {
  const file = thumbnailInput.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('thumbnail', articleThumbnailPreview.style.backgroundImage);
    formData.append('heading', articleHeadingInput.value);
    formData.append('category', categorySelect.value);
    formData.append('content', writingArea.innerHTML);

    if (!formData.get('thumbnail') || !formData.get('heading') || !formData.get('category') || !formData.get('content')) {
      alert('Please fill in all fields before publishing.');
      return; 
    } else {
      fetch('/publish/', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log('Response from Django:', data);
        window.location.href = `/articlepage/${data.id}`;  
      })
      .catch(error => {
        console.error('Error sending data to Django:', error);
      });
    }
  }
});
