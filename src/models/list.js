const mongose = require('mongoose')
const listShema = new mongose.Schema({
    tittle: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    temp_id: {
        type: Number
    },
    owner: {
        type: mongose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    completed: {
        type: Boolean,
        required: true,
    }
}, {
        timestamps: true,
    })

listShema.virtual('tasks', {
    ref: "Task",
    localField: "_id",
    foreignField: "list",
})


listShema.pre('remove', async function(next) {
    const list = this
    await Task.deleteMany({
        list: list._id
    })
    next()
})
const List = mongose.model('List', listShema)
module.exports = List
//comments