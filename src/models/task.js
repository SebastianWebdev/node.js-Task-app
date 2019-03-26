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
    },
    owner: {
        type: mongose.Types.ObjectId,
        required: true,
    }
})

taskShema.pre('save', async function(next) {


    next()
})
const Task = mongose.model('Task', taskShema)
module.exports = Task