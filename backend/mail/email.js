import nodemailer from "nodemailer";
import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    
    const transporter = nodemailer.createTransport({
      service: "gmail",  
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

   
    const mailOptions = {
      from: `"Ammaz App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification Code",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationCode),
    };


    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",  
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Notes App",
      html: WELCOME_EMAIL_TEMPLATE
        .replace("{userName}", name)
         .replace("{appURL}", "http://localhost:3000"),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};
 
export const sendPasswordResetEmail = async (email, resetURL) => { 
    try {
           const transporter = nodemailer.createTransport({
      service: "gmail",  
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
          
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully:", info.response);
    }catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
    
}




export const sendResetSuccessEmail = async (email) => { 
    try {
           const transporter = nodemailer.createTransport({
      service: "gmail",  
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
          
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Reset email sent successfully:", info.response);
    }catch (error) {
        console.error("Error sending reset email:", error);
        throw new Error("Failed to reset email");
    }
    
}


