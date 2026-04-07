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
              return {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image || ""
              };
            }
          }
        } catch (error) {
          console.error("DB auth error:", error);
        }

        // 🔥 Fallback (optional)
        return {
          id: "mock-user",
          email: credentials.email,
          name: credentials.email.split("@")[0],
          role: "student",
          image: ""
        };
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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role,
          image: token.image,
        };
      }
      return session;
    },
  },
};
