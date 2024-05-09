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

function bookmarkArticle(event, articleId) {
    const bookmarkBtns = document.querySelector(`.bookmark-btn${articleId}`);
    event.preventDefault();
    const bookmarkIcon = bookmarkBtns.querySelector('.bookmark-icon');
    bookmarkIcon.classList.toggle('bookmarked');
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
            console.log('adsa');
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