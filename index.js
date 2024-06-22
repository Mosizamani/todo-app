
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ToDo  = require('./models');

const app = express()
const port = process.env.PORT || 3000
app.use(cors())


const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/test')

        app.listen(port, () => {
            console.log(`Todo backend is running on port ${port}`)
        })
    } catch (error) {
        console.error(error)
        process.exit(1)
    }

}

start()

