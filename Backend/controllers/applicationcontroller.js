import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { Job } from "../models/jobSchema.js";

cloudinary.config({
  cloud_name: "dp40oo2hh",
  api_key: "143991895642291",
  api_secret: "-4EKXoiFOWJaNh7aJPmVIZseQa8",
});

export const EmployerGetallApplications = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;

    if (role === "jobseeker") {
      return next(
        new ErrorHandler(
          "job seeker is not allowed to access this resource",
          400
        )
      );
    }

    const _id = req.user;
    const applications = await Application.find({ "employerId.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetallApplications = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;

    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer is not allowed to access this resource", 400)
      );
    }

    const _id = req.user;
    const applications = await Application.find({ "applicantId.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerdeleteApplication = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(new ErrorHandler("Employer is not allowed delete job", 400));
    }

    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Oops application not found!!", 404));
    }
    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: "application deleted successfully",
    });
  }
);

export const postApplication = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(new ErrorHandler("Employer is not allowed to post jobs", 400));
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume file required"));
  }
  try {
    const { resume } = req.files;
    console.log(JSON.stringify(resume));
    const { name, email, coverletter, phone, address, jobId } = req.body;

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedFormats.includes(resume.mimetype)) {
      return next(
        new ErrorHandler(
          "Invalid file type. Please upload png, jpg, or webp format",
          400
        )
      );
    }

    const cloudinaryres = await cloudinary.uploader.upload(resume.tempFilePath);
    console.log(cloudinaryres.url);

    if (!cloudinaryres || cloudinaryres.error) {
      console.error(
        "cloudinary error",
        cloudinaryres.error || "unknown cloudinary error"
      );

      return next(new ErrorHandler("failed to upload resume", 500));
    }

    const { user } = req;
    const applicantId = {
      user: user._id,
      role: "jobseeker",
    };
    if (!jobId) {
      return next(new ErrorHandler("Job not found!", 404));
    }

    const jobdetails = await Job.findById(jobId);

    if (!jobdetails) {
      return next(new ErrorHandler("Job not found!", 404));
    }

    const employerId = {
      user: jobdetails.Posted_By,
      role: "Employer",
    };

    if (
      !name ||
      !email ||
      !coverletter ||
      !phone ||
      !address ||
      !applicantId ||
      !employerId ||
      !resume
    ) {
      return next(new ErrorHandler("Please fill all details", 400));
    }

    const application = await Application.create({
      name,
      email,
      coverletter,
      phone,
      address,
      applicantId,
      employerId, // Corrected to use 'employerId' instead of 'EmployerId'
      resume: {
        public_id: cloudinaryres.public_id, // Correct property name for public_id
        url: cloudinaryres.secure_url, // Correct property name for secure_url
      },
    });

    res.status(200).json({
      success: true,
      message: "Application submitted",
      application,
    });
  } catch (err) {
    console.log(err);
  }
});


