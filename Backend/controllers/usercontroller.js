import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwttoken.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, contact, role, password } = req.body;

  if (!name || !email || !contact || !role || !password) {
    return next(new ErrorHandler("please fill the complete details"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email alrady exist!"));
  }

  const user = await User.create({
    name,
    email,
    contact,
    role,
    password,
  });
  sendToken(user, 200, res, "User registerd Sucessfully!");
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, role, password } = req.body;

  if (!email || !role || !password) {
    return next(new ErrorHandler("Please provide correct details", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  const ispasswordmatch = await user.comparePassword(password);

  if (!ispasswordmatch) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  if (user.role !== role) {
    return next(new ErrorHandler("user for this role not found", 400));
  }
console.log(user);
  sendToken(user, 200, res, "User logged in sucessfully");
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "user logged out sucessfully",
    });
});

export const getUser = catchAsyncError((req, res, next) => {
   // Check if user is available in request
 const user =  req.user;
 if(!user){
  return next(new ErrorHandler("No user is found",404));
 }

 res.status(200).json({
  success : true,
  user,
 });


   


});

