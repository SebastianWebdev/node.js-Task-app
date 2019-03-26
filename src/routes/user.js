const express = require('express');
const router = new express.Router()
const User = require("../models/user")
const auth = require('../middleware/auth')



// add new user
router.post('/users', async (req, res) => {
    console.log(req.body);
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({
            user,
            token
        })
    } catch (err) {
        res.status(400).send(err)
    }

})
// user login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findAndVerifyPass(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send(e)
    }
})
// user logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send("User Logout")
    } catch (e) {
        res.status(500).send(e)
    }
})
// logout all sessions
router.post('/users/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send(`Logout complete`)
    } catch (e) {
        res.status(500).send()
    }
})


router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


// Update User Data

router.patch('/users/update', auth, async (req, res) => {
    const valid = ['name', 'email', 'password', 'age'];
    const updates = Object.keys(req.body);
    const isValid = updates.every(i => valid.includes(i))
    if (!isValid) {
        return res.status(400).send('Wrong Property name')
    }
    try {
        const user = req.user
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send()
    }
})

// delete User by id
router.delete('/users/delete', auth, async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(404).send('User Not Found')
        }
        user.delete()
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }

})

module.exports = router