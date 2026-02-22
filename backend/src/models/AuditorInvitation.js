import mongoose from "mongoose";

const auditorInvitationSchema = new mongoose.Schema({
  email: {
  type: String,
  required: true,
  unique: true
},

  username: {
    type: String,
    required: true,
  },

  token: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "expired"],
    default: "pending",
  },

  expiresAt: {
    type: Date,
    required: true,
  },

  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

const AuditorInvitation = mongoose.model(
  "AuditorInvitation",
  auditorInvitationSchema
);

export default AuditorInvitation;