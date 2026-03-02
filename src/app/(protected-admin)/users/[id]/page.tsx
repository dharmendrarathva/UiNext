import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { UserActivity } from "@/models/UserActivity";
import { Notification } from "@/models/Notification";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import Image from "next/image";
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

  const user = await User.findById(id).lean();
  if (!user) notFound();

  const activitiesRaw = await UserActivity.find({ userId: id })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  const notificationsRaw = await Notification.find({ to: id })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  /* ================= SAFE SERIALIZATION ================= */

  const activities = activitiesRaw.map((a: any) => ({
    _id: a._id.toString(),
    type: a.type,
    createdAt: a.createdAt
      ? new Date(a.createdAt).toISOString()
      : null,
  }));

  const notifications = notificationsRaw.map((n: any) => ({
    _id: n._id.toString(),
    title: n.title,
    message: n.message,
    type: n.type,
    createdAt: n.createdAt
      ? new Date(n.createdAt).toISOString()
      : null,
  }));

  const formatDate = (date?: Date | string | null) =>
    date ? new Date(date).toISOString().split("T")[0] : "-";

  return (
    <div className="min-h-screen bg-black text-white p-10 space-y-12">

      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-8 border-b border-neutral-800 pb-8">
        {user.image ? (
          <Image
            src={user.image}
            alt="Profile"
            width={120}
            height={120}
            className="rounded-full object-cover border border-neutral-700"
          />
        ) : (
          <div className="w-[120px] h-[120px] rounded-2xl bg-neutral-800 flex items-center justify-center text-3xl font-bold">
            {user.name?.charAt(0)}
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <p className="text-neutral-400 text-lg">@{user.username}</p>
          <p className="text-neutral-500">{user.email}</p>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid lg:grid-cols-3 gap-10">

        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-2 space-y-8">

          {/* ACCOUNT INFORMATION */}
          <section className="bg-neutral-900 rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-semibold border-b border-neutral-800 pb-4">
              Account Information
            </h2>

            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <Info label="Role" value={user.role} />

              <Info
                label="Status"
                value={
                  <StatusBadge isBlocked={user.isBlocked} />
                }
              />

              <Info
                label="Deleted"
                value={user.isDeleted ? "Yes" : "No"}
              />

              <Info
                label="Block Reason"
                value={user.blockReason || "-"}
              />

              <Info
                label="Last Login IP"
                value={user.lastLoginIP || "-"}
              />
            </div>

            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5">
              <p className="text-neutral-400 text-sm mb-2">
                Device Information
              </p>
              <p className="text-white text-sm break-words">
                {user.lastLoginDevice || "Not Available"}
              </p>
            </div>
          </section>

          {/* PROFILE DETAILS */}
          <section className="bg-neutral-900 rounded-2xl p-8 space-y-4">
            <h2 className="text-2xl font-semibold border-b border-neutral-800 pb-4">
              Profile Details
            </h2>

            <p className="text-neutral-300">
              Bio: {user.bio || "No bio provided"}
            </p>

            {user.website && (
              <a
                href={user.website}
                target="_blank"
                className="text-neutral-300 hover:underline text-sm"
              >
                Website: {user.website}
              </a>
            )}
          </section>

          {/* ADMIN ACTIONS */}
          <AdminUserActions
            userId={id}
            isBlocked={user.isBlocked}
          />

          {/* RECENT ACTIVITY */}
          <section className="bg-neutral-900 rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-semibold border-b border-neutral-800 pb-4">
              Recent Activity
            </h2>

            {activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((act) => (
                  <div
                    key={act._id}
                    className="bg-neutral-800 p-4 rounded-xl text-sm flex justify-between"
                  >
                    <span>{act.type}</span>
                    <span className="text-neutral-500">
                      {act.createdAt
                        ? act.createdAt.split("T")[0]
                        : "-"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">
                No recent activity found
              </p>
            )}
          </section>

          {/* NOTIFICATIONS */}
          <section className="bg-neutral-900 rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-semibold border-b border-neutral-800 pb-4">
              Recent Notifications
            </h2>

            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className="bg-neutral-800 p-4 rounded-xl text-sm"
                  >
                    <p className="font-semibold">{n.title}</p>
                    <p className="text-neutral-400 mt-1">
                      {n.message}
                    </p>
                    <p className="text-neutral-500 text-xs mt-2">
                      {n.createdAt
                        ? n.createdAt.split("T")[0]
                        : "-"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">
                No notifications found
              </p>
            )}
          </section>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="space-y-8">

          {/* STATS */}
          <section className="bg-neutral-900 rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-semibold border-b border-neutral-800 pb-4">
              Statistics
            </h2>

            <Stat label="Followers" value={user.followersCount || 0} />
            <Stat label="Following" value={user.followingCount || 0} />
            <Stat label="Created" value={formatDate(user.createdAt)} />
            <Stat label="Updated" value={formatDate(user.updatedAt)} />
          </section>

          {/* LOCATION */}
          <section className="bg-neutral-900 rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-semibold border-b border-neutral-800 pb-4">
              Last Login Location
            </h2>

            {user.lastLoginLocation ? (
              <div className="space-y-2 text-sm">
                <Info label="City" value={user.lastLoginLocation.city || "-"} />
                <Info label="Country" value={user.lastLoginLocation.country || "-"} />
                <Info
                  label="Coordinates"
                  value={`${user.lastLoginLocation.lat}, ${user.lastLoginLocation.lng}`}
                />
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">
                Location data not available
              </p>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between border-b border-neutral-800 pb-2">
      <span className="text-neutral-500">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-neutral-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function StatusBadge({ isBlocked }: { isBlocked: boolean }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        isBlocked
          ? "bg-red-500/20 text-red-400"
          : "bg-green-500/20 text-green-400"
      }`}
    >
      {isBlocked ? "Blocked" : "Active"}
    </span>
  );
}