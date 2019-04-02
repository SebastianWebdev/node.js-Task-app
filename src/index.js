// importing modules
const express = require('express');
// importing routers
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')

const listRouter = require('./routes/list')

//importing files for using DB
require('./db/mongose') // cały kod z mongoose

//-----config express serwer
const app = express();
const port = process.env.PORT || 3000;


// maintenance middleware
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Credentials', true);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(express.json()) // express will automaticly parse data to json
// routes to endpoints
app.use(userRouter)
app.use(taskRouter)
app.use(listRouter)



// ------------------------------------------Starting a serwer
app.listen(port, () => {
    console.log(`serwer is running at port: ${port}`);

})