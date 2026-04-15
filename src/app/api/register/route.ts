import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import {
    validateEmail,
    validatePhone,
    validateName,
    validatePassword,
} from "@/utils/validation";

// ✅ helper
function generateReferralCode(name: string) {
    return (
        name.slice(0, 3).toUpperCase() +
        Date.now().toString().slice(-4)
    );
}

export async function POST(req: Request) {
    try {
        await connectDB();

        // ✅ ADD referredBy
        const { name, email, contact, password, referredBy } =
            await req.json();

        // validations (same as your code)...

        if (!name || !email || !contact || !password) {
            return NextResponse.json(
                { message: "All fields are required." },
                { status: 400 }
            );
        }

        if (!validateName(name)) {
            return NextResponse.json(
                { message: "Invalid name" },
                { status: 400 }
            );
        }

        if (!validateEmail(email)) {
            return NextResponse.json(
                { message: "Invalid email" },
                { status: 400 }
            );
        }

        if (!validatePhone(contact)) {
            return NextResponse.json(
                { message: "Invalid contact" },
                { status: 400 }
            );
        }

        const passwordCheck = validatePassword(password);
        if (!passwordCheck.valid) {
            return NextResponse.json(
                { message: passwordCheck.message },
                { status: 400 }
            );
        }

        // ✅ CHECK USER EXISTS BY EMAIL
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json(
                { message: "An account with this email already exists." },
                { status: 400 }
            );
        }

        // ✅ CHECK DUPLICATE CONTACT NUMBER
        const contactExists = await User.findOne({ contact });
        if (contactExists) {
            return NextResponse.json(
                { message: "An account with this contact number already exists." },
                { status: 400 }
            );
        }

        // ✅ VALIDATE REFERRAL
        let validRef = null;

        if (referredBy) {
            const refUser = await User.findOne({
                referralCode: referredBy,
            });

            // ❌ prevent self referral
            if (refUser && refUser.email !== email) {
                validRef = referredBy;
            }
        }

        // ✅ HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ CREATE USER WITH REFERRAL
        await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            contact,
            password: hashedPassword,

            referralCode: generateReferralCode(name), // 🔥 IMPORTANT
            referredBy: validRef, // 🔥 IMPORTANT
        });

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}



// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import { validateEmail, validatePhone, validateName, validatePassword } from "@/utils/validation";

// export async function POST(req: Request) {
//     try {
//         await connectDB();
//         const { name, email, contact, password } = await req.json();

//         // --- Required fields ---
//         if (!name || !email || !contact || !password) {
//             return NextResponse.json(
//                 { message: "All fields are required." },
//                 { status: 400 }
//             );
//         }

//         // --- Name validation ---
//         if (!validateName(name)) {
//             return NextResponse.json(
//                 { message: "Name must be 2–60 characters and contain only letters." },
//                 { status: 400 }
//             );
//         }

//         // --- Email validation ---
//         if (!validateEmail(email)) {
//             return NextResponse.json(
//                 { message: "Please provide a valid email address." },
//                 { status: 400 }
//             );
//         }

//         // --- Phone validation ---
//         if (!validatePhone(contact)) {
//             return NextResponse.json(
//                 { message: "Contact number must be exactly 10 digits." },
//                 { status: 400 }
//             );
//         }

//         // --- Password strength validation ---
//         const passwordCheck = validatePassword(password);
//         if (!passwordCheck.valid) {
//             return NextResponse.json(
//                 { message: passwordCheck.message },
//                 { status: 400 }
//             );
//         }

//         // --- Check duplicate or re-activate deleted account ---
//         const userExists = await User.findOne({ email });
//         if (userExists) {
//             if (userExists.status === "deleted") {
//                 // Re-activate the account
//                 const salt = await bcrypt.genSalt(10);
//                 const hashedPassword = await bcrypt.hash(password, salt);

//                 await User.findByIdAndUpdate(userExists._id, {
//                     name: name.trim(),
//                     contact,
//                     password: hashedPassword,
//                     status: "active",
//                     deletionReason: "", // Clear the reason
//                 });

//                 return NextResponse.json(
//                     { message: "Account re-activated. You can now sign in." },
//                     { status: 201 }
//                 );
//             } else {
//                 return NextResponse.json(
//                     { message: "An account with this email already exists." },
//                     { status: 400 }
//                 );
//             }
//         }

//         // --- Hash password and create user ---
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const user = await User.create({
//             name: name.trim(),
//             email: email.trim().toLowerCase(),
//             contact,
//             password: hashedPassword,
//         });

//         if (user) {
//             return NextResponse.json(
//                 { message: "User registered successfully" },
//                 { status: 201 }
//             );
//         } else {
//             return NextResponse.json(
//                 { message: "Invalid user data" },
//                 { status: 400 }
//             );
//         }
//     } catch (error: any) {
//         console.error("Registration error:", error);
//         return NextResponse.json(
//             { message: "Internal server error" },
//             { status: 500 }
//         );
//     }
// }
