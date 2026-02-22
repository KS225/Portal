import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    businessType: {
      type: String,
      required: true,
    },

    offeringType: {
      type: String,
      required: true,
    },

    businessDescription: {
      type: String,
      required: true,
    },

    remarksDescription: {
      type: String,
    },

    numberOfCustomers: {
      type: Number,
      min: 0,
      required: true,
    },

    yearsInOperation: {
      type: Number,
      min: 0,
      required: true,
    },

  annualTurnover: {
  type: String,
  required: function () {
    return !this.revenueToDate; 
  },
},

revenueToDate: {
  type: String,
  required: function () {
    return !this.annualTurnover;
  },
},

    otherBusinesses: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Auditor Assigned"],
      default: "Pending",
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    otherBusinessType: String,
    otherOfferingType: String,
    revenueToDate: String,
    rejectionReason: String,
    assignedAuditor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Certification", certificationSchema);