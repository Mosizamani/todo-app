const express = require('express');

const { ToDo } = require('../models');

const router = express.Router()


router.get('/todos', async (req, res) => {
    const todos = await ToDo.find({
        user: req.user.id
    })
    return res.status(200).json(todos)
})

router.get('/user-info', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' })
        }

        const username = req.user.username;  // Assuming `req.user` has a `username` property

        // Return the username in the response
        return res.status(200).json({ username })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve user info', error })
    }
})

router.delete('/todos/:id', async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message:'ID is required to delete a todo' })
    }

    try {
        await ToDo.deleteOne({
            _id: req.params.id,
            user: req.user.id
        })

        return res.status(200).json({ message:'Todo deleted successfully' })
    } catch (error) {
        return res.status(400).json({ message:'Delete todo failed (The length of the id written is not correct)' })
    }
})

router.put('/todos', async (req, res) => {
    if(!req.body.title) {
        return res.status(400).json({ message:'Title field is required to create todo' })
    }
    if(!req.body.details) {
        return res.status(400).json({ message:'Details field is required to create todo' })
    }

    const todo = await ToDo.create({
        title: req.body.title,
        details: req.body.details,
        user: req.user.id
    })

    return res.status(201).json(todo)
})

router.patch('/todos/:id', async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message:'ID is required to update a todo'})
    }

    try {
        await ToDo.updateOne({
            _id: req.params.id,
            user: req.user.id
        }, {
            title: req.body.title,
            details: req.body.details,
            completed:req.body.completed
        })
    
        const todo = await ToDo.findOne({ _id: req.params.id })
    
        if (!todo) {
            return res.status(404).json({ message:'Todo not found' })
        }
    
        return res.status(200).json(todo)
    } catch (error) {
        return res.status(400).json({ message:'Update todo failed (The length of the id written is not correct)' })
    }

})

module.exports = router
