/*

defualt index page. handles routing for login

//takes user to login from page
//check for user role in db 
//redirect to corrct login handler 

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

//token builder
import { userToken, generateAdminsToken } from "../DB/token.js";





//express
import express from "express";

const login = express()

login.use(bodyParser.json());

//password hash checker
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password.toString(), hashedPassword.toString());
};



login.post("/login", async (req, res) => {
    let passwordMatch = false

    const _email = {email: req.body.email.toString()};
    const _password = req.body.password.toString();
  

    //we first check if the user is admin or customer
    const admin = await Admin.findOne(_email);
    const customer = await Customer.findOne(_email);

    

    if (admin){
        passwordMatch = await comparePassword(_password, admin.password);
        if (passwordMatch) {
           //call admin auth to set up that stuff
           ///get admin id
           let _id = admin.id
           let _email = admin.email
           
           //generate token
           const token = generateAdminsToken(_id, _email, "admin");

           //set cookie
           res.cookie("token", token, { httpOnly: true });
           
            //return user role
            res.status(200).json({ role: "admin" });
          
        } else {
            res.status(401).json({ message: "Invalid credentials admin" });
        }
    }
    else if (customer){
         passwordMatch = await comparePassword(_password, customer.password);
        if (passwordMatch) {
          //call user auth to set up that stuff 

          //get user id
          let _id = customer.id
          let _email = customer.email
          //generate token
          const token = userToken(_id, _email, "customer");
          //set cookie
          res.cookie("token", token, { httpOnly: true });

          //return user role
            res.status(200).json({ role: "customer" });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    }
    else{
        res.status(401).json({ message: "Invalid credentials or user does not exist " });
    }

}

)

export default login