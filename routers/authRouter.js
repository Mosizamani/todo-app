const express = require('express')

const { User } = require('../models')

const router = express.Router()

router.post('/register', async (req, res, next) => {
    if (!req.body.username || !req.body.passport) {
        next('Username and passport are required to register')
    }

    const user = await User.findOne({
        username: req.body.username
    })
    if (user) {
        next('Username already exists')
    }
    //TODO: pASSPORT Registration
})

router.post('/login', async (req, res, next) => {
    //TODO: Passport authentication
})

router.post('/logout ', async (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error)
        }
        res.redirect('/app/login.html')
    })
})

module.exports = router