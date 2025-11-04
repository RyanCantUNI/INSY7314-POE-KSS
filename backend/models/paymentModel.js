/*
class summary 
this is a template class for customer payments in the mongo
like mvc same same but different 

payment {
    id: String,
    amount: Number,
    date: Date,
    description: String,
    customer_id: String}
*/


//for data definition language 
const mongoose = require("mongoose");

//TO:DO and more ECC
//db schema 
const paymentSchema = new mongoose.Schema({
    id: {
        //auto generated 
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        //auto generated
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    customer_id: {
        type: String,
        required: true
    }
});

//variable to contain our schema --like a model class in mvc
const paymentModel = mongoose.model("payment", paymentSchema);
export default paymentModel