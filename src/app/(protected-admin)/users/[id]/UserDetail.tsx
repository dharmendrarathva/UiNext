"use client"
import Image from "next/image";


interface Props {
  user: any;
}

export default function UserDetail({ user }: Props) {
  const formatDate = (date?: Date | string | null) =>
    date ? new Date(date).toISOString().split("T")[0] : "-";

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-8 border-b border-neutral-800 pb-8">
        {user.image ? (
    <Image
      src={user.image}
      alt="Profile"
      width={120}
      height={120}
      className="rounded-full object-cover border border-neutral-700"
      unoptimized
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

      {/* ================= ACCOUNT INFORMATION ================= */}
      <section className="bg-neutral-900 rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold border-b border-neutral-800 pb-4">
          Account Information
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          <Info label="Role" value={user.role} />

          <Info
            label="Status"
            value={<StatusBadge isBlocked={user.isBlocked} />}
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

        {/* DEVICE INFO */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 mt-4">
          <p className="text-neutral-400 text-sm mb-2">
            Device Information
          </p>
          <p className="text-white text-sm break-words">
            {user.lastLoginDevice || "Not Available"}
          </p>
        </div>
      </section>

      {/* ================= PROFILE DETAILS ================= */}
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

      {/* ================= STATISTICS ================= */}
      <section className="bg-neutral-900 rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold border-b border-neutral-800 pb-4">
          Statistics
        </h2>

        <Stat label="Followers" value={user.followersCount || 0} />
        <Stat label="Following" value={user.followingCount || 0} />
      <Stat
  label="Created"
  value={user.createdAt ? user.createdAt.split("T")[0] : "-"}
/>
<Stat
  label="Updated"
  value={user.updatedAt ? user.updatedAt.split("T")[0] : "-"}
/>
      </section>

      {/* ================= LAST LOGIN LOCATION ================= */}
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