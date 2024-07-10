import express from "express";
import {EmployerGetallApplications,jobseekerGetallApplications,jobseekerdeleteApplication,postApplication} from "../controllers/applicationcontroller.js";
import {isAuthorized} from "../middlewares/auth.js";

const router = express.Router();

router.get("/Employergetapplication",isAuthorized,EmployerGetallApplications);
router.get("/jobseekergetapplication",isAuthorized,jobseekerGetallApplications);
router.delete("/deleteapplication/:id",isAuthorized,jobseekerdeleteApplication);
router.post("/postapplication",isAuthorized,postApplication);


export default router;
