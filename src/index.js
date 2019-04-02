// importing modules
const express = require('express');
// importing routers
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')
const devRouter = require('./routes/dev')
const listRouter = require('./routes/list')

//importing files for using DB
require('./db/mongose') // cały kod z mongoose

//-----config express serwer
const app = express();
const port = process.env.PORT || 3000;


// maintenance middleware

app.use(express.json()) // express will automaticly parse data to json
// routes to endpoints
app.use(userRouter)
app.use(taskRouter)
app.use(listRouter)
app.use(devRouter)




/*const mail = require("./mail/mailer")
mail(
    mailOptions = {
        from: 'kontakt@sebastian-webdev.pl',
        to: 'sebastian.goleb@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    }
)*/

// ------------------------------------------Starting a serwer
app.listen(port, () => {
    console.log(`serwer is running at port: ${port}`);

})