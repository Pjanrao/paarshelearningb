const axios = require("axios");

async function run() {
  try {
    console.log("Sending POST request to http://localhost:3000/api/teacher/register...");
    const res = await axios.post("http://localhost:3000/api/teacher/register", {
      name: "Teacher API Test",
      email: "teacherapitest@gmail.com",
      contact: "9988776655",
      password: "Password@123",
      designation: "Trainer",
      course: "Next.js",
      experience: "3 years",
      dateOfJoining: "2026-05-29"
    });
    console.log("Response Status:", res.status);
    console.log("Response Data:", res.data);
  } catch (err) {
    console.error("Error occurred:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

run();
