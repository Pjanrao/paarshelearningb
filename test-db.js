const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected");
  
  const Batch = mongoose.model("Batch", new mongoose.Schema({}, { strict: false }));
  const Course = mongoose.model("Course", new mongoose.Schema({}, { strict: false }));
  const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
  const Topic = mongoose.model("Topic", new mongoose.Schema({}, { strict: false }));
  const LectureTracking = mongoose.model("LectureTracking", new mongoose.Schema({}, { strict: false }));

  try {
    const batches = await Batch.find()
      .populate("courseId", "name syllabus")
      .populate("assignedTeacher", "name _id")
      .populate({
        path: "syllabusProgress.teacherId",
        model: "User",
        select: "name",
        strictPopulate: false
      })
      .lean();
    console.log("Batches count:", batches.length);
    
    // Check if totalTopicsAcross throws
    const teacherProgressData = await Promise.all(
      Array.from(new Set(batches.map(b => b.assignedTeacher?._id?.toString()).filter(Boolean))).map(async (teacherId) => {
        const teacherBatches = batches.filter(b => b.assignedTeacher?._id?.toString() === teacherId);
        const teacher = await User.findById(teacherId).select("name").lean();
        
        console.log("Teacher:", teacherId);
        const totalHours = await LectureTracking.aggregate([
          { $match: { teacherId: new (require("mongoose")).Types.ObjectId(teacherId) } },
          { $group: { _id: null, total: { $sum: { $ifNull: ["$durationHours", 0] } } } }
        ]);
        console.log("Total hours:", totalHours);
        
        return { teacherId, name: teacher?.name };
      })
    );
    console.log("Done");
  } catch (e) {
    console.error("Error:", e);
  }
  
  mongoose.disconnect();
}
test();
