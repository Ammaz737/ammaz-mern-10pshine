import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail   } from "../mail/email.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(409)
        .json({ success: "false", message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 3600000, // 1 hour
    });

    await newUser.save();

    // jwt
    generateTokenAndSetCookie(res, newUser._id);
    await sendVerificationEmail(newUser.email, verificationToken);

    res.status(201).json({
      status: "success",
      message: "User registered successfully.",
      user: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
    // 1 2 3 4 5 6
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }, 
        })
        if(!user){
            return res.status(400).json({message:"Invalid or expired verification code"});
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);
        res.status(200).json(
            {   
                success:true,
                message:"Email verified successfully",
              user:{
                ...user._doc,
                password:undefined,
              }
            }
        )  
    } catch (error) {
        console.error("Error verifying email:", error);
        throw new Error("Failed to verify email");
    }
}

export const login = async (req, res) => {
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"});
        }
        generateTokenAndSetCookie(res,user._id);
        
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success:true,
            message:"Login successful",
            user:{
                ...user._doc,
                password:undefined,
            }
        });

    }catch (error){
        res.status(400).json({
          success:false,
          message:error.message});
    }
}

export const logout = async (req, res) => {
     res.clearCookie("token");
      res.status(200).json({
        success:true,
        message:"Logged out successfully"
      });
}

export const forgotPassword = async (req, res) => {
  console.log("Request received for forget password");
  const { email } = req.body;
  console.log("Email:", email);

  try {
    const user = await User.findOne({ email });
    if(!user){
      console.log("User not found");
      return res.status(400).json({message:"User with this email does not exist"}); 
    }
    console.log("User found:", user);
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 3600000; 

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();
    console.log("Reset token saved to user");

    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
    console.log("Password reset email sent successfully");
    res.status(200).json({
       success:true,
        message:"Password reset email sent successfully"
    })
  }catch (error){
    console.error("Error in forgetPassword:", error);
    res.status(400).json({
      success:false,
      message:error.message
    });
  }

}

export const resetPassword = async (req, res) => {
  try { 
  const { token } = req.params;
  console.log("token", token);
  const {password} = req.body;
  
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiresAt: { $gt: Date.now() },
  })

  if(!user){
    return res.status(400).json({
      success:false,
      message:"Invalid or expired password reset token"});
  }
  
  const hashedPassword = await bcrypt.hash(password,10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  await sendResetSuccessEmail(user.email);
  res.status(200).json({
    success:true,
    message:"Password reset successful"
  });


   }catch (error){
    console.log("Error in resetPassword:", error);
    res.status(400).json({
      success:false,
      message:error.message
    })
   }
}

export const checkAuth = async (req, res) => {
 try{
    const user = await User.findById(req.userId).select("-password"); 
    if(!user){
        return res.status(404).json({success:false, message:"User not found"});
    }
    res.status(200).json({success:true, user});
 }catch(error){
    console.log("Error in checkAuth:", error);
    res.status(400).json({success:false, message:error.message});
 }
}