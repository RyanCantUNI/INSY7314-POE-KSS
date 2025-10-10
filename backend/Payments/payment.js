//here we create a payment 

//imports 
import express from "express";
import bodyParser from "body-parser";
//for creating untracable user ids
import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";



//db client 
import { client } from "../DB/db.js";
//token checker
import tokenChecker from "../DB/token.js";

//useable variables for automation 

//users collection 
const users = client.db("APDS")

//payments collection 
let payments = users.collection("payments")

//curent date for payment
const date = new Date();
const currentDate = date.toLocaleDateString()

//setting up module 
const makePayment = express()

makePayment.use(cookieParser())
//set up body parser 
makePayment.use(bodyParser.json())
makePayment.use(bodyParser.urlencoded({ extended: true }))


//payment collection
//body based off this documentation for the SWIFT API: https://documenter.getpostman.com/view/8153370/TzkyKybq
/* {
    //auto generated
    paymentID
    date
    user id
    //user input
    amount
    provider Account
    currency 
    SWIFT Code
} */
//post method 
//this is UUID
makePayment.post('/payment:id',
    //input sanitation
    body('amount').isLength({ min: 1 }),
    body('providerAccount').isLength({ min: 6, max: 15 }),
    body('currency').isLength({ min: 1 }),
    body('SWIFTCode').isLength({ min: 4 }),
    tokenChecker,  async (req, res) => {
    try {
        const logedInUID = req.params.id.replace(":", "")
        console.log(logedInUID)
        console.log(tokenChecker)
        //jwt token with our logged in UID
        //const tokenID  = req.cookies.token;
        //const payload = jwt.verify(tokenID, "User token");
        //const logedInUID = payload.UUID
        //const logedInUID = '173'

        //SWIFT api call would go here

        //if successful
        //create our db payment log
        const paymentModule = {
            paymentID: uuidv4(),
            date: currentDate,
            userID: logedInUID,

            amount: req.body.amount,
            providerAccount: req.body.providerAccount,
            currency: req.body.currency,
            SWIFTCode: req.body.SWIFTCode
        }

        //add to payments collection 
        await payments.insertOne(paymentModule)
        res.status(200).send('Payment made')



    }
    catch (err) {
        console.log('Error makeing payment', err)
        res.status(500).send('Error makeing payment')
    }

}

)


export default makePayment