import bcrypt from "bcryptjs";
import connectDB from "../../lib/mongodb";
import User from "../../models/User";

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { username, password } = req.body;

        try {
            await connectDB();

            // Find user by username
            const user = await User.findOne({ username });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid username or password"
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid username or password"
                });
            }

            // Return user data without sensitive information
            res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: "An error occurred during login"
            });
        }
    } else {
        res.status(405).json({ success: false, message: "Method not allowed" });
    }
};

export default handler;
