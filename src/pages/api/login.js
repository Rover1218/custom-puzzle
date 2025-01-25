import bcrypt from "bcryptjs";
import connectDB from "../../lib/mongodb";
import User from "../../models/User";

const handler = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        await connectDB();
        const { username, password } = req.body;

        console.log("Login attempt for username:", username); // Debug log

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both username and password"
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            console.log("User not found:", username); // Debug log
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log("Password mismatch for user:", username); // Debug log
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Return user without password
        const userWithoutPassword = {
            _id: user._id.toString(),
            username: user.username,
            email: user.email || `${user.username}@example.com`,
        };

        console.log("Login successful for user:", username); // Debug log

        return res.status(200).json({
            success: true,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export default handler;
