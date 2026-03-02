import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./db";
import { User } from "@/models/User";
import { UserActivity } from "@/models/UserActivity";
import { headers } from "next/headers";

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
    /**
     * 🔐 SIGN IN
     * - Create user if not exists
     * - Sync google image
     * - Update login metadata
     * - Log activity
     */
    async signIn({ user }) {
      await connectDB();

     const requestHeaders = await headers();

const ip =
  requestHeaders.get("x-forwarded-for") ??
  requestHeaders.get("x-real-ip") ??
  "unknown";

const userAgent =
  requestHeaders.get("user-agent") ?? "unknown-device";

      let existingUser = await User.findOne({
        email: user.email,
      });

      if (!existingUser) {
        existingUser = await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          lastLoginAt: new Date(),
          lastLoginIP: ip,
          lastLoginDevice: userAgent,
        });
      } else {
        if (existingUser.isBlocked || existingUser.isDeleted) {
          return false;
        }

        // Sync Google image
        existingUser.image = user.image;

        // Update login metadata
        existingUser.lastLoginAt = new Date();
        existingUser.lastLoginIP = ip;
        existingUser.lastLoginDevice = userAgent;

        await existingUser.save();
      }

      // Log activity (separate collection)
      await UserActivity.create({
        userId: existingUser._id,
        ip,
        device: userAgent,
        type: "LOGIN",
      });

      return true;
    },

    /**
     * 🧠 JWT
     * Attach DB role + block status
     */
async jwt({ token, user }) {
  if (user) {
    token.image = user.image ?? null;
  }

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
      if (!token?.id) return session;

      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.isBlocked = token.isBlocked as boolean;
        session.user.image = token.image ?? null;
      }

      return session;
    },
  },
};