import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    const mailOptions = {
      from: `"Granuler Certification" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Granuler OTP Verification Code",
      html: `
        <div style="font-family: sans-serif; text-align: center;">
          <h2>Granuler Certification Portal</h2>
          <p>Your OTP code is:</p>
          <h1 style="color: orange;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (err) {
    console.error("Error sending OTP email:", err);
    throw new Error("Email sending failed");
  }
};
