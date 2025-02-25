import userModel from "../models/userModel.js";

export const getUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userData } = user.toObject();

    return res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
