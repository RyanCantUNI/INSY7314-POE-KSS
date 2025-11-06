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






//express
import express from "express";

const login = express()

login.use(bodyParser.json());


login.post("/login", async (req, res) => {

    const _email = req.body.email;
    const _password = req.body.password;
   

    //we first check if the user is admin or customer
    const admin = await Admin.findOne({email: _email});
    const customer = await Customer.findOne({email: _email});

    

    if (admin){
        const passwordMatch = await bcrypt.compare(_password, admin.password);
        if (passwordMatch) {
           //call admin auth to set up that stuff
            console.log("valid admin")
            //return user role
            res.status(200).json({ role: "admin" });
          
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    }
    else if (customer){
        const passwordMatch = await bcrypt.compare(_password, customer.password);
        if (passwordMatch) {
          //call user auth to set up that stuff 


          //return user role
            res.status(200).json({ role: "customer" });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    }
    else{
        res.status(401).json({ message: "Invalid credentials " });
    }

}

)

export default login