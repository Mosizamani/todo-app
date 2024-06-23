const API_URL = 'http://localhost:3000'

async function fetchTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`)
        const data = await response.json()

        const todoItems = document.getElementById('todo-items')

        todoItems.innerHTML = ''

        if (data.length) {
            data.forEach((todo) => {
                const item = document.createElement('div')
                item.classList.add('todo-item')
                
                if (todo.completed) {
                    item.classList.add('completed')
                }

                const checkbox = document.createElement('input')
                checkbox.type = 'checkbox'
                checkbox.checked = todo.completed
                item.appendChild(checkbox)

                const text = document.createElement('p')
                text.innerHTML = `<strong>${todo.title}</strong> - ${todo.details}`
                item.appendChild(text)

                todoItems.appendChild(item)
            })
        } else {
            todoItems.innerHTML = '<p>No todo items found!</p>'
        }

    } catch (error) {
        console.error(error)
    }
}


addEventListener("DOMContentLoaded", async () => {
    await fetchTodos()
})

document.getElementById('add-todo').addEventListener('submit', async (event) => {
    event.preventDefault()

    const title = document.getElementById('todo-title')
    const details = document.getElementById('todo-details')

    try {
        await fetch(`${API_URL}/todos`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                title: title.value,
                details: details.value
            })
        })

        title.value = ''
        details.value = ''

    } catch (error) {
        //  TODO: Show error to the user
        console.error(error)
    } finally {
        await fetchTodos()
    }
})


// TODO: Implement editing title and details
// TODO: Implement deleting todos
// TODO: Implement completed todos

