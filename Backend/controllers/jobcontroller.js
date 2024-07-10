import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";

export const getJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const postjob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role == "jobseeker") {
    return next(
      new ErrorHandler("job seeker is not allowed to post jobs", 400)
    );
  }
  const {
    title,
    description,
    category,
    contry,
    city,
    location,
    salary,
    salary_from,
    salary_to,
  } = req.body;

  if (!title || !description || !category || !contry || !city || !location) {
    return next(new ErrorHandler("Please provide complete job details", 400));
  }

  if (!salary && (!salary_from || !salary_to)) {
    return next(new ErrorHandler("Please provide either salary", 400));
  }
  if (salary && !salary_from && salary_to) {
    return next(
      new ErrorHandler(
        "Can not enter fixed salary and salary range together",
        400
      )
    );
  }

  const Posted_By = req.user._id;
  const job = await Job.create({
    title,
    description,
    category,
    contry,
    city,
    location,
    salary,
    salary_from,
    salary_to,
    Posted_By,
  });

  res.status(200).json({
    sucess: true,
    message: "job posted sucessfully!",
    job,
  });
});

export const getmyjobs = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "jobseeker") {
    return next(
      new ErrorHandler("job seeker is not allowed to post jobs", 400)
    );
  }

  const myjobs = await Job.find({ Posted_By: req.user._id });

  res.status(200).json({
    success: true,
    myjobs,
  });
});

export const updatejob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "jobseeker") {
    return next(
      new ErrorHandler("job seeker is not allowed to post jobs", 400)
    );
  }

  const { id } = req.params;

  let job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Oops! Job not found", 400));
  }

  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    job,
    message: "job updated successfully",
  });
});

export const deletejob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "jobseeker") {
    return next(
      new ErrorHandler("job seeker is not allowed to post jobs", 400)
    );
  }

  const { id } = req.params;

  let job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Oops! Job not found", 400));
  }

  await Job.deleteOne();

  res.status(200).json({
    success: true,
    message: "post deleted successfully",
  });
});

export const getsinglejob = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  try {
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("Job not found!!", 404));
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    return next(new ErrorHandler("Invalid Id or cast error",400));
  }
});
