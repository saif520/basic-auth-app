const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const UserModel=require('../models/user.model');

const JWT_SECRET=process.env.JWT_SECRET;

//Register
exports.registerUser=async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        if(!username||!email||!password){
            return res.status(400).send("All fields are required.");
        }
        const user=new UserModel({username,email,password});
        const result=await user.save();
        console.log(result);
        res.status(201).send("User registered successfully!");
    }
    catch(error){
        if(error.code===11000){
            return res.status(400).send("Username or email already exist.");
        }
        res.status(500).send("Error registering user.");
    }
}


//Login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("All fields are required.");
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).send("User not found.");
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials.");
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        console.log("Generated Token:", token);
        res.json({ token });
    } catch (error) {
        console.error('Login Error:', error.message); // Logs the specific error
        res.status(500).send("Error logging in.");
    }
};

//profile
exports.getProfile = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).send("Access denied. No token provided.");
        }

        // Extract the token from the header
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send("Access denied. Invalid token format.");
        }

        // Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(verified.id).select('-password');
        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Respond with user data
        res.json(user);
    } catch (error) {
        console.error('Token Verification Error:', error.message); // Logs the specific error
        res.status(401).send("Invalid token.");
    }
};