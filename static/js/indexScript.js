function showMenu() {
    const menu = document.querySelector('.menu-container').style.display;
    if (menu == 'none') {
        document.querySelector('.menu-container').style.display = 'block';
    }
    else {
        document.querySelector('.menu-container').style.display = 'none';
    }
}

window.onclick = function (event) {
    if (!event.target.matches('#menu-button')) {
        const menu = document.querySelector('.menu-container').style.display;
        if (menu == 'block') {
            document.querySelector('.menu-container').style.display = 'none';
        }
    }
}
document.querySelector('.menu-container').addEventListener('click', function(event) {
    // Stop event propagation
    event.stopPropagation();
});
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
document.getElementById('category-select').addEventListener('change', function () {
    let selectedCategory = this.value;
    let articleContainers = document.querySelectorAll('.categories');
    articleContainers.forEach(function (container) {
        let articleCategory = container.getAttribute('data-category');
        if (selectedCategory == 0) {
            container.style.display = 'block';
            return;
        }
        if (selectedCategory === articleCategory) {
            container.style.display = 'block';
            return;
        } else {
            container.style.display = 'none';
        }
    });
});

function userLogout() {
    // Get the modal
    const modal = document.getElementById("logoutModal");
  
    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];
  
    // Get the confirm and cancel buttons
    const confirmBtn = document.getElementById("logoutConfirm");
    const cancelBtn = document.getElementById("logoutCancel");
  
    // When the user clicks the button, open the modal
    modal.style.display = "block";
  
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }
  
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  
    // When the user clicks the confirm button, logout
    confirmBtn.onclick = function() {
      fetch('/', {
        method: 'POST',
        headers: {
          'X-action': 'logout'
        }
      })
      .then(response => response.json())
      .then(data => {
        window.location.href = '/';
      })
      .catch(error => {
        console.log("Error: ", error);
      })
      modal.style.display = "none";
    }
  
    // When the user clicks the cancel button, close the modal
    cancelBtn.onclick = function() {
      modal.style.display = "none";
    }
  }


