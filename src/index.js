// importing modules
const express = require('express');
// importing routers
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')

//importing files for using DB
require('./db/mongose') // cały kod z mongoose

//-----config express serwer
const app = express();
const port = process.env.PORT || 3000;


// maintenance middleware
app.use((req, res, next) => {
    res.status(503).send("Service is temporary unavailable")
})
app.use(express.json()) // wxpress will automaticly parse data to json
// routes to endpoints
app.use(userRouter)
app.use(taskRouter)



// ------------------------------------------Starting a serwer
app.listen(port, () => {
    console.log(`serwer is running at port: ${port}`);

})