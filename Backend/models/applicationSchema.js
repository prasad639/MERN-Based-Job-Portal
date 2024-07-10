import mongoose from "mongoose";

import validator from "validator";

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    minLength: [3, "name must contain atleast 3 characters"],
    maxLength: [30, "name should not exceeds 30 characters"],
  },

  email: {
    type: String,
    validator: [validator.isEmail, "Please provide valid email"],
    required: [true, "Please provide your email"],
  },

  coverletter: {
    type: String,
    required: [true, "Please your coverletter"],
  },

  phone: {
    type: Number,
    required: [true, "Please provide Your Phone number"],
  },

  address: {
    type: String,
    required: [true, "Please provide Your address"],
  },

  resume: {
    public_id: {
      type: String,
      required: false,
    },

    url: {
      type: String,
      required: true,
    },
  },

  applicantId: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["jobseeker"],
      required: true,
    },
  },

  employerId: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["Employer"],
      required: true,
    },
  },
});

export const Application = mongoose.model("Application", applicationSchema);
