// packages
const mongose = require('mongoose')


const connectionURL = 'mongodb://127.0.0.1:27017/Task-Manager-Api'
const connectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true, // very important!
    useFindAndModify: false,
}


mongose.connect(connectionURL, connectionOptions).catch(error => console.log(error));