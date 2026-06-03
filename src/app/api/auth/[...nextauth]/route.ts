import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Optional: Add debugging for NextAuth issues
export async function OPTIONS(req: Request) {
  return new Response("NextAuth is configured correctly", { status: 200 });
}
