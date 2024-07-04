document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault()

    const username = document.getElementById('register-username').value
    const password = document.getElementById('register-password').value

    console.log(username, password)

    //TODO: Make API request
})

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault()

    const username = document.getElementById('login-username').value
    const password = document.getElementById('login-password').value

    console.log(username, password)

    //TODO: Make API request
})
