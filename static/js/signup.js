// document.getElementById('myForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//     let email = document.getElementById("email-input").value;
//     let password = document.getElementById("Pword-signup").value;
//     let confirm_password = document.getElementById("Cpword-signup").value;
//     let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//         console.log("Please enter a valid email address");
//         return; 
//     }
//     if (password != confirm_password){
//         return;
//     }
//     document.getElementById("myForm").submit();
// });

// JavaScript code for form navigation
const nextBtn1 = document.getElementById('nextBtn1');
const skipbtn = document.getElementById('skip');
const nextBtn2 = document.getElementById('nextBtn2');
const prevBtn1 = document.getElementById('prevBtn1');
const prevBtn2 = document.getElementById('prevBtn2');
const signupbtn = document.getElementById('signup');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const steps = document.querySelectorAll('.step');
const profilePicInput = document.getElementById('profilePic');
const profilePicLabel = document.getElementById('profilePicLabel');
const profilePicPreview = document.getElementById('profilePicPreview');
const errorMessage = document.querySelector('.error-message');

nextBtn1.addEventListener('click', () => {
    const step1Inputs = step1.querySelectorAll('input[required]');
    let isValid = true;

    step1Inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
        }
    });
    if(!isValid){
        errorMessage.textContent = 'Please fill in all required fields.';
        return;
    }
    let email = document.getElementById("email").value;
    let password = document.getElementById("pword").value;
    let confirm_password = document.getElementById("Cpword").value;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMessage.textContent = 'Please fill a valid email ID.';
        return; 
    }
    if (password != confirm_password){
        errorMessage.textContent = 'password does not match';
        return;
    }
    else {
        step1.style.display = 'none';
        step2.style.display = 'block';
        steps[0].classList.remove('active');
        steps[1].classList.add('active');
        errorMessage.textContent = '';
    }
});

prevBtn1.addEventListener('click', () => {
    step2.style.display = 'none';
    step1.style.display = 'block';
    steps[1].classList.remove('active');
    steps[0].classList.add('active');
    errorMessage.textContent = '';
});

skipbtn.addEventListener('click', () => {
    step2.style.display = 'none';
    step3.style.display = 'block';
    steps[1].classList.remove('active');
    steps[2].classList.add('active');
});
nextBtn2.addEventListener('click', () => {
    const pic = document.getElementById('profilePic').value;
    const bio = document.getElementById('bio').value;
    if (bio || pic){
        step2.style.display = 'none';
        step3.style.display = 'block';
        steps[1].classList.remove('active');
        steps[2].classList.add('active');
        errorMessage.textContent = '';
    }
    else{
        document.querySelector('.error-messages').innerHTML = 'Please fill in all required fields.';
    }
});

prevBtn2.addEventListener('click', () => {
    step3.style.display = 'none';
    step2.style.display = 'block';
    steps[2].classList.remove('active');
    steps[1].classList.add('active');
});

profilePicInput.addEventListener('change', () => {
    if (profilePicInput.files.length > 0) {
        const file = profilePicInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            profilePicPreview.src = reader.result;
            profilePicPreview.style.display = 'block';
            profilePicLabel.textContent = 'uploaded';
        });

        reader.readAsDataURL(file);
    } else {
        profilePicPreview.style.display = 'none';
        profilePicLabel.textContent = 'Upload Profile Picture';
    }
});

// Function to show the desired step
function showStep(stepNumber) {
    if (stepNumber === 1) {
        showStep1();
    } else if (stepNumber === 2) {
        const step1Inputs = step1.querySelectorAll('input[required]');
        let isValid = true;

        step1Inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
            }
        });

        if (isValid) {
            showStep2();
        } else {
            errorMessage.textContent = 'Please fill in all required fields.';
        }
    } else if (stepNumber === 3) {
        const step1Inputs = step1.querySelectorAll('input[required]');
        let isValid = true;

        step1Inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
            }
        });

        if (isValid) {
            showStep3();
            //   showStep2();
        } else {
            errorMessage.textContent = 'Please fill in all required fields.';
        }
    }
}

function showStep1() {
    step1.style.display = 'block';
    step2.style.display = 'none';
    step3.style.display = 'none';
    steps.forEach(step => step.classList.remove('active'));
    steps[0].classList.add('active');
    errorMessage.textContent = '';
}

function showStep2() {
    step1.style.display = 'none';
    step2.style.display = 'block';
    step3.style.display = 'none';
    steps.forEach(step => step.classList.remove('active'));
    steps[1].classList.add('active');
    errorMessage.textContent = '';
}

function showStep3() {
    step1.style.display = 'none';
    step2.style.display = 'none';
    step3.style.display = 'block';
    steps.forEach(step => step.classList.remove('active'));
    steps[2].classList.add('active');
}

signupbtn.addEventListener('click',()=>{
    // console.log('click');
    const firstname = document.getElementById('firstname').value
    const lastname = document.getElementById('lastname').value
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const password = document.getElementById('pword').value
    const bio = document.getElementById('bio').value
    const file = document.getElementById('profilePic')
    const profilePic = file.files[0];
    const pub = document.getElementsByName('isPublisher')
    let isPublisher;
    for (let i = 0; i < pub.length; i++) {
        if (pub[i].checked) {
            isPublisher = pub[i].value;
            break;
        }
    }
    const formdata = new FormData();
    formdata.append('first',firstname);
    formdata.append('last',lastname);
    formdata.append('username',username);
    formdata.append('email',email);
    formdata.append('password',password);
    formdata.append('bio',bio);
    formdata.append('profilepic',profilePic);
    formdata.append('ispublisher',isPublisher);
    fetch('/signup/',{
        method: 'POST',
        body: formdata
    })
    .then(response => response.json())
    .then(data =>{
        window.location.href = "/";
    })
    .catch(error => {
        console.error('Error sending data to Django:', error);
      });
})
// window.location.reload(true);