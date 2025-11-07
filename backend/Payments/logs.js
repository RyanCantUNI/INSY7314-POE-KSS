/*
 this can get all payments or payments by customer ID
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


//express 
import express from "express";
//input sanitation



const logs = express()

logs.use(bodyParser.json());


//get all payments
//no parsed id will reutrn all payments made
logs.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving payments" });
  }
});



//get payments by customer id 
//parse in id which we get from session token
logs.get("/payments/:id",
  async (req, res) => {
  let _customer_id = req.params.id.replace(":", "")
  try {
    console.log(_customer_id)
    const payments = await Payment.find({ customer_id: _customer_id });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving payments" });
  }
});


export default logs;