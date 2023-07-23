import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin";
import College from "../models/College";


export const addCollege = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1];
  if (!extractedToken && extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token Not Found" });
  }

  let adminId;

  // verify token
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` });
    } else {
      adminId = decrypted.id;
      return;
    }
  });

  //create new college
  const { title, description, stublishDate, posterUrl, featured, subjects } =
    req.body;
  if (
    !title &&
    title.trim() === "" &&
    !description &&
    description.trim() == "" &&
    !posterUrl &&
    posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let college;
  try {
    college = new College({
      description,
      stublishDate: new Date(`${stublishDate}`),
      featured,
      subjects,
      admin: adminId,
      posterUrl,
      title,
    });
    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);
    session.startTransaction();
    await college.save({ session });
    adminUser.addedCollege.push(college)
    await adminUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }
  
  if (!college) {
    return res.status(500).json({ message: "Request Failed" });
  }

  return res.status(201).json({ college });
};

export const getAllColleges = async (req, res, next) => {
  let colleges;

  try {
    colleges = await College.find();
  } catch (err) {
    return console.log(err);
  }

  if (!colleges) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(200).json({ colleges });
};

export const getCollegeById = async (req, res, next) => {
  const id = req.params.id;
  let college;
  try {
    college = await College.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!college) {
    return res.status(404).json({ message: "Invalid College ID" });
  }

  return res.status(200).json({ college });
};
