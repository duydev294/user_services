const bodyParser = require('body-parser')
const express = require('express')
require('dotenv').config()
const app = express()
var device_router = require('./device_router/device_router')


var DB_URL = process.env.MONGO_URL
var port = process.env.PORT
console.log('mongo DB:'+DB_URL)
console.log("PORT"+port)



app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.json())


app.use('/api/device',device_router)

app.get('/',(rep,res)=>{
    res.json({
        'message':'Hello'
    })
})


const mongose = require('mongoose')
mongose.Promise = global.Promise
mongose.connect(DB_URL,).then(
    ()=>{
        console.log('Connect DB successfully')
        app.listen(port, ()=>{
            console.log("app is running on port: "+ port);
        })
    }
)