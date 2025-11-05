/*
summary user account creation page
*/

//data schema modles
import Admin from "../models/adminModel.js";
import Customer from "../models/customerModel.js";

//mongoose for UUID
import mongoose from "mongoose";


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

//register defualt admin 
user.post("/register", async (req, res) => {
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
        //creating new admin entry 
        const admin = new Admin({
            
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: "admin"
        })
        //push to db
        admin.save((err, savedAdmin) => {
                if (err) {
                 console.error(err);
        } else {
                 console.log(savedAdmin);
        }
    })
        
    }
    catch(error){
        
    }
}
)


//register admin

//register customer


//update details


//delet acount



export default user