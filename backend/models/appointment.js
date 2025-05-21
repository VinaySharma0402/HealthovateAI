import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  department: String,
  doctor: String,
  date: String,
  time: String,
  message: String,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
