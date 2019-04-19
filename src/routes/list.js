const express = require('express');
const router = new express.Router()
const List = require("../models/list")
const auth = require('../middleware/auth')
const fList = require('../middleware/fList')
// creaate list
router.post("/lists", auth, async (req, res) => {
    const list = new List({
        ...req.body,
        owner: req.user._id,
        completed: false,
    })
    try {
        await list.save()
        res.status(201).send(list)
    } catch (e) {
        res.status(400).send(e)
    }
})
//get user lists
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
// update List
router.patch('/lists/:id', auth, fList, async (req, res) => {
    const valid = ['tittle', 'description'];
    const proper = Object.keys(req.body)
    const isValid = proper.every(i => valid.includes(i))
    if (!isValid) {
        return res.status(400).send("Error:Bad properties name")
    }
    try {
        const list = req.list
        if (!list) {
            return res.status(404).res.send("Task not found")
        }
        proper.forEach(p => list[p] = req.body[p])
        await list.save()
        res.send(list)
    } catch (e) {
        res.status(500).send(e)
    }
})
// delete list
router.delete('/lists/:id', auth, fList, async (req, res) => {
    const list = req.list
    console.log(list);

    try {
        await List.findByIdAndDelete({
            _id: list._id
        })
        res.send(list)
    } catch (e) {
        res.status(500)
    }


})

module.exports = router