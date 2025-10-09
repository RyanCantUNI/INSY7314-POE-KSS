import express from "express";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from 'uuid';
import validate from "express-validator";

const router = express.Router();
router.use(express.json());



// Registration endpoint
router.post('/register', async (req, res) => {
    const { fullName, email, idNumber, accountNumber, password } = req.body;

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
    else{

    // Check if user already exists
    const userExists = users.find(user => user.UUID === targetUuid);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    } else {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //make a user model

        const user = {
            fullName,
            email,
            idNumber,
            accountNumber,
            password: hashedPassword,
            UUID,
        };
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
    }
}
});

export default router;