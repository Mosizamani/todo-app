const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 4000

const authRouter = require('./routers/authRouter')
const todoRouter = require('./routers/todoRouter')

app.use(cors())
app.use (express.json())

app.use('/app', express.static('public'))
app.use('/auth', authRouter)
app.use('/', todoRouter)

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
