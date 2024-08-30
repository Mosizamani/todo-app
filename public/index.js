// Base URL of the REST API for managing to-do items
const API_URL = 'http://localhost:4000'

// Element to display error messages to the user
const errorElement = document.getElementById('error')

// Variables to manage edit state
let editMode = false  // Track if we're editing an existing to-do 
let currentEditId = null  // Store the ID of the to-do being edited 

// Function to fetch and display to-do items from the server
async function fetchTodos() {
    try {
        // Send a GET request to fetch all to-do items
        const response = await fetch(`${API_URL}/todos`)

        // If the response is redirected, navigate to the new URL
        if (response.redirected) {
            window.location.href = response.url
        }
        
        // Parse the JSON response
        const data = await response.json()
        
        // Get the element to display the to-do items
        const todoItems = document.getElementById('todo-items')

        // Clear the current list of to-do items
        todoItems.innerHTML = ''

        // If there are to-do items, render them on the page
        if (data.length) {
            data.forEach((todo) => {
                // Create a div element for each to-do item
                const item = document.createElement('div')
                item.dataset.id = todo._id // Store the item ID in a data attribute
                item.classList.add('todo-item')
                
                // Add 'completed' class if the to-do item is marked as completed
                if (todo.completed) {
                    item.classList.add('completed')
                }

                // Create a paragraph element to display the created date of the to-do item
                const createdDate = document.createElement('p')
                createdDate.innerHTML = `${new Date(todo.createdDate).toLocaleString()}`
                item.appendChild(createdDate)

                // Create a checkbox to mark the item as completed
                const checkbox = document.createElement('input')
                checkbox.type = 'checkbox'
                checkbox.checked = todo.completed
                item.appendChild(checkbox)

                // Create a paragraph element to display the title and details of the to-do item
                const text = document.createElement('p')
                text.innerHTML = `<span class="todo-title">${todo.title}</span> - <span class="todo-details">${todo.details}</span>`
                item.appendChild(text)

                // Create a button for editing the to-do item
                const button = document.createElement('button')
                button.innerHTML = 'Edit'
                button.classList.add('edit-button') // Use a class to identify the edit button 
                item.appendChild(button)

                // Create a button for deleting the to-do item
                const buttonD = document.createElement('button') 
                buttonD.innerHTML = 'Delete'
                buttonD.classList.add('delete-button') // Use a class to identify the delete button 
                item.appendChild(buttonD) 
                
                // Create a button for sharing the to-do item
                const buttonS = document.createElement('button')
                buttonS.innerHTML = 'Share Todo'
                buttonS.classList.add('share-button') // Use a class to identify
                item.appendChild(buttonS)

                // Append the item to the to-do items container
                todoItems.appendChild(item)
            })
        } else {
            // If no to-do items are found, display a message
            todoItems.innerHTML = '<p>No todo items found!</p>'
        }

    } catch (error) {
        // Log any errors to the console
        console.error(error)
    }
}

// Event listener to fetch and display to-do items when the DOM is fully loaded
addEventListener("DOMContentLoaded", async () => {
    await fetchTodos()
})

// Event listener for submitting the form to add a new to-do item
document.getElementById('add-todo').addEventListener('submit', async (event) => {
    event.preventDefault()  // Prevent the default form submission behavior

    const title = document.getElementById('todo-title-input')
    const details = document.getElementById('todo-details-input')

    try {
        let response 
        if (editMode) { 
            // If we're in edit mode, update the existing to-do 
            response = await fetch(`${API_URL}/todos/${currentEditId}`, { 
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    title: title.value,
                    details: details.value
                })
            })
        } else {
            // If not in edit mode, create a new to-do
            response = await fetch(`${API_URL}/todos`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    title: title.value,
                    details: details.value
                })
            })
        }

        if (response.redirected) {
            window.location.href = response.url
        }

        const data = await response.json()

        if (!response.ok) { 
            throw new Error(`Failed to save todo - ${data.message}`) 
        }

        // Clear the input fields and reset edit mode 
        title.value = ''
        details.value = ''
        editMode = false 
        currentEditId = null 

    } catch (error) {
        console.error(error)
        errorElement.innerHTML = error
    } finally {
        await fetchTodos()  // Refresh the list of to-do items
    }
})

