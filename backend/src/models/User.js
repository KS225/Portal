import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  industry: String,
  contactPerson: { type: String, required: true },
  designation: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  certificationType: { type: String, required: true },
  startDate: Date,
  endDate: Date,
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false }
});

export default mongoose.model("User", userSchema);
