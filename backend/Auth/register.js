import express from "express";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from "express-validator";

import { client } from "../DB/db.js";


const router = express.Router();
router.use(express.json());



//user collection in BD
const users = client.db("APDS").collection("users");

// Registration endpoint
router.post('/register',
    [
        //regex block here
        body('fullName').isLength({ min: 3, max: 50 }),
        body('email').isEmail(),
        body('idNumber').isLength({ min: 6, max: 13 }),
        body('accountNumber').isLength({ min: 6, max: 15 }),
        body('password').isLength({ min: 8 }),
    ] ,async (req, res) => {
    const { fullName, email, idNumber, accountNumber, password } = req.body;
     const 
     isValid = validationResult(req);
    // accountNumber stands for Bank account number
 


     if (
         


       isValid
    ) {
        try {
            //input validation


            //check if user exists
            let userExists = await users.findOne({ email });
            if (userExists) {

            }
            else {
                const UUID = uuidv4();
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);
                const hashedIDnum = await bcrypt.hash(idNumber, 10);
                const hashedAccNum = await bcrypt.hash(accountNumber, 10);

                //make a user model

                const userModel = {
                    fullName: req.body.fullName,
                    email: req.body.email,
                    idNumber: hashedIDnum,
                    accountNumber: hashedAccNum,
                    password: hashedPassword,
                    UUID,
                };

                await users.insertOne(userModel);

                res.status(201).json({ message: 'User registered successfully' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Error registering user' });
        }
    }
     else {
         
         return res.status(400).json({ message: 'Invalid input. Please check your details.' });
     }
}
);

export default router;