//here we just get all payments by UID 

//plugins
import express from "express";
import bodyParser from "body-parser";
import tokenChecker from "../DB/token.js";


//db client 
import { client } from "../DB/db.js";
import { get } from "https";

//useable variables for automation

//users collection 
const users = client.db("APDS")

//payments collection 
let payments = users.collection("payments")
//jwt token with our logged in UID


//modules setup

const getLogs = express()

//this id is also UID

getLogs.get('/logs:id', 
    //tokenChecker, 
    async (req, res) => {
    try {
        //get all payments containing our UID
        const id = req.params.id.replace(":", "")
        console.log(id)
        const logs = await payments.find({ userID: id}).toArray()
        console.log(logs)
        res.status(200).send(logs)
    }
    catch (err) {
        console.log("Error getting data from database: ", err);
        res.status(500).send("Error getting data from database");
    }
}
)

export default getLogs
