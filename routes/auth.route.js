const router = require("express").Router();
const userModel = require("../model/user.model.js");
const { DataValidation } = require("../validations/data.validate.js");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const env=require('dotenv')
env.config()
// For Register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    // Validate Body
    const { error } = DataValidation.regValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Check if the user already exists
    const emailExists = await userModel.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('Email already registered');
    // Encrypt Password
    const encryptPassword = await bcrypt.hashSync(req.body.password, 10);
    try {
        // Save the user to the database
        const saveUser = await new userModel({ name, email, password: encryptPassword }).save();
        res.send(saveUser);
    } catch (error) {
        res.status(400).send(error);
    }
});

// For Login
router.post('/login', async (req, res) => {
    const { error } = DataValidation.loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Check if the user exists
    const userExists = await userModel.findOne({ email: req.body.email });
    if (!userExists) return res.status(400).send('Email not found');
    // Compare Passwords
    const validPassword = await bcrypt.compare(req.body.password.trim(), userExists.password.trim());
    if (!validPassword) {
        return res.status(401).send('Authentication failed');
    }
    // Generate JWT Token
    const token = jwt.sign({ _id: userExists._id, email: userExists.email }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    // Include the token in the response
    res.status(200).json({ token: token });
});

// Example Protected Route - Requires a valid JWT token
router.get('/protected', (req, res) => {
    // Get the token from the request header
    const token = req.header('Authorization');
    // Verify the token
    jwt.verify(token,process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Unauthorized');
        }
        // If the token is valid, you can proceed with the protected action
        res.status(200).send('Protected Route - Authorized');
    });
});

module.exports = router;
