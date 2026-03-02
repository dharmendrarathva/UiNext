import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { UserActivity } from "@/models/UserActivity";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import Image from "next/image";

export default async function UserDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) notFound();

  const user = await User.findById(id).lean();
  if (!user) notFound();

  const activities = await UserActivity.find({ userId: id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

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

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">

         {/* Account Information */}
<section className="bg-neutral-900 rounded-2xl p-8 space-y-8">
  <h2 className="text-2xl font-semibold border-b border-neutral-800 pb-4">
    Account Information
  </h2>

  {/* Top Grid (Normal Fields) */}
  <div className="grid sm:grid-cols-2 gap-6 text-sm">

    <Info label="Role" value={user.role} />

    <Info
      label="Status"
      value={
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            user.isBlocked
              ? "bg-red-500/20 text-red-400"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          {user.isBlocked ? "Blocked" : "Active"}
        </span>
      }
    />

    <Info
      label="Deleted"
      value={user.isDeleted ? "Yes" : "No"}
    />

    <Info label="Block Reason" value={user.blockReason || "-"} />

    <Info label="Last Login IP" value={user.lastLoginIP || "-"} />

  </div>

  {/* Full Width Device Section */}
  <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-5">
    <p className="text-neutral-400 text-sm mb-2">Device Information</p>
    <p className="text-white text-sm break-words">
      {user.lastLoginDevice || "Not Available"}
    </p>
  </div>

</section>

          {/* Bio & Website */}
          <section className="bg-neutral-900 rounded-2xl p-8 space-y-4">
            <h2 className="text-2xl font-semibold border-b border-neutral-800 pb-4">
              Profile Details
            </h2>

            <p className="text-neutral-300">
              Bio : {user.bio || "No bio provided"}
            </p>

            {user.website && (
              <a
                href={user.website}
                target="_blank"
                className="text-neutral-300 hover:underline text-sm"
              >
               Website :  {user.website}
              </a>
            )}
          </section>

          {/* Recent Activity */}
          <section className="bg-neutral-900 rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-semibold border-b border-neutral-800 pb-4">
              Recent Activity
            </h2>

            {activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((act: any) => (
                  <div
                    key={act._id.toString()}
                    className="bg-neutral-800 p-4 rounded-xl text-sm flex justify-between"
                  >
                    <span>{act.type}</span>
                    <span className="text-neutral-500">
                      {new Date(act.createdAt).toLocaleString()}
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
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">

          {/* Stats */}
          <section className="bg-neutral-900 rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-semibold border-b border-neutral-800 pb-4">
              Statistics
            </h2>

            <Stat label="Followers" value={user.followersCount || 0} />
            <Stat label="Following" value={user.followingCount || 0} />
            <Stat
              label="Account Created"
              value={
                user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-"
              }
            />
            <Stat
              label="Last Updated"
              value={
                user.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString()
                  : "-"
              }
            />
          </section>

          {/* Login Location */}
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

/* ================= REUSABLE COMPONENTS ================= */

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