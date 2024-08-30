const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const session = require('express-session')
const passport = require('passport') 

require('dotenv').config();

const app = express()
const port = process.env.PORT || 4000

//... Middleware to check if the user is logged in
const loggedIn = (req, res, next) => {
    if (req.user) {
        //... If the user is authenticated, proceed to the next middleware or route handler
        next()
    } else {
        //... If not authenticated, redirect to the login page
        res.redirect('/app/login.html')
    }
}

const authRouter = require('./routers/authRouter')
const todoRouter = require('./routers/todoRouter')

//... Enable Cross-Origin Resource Sharing (CORS) to allow requests from different origins
app.use(cors())
//... Middleware to parse JSON requests
app.use(express.json())

//... Configure session management
app.use(session({
    secret: 'infbflkumjnyhbtgrvfedhjbjgk',  //... Secret key for signing the session ID cookie
    resave: false,  //... Do not save session if unmodified
    saveUninitialized: false,  //... Do not create session until something is stored
    cookie: { 
        secure: false,  //... Set to `true` if using HTTPS
        maxAge: 1000 * 60 * 60 * 24  //... Session cookie expires in 24 hours
    }
}))

//... Initialize Passport.js to handle user sessions
app.use(passport.session());

//... Serve static files from the 'public' directory when the '/app' route is accessed
app.use('/app', express.static('public'))

//... Use the authentication router for '/auth' routes
app.use('/auth', authRouter)

//... Use the todo router for the root route ('/') but only if the user is logged in
app.use('/', loggedIn, todoRouter)

//... Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err)  //... Log the error to the console
    res.status(err.status ?? 500).send(err)  //... Send the error status or default to 500
})

//... Function to start the application
const start = async () => {
    try {
        //... Connect to the MongoDB database
        await mongoose.connect('mongodb://localhost:27017/todo')

        //... Start the Express server on the specified port
        app.listen(port, () => {
            console.log(`Application backend is listening on port ${port}`)
        })
    } catch (error) {
        //... Log any errors that occur during startup and exit the process
        console.error(error)
        process.exit(1)
    }

}

start()  //... Call the start function to initialize the application