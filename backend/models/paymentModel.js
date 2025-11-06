/*
class summary 
this is a template class for customer payments in the mongo
like mvc same same but different 

payment {
    id

amount

account_paid_to(number)

accountName

branchCode

SwiftID(optional)

date

customer_id


*/


//for data definition language 
import mongoose from "mongoose";
//TO:DO and more ECC
//db schema 
const paymentSchema = new mongoose.Schema({
    id: {
        //auto generated 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    account_paid_to: {
        type: String,
        required: true
    },
    accountName: {
        type: String,
        required: true
    },
    branchCode: {
        type: String,
        required: true
    },
    SwiftID: {
        type: String,
        required: false
    },
    date: {
        //auto generated
        type: Date,
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