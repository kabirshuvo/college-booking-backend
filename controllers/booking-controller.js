import mongoose from "mongoose";
import Bookings from "../models/Bookings";
import College from "../models/College";
import User from "../models/User";

export const newBooking = async (req, res, next) => {
  const { college, date, subjectId, user } = req.body;

  let existingCollege;
  let existingUser;
  try {
    existingCollege = await College.findById(college);
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!existingCollege) {
    return res.status(404).json({ message: "College Not Found With Given ID" });
  }
  if (!existingUser) {
    return res.status(404).json({ message: "User not found with given ID " });
  }
  let booking;

  try {
    booking = new Bookings({
      college,
      date: new Date(`${date}`),
      subjectId,
      user,
    });
    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.bookings.push(booking);
    existingCollege.bookings.push(booking);
    await existingUser.save({ session });
    await existingCollege.save({ session });
    await booking.save({ session });
    session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }

  if (!booking) {
    return res.status(500).json({ message: "Unable to create a booking" });
  }

  return res.status(201).json({ booking });
};

export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unexpected Error" });
  }
  return res.status(200).json({ booking });
};

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findByIdAndRemove(id).populate("user college");
    console.log(booking);
    const session = await mongoose.startSession();
    session.startTransaction();
    await booking.user.bookings.pull(booking);
    await booking.college.bookings.pull(booking);
    await booking.college.save({ session });
    await booking.user.save({ session });
    session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unable to Delete" });
  }
  return res.status(200).json({ message: "Successfully Deleted" });
};
