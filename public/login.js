// Define the base URL for the API endpoints
const API_URL = 'http://localhost:4000'

// Add an event listener for the form submission of the registration form
document.getElementById('register-form').addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault()

    // Get the values of the username and password fields from the registration form
    const username = document.getElementById('register-username').value
    const password = document.getElementById('register-password').value

    // Send a POST request to the API to register the user
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Include the username and password in the request body as JSON
        body: JSON.stringify({
            username,
            password
        })
    })

    // If the response indicates a redirect, navigate to the redirected URL
    if (response.redirected) {
        window.location.href = response.url
    }

    // If the response status is 400 or higher, it indicates an error
    if (response.status >= 400) {
        // Get the error message from the response
        const data = await response.text()
        // Create a new paragraph element to display the error message
        const error = document.createElement('p')
        error.textContent = data
        // Clear any previous error messages and display the new one
        document.getElementById('error').innerHTML = ''
        document.getElementById('error').appendChild(error)
    } 
})

// Add an event listener for the form submission of the login form
document.getElementById('login-form').addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault()

    // Get the values of the username and password fields from the login form
    const username = document.getElementById('login-username').value
    const password = document.getElementById('login-password').value

    // Send a POST request to the API to log in the user
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Include the username and password in the request body as JSON
        body: JSON.stringify({
            username,
            password
        })
        
    })

    // If the response indicates a redirect, navigate to the redirected URL
    if (response.redirected) {
        window.location.href = response.url
    }

    // If the response status is 400 or higher, it indicates an error
    if (response.status >= 400) {
        // Get the error message from the response
        const data = await response.text()
        // Create a new paragraph element to display the error message
        const error = document.createElement('p')
        error.textContent = data
        // Clear any previous error messages and display the new one
        document.getElementById('error').innerHTML = ''
        document.getElementById('error').appendChild(error)
    }
})

// // Add an event listener for the form submission of the forgot password form
// document.getElementById('reset-password-form').addEventListener('submit', async (event) => {
//     // Prevent the default form submission behavior
//     event.preventDefault();

//     // Get the email from the input field
//     const email = document.getElementById('email').value;

//     // Send a POST request to the API to reset the user's password
//     const response = await fetch(`${API_URL}/auth/forgotPassword`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }) // Send the email in the request body
//     });

//     // If the response indicates a redirect, navigate to the redirected URL
//     if (response.redirected) {
//         window.location.href = response.url;
//     }

//     // If the response status is 400 or higher, it indicates an error
//     if (response.status >= 400) {
//         // Get the error message from the response
//         const data = await response.text();
//         // Create a new paragraph element to display the error message
//         const error = document.createElement('p');
//         error.textContent = data;
//         // Clear any previous error messages and display the new one
//         document.getElementById('error').innerHTML = '';
//         document.getElementById('error').appendChild(error);
//     }
// });

