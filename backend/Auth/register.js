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
       customer {
id:

national_Id

bankaccount

accountnumber

customer_name

email

password

role

}
        */
        //encrypting and salting password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const customerName = req.body.customer_name
        const _national_Id = req.body.national_Id
        const _bankaccount = req.body.bankaccount
        const _accountnumber = req.body.accountnumber
    
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
            name: customerName,
            national_Id: _national_Id,
            account: _bankaccount,
            bankaccountnumber: _accountnumber,
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
//find user account by id then delete it
user.delete("deletuser:id",async (req, res) => {
    try {
        const userId = req.params.id;
        const _admin = await Admin.findByIdAndDelete(userId);
        const _customer = await Customer.findByIdAndDelete(userId);
        if (!_admin && !_customer) {
            return res.status(404).json({ message: "User not found" });
        }
       
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});






export default user