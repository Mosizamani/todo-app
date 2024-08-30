const express = require('express')
const passport = require('passport')
const crypto = require('crypto')

const LocalStrategy = require('passport-local')

const { User } = require('../models')

const router = express.Router()

//... Configures Passport.js to use the LocalStrategy for authentication
passport.use(new LocalStrategy(async function verify(username, password, callback) {
    try {
        //... Finds a user in the database with the given username
        const user = await User.findOne({ username })

        //... If the user is not found, return an error message
        if (!user) {
            return callback(null, false, { message: 'Incorrect username or password.'})
        }

        //... Hashes the provided password and compares it with the stored password hash
        crypto.pbkdf2(password, Buffer.from(user.passwordSalt, 'base64'), 310000, 32, 'sha256', async function (error, hashedPassword) {
            if (error) {
                return callback(error)
            }
            //... If the hashed passwords do not match, return an error message
            if (!crypto.timingSafeEqual(Buffer.from(user.passwordHash, 'base64'), hashedPassword)) {
                return callback(null, false, { message: 'Incorrect username and password.'})
            }
            //... If the passwords match, authentication is successful and the user is returned
            return callback(null, user)
        })
    } catch(error) {
        return callback(error)
    }
    
}))

//... Serializes the user information into the session
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, {
            id: user._id,
            username: user.username
        })
    })
})
  
//... Deserializes the user information from the session
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    })
})

//... Handles the user registration process
router.post('/register', async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return next('Username and passport are required to register')
    }

    //... Checks if a user with the provided username already exists
    const user = await User.findOne({ username: req.body.username })

    if (user) {
        return next('Username already exists')
    }
    
    const salt = crypto.randomBytes(16)

    //... Hashes the password with a generated salt and saves the user to the database
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function (error, hashedPassword) {
        if (error) {
            return next('Error while creating password hash')
        }
        
        try {
            const user = await User.create({
                username: req.body.username,
                passwordSalt: salt.toString('base64'),
                passwordHash: hashedPassword.toString('base64')
            })

            if(!user) {
                return next('Error while creating user')
            }

            //... Optional: Automatically log in the user after registration
            // req.login(user, function(error) {
            //     if (error) {
            //         return next(error)
            //     }
            //     res.redirect('/app')
            // })
            res.status(201).send()
            return ('User created successfully')
        } catch (error) {
            return next(error)
        }

    })
})

//... Handles the user login process using Passport.js
router.post('/login', passport.authenticate('local', {
    successRedirect: '/app',  //... Redirects to the app on successful login
    failureRedirect: '/app/login.html'  //... Redirects to the login page on failure
    
}))

// //... Handles the user reset password process
// router.post('/forgotPassword', async (req, res, next) => {
//     res.redirect('/app/resetPassword.html'); // Redirects to the reset password page
// });

//... Handles the user logout process
router.post('/logout', async (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error)
        }
        res.redirect('/app/login.html')  //... Redirects to the login page after logout
    })
})

module.exports = router