// Event listener for click events on the to-do items container
document.getElementById('todo-items').addEventListener('click', async (event) => {
    const item = event.target.parentNode  // Get the parent element of the clicked target
    
    if (event.target.type === 'checkbox') {
        // Handle checkbox click to mark as complete/incomplete
        const id = item.dataset.id
        
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    completed: event.target.checked
                })
            })

            if (response.redirected) {
                window.location.href = response.url
            }

        } catch (error) {
            console.error(error)
        } finally {
            await fetchTodos()
        }
    } else if(event.target.classList.contains('edit-button')) { 
        // Enter edit mode 
        editMode = true 
        currentEditId = item.dataset.id 

        const titleInput = document.getElementById('todo-title-input')
        const detailsInput = document.getElementById('todo-details-input')

        const title = item.querySelector('.todo-title')
        titleInput.value = title.innerHTML

        const details = item.querySelector('.todo-details')
        detailsInput.value = details.innerHTML
    } else if(event.target.classList.contains('delete-button')) {
        // Handle delete button click
        const id = item.dataset.id

        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'DELETE'
            })

            if (response.redirected) {
                window.location.href = response.url
            }

        } catch (error) {
            console.error(error)
        } finally {
            await fetchTodos()
        }
    }
})

// Theme code FOR DAY AND NIGHT MODE
const themeLink = document.getElementById('theme-link')
const themeToggle = document.getElementById('theme-toggle')

// Check local storage to see if a theme is already set
let currentTheme = localStorage.getItem('theme') || 'day'

// Set the initial theme
setTheme(currentTheme)

themeToggle.addEventListener('click', () => {
    // Toggle theme between 'day' and 'night'
    currentTheme = currentTheme === 'day' ? 'night' : 'day'
    setTheme(currentTheme)
})

function setTheme(theme) {
    if (theme === 'night') {
        themeLink.href = 'night.css'
        themeToggle.textContent = 'Switch to Day Mode'
    } else {
        themeLink.href = 'day.css'
        themeToggle.textContent = 'Switch to Night Mode'
    }
    // Save the theme preference in local storage
    localStorage.setItem('theme', theme)
}

// **Managed logout button here (because the logout button is located in the index.html file)

// Add an event listener for the logout button
document.getElementById('logout').addEventListener('click', async () => {
    // Send a POST request to the API to log out the user
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST'
    })

    // If the response indicates a redirect, navigate to the redirected URL
    if (response.redirected) {
        window.location.href = response.url
    }
    
})

// Fetching username from the server and displaying it on the page after the user successfully logs in

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/user-info')  // Fetch the username from your new route
        const data = await response.json()  // Parse the JSON response

        if (response.ok) {
            // Update the username display element with the fetched username
            const usernameDisplay = document.getElementById('username-display')
            usernameDisplay.textContent = `Welcome, ${data.username}!`
        } else {
            console.error('Failed to load user data')
        }
    } catch (error) {
        console.error('Error fetching username:', error)
    }
})

// Function to update and display the current time and date
function updateDateTime() {
    const dateTimeElement = document.getElementById('current-date-time') // Get the element to display time and date
    const now = new Date()  // Get the current date and time

    // Format the date and time
    const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long', // Full name of the day
        year: 'numeric', // 4-digit year
        month: 'long', // Full name of the month
        day: 'numeric' // Numeric day of the month
    })

    const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit', // 2-digit hour
        minute: '2-digit', // 2-digit minute
        second: '2-digit' // 2-digit second
    })

    // Display the formatted date and time in the HTML element
    dateTimeElement.innerHTML = `${formattedDate}, ${formattedTime}`
}

// Update the time and date every second
setInterval(updateDateTime, 1000)

// Call the function to display the date and time immediately when the page loads
updateDateTime()