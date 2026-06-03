import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Teacher from "@/models/Teachers";
import User from "@/models/User";
import { getUserFromAuth } from "@/lib/api-auth";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    await connectDB();

    const dbUser = await getUserFromAuth(req);
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (dbUser.role !== "teacher") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const teacher = await Teacher.findOne({ userId: dbUser._id }).lean();
    if (!teacher) {
      return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
    }

    return NextResponse.json({ teacher }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const dbUser = await getUserFromAuth(req);

    if (!dbUser || dbUser.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = dbUser._id;
    const body = await req.json();
    let { name, email, contact, designation, course, experience, dateOfJoining, assignedCourses, totalStudents, rating, avatar, currentPassword, newPassword } = body;

    if (email) email = email.trim().toLowerCase();

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const teacher = await Teacher.findOne({ userId });
    if (!teacher) {
      return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
    }

    // Handle Profile Update for both User and Teacher
    if (name) {
      user.name = name;
      teacher.name = name;
    }
    if (email) {
      user.email = email;
      teacher.email = email;
    }
    if (contact) {
      if (!/^\d{10}$/.test(contact)) {
        return NextResponse.json({ error: "Invalid phone number format (10 digits required)" }, { status: 400 });
      }
      user.contact = contact;
      teacher.contact = contact;
    }
    if (designation) {
      teacher.designation = designation;
      // Not adding designation to user as it might not be supported there
    }
    if (course) {
      teacher.course = course;
    }
    if (experience) {
      teacher.experience = experience;
    }
    if (dateOfJoining) {
      teacher.dateOfJoining = dateOfJoining;
    }
    if (assignedCourses !== undefined) {
      teacher.assignedCourses = typeof assignedCourses === 'string'
        ? assignedCourses.split(",").map((c: string) => c.trim()).filter((c: string) => c)
        : assignedCourses;
    }
    if (totalStudents !== undefined && totalStudents !== "") {
      teacher.totalStudents = Number(totalStudents);
    }
    if (rating !== undefined && rating !== "") {
      teacher.rating = Number(rating);
    }
    if (avatar) {
      teacher.avatar = avatar;
    }

    // Handle Password Update
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    await teacher.save();

    return NextResponse.json(teacher.toObject ? teacher.toObject() : teacher);
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
