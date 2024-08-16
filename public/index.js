// Base URL of the REST API for managing to-do items
const API_URL = 'http://localhost:4000'

// Element to display error messages to the user
const errorElement = document.getElementById('error')

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
                button.innerHTML = 'edit'
                button.type = 'button'
                item.appendChild(button)

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
    // Prevent the default form submission behavior
    event.preventDefault()

    // Get the input values for title and details
    const title = document.getElementById('todo-title-input')
    const details = document.getElementById('todo-details-input')

    try {
        // Send a PUT request to add a new to-do item
        const response = await fetch(`${API_URL}/todos`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                title: title.value,
                details: details.value
            })
        })

        // If the response is redirected, navigate to the new URL
        if (response.redirected) {
            window.location.href = response.url
        }

        // Parse the JSON response
        const data = await response.json()

        // Log the response data to the console
        console.log(data)

        // If the response status is not 201 (Created), throw an error
        if (response.status !== 201) {
            throw new Error(`Creating todo failed - ${data.message}`)
        }

        // Clear the input fields
        title.value = ''
        details.value = ''

    } catch (error) {
        // Log any errors to the console and display the error message
        console.error(error)
        errorElement.innerHTML = error
    } finally {
        // Refresh the list of to-do items
        await fetchTodos()
    }
})

// Event listener for click events on the to-do items container
document.getElementById('todo-items').addEventListener('click', async (event) => {
    const item = event.target.parentNode // Get the parent element of the clicked target
    console.log("clicked")
    
    // Check if the clicked element is a checkbox
    if (event.target.type === 'checkbox') {
        
        const id = item.dataset.id // Get the ID of the to-do item
        console.log(id)

        try {
            // Send a PATCH request to update the completed status of the to-do item
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    completed: event.target.checked
                })
            })

            // If the response is redirected, navigate to the new URL
            if (response.redirected) {
                window.location.href = response.url
            }

        } catch (error) {
            // Log any errors to the console
            console.error(error)
        } finally {
            // Refresh the list of to-do items
            await fetchTodos()
        } 
    } else if(event.target.type === 'button') {
        // Check if the clicked element is the edit button
        const titleInput = document.getElementById('todo-title-input')
        const detailsInput = document.getElementById('todo-details-input')

        // Populate the form with the existing to-do item's title and details
        const title = item.querySelector('.todo-title')
        titleInput.value = title.innerHTML

        const details = item.querySelector('.todo-details')
        detailsInput.value = details.innerHTML

    }
    
})



// TODO: Implement editing title and details

// TODO: Implement deleting todos


// Theme code FOR DAY AND NIGHT MODE
const themeLink = document.getElementById('theme-link');
const themeToggle = document.getElementById('theme-toggle');

// Check local storage to see if a theme is already set
let currentTheme = localStorage.getItem('theme') || 'day';

// Set the initial theme
setTheme(currentTheme);

themeToggle.addEventListener('click', () => {
    // Toggle theme between 'day' and 'night'
    currentTheme = currentTheme === 'day' ? 'night' : 'day';
    setTheme(currentTheme);
});

function setTheme(theme) {
    if (theme === 'night') {
        themeLink.href = 'night.css';
        themeToggle.textContent = 'Switch to Day Mode';
    } else {
        themeLink.href = 'day.css';
        themeToggle.textContent = 'Switch to Night Mode';
    }
    // Save the theme preference in local storage
    localStorage.setItem('theme', theme);
}

// **Manage logout button here (because the logout button is located in the index.html file)

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

async function fetchUsernameAndUpdateDisplay() {
    try {
        const response = await fetch('/todos'); // or another endpoint that returns the username
        const data = await response.json();

        if (response.ok) {
            // Find the username display element and update its content
            const usernameDisplay = document.getElementById('username-display');
            usernameDisplay.textContent = `Welcome, ${data.username}!`;
        } else {
            console.error('Failed to load user data');
        }
    } catch (error) {
        console.error('Error fetching username:', error);
    }
}

