// packages
const mongose = require('mongoose')


const connectionURL = process.env.DB_URL


const connectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true, // very important!
    useFindAndModify: false,
}


mongose.connect(connectionURL, connectionOptions).catch(error => console.log(error));