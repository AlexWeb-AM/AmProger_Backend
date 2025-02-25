import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import connectDB from "../config/mongodb.js";
import transporter from "../config/nodemailer.js";
import generateToken from "../utils/generateToken.js";

connectDB();

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and Password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }



    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Password" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        routeId:user.routeId
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 15);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      routeId: generateId(),
      verifyOtp: otp,
    });

    await user.save(); 

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verification Code :)",
      text: `Your Verification Code ${otp}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("OTP sent successfully");
    } catch (error) {
      console.log("Error sending OTP:", error);
      return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }

    const savedUser = await userModel.findById(user._id).select("-password");

    return res.json({
      success: true,
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email or OTP are required" });
    }

    const user = await userModel.findOneAndUpdate(
      { email, verifyOtp: otp }, 
      { $unset: { verifyOtp: "" }, $set: { isAccountVerified: true } },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid OTP or user not found" });
    }

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
