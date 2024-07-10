import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requires: [true, "Please provide your name"],
    minLength: [3, "name atleast contain 3 characters"],
    maxLength: [30, "name cannot exceed 30 characters"],
  },

  email: {
    type: String,
    required: [true, "Please provide your Email"],
    validate: [validator.isEmail, "Please provide valid Email"],
  },

  contact: {
    type: Number,
    required: [true, "Please provide valid phone number"],
  },

  password: {
    type: String,
    minLength: [3, "password length should be atleast 3"],
    maxLength: [12, "password length should not exceed 12"],
    select : false,
  },

  role: {
    type: String,
    required: [true, "Please provide your role"],
    enum: ["jobseeker", "Employer"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// Hashing password

// userSchema.pre("save", async()=>{
//     if(!this.ismodified(password)){
//         next();
//     }
//     this.password = await bcrypt.hash(this.password, 10);
// });
userSchema.pre("save", async function(next) {
  if (!this.isModified('password')) {
      return next();
  }
  try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
  } catch (error) {
      return next(error);
  }
});
// Comparing password

userSchema.methods.comparePassword = async function(enterdpassword){
  return await bcrypt.compare(enterdpassword, this.password);
};

// jwt token generation for authorization
userSchema.methods.getJWTToken = function(){
return jwt.sign({id: this._id},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRE});
};


export const User  = mongoose.model("User",userSchema);


  
