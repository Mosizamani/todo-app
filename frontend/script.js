const API_URL = 'http://localhost:3000'

const errorElement = document.getElementById('error')

async function fetchTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`)
        const data = await response.json()
        const todoItems = document.getElementById('todo-items')

        todoItems.innerHTML = ''

        if (data.length) {
            data.forEach((todo) => {
                const item = document.createElement('div')
                item.dataset.id = todo._id
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

        const data = await response.json()

        console.log(data)

        if (response.status !== 201) {
            throw new Error(`Creating todo failed - ${data.message}`)
        }

        title.value = ''
        details.value = ''

    } catch (error) {
        console.error(error)
        errorElement.innerHTML = error
    } finally {
        await fetchTodos()
    }
})

document.getElementById('todo-items').addEventListener('click', async (event) => {
    if (event.target.type === 'checkbox') {
        const item = event.target.parentNode
        const id = item.dataset.id

        console.log(id)
        try {
            await fetch(`${API_URL}/todos/${id}`, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    completed:event.target.checked
                })
            })


        } catch (error) {
            console.error(error)
        } finally {
            await fetchTodos()
        }
    }
})


// TODO: Implement editing title and details
// TODO: Implement deleting todos
