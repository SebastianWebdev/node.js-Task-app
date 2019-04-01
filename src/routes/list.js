const express = require('express');
const router = new express.Router()
const List = require("../models/list")
const auth = require('../middleware/auth')
router.post("/lists", auth, async (req, res) => {
    const list = new List({
        ...req.body,
        owner: req.user._id
    })
    try {
        await list.save()
        res.status(201).send(list)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get('/lists', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'lists',

        }).execPopulate()

        if (!req.user.lists) {
            throw new Error(res.status(404).send('Lists not found'))
        }
        res.send(req.user.lists)
    } catch (e) {
        res.status(500).send(e)
    }
})
module.exports = router