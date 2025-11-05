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

payment.post("/payment:id", async (req, res) => {

 let payment = new Payment({
    id: req.params.id,
    amount: req.body.amount,
    date: req.body.date,
    description: req.body.description,
    customer_id: req.body.customer_id
 });

 try {
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
 }


});

export default payment