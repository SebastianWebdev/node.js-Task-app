const mongose = require('mongoose')
const taskShema = new mongose.Schema({
    description: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        required: true,
    },
    stage: {
        type: Number,
        required: true,
        validate(v) {
            if (v !== 1 && v !== 2 && v !== 3) {
                throw new Error("Provide correct stage code")
            }
        }
    },
    completed: {
        type: Boolean,
        required: false,
        default: false,
    },
    list: {
        type: mongose.Schema.Types.ObjectId,
        required: true,
        ref: "List"
    },
    owner: {
        type: mongose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    temp_Id: {
        type: String,
    }
}, {
        timestamps: true,
    })

const Task = mongose.model('Task', taskShema)
module.exports = Task