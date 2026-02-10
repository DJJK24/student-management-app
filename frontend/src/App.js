const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

/* ===== CORS SETUP ===== */
app.use(cors({
  origin: "https://peppy-sprite-ad724c.netlify.app", // allow only your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.options("*", cors()); // handle preflight requests

app.use(express.json());

/* ===== CONNECT DATABASE ===== */
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

/* ===== DEFINE STUDENT SCHEMA ===== */
const Student = mongoose.model(
  "Student",
  new mongoose.Schema({
    name: String,
    email: String,
    course: String,
    age: Number
  })
);

/* ===== ROUTES ===== */
app.get("/", (req, res) => {
  res.send("🎓 Backend is live!");
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ===== START SERVER ===== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
