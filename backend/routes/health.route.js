import express from 'express';
import { 
  signup, userlogin, getMedicine, addMedicine, updateMedicine, 
  deleteMedicine, booking, response, userlogout 
} from '../controllers/health.controller.js';

const router = express.Router();

// User Authentication Routes
router.post("/signup", signup);  // Signup route
router.post("/login", userlogin);
router.post("/logout", userlogout);

// Medicine Routes
router.post("/medicine/add", addMedicine);
router.get("/medicine/all", getMedicine);
router.put("/medicine/update/:id", updateMedicine);
router.delete("/medicine/delete/:id", deleteMedicine);

// Appointment Booking Route
router.post("/appointment", booking);

// AI Response Route (Gemini API)
router.post("/api/gemini", response);

export default router;
