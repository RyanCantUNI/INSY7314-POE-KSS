/*
summary this page will let cusomters make payments 
*/

//data schema modles
import Admin from "../models/adminModel.js";
import Customer from "../models/customerModel.js";
import Payment from "../models/paymentModel.js";

//mongoose for UUID
import mongoose from "mongoose";

//json parsing
import bodyParser from "body-parser";

//bycrypt for encryption
import bcrypt from "bcrypt";

//auth checks
import jwt from "jsonwebtoken";


//mongo connection 
import connectToDatabase from "../DB/db.js";

//express stuff 
import express from "express";
const payment = express();

payment.use(bodyParser.json());

/*
    id

amount

account_paid_to(number)

accountName

branchCode

SwiftID(optional)

date

customer_id*/

payment.post("/payment:id", async (req, res) => {

_id = new mongoose.Types.ObjectId();
_ammount = req.body.ammount
_account_paid_to = req.body.account_paid_to
_accountName = req.body.accountName
_branchCode = req.body.branchCode
_SwiftID = req.body.SwiftID
_date = req.body.date
_customer_id = req.body.customer_id

 let payment = new Payment({
    id: _id,
    ammount: _ammount,
    account_paid_to: _account_paid_to,
    accountName: _accountName,
    branchCode: _branchCode,
    SwiftID: _SwiftID,
    date: _date,
    customer_id: _customer_id
 });

 try {
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
 }


});

export default payment