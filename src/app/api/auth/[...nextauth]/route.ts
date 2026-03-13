import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add your own logic here to validate credentials
        // This is a placeholder - replace with your actual authentication logic
        if (credentials?.email && credentials?.password) {
          // Return user object on successful authentication
          return {
            id: "1",
            email: credentials.email,
            name: "User"
          };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id ?? "1";
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...(session.user ?? {}),
        id: (token as { id?: string }).id ?? "1",
      } as typeof session.user & { id: string };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
