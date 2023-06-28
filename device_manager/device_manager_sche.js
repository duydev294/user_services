const mongoose = require("mongoose")
var device_manager_sche = new mongoose.Schema({
    device_active:{
        type: Array,
        require:true,
        default:[]
    },
    user_ID_manage:{
        type: String,
        require: true,
        default: "duydev" 
    }

})

module.exports = device_manager_sche