export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Notification } from "@/models/Notification";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDB();

  const dbUser = await User.findById(session.user.id)
    .select(
      "name username bio website followersCount followingCount createdAt updatedAt isBlocked blockReason"
    )
    .lean();

  if (!dbUser) {
    redirect("/login");
  }

  // Optional strict protection (recommended)
  if (dbUser.isBlocked) {
    redirect("/blocked");
  }

  /* ================= NOTIFICATIONS ================= */

  const rawNotifications = await Notification.find({
    to: session.user.id,
  })
    .sort({ createdAt: -1 })
    .limit(15)
    .lean();

  const notifications = rawNotifications.map((n: any) => ({
    _id: n._id.toString(),
    title: n.title,
    message: n.message,
    type: n.type,
    isRead: n.isRead,
    createdAt: n.createdAt ? n.createdAt.toISOString() : null,
    updatedAt: n.updatedAt ? n.updatedAt.toISOString() : null,
  }));

  return (
    <div className="text-white px-10 py-10">
      <div className="max-w-6xl">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-neutral-400 mt-2">
          Manage your account preferences and profile information.
        </p>

        <div className="mt-10">
          <ProfileForm
            user={{
              email: session.user.email ?? "",
              image: session.user.image ?? null,
              name: dbUser.name ?? "",
              username: dbUser.username ?? "",
              bio: dbUser.bio ?? "",
              website: dbUser.website ?? "",
              followersCount: dbUser.followersCount ?? 0,
              followingCount: dbUser.followingCount ?? 0,
              createdAt: dbUser.createdAt
                ? dbUser.createdAt.toISOString()
                : null,
              updatedAt: dbUser.updatedAt
                ? dbUser.updatedAt.toISOString()
                : null,
              isBlocked: dbUser.isBlocked ?? false,
              blockReason: dbUser.blockReason ?? null,
              notifications,
            }}
          />
        </div>
      </div>
    </div>
  );
}