import mongoose from "mongoose";

const certificationRequestSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  certificationType: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "assigned"],
    default: "pending",
  },

  assignedAuditor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

const CertificationRequest = mongoose.model(
  "CertificationRequest",
  certificationRequestSchema
);

export default CertificationRequest;