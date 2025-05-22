# 🏥 Healthovate AI

Healthovate AI is a smart healthcare web platform that uses AI to assist users with everyday health needs like symptom checking, medicine reminders, BMI calculation, and more — all in one place.

## 🚀 Features

### 🤖 1. AI Health Assistant
- Ask any health-related questions.
- Get smart and reliable suggestions powered by AI.
- Example: _“What should I do for a sore throat?”_

### 🧾 2. AI Symptom Checker
- Enter symptoms and receive possible health conditions.
- Get general advice on what steps to take.
- Example: _“Fever, cough” → Possible: Flu or viral infection._

### ⏰ 3. Medicine Reminder
- Set custom reminders to take your medicine on time.
- Backend scheduler ensures timely alerts.

### 📅 4. Appointment Booking
- Book appointments with your doctor in a simple form.
- Admin panel (for doctors) to view and manage patient appointments.

### 🏥 5. Nearest Hospital Location
- Uses geolocation to show nearby hospitals.
- Integrated with Google Maps API or similar services.

### ⚖️ 6. BMI Calculator
- Enter your height and weight.
- Instantly calculate your Body Mass Index and health range.

---

## 🧰 Tech Stack

| Layer              | Technologies                                        |
|--------------------|-----------------------------------------------------|
| **Frontend**       | HTML, CSS, JavaScript, Reacts                       |
| **Backend**        | Node.js, Express.js                                 |
| **Database**       | MongoDB (via Mongoose)                              |
| **AI Assistant**   | OpenAI API / Custom logic                           |
| **Authentication** | JWT, bcrypt.js                                      |
| **Scheduling**     | Node-cron for reminders                             |
| **APIs Used**      | Google Maps API (for location services)             |

---

## 🔐 Authentication & Security
- Secure user login/signup.
- Passwords are hashed using `bcryptjs`.
- Authenticated routes protected via JWT tokens.

---

## 📁 Folder Structure

### ``` healthcare-backend/
├── controllers/ → Handle business logic
├── models/ → Mongoose schemas
├── routes/ → Express routing
├── middleware/ → Auth & validation middlewares
├── config/ → DB config and environment setup
├── index.js → Entry point
├── .env → Environment variables
└── package.json → Project dependencies and scripts ```
---

## 💡 Why Healthovate AI?

Unlike general platforms like Google, **Healthovate AI** is:

- 🧠 **Personalized**: Answers and suggestions tailored to you.
- 🧰 **All-in-One**: No need for multiple apps — everything in one place.
- 🧑‍⚕️ **Real-time**: Book appointments, get reminders, and find hospitals instantly.

### ✅ Example:

A user feels dizzy at night. Instead of:
- Searching symptoms on Google,
- Setting a reminder on another app,
- Looking for hospitals on Maps separately...

They simply use **Healthovate AI**:
- Ask the AI Assistant,
- Use the Symptom Checker,
- Get hospital directions,
- Book an appointment,
- Set medicine reminders — **all in one place**.

---

## 👨‍🔬 How It Helps Users

- Saves time and reduces confusion.
- Encourages consistent health monitoring.
- Makes healthcare more accessible and organized.
- Reduces reliance on fragmented tools or vague search results.

---

## 📌 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/VinaySharma0402/healthovate-ai.git
cd healthcare-backend
---

2️⃣ Install Dependencies
   npm install

3️⃣ Create a .env File
  PORT=5000
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret

4️⃣ Run in Development Mode
   npm run dev

🗨️ Contact
   Have questions or want to contribute?

📧 Email: vinaysharma8548@gmail.com
🔗 GitHub:(https://github.com/VinaySharma0402)
----
## Developed by
   Ram Vinay Kumar



