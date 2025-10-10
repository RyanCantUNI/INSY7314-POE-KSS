import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { body, validationResult } from "express-validator";


import { client } from "../DB/db.js";


const app = express();

// Middleware
app.use(bodyParser.json());

//db collection
let collection = client.db("APDS").collection("users");

// Login route
app.post("/login",
    //input sanitation
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('accountNumber').isLength({ min: 6, max: 15 }),
    async (req, res) => {
        const { email, password, accountNumber } = req.body;
        try {
            const user = await collection.findOne({ email: email });
            const isValid = validationResult(req);
            if (isValid) {
                if (!user) {
                    return res.status(401).send("Ensure name and password are correct.");
                }
                else {
                    let isPasswordValid = await bcrypt.compare(password, user.password);
                    let isAccountValid = await bcrypt.compare(accountNumber, user.accountNumber);
                    if (!isPasswordValid && !isAccountValid) {
                        return res.status(401).send("Ensure name and password are correct.");
                    }
                    else {
                        //get UUID from db for token
                        const tokenID = user.UUID;
                        console.log("tokenID: "+tokenID);
                        const token = jwt.sign({ tokenID }, "User token", { expiresIn: '2h' });

                        //storing UUID for loged in user
                        const UUID = user.UUID;
                        //localStorage.setItem("userID", userId);
                        console.log("logged in user"+UUID);
                        res.status(200).json({ UUID: UUID, Message: "Successfully logged in" })
                        console.log(token);
                    }
                }
            }
        }
        catch (error) {
            console.error(error);
            res.status(401).send("Failed login attempt.");
        }
    })

export default app;