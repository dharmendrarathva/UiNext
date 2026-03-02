import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./db";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

callbacks: {
  async signIn({ user }) {
    await connectDB();

    let existingUser = await User.findOne({
      email: user.email,
    });

    if (!existingUser) {
      existingUser = await User.create({
        name: user.name,
        email: user.email,
        image: user.image, // save google image
      });
    } else {
      // Always sync latest google image
      existingUser.image = user.image;
      await existingUser.save();
    }

    if (existingUser.isBlocked || existingUser.isDeleted) {
      return false;
    }

    return true;
  },

  async jwt({ token, user }) {
    // First login
    if (user) {
    token.image = user.image ?? null;
    }

    // Always attach DB data
    if (token.email) {
      await connectDB();

      const dbUser = await User.findOne({
        email: token.email,
      });

      if (dbUser) {
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.isBlocked = dbUser.isBlocked;
      token.image = dbUser.image ?? null;
      }
    }

    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.role = token.role;
      session.user.isBlocked = token.isBlocked;
session.user.image = token.image ?? null;    }

    return session;
  },
},
}