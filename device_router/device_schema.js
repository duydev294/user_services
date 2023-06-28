const mongose = require("mongoose")
var device_schema = new mongose.Schema({
    device_name:{
        type: String,
        require: true,
        default: null
    },
    device_ip:{
        type: String,
        require: true,
        default: null

    },
    API_key:{
        type:String,
        required: true
    },
    count_message:{
        type: Number,
        require: true,
        default: 0
    },
    mess_in_minute:{
        type: Number,
        require: false,
        default: 0
    },
    is_block:{
        type: Boolean,
        require: false,
        default: false
    },
    time_interval:{
        type: Number,
        require: false,
        default: null
    },
    lat:{
        type: String,
        require: true,
        default: null
    },
    lon:{
        type: String,
        require: true,
        default: null
    },
    last_message:{   // time that the nearest messagse be receive  
        type: String,
        require: true,
        default: null
    },
    data:[{
       time: String,
       Temp: String,
       DO: String,
       pH: String,
       EC:String
    }],
    Alert_t:{
        type: Array,
        require: true,
        default: []
    },
    Alert_message:{
        type:Array,
        require : true
    },
    Threshold_alert:{
        type:Array,
        default: [{
            Time_set:'',
            Temp:{
                min: 20,
                max:40,
                
            },
            DO:{
                min: 0,
                max:4000
    
            },
            EC:{
                min: 0,
                max:100,
                
            },
            pH:{
                min: 4,
                max:8.5
            },
           
        }]
    },
    Predic_data:[{
        Time_predic: String,
        Predic_data:{
            Temp: Number,
            DO: Number,
            pH: Number ,
            EC:Number  ,
        }
    }],
})
module.exports = device_schema