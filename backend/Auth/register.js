/*
summary user account creation page
*/

//data schema modles
import Admin from "../models/adminModel.js";
import Customer from "../models/customerModel.js";

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

//express app
const user = express()
user.use(bodyParser.json())

//register defualt admin 
// user.post("/register", async (req, res) => {
//     try{
//         /*
//         id: String,
//         name: String,
//         email: String,
//         password: String,
//         role: String}
//         */
//         //encrypting and salting password
//         const hashedPassword = await bcrypt.hash(req.body.password, 10)
//         const adminName = req.body.admin_name
//         const emailIn = req.body.email
//         const _id = new mongoose.Types.ObjectId();
//         //creating new admin entry 
//         const admin = new Admin({
//             id: _id,
//             admin_name: adminName,
//             email: emailIn,
//             password: hashedPassword,
//             role: "admin"

//         })
//         //push to db
//         await admin.save();
    
        
//         res.status(201).json({ message: "Admin registered successfully" });
//         console.log(admin)

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


//register admin

//register customer


//update details


//delet acount

//register standard user 
user.post("/register/customer", async (req, res) => {
    try{
        /*
        id: String,
        name: String,
        email: String,
        password: String,
        role: String}
        */
        //encrypting and salting password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const customerName = req.body.name
    
        const _id = new mongoose.Types.ObjectId();
        let emailIn = ""
        //check sum to see if user already exists
         const doesEmailExist = await Admin.findOne({ email: req.body.email });
         if (doesEmailExist) {
            return res.status(400).json({ message: "Email already exists" });
          }
          else{
             emailIn = req.body.email
          }
        //creating new admin entry 
        const customer = new Customer({
            id: _id,
            customer_name: customerName,
            email: emailIn,
            password: hashedPassword,
            role: "customer"
    })
        //push to db
        await customer.save();
    
        
        res.status(201).json({ message: "Customer registered successfully" });
        console.log(customer)

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



//register admin user
user.post("/register/admin", async (req, res) => {
    try{
        /*
        id: String,
        name: String,
        email: String,
        password: String,
        role: String}
        */
        //encrypting and salting password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const _adminName = req.body.admin_name
       
        const _id = new mongoose.Types.ObjectId();
        let emailIn
        //check sum to see if user already exists
         const doesEmailExist = await Admin.findOne({ email: req.body.email });
         if (doesEmailExist) {
            return res.status(400).json({ message: "Email already exists" });
          }
          else{
             emailIn = req.body.email
          }
        //creating new admin entry 
        const admin = new Admin({
            id: _id,
            admin_name: _adminName,
            email: emailIn,
            password: hashedPassword,
            role: "admin"

        })
        //push to db
        await admin.save();
    
        
        res.status(201).json({ message: "Admin registered successfully" });
        console.log(admin)

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



//get all admins
user.get("/getuser/admin", async (req, res) => {
    try {
        const users = await Admin.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



//get all customers
user.get("/getuser/customer", async (req, res) => {
    try {
        const users = await Customer.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});




//delete account 



export default user