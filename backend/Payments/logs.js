//here we just get all payments by UID 

//plugins
import express from "express";
import bodyParser from "body-parser";
import tokenChecker from "../DB/token.js";


//db client 
import {client} from "../DB/db.js";
import { get } from "https";

//useable variables for automation

     //users collection 
    const users = client.db("users")

    //payments collection 
    let payments = users.collection("payments")
     //jwt token with our logged in UID
     

//modules setup

const getLogs = express()


getLogs.get('/logs',tokenChecker,async(req,res)=>
{
    try{
        //get all payments containing our UID
        const logs = await payments.find({userID: userID}).toArray()
        res.status(200).send(logs)
    }
    catch(err)
    {
        console.log("Error getting data from database: ", err);
        res.status(500).send("Error getting data from database");
    }
}
)

export default getLogs
