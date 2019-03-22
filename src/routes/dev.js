const express = require('express');
const router = new express.Router()
const User = require("../models/user")


// get user by params. This route is only for developing proccess
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
// update
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

module.exports = router