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
      showPopup('Please fill in all fields before publishing.');
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
  else{
    showPopup('Please fill in all fields before publishing.');
  }
});
function showPopup(message) {
  const popup = document.createElement('div');
  popup.classList.add('popup');

  const popupContent = document.createElement('div');
  popupContent.classList.add('popup-content');

  const popupMessage = document.createElement('p');
  popupMessage.textContent = message;

  const closeButton = document.createElement('span');
  closeButton.classList.add('close-button');
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    popup.remove();
  });

  popupContent.appendChild(popupMessage);
  popupContent.appendChild(closeButton);
  popup.appendChild(popupContent);
  document.body.appendChild(popup);

  // Add some styles
  const style = document.createElement('style');
  style.innerHTML = `
    .popup {
      position: fixed;
      z-index: 9999;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .popup-content {
      background-color: #fff;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      max-width: 600px;
      text-align: center;
      position: relative;
    }

    .close-button {
      position: absolute;
      top: 8px;
      right: 12px;
      color: #aaa;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
    }

    .close-button:hover {
      color: #333;
    }

    p {
      margin: 0;
      font-size: 18px;
      line-height: 1.5;
    }
  `;
  document.head.appendChild(style);
}