const express = require('express')
const sharp = require('sharp')
const mailer = require('../mail/mailer')
const router = new express.Router()
const User = require("../models/user")
const auth = require('../middleware/auth')
const uploadAvatar = require('../middleware/avatar')



// add new user
router.post('/users', async (req, res) => {

    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()

        await res.status(201).send({
            user,
            token,
            message: 'We send you an email, check your inbox'
        })
        await mailer(mailOptions = {
            from: 'kontakt@sebastian-webdev.pl',
            to: req.body.email,
            subject: 'Task-App welcome message',
            text: ` Welcome to Task-App! Login using this credentials: Username: ${req.body.name}, Password: ${req.body.password}`
        })


    } catch (err) {
        console.log(err);

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
        await mailer(mailOptions = {
            from: 'kontakt@sebastian-webdev.pl',
            to: user.email,
            subject: 'Task-App Goodbye',
            text: ` You just delete your account`
        })
    } catch (e) {
        res.status(500).send()
    }

})
// uplouds user avatar
router.post('/users/me/avatar', auth, uploadAvatar.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.sendStatus(200)
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})
// deleting avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save()
    res.status(200).send('avatar deleted')
})
// get user avatar
router.get('/users/:id/avatar', async (req, res) => {
    const user = await User.findById(req.params.id);
    try {
        if (!user || !user.avatar) {
            throw new Error("avatar nie znaleziony")
        }
        res.set('Content-Type', 'image/png').send(user.avatar)

    } catch (e) {
        res.status(404).send(e)
    }
})

module.exports = router