const List = require('../models/list')
const fList = async (req, res, next) => {
    try {
        const _id = req.body.list_id


        const list = await List.findOne({
            _id,
        })
        if (!list) {
            // console.log(list);

            throw new Error("List not found")
        }
        req.list = list
    } catch (e) {
        res.status(404).send("Nie znaleziono listy")
    }
    next()
}
module.exports = fList