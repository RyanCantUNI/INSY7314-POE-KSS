//here we create a payment 

//imports 
import express from "express";
import bodyParser from "body-parser";
//for creating untracable user ids
import UUID from "uuid/v4";


//db client 
import {connectionString} from "../DB/db.js";  
//token checker
import tokenChecker from "../DB/token.js";

//useable variables for automation 

    //users collection 
    const users = client.db("users")

    //payments collection 
    let payments = users.collection("payments")

    //curent date for payment
    const date = new Date();
    const currentDate = date.toLocaleDateString()

    //setting up module 
    const makePayment = epxress()

    //set up body parser 
    makePayment.use(bodyParser.json())
    makePayment.use(bodyParser.urlencoded({extended: true}))


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
makePayment.post('/payment',tokenChecker,async(req,res)=>
    {
        try{
            //jwt token with our logged in UID
            const jwt = req.headers.authorization.split(' ')[1]
            const payload = jwt.verify(jwt,process.env.JWT_SECRET)
            const userID = payload.sub

            //SWIFT api call would go here

            //if successful
            //create our db payment log
            const paymentModule = {
                paymentID: UUID(),
                date: currentDate,
                userID: userID,
                
                amount: req.body.amount,
                providerAccount: req.body.providerAccount,
                currency: req.body.currency,
                SWIFTCode: req.body.SWIFTCode
            }

            //add to payments collection 
            await payments.insertOne(paymentModule)
            res.status(200).send('Payment made')
          


        }
        catch(err){
            console.log('Error makeing payment',err)
            res.status(500).send('Error makeing payment')
        }

    }

)


export default makePayment