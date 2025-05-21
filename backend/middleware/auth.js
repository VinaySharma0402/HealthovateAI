import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
console.log("Received Token:", token);
  

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Invalid Token:", error.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

export default requireAuth;
