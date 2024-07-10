import mongoose from "mongoose";


const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide job title"],
    minLength: [3, "job title must contain atleast 3 titles"],
    maxLength: [50, "job title can not exceed 50 characters"],
  },

  description: {
    type: String,
    required: [true, "Please provide description"],
    minLength: [3, "job description must contain atleast 3 descriptions"],
    maxLength: [350, "job description can not exceed 350 characters"],
  },

  category: {
    type: String,
    required: [true, "Please provide job category"],
  },

  contry: {
    type: String,
    required: [true, "Please provide job contry"],
  },

  city: {
    type: String,
    required: [true, "Please provide job city"],
  },

  location: {
    type: String,
    required: [true, "Please provide job location"],
    minLength: [50, "job location must contain atleast 50 characters"],
  },

  salary: {
    type: Number,
    minLength: [4, "Fixed salary atleast contains 4 digit"],
    maxLength: [9, "Fixed salary can not exceeds  9 digit"],
  },

  salary_from: {
    type: Number,
    minLength: [4, "Fixed salary from atleast contains 4 digit"],
    maxLength: [9, "Fixed salary from can not exceeds  9 digit"],
  },

  salary_to: {
    type: Number,
    minLength: [4, "Fixed salary to atleast contains 4 digit"],
    maxLength: [9, "Fixed salary to can not exceeds  9 digit"],
  },

  expired: {
    type: Boolean,
    default: false,
  },

  posted_on: {
    type: Date,
    default: Date.now,
  },

  Posted_By: {
    type: mongoose.Schema.ObjectId,
    ref :"User",
    require : true

  },
});

export const Job = mongoose.model("job",jobSchema);
