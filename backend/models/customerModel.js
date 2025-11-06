/*
class summary 
this is a template class for customer users in the mongo
like mvc same same but different 
customer {
d:

national_Id

bankaccount

accountnumber

customer_name

email

password

role

}


*/

//for data definition language 
import mongoose from "mongoose";

//db schema 
const customerSchema = new mongoose.Schema({
    id: {
        //auto generated 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    name: {
        type: String,
        validate: {
          validator: function (v) {
          let regex = new RegExp(
            "^(?=[a-zA-Z0-9._ ]{10,35}$)(?!.*[_.]{2})[^_.].*[^_.]$"
            
          );
          return regex.test(v);
        },
        
    },
    required: true
    },
    national_Id: {
        type: String,
        required: true,
        unique: true
    },
    bankaccountnumber: {
        type: String,
        required: true,
        unique: true
    },
    account: {
        type: String,
        required: true,
        unique: true
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
const customerModel = mongoose.model("customer", customerSchema);


export default customerModel