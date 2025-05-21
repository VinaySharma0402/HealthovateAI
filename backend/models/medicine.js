import mongoose from "mongoose";

const MedicineSchema = new mongoose.Schema({
  medicine: { type: String, required: true },  // Medicine name
  dose: { type: String, required: true },      // Dosage details
  time: { type: String, required: true },      // Time of intake (morning, evening, etc.)
  frequency: { type: String, required: true }, // Frequency (e.g., once daily, twice daily)
  start: { type: Date, required: true },       // Start date of medication
  end: { type: Date, required: true },         // End date of medication
  notes: { type: String }                      // Additional notes (optional)
});

const MedicineModel = mongoose.model("Medicine", MedicineSchema);
export default MedicineModel;  // Use ES Module export
