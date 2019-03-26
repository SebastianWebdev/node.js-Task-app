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
        type: mongose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
}, {
    timestamps: true,
})

const Task = mongose.model('Task', taskShema)
module.exports = Task