const express = require('express');
const router = new express.Router()
const Task = require("../models/task")
const auth = require('../middleware/auth')
const fList = require('../middleware/fList')

// post task
router.post("/tasks", auth, fList, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id,
        list: req.list._id,
        stage: 1
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// get user tasks by list
router.get('/tasks/list/:id', auth, fList, async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.sort) {
        const keyValue = req.query.sort.split(":")
        sort[keyValue[0]] = keyValue[1] === "desc" ? -1 : 1
    }

    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }
    match.list = req.body.list_id
    try {
        await req.list.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            },
        }).execPopulate()

        if (!req.list.tasks) {

            throw new Error(res.status(404).send("task not found"))
        }
        res.send(req.list.tasks)
    } catch (e) {
        res.status(500)
    }

})

// get all user tasks 
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.sort) {
        const keyValue = req.query.sort.split(":")
        sort[keyValue[0]] = keyValue[1] === "desc" ? -1 : 1
    }

    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            },
        }).execPopulate()
    } catch (e) {
        res.status(500)
    }

    if (!req.user.tasks) {
        throw new Error(res.status(404).send("task not found"))
    }
    if (req.query.stats) {
        const tasksCompleted = req.user.tasks.filter(task => task.completed).length
        const tasksTotal = req.user.tasks.length
        const tasksUncompleated = tasksTotal - tasksCompleted
        const stats = {
            tasksTotal,
            tasksCompleted,
            tasksUncompleated
        }
        res.send(stats)
    } else {

        res.send(req.user.tasks)
    }

})

//---------------- Updating 

// update task by id
router.patch('/tasks/:id', auth, async (req, res) => {
    const valid = ['completed', 'description', 'stage', 'name'];
    const proper = Object.keys(req.body)
    const isValid = proper.every(i => valid.includes(i))
    if (!isValid) {
        return res.status(400).send("Error:Bad properties name")
    }
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        }) // searching task by its id and owner id
        if (!task) {
            return res.status(404).res.send("Task not found")
        }
        proper.forEach(p => task[p] = req.body[p])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

//---------Deleting

// delete task by id
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task) {
            return res.status(404).send('Task Not Found')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// exporting 
module.exports = router