import Appointment from "../models/appointment.js";
import MedicineModel from "../models/medicine.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import cron from "node-cron";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;



export const getMedicine = async (req, res) => {
    try {
        const medicines = await MedicineModel.find();
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

export const addMedicine = async (req, res) => {
    try {
        const newMedicine = new MedicineModel(req.body);
        await newMedicine.save();
        res.status(201).json({ message: "Medicine added successfully", newMedicine });
    } catch (error) {
        res.status(500).json({ message: "Error adding medicine", error });
    }
};

export const updateMedicine = async (req, res) => {
    try {
        const updatedMedicine = await MedicineModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMedicine) return res.status(404).json({ message: "Medicine not found" });

        res.json({ message: "Medicine updated successfully", updatedMedicine });
    } catch (error) {
        res.status(500).json({ message: "Error updating medicine", error });
    }
};

export const deleteMedicine = async (req, res) => {
    try {
        const deletedMedicine = await MedicineModel.findByIdAndDelete(req.params.id);
        if (!deletedMedicine) return res.status(404).json({ message: "Medicine not found" });

        res.json({ message: "Medicine deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting medicine", error });
    }
};


// Function to Send WhatsApp Messages
const sendWhatsApp = async (message) => {
    try {
      const response = await axios.post(
        `https://7105.api.greenapi.com/waInstance7105198329/sendMessage/23f4735f100c4b69be351dd99861ae4e22af10da1e91471eae`,
        {
          chatId: `${process.env.ADMIN_WHATSAPP}@c.us`,
          message: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GREEN_API_TOKEN}`, // If required
          },
        }
      );
      console.log("WhatsApp message sent:", response.data);
    } catch (error) {
      console.error("Error sending WhatsApp message:", error.response?.data || error.message);
    }
  };
  
  // Medicine Reminder Notifications via Cron Job
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Format HH:mm
  
    try {
      const medicines = await MedicineModel.find();
      medicines.forEach((med) => {
        const medTime = med.time.slice(0, 5);
        if (medTime === currentTime) {
          const message = `Reminder: Take ${med.medicine} (${med.dose}) at ${med.time}. Notes: ${med.notes}`;
          sendWhatsApp(message);
        }
      });
    } catch (error) {
      console.error("Error fetching medicines for reminders:", error);
    }
  });
  
  // Function to Send SMS via Fast2SMS
  const sendSMS = async (message, phone) => {
    try {
      const response = await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          message: message,
          language: "english",
          route: "q",
          numbers: phone,
        },
        {
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
          },
        }
      );
      console.log("SMS Sent:", response.data);
    } catch (error) {
      console.error("SMS Error:", error.response?.data || error.message);
    }
  };

export const booking = async (req, res) => {
    try {
        const { name, phone, date, time, department, doctor } = req.body;
        if (!name || !phone || !date || !time || !department || !doctor) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newAppointment = new Appointment(req.body);
        await newAppointment.save();

        const patientMessage = `Hello ${name}, your appointment with Dr. ${doctor} (Dept: ${department}) is confirmed for ${date} at ${time}.`;
        const adminMessage = `New Appointment:\n Name: ${name}\n Phone: ${phone}\n Doctor: ${doctor}\n Department: ${department}\n Date: ${date}\n Time: ${time}`;

        if (typeof sendSMS !== "undefined") {
            await sendSMS(patientMessage, phone);
            await sendSMS(adminMessage, "7903150470");
        }

        res.status(201).json({ message: "✅ Appointment booked successfully and SMS sent!" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

export const response = async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ message: "Please enter your question!" });

  try {
      const prompt = `Please answer the following question in a clear and helpful way, using at least two full lines of explanation:\n\n${query}`;

      const apiResponse = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
              contents: [
                  {
                      role: "user",
                      parts: [{ text: prompt }]
                  }
              ]
          },
          { headers: { "Content-Type": "application/json" } }
      );

      const reply = apiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response available";
      res.json({ reply });
  } catch (error) {
      res.status(500).json({ reply: "AI is not available right now!", error: error.message });
  }
};
export const userlogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

      // Set token in HTTP-only, secure cookie
      res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Only set secure flag in production
          sameSite: 'Lax', // Prevents issues with different domains/ports
          maxAge: 2 * 60 * 60 * 1000 // 2 hours
      });

      res.json({ message: "Login successful", user: { id: user._id, email: user.email } });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

    // Set token in HTTP-only, secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });

    res.status(201).json({
      message: "Signup successful",
      user: { id: newUser._id, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// export const signup = async (req, res) => {
//   const { name, email, password } = req.body;
//   if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await User.create({ name, email, password: hashedPassword });

//     // Generate JWT token
//     const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

//     // Set token in HTTP-only, secure cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'Strict',
//       maxAge: 2 * 60 * 60 * 1000 // 2 hours
//     });

//     // Respond with user info
//     res.status(201).json({
//       message: "Signup successful",
//       user: { id: newUser._id, email: newUser.email }
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Login Controller
// export const userlogin = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

//   try {
//       const user = await User.findOne({ email });
//       if (!user || !(await bcrypt.compare(password, user.password))) {
//           return res.status(400).json({ message: "Invalid credentials" });
//       }

//       // Generate JWT token
//       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

//       // Set token in HTTP-only, secure cookie
//       res.cookie("token", token, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === 'production', // Only set secure flag in production
//           sameSite: 'Strict',
//           maxAge: 2 * 60 * 60 * 1000 // 2 hours
//       });

//       // Optionally update user status in DB if needed
//       await User.updateOne({ _id: user._id }, { loggedIn: true });

//       res.json({ message: "Login successful", user: { id: user._id, email: user.email } });
//   } catch (error) {
//       res.status(500).json({ message: "Server error" });
//   }
// };

// Logout Controller
export const userlogout = async (req, res) => {
  try {
      // Clear token from client-side cookie
      res.clearCookie("token");

      // Optionally update user status in DB if needed
      await User.updateOne({ _id: req.user._id }, { loggedIn: false });

      res.json({ message: "Logged out successfully" });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};