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



export default user