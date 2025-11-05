/*
class summary 
this is a template class for admin users in the mongo
like mvc same same but different 
Admind :{
    id: String,
    name: String,
    email: String,
    password: String,
    role: String}
*/

//for data definition language 
import mongoose from "mongoose";
//db schema

//TO:DO and more ECC
const adminSchema =  new mongoose.Schema({
    id: {
        //auto generated 
        type: mongoose.Schema.Types.ObjectId,

        required: true,
        unique: true
    },
    admin_name: {
        type: String,
        //validate: {
            //regex for checking name input
       
        
        //},
        required: true
    },
    email: {
        type: String,
        required: true,
         validate: {
            //regex checker for email input 
        validator: function (v) {
          let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
          return regex.test(v);
        },
    
        
    },
    unique: true
    },
    password: {
        //need to salt and ecypt
        type: String,
        required: true
    },
    role: {
        //automatically set when user accounts are created 
        type: String,
        required: true
    }
});



//variable to contain our schema --like a model class in mvc
const adminModel = mongoose.model("admin", adminSchema);
export default adminModel  