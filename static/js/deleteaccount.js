// Get the delete account form and add an event listener
const deleteAccountForm = document.getElementById('delete-account-form');
const errorMessageDiv = document.getElementById('error-message');
deleteAccountForm.addEventListener('submit', handleDeleteAccount);

function handleDeleteAccount(event) {
    event.preventDefault();
    errorMessageDiv.textContent = '';
    // Get the password value from the form
    const password = document.getElementById('password').value;
    const formdata = new FormData();
    formdata.append('password',password);
    // Send a fetch request to the server to delete the user account
    // console.log(password);
    fetch('/deleteyouraccount/',{
        method:'POST',
        body: formdata
    })
    .then(response=>response.json())
    .then(data=>{
        // console.log(data.error);
        if(data.error){
            errorMessageDiv.textContent = `Error: Incorrect Password`;
        }
        else{
            window.location.href = '/';

        }

    })
    .catch(error=>{
        console.log("Error: ",error);
    })
}