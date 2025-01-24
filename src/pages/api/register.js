import bcrypt from "bcryptjs";
import connectDB from "../../lib/mongodb";
import User from "../../models/User";

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { username, email, fullName, password } = req.body;

        await connectDB();

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email
                    ? "Email already exists"
                    : "Username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            fullName,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ success: true, message: "User registered successfully" });
    } else {
        res.status(405).json({ success: false, message: "Method not allowed" });
    }
};

export default handler;
