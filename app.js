const express = require("express")
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const userRoute = require("./api/routes/users")

const app = express();

mongoose.connect(process.env.MONGO_ATLAS_URL)
.then(()=>console.log('Database Connected'))
.catch(e=>console.log(e));

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({
    extended:false
}))

app.use(bodyParser.json())

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({});
    }
    next();
})

app.use("/users",userRoute)

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app