const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

async function debug() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    console.log("DB:", mongoose.connection.db.databaseName);
    console.log("");

    // 1. Check Batches
    const batches = await mongoose.connection.db.collection("batches").find({}).toArray();
    console.log("=== BATCHES ===");
    console.log("Total batches:", batches.length);
    for (const b of batches) {
      console.log(`\n  Batch: "${b.name}" (${b._id})`);
      console.log(`    courseId: ${b.courseId}`);
      console.log(`    assignedTeacher: ${b.assignedTeacher}`);
      console.log(`    status: ${b.status}`);
      console.log(`    syllabusProgress length: ${(b.syllabusProgress || []).length}`);
      if (b.syllabusProgress && b.syllabusProgress.length > 0) {
        for (const sp of b.syllabusProgress) {
          console.log(`      topicId: ${sp.topicId}, completed: ${sp.completed}, completedSubtopics: [${(sp.completedSubtopics || []).join(",")}], updatedAt: ${sp.updatedAt}`);
        }
      }
      console.log(`    lastLectureAt: ${b.lastLectureAt}`);
    }

    // 2. Check Courses
    console.log("\n=== COURSES ===");
    const courseIds = [...new Set(batches.map(b => b.courseId?.toString()).filter(Boolean))];
    for (const cid of courseIds) {
      const course = await mongoose.connection.db.collection("courses").findOne({ _id: new mongoose.Types.ObjectId(cid) });
      if (course) {
        console.log(`\n  Course: "${course.name}" (${course._id})`);
        console.log(`    syllabus entries: ${(course.syllabus || []).length}`);
        console.log(`    modules refs: ${(course.modules || []).length}`);
        if (course.syllabus && course.syllabus.length > 0) {
          for (const s of course.syllabus) {
            console.log(`      Syllabus: "${s.title}" (${s._id}), subtopics: ${(s.subtopics || []).length}`);
            if (s.subtopics) {
              for (const st of s.subtopics) {
                console.log(`        Subtopic: "${st.title}" (${st._id})`);
              }
            }
          }
        }
      }
    }

    // 3. Check Modules collection
    console.log("\n=== MODULES (standalone collection) ===");
    const modules = await mongoose.connection.db.collection("modules").find({}).toArray();
    console.log("Total modules:", modules.length);
    for (const m of modules) {
      console.log(`  Module: "${m.title}" (${m._id}), courseId: ${m.courseId}`);
    }

    // 4. Check Topics collection
    console.log("\n=== TOPICS (standalone collection) ===");
    const topics = await mongoose.connection.db.collection("topics").find({}).toArray();
    console.log("Total topics:", topics.length);
    for (const t of topics) {
      console.log(`  Topic: "${t.title}" (${t._id}), courseId: ${t.courseId}, moduleId: ${t.moduleId}, subtopics: ${(t.subtopics || []).length}`);
    }

    // 5. Check Users with teacher role
    console.log("\n=== TEACHERS ===");
    const teachers = await mongoose.connection.db.collection("users").find({ role: "teacher" }).toArray();
    console.log("Total teachers:", teachers.length);
    for (const t of teachers) {
      console.log(`  Teacher: "${t.name}" (${t._id}), email: ${t.email}`);
    }

    // 6. Check LectureTracking
    console.log("\n=== LECTURE TRACKING ===");
    const lectures = await mongoose.connection.db.collection("lecturetrackings").find({}).toArray();
    console.log("Total lecture records:", lectures.length);

    // 7. Check admin users
    console.log("\n=== ADMINS ===");
    const admins = await mongoose.connection.db.collection("users").find({ role: "admin" }).toArray();
    console.log("Total admins:", admins.length);
    for (const a of admins) {
      console.log(`  Admin: "${a.name}" (${a._id}), email: ${a.email}`);
    }

  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

debug();
