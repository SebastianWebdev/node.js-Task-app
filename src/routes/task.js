const express = require('express');
const router = new express.Router()
const Task = require("../models/task")

// post task
router.post("/tasks", async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// get tasks by params
router.get('/getTasks', async (req, res) => {
    const params = req.query
    const result = await Task.find(params)
    try {
        if (result.length === 0) {
            throw new Error(res.status(404).send("Tasks not found"))
        }
        res.send(result)
    } catch (e) {
        res.status(500).send(e)
    }
})
// get task by id
router.get('/getTaskById/:id', async (req, res) => {
    const _id = req.params.id
    const result = await Task.findById(_id)
    try {
        if (!result) {
            throw new Error(res.status(404).send('Task not found'))
        }
        res.send(result)
    } catch (e) {
        res.status(500).send(e)
    }

})
//---------------- Updating 

// update task by id
router.patch('/updateTaskById/:id', async (req, res) => {
    const valid = ['completed', 'description'];
    const proper = Object.keys(req.body)
    const isValid = proper.every(i => valid.includes(i))
    if (!isValid) {
        return res.status(400).send("Error:Bad properties name")
    }
    try {
        const task = await Task.findById(req.params.id)
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
router.delete('/deleteTaskById/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
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