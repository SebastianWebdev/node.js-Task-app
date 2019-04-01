const List = require('../models/list')
const fList = async (req, res, next) => {
    try {
        const _id = req.params.id === undefined ? req.body.list_id : req.params.id
        if (!_id) {
            throw new Error("You must send ID of tasks list")
        }

        const list = await List.findOne({
            _id,
        })
        if (!list) {
            // console.log(list);
            throw new Error("List not found")
        }
        req.list = list
    } catch (e) {
        res.status(404).send('List not found')
    }
    next()
}
module.exports = fList