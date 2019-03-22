// importing modules
const express = require('express');
// importing routers
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')
const devRouter = require('./routes/dev')

//importing files for using DB
require('./db/mongose') // cały kod z mongoose

//-----config express serwer
const app = express();
const port = process.env.PORT || 3000;


// maintenance middleware

app.use(express.json()) // wxpress will automaticly parse data to json
// routes to endpoints
app.use(userRouter)
app.use(taskRouter)
app.use(devRouter)



// ------------------------------------------Starting a serwer
app.listen(port, () => {
    console.log(`serwer is running at port: ${port}`);

})