import express from "express";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from 'uuid';
import { check, validationResult } from "express-validator";

import { client } from "../DB/db.js";


const router = express.Router();
router.use(express.json());

//user collection in BD
const users = client.db("APDS").collection("users");

// Registration endpoint
router.post('/register', async (req, res) => {
    const { fullName, email, idNumber, accountNumber, password } = req.body;
    // accountNumber stands for Bank account number
    const nameRegex = "/^[A-Za-z\s]{3,50}$/";
    const idRegex = "/^[0-9]{6,13}$/";
    const accountRegex = "/^[0-9]{6,15}$/";
    const passwordRegex = "/^[A-Za-z0-9!@#\$%\^&\*]{8,}$/";


    if (
        !validateInput(nameRegex, fullName) ||
        !validateInput(idRegex, idNumber) ||
        !validateInput(accountRegex, accountNumber) ||
        !validateInput(passwordRegex, password)
    ) {
        return res.status(400).json({ message: 'Invalid input. Please check your details.' });
    }
    else {



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

}
);

export default router;