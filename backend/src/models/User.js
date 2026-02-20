
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  registrationNumber: { type: Number, required: true, unique: true },
  industry: { type: String, required: true },
  contactPerson: { type: String, required: true },
  designation: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true },
  certificationType: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },

  // OTP fields
  otp: Number,
  otpExpiry: Date,
});

const User = mongoose.model("User", userSchema);
export default User;
