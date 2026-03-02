// import { connectDB } from "@/lib/db";
// import { User } from "@/models/User";
// import Link from "next/link";

// export default async function AdminUsersPage() {
//   await connectDB();

//   const users = await User.find({})
//     .select("name email role isBlocked lastLoginAt")
//     .lean();

//   return (
//     <div className="p-10 text-white">
//       <h1 className="text-3xl font-bold mb-6">All Users</h1>

//       <div className="space-y-4">
//         {users.map((user: any) => (
//           <div
//             key={user._id}
//             className="p-4 bg-neutral-900 rounded-xl flex justify-between"
//           >
//             <div>
//               <p>{user.name}</p>
//               <p className="text-sm text-neutral-400">{user.email}</p>
//               <p className="text-xs text-neutral-500">
//                 Last Login: {user.lastLoginAt?.toString()}
//               </p>
//             </div>

//             <Link href={`/users/${user._id}`} className="text-blue-400">
//               Manage
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import Link from "next/link";
import { UserRole } from "@/models/User";

export const dynamic = "force-dynamic";

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  lastLoginAt?: Date;
  lastLoginDevice?: string;
  createdAt: Date;
}

export default async function AdminUsersPage() {
  await connectDB();

  const users = await User.find({})
    .select(
      "name email role isBlocked lastLoginAt lastLoginDevice createdAt"
    )
    .sort({ createdAt: -1 })
    .lean<IUser[]>();

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">User Management</h1>
        <p className="text-neutral-400 mb-10">
          Manage users, monitor activity, and control access.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900 text-neutral-400">
              <tr className="text-left">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Login</th>
                <th className="p-4">Device</th>
                <th className="p-4">Created</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id.toString()}
                  className="border-t border-white/5 hover:bg-neutral-900 transition"
                >
                  {/* USER */}
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-neutral-500 text-xs">
                        {user.email}
                      </p>
                    </div>
                  </td>

                  {/* ROLE */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        user.role === "ADMIN"
                          ? "bg-purple-600/20 text-purple-400"
                          : user.role === "SUPERADMIN"
                          ? "bg-red-600/20 text-red-400"
                          : "bg-blue-600/20 text-blue-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    {user.isBlocked ? (
                      <span className="px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs">
                        Blocked
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-xs">
                        Active
                      </span>
                    )}
                  </td>

                  {/* LAST LOGIN */}
                  <td className="p-4 text-neutral-400">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleString()
                      : "—"}
                  </td>

                  {/* DEVICE */}
                  <td className="p-4 text-neutral-500 truncate max-w-xs">
                    {user.lastLoginDevice ?? "—"}
                  </td>

                  {/* CREATED */}
                  <td className="p-4 text-neutral-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* ACTION */}
                  <td className="p-4 text-right">
                    <Link
                      href={`/users/${user._id}`}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-10 text-neutral-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}