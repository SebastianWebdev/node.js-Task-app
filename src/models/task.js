const mongose = require('mongoose')
const taskShema = new mongose.Schema({
    description: {
        type: String,
        trim: true,
        required: true,
    },
    completed: {
        type: Boolean,
        required: false,
        default: false,
    }
})

taskShema.pre('save', async function(next) {


    next()
})
const Task = mongose.model('Task', taskShema)
module.exports = Task