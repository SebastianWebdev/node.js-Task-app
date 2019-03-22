const express = require('express');
const router = new express.Router()
const User = require("../models/user")



// add new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    const token = await user.generateAuthToken()

    try {
        await user.save()
        res.status(201).send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send(e)
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

// get user by params
router.get('/getUsers', async (req, res) => {
    const params = req.query
    try {
        const result = await User.find(params)
        if (result.length === 0) {
            return (res.status(404).send("User Not found"))
        }
        res.send(result)


    } catch (e) {
        res.status(500).send(e)
    }
})

// getting user by id
router.get('/getUserById/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const result = await User.findById(_id)
        if (!result) {
            throw new Error(res.status(404).send('User not found'))
        }
        res.send(result)
    } catch (e) {
        res.status(500).send(e)
    }
})
// Update User Data
router.patch('/updateUserById/:id', async (req, res) => {
    const valid = ['name', 'email', 'password', 'age'];
    const updates = Object.keys(req.body);
    const isValid = updates.every(i => valid.includes(i))
    if (!isValid) {
        return res.status(400).send('Wrong Property name')
    }
    try {
        const user = await User.findById(req.params.id)


        if (!user) {
            return res.status(404).send('User not found')
        }
        updates.forEach(update => user[update] = req.body[update])

        await user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// delete User by id
router.delete('/deleteUserById/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send('User Not Found')
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }

})

module.exports = router