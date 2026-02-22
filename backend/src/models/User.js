
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
companyName: {
  type: String,
  required: function () {
    return this.role === "company";
  },
},

registrationNumber: {
  type: String,
  required: function () {
    return this.role === "company";
  },
  unique: true,
  sparse: true
},

industry: {
  type: String,
  required: function () {
    return this.role === "company";
  },
},

contactPerson: {
  type: String,
  required: function () {
    return this.role === "company";
  },
},

designation: {
  type: String,
  required: function () {
    return this.role === "company";
  },
},

phone: {
  type: String,
  required: function () {
    return this.role === "company";
  },
},
   username: {
    type: String,
    unique: true,
    sparse: true, // allows null for company/admin
  },

  name: {
  type: String,
},
  role: {
    type: String,
    enum: ["company", "admin", "auditor"],
    default: "company",
  },

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },

  // OTP fields
  otp: Number,
  otpExpiry: Date,
  
}
, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
