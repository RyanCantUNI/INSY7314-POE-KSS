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

//auth checks
import jwt from "jsonwebtoken";


//mongo connection 
import connectToDatabase from "../DB/db.js";




//express
import express from "express";

const login = express();

login.use(bodyParser.json());

