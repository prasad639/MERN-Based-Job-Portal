import express from "express";
import {getJobs,postjob,getmyjobs,updatejob,deletejob,getsinglejob} from "../controllers/jobcontroller.js";
import { isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", getJobs);
router.post("/post",isAuthorized, postjob);
router.get("/getmyjob",isAuthorized,getmyjobs);
router.put("/updatejob/:id",isAuthorized,updatejob);
router.delete("/deletejob/:id",isAuthorized,deletejob);
router.get("/getsinglejob/:id",isAuthorized,getsinglejob);
export default router;
