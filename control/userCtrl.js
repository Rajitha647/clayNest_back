import usermodel from '../model/usermodel';
import bcrypt from "bcryptjs";
import { createToken } from '../middleware/token';

const totalUser = async (req, res) => {
    try {
      const totalUsers = await usermodel.countDocuments();
      res.json({ total: totalUsers });
    } catch (error) {
      console.error("Error fetching total users:", error);
      res.status(500).json({ message: "Error fetching total users" });
    }
};

const register = async (req, res) => {
    try {
        const { fullname, phone, email, password } = req.body;

        if (!fullname || !phone || !email || !password) {
            return res.status(400).json({ status: 0, msg: 'All fields are required' });
        }

        const existingUser = await usermodel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ status: 0, msg: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new usermodel({
            fullname,
            phone,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(201).json({ status: 1, msg: 'Registered successfully', userId: newUser._id });
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ status: 0, msg: 'Internal server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    let user = await usermodel.findOne({ email: email });
    if (user) {
        const result = await bcrypt.compare(password, user.password);
        if (result) {
            let token = await createToken(user);
            res.json({ status: 1, msg: "Login success", 'userId': user._id, 'token': token, 'user': user });
        } else {
            res.json({ status: 0, msg: "Password incorrect" });
        }
    } else {
        res.json({ status: 0, msg: "User not found" });
    }
};

export { register, login, totalUser };
