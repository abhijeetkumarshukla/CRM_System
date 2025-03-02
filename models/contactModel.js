const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    
    name:{type:String,required:true},
    email:{type:String,required:true, unique:true},
    phone:{type:String,required:true},
    company: {type:String}
    
},
 {
    timestamps: true
 }
)

const ContactModel = mongoose.model('Contact', contactSchema);

module.exports =  ContactModel;