
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ToDo  = require('./models');

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use (express.json())

app.get('/todos', async (req, res) => {
    const todos = await ToDo.find()
    return res.status(200).json(todos)
})

app.put('/todos', async (req, res) => {
    if(!req.body.title) {
        return res.status(400).send('Title field is required to create todo')
    }
    if(!req.body.details) {
        return res.status(400).send('Details field is required to create todo')
    }

    const todo = await ToDo.create({
        title: req.body.title,
        details: req.body.details,
    })

    return res.status(201).json(todo)
})

app.patch('/todos/:id', async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send('ID is required to update a todo')
    }

    try {
        await ToDo.updateOne({
            _id: req.params.id
        }, {
            title: req.body.title,
            details: req.body.details,
            completed:req.body.completed
        })
    
        const todo = await ToDo.findOne({ _id: req.params.id })
    
        if (!todo) {
            return res.status(404).send('Todo not found')
        }
    
        return res.status(200).json(todo)
    } catch (error) {
        return res.status(400).send('Update todo failed (The length of the id written is not correct)')
    }

})

const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/test')

        app.listen(port, () => {
            console.log(`Todo backend is listening on port ${port}`)
        })
    } catch (error) {
        console.error(error)
        process.exit(1)
    }

}

start()

