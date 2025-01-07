const usermodel = require('../model/usermodel');
const bcrypt = require('bcrypt');
const { createToken } = require('../middleware/token');




const totalUser=async (req, res) => {
    try {
      const totalUsers = await usermodel.countDocuments();
      res.json({ total: totalUsers });
    } catch (error) {
      console.error("Error fetching total users:", error);
      res.status(500).json({ message: "Error fetching total users" });
    }
  }
const register = async (req, res) => {
    try {
        const { fullname, phone, email, password } = req.body;

        // Check if all required fields are present
        if (!fullname || !phone || !email || !password) {
            return res.status(400).json({ status: 0, msg: 'All fields are required' });
        }

        // Check if the email already exists
        const existingUser = await usermodel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ status: 0, msg: 'Email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10); // Ensure salt is defined
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        const newUser = new usermodel({
            fullname,
            phone,
            email,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();

        return res.status(201).json({ status: 1, msg: 'Registered successfully', userId: newUser._id });
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ status: 0, msg: 'Internal server error' });
    }
};



// Login endpoint
const login = async (req, res) => {
    const { email, password } = req.body;

    let user = await usermodel.find({ email: email });
    let password_db;
    if (user.length > 0) {
        password_db = user[0].password;
        const result = await bcrypt.compare(password, password_db);
        if (result) {
            let token = await createToken(user);
            res.json({ status: 1, msg: "Login success", 'userId': user[0]._id, 'token': token,'user': user[0] });
        } else {
            res.json({ status: 0, msg: "Password incorrect" });
        }
    } else {
        res.json({ status: 0, msg: "User not found" });
    }
};

module.exports = {
    register,
    login,
    totalUser
};
