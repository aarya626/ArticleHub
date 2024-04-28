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