import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        try {
          await connectDB();

          const user = await User.findOne({
            email: credentials.email.toLowerCase()
          }).select("+password");

          if (user) {
            const isMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isMatch) {
              if (user.status === "deleted") {
                throw new Error("Account not found");
              }

              if (user.role === "teacher" && user.approvalStatus === "pending") {
                throw new Error("Account pending admin approval");
              }

              if (user.role === "teacher" && user.approvalStatus === "rejected") {
                throw new Error("Teacher account application was rejected");
              }
              return {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image || ""
              };
            }
          }
          
          // No user found or password mismatch
          throw new Error("Invalid email or password");
        } catch (error: any) {
          console.error("Auth error:", error?.message || error);
          throw new Error(error?.message || "Authentication failed");
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "fallback-secret-change-in-production",
  callbacks: {
    async jwt({ token, user, account }: { token: any; user?: any; account?: any }) {
      try {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.role = user.role;
          token.image = user.image || "";
        }
        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },
    async session({ session, token }: { session: any; token: any }) {
      try {
        if (session.user && token) {
          session.user.id = token.id || token.sub;
          session.user.email = token.email;
          session.user.name = token.name;
          session.user.role = token.role;
          session.user.image = token.image;
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },
};
