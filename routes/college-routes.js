import express from "express";

import {
  addCollege, getAllColleges,
  getCollegeById,
} from "../controllers/college-controller";


const collegeRouter = express.Router();


collegeRouter.get("/", getAllColleges);
collegeRouter.get("/:id", getCollegeById);
collegeRouter.post("/", addCollege);

export default collegeRouter;
