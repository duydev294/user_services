const express = require("express")
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
require("dotenv").config()
var device_router = express.Router()
///var Device = require('./device_schema')
const uri_devices = 'mongodb://admin_sanslab:sanslab@sanslab1.ddns.net:27017/devices'
const { makeid } = require("./generate_apiKey")
const device_schema = require("./device_schema");
const device_manager_sche = require("../device_manager/device_manager_sche");
const { getDay } = require("./day");


device_router.post('/create',async(req,res)=>{
   
    var API = makeid(8)
    const device_name = req.body.device_name
    const device_lat = req.body.lat
    const device_lon = req.body.lon
    var conn2 = await mongoose.createConnection(uri_devices,{authSource:"admin"});
    
    // find api device in device manager 
    const device_manager_model = conn2.model('device_manager',device_manager_sche)
    let device_manager = await device_manager_model.find({})
    if(device_manager.length === 0 ){
        let device_manage = new device_manager_model({
            device_active:[API]
        })
        await device_manage.save()
    }else{
        if(!device_manager[0].device_active.includes(API)){
            let new_device = {
                API_key:API,
                create_time:getDay()
            }
            await device_manager_model.updateOne({},{$push:{device_active:new_device}})
        }
        else {
            res.json({
                'message':'Error, try again',
            })
        }
    }


    const device_model = conn2.model(API,device_schema)
    let devices = await device_model.find({});
    if(devices.length != 0){
        res.json({
            'message':'Error, try again',
        })
    }else{
        var device = new device_model({
            device_name:device_name,
            API_key:API,
            lat:device_lat,
            lon:device_lon
        })
        device.save()
        res.json({
            'message':'Success'
        })
    }
    
})


// device_router.post('/get/data_by_ID/',async(req,res)=>{

// })

device_router.post('/set/threshold',async (req,res)=>{
    console.log(req.body)
    let API_device = req.body.API_key
    let threshold = req.body.threshold
    var conn2 = await mongoose.createConnection(uri_devices,{authSource:"admin"});
    const device_manager_model = conn2.model('device_manager',device_manager_sche)
    let device_manager = await device_manager_model.find({})
    if(device_manager.length === 0){
        res.json({
            'message':'Error, try again',
        })
    }
    else{
        if(device_manager[0].device_active.find((item) => item.API_key === API_device)){
            var conn2 = await mongoose.createConnection(uri_devices,{authSource:"admin"});
            const device_model = conn2.model(API_device,device_schema)
            let threshold_obj = {
                Time_set: getDay,
                Temp: threshold.Temp,
                DO: threshold.DO,
                EC: threshold.EC,
                pH: threshold.pH
            }
            device_model.updateOne({},{$push:{Threshold_alert:threshold_obj}})
            res.json({
                'message':'Success'
            })
        }else{
            res.json({
                'message':'API_key not found!'
            })
        }
    }
})



device_router.get('/get/API_key',async(req,res)=>{
   
    var conn2 = await mongoose.createConnection(uri_devices,{authSource:"admin"});
    const device_manager_model = conn2.model('device_manager',device_manager_sche)
    let device_manager = await device_manager_model.find({})
    if(device_manager.length === 0){
        res.json({
            'message':'Error, try again',
        })
    }
    else{
        let API_key = device_manager[0].device_active
        console.log(API_key)
        res.json({
            'message':'success',
            'API_key':API_key
        })
    }

})

device_router.post('/get/data_by_key',async(req,res)=>{
    let API_device = req.body.API_key
    let number = req.body.num_data
    var conn2 = await mongoose.createConnection(uri_devices,{authSource:"admin"});
    const device_manager_model = conn2.model('device_manager',device_manager_sche)
    let device_manager = await device_manager_model.find({})
    if(device_manager.length === 0){
        res.json({
            'message':'Error, try again',
        })
    }
    else{
        if(device_manager[0].device_active.find((item) => item.API_key === API_device)){
            const device_model = conn2.model(API_device,device_schema)
            let device = await device_model.find({})
            console.log(device)
            let device_data = {
                API_key: device[0].API_key,
                lat: device[0].lat,
                lon:device[0].lon,
                last_message: device[0].last_message,
                Alert_t: device[0].Alert_t,
                data: device[0].data.slice(-number),
                predict_data: device[0].Predic_data.slice(-10),
                arlert_mess: device[0].Alert_message.slice(-20),
                threshold:device[0].Threshold_alert.slice[-1]
            }
            
            res.json({
                'message':'Success',
                'data':device_data
            })
        }else{
            res.json({
                'message':'API_key not found!'
            })
        }
    }

})
module.exports  = device_router