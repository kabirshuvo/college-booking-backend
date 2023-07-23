import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  college: {
    type: mongoose.Types.ObjectId,
    // type: String,
    ref: "College",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  subjectId: {
    type: Number,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    // type: String,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Booking", bookingSchema);
