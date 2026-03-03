import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { UserActivity } from "@/models/UserActivity";
import { Notification } from "@/models/Notification";
import { notFound } from "next/navigation";
import mongoose from "mongoose";

import UserDetail from "./UserDetail";
import UserLogs from "./UserLogs";
import AdminUserActions from "./user-actions";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetails({ params }: Props) {
  const { id } = await params;

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  /* ================= USER ================= */

  const rawUser = await User.findById(id).lean();
  if (!rawUser) notFound();

  const user = {
    ...rawUser,
    _id: rawUser._id.toString(),
    createdAt: rawUser.createdAt
      ? new Date(rawUser.createdAt).toISOString()
      : null,
    updatedAt: rawUser.updatedAt
      ? new Date(rawUser.updatedAt).toISOString()
      : null,
  };

  /* ================= ACTIVITIES ================= */

  const activitiesRaw = await UserActivity.find({ userId: id })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  const activities = activitiesRaw.map((a: any) => ({
    _id: a._id.toString(),
    type: a.type,
    createdAt: a.createdAt
      ? new Date(a.createdAt).toISOString()
      : null,
  }));

  /* ================= NOTIFICATIONS ================= */

  const notificationsRaw = await Notification.find({ to: id })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  const notifications = notificationsRaw.map((n: any) => ({
    _id: n._id.toString(),
    title: n.title,
    message: n.message,
    type: n.type,
    createdAt: n.createdAt
      ? new Date(n.createdAt).toISOString()
      : null,
  }));

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-black text-white p-10 space-y-12">
      <div className="grid lg:grid-cols-3 gap-10">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">

          <UserDetail user={user} />

          <AdminUserActions
            userId={id}
            isBlocked={user.isBlocked}
          />

          <UserLogs
            activities={activities}
            notifications={notifications}
          />

        </div>

        {/* RIGHT COLUMN (Reserved for future expansion) */}
        <div className="space-y-8">
          {/* Future: audit logs, reports, flags, analytics */}
        </div>

      </div>
    </div>
  );
}