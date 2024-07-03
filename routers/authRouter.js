const express = require('express')

const { User } = require('../models')

const router = express.Router()

router.post('/register', async (req, res, next) => {
    if(!req.body.username || !req.body.passport) {
        next('Username and passport')
    }
})

module.exports = router