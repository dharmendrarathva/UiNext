// "use client";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// interface User {
//   _id: string;
//   name: string;
//   username: string;
//   image?: string;
// }

// export default function FollowListModal({
//   userId,
//   type,
//   onClose,
// }: {
//   userId: string;
//   type: "followers" | "following";
//   onClose: () => void;
// }) {
//   const [users, setUsers] = useState<User[]>([]);

//   useEffect(() => {
//     async function load() {
//       const res = await fetch(`/api/users/${userId}/follows`);
//       const data = await res.json();
//       setUsers(data[type]);
//     }

//     load();
//   }, [userId, type]);

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//       <div className="bg-neutral-900 w-[420px] rounded-xl p-6 max-h-[500px] overflow-y-auto">
//         <div className="flex justify-between mb-4">
//           <h2 className="text-lg font-semibold capitalize">{type}</h2>
//           <button onClick={onClose}>✕</button>
//         </div>

//         {users.length === 0 && (
//           <p className="text-neutral-400">No users</p>
//         )}

//        <div className="space-y-4">
//   {users.map((u) => (
//     <Link
//       key={u._id}
//       href={`/users/${u._id}`}
//       onClick={onClose}
//       className="flex items-center gap-3 hover:bg-neutral-800 p-2 rounded-lg transition"
//     >
//       <img
//         src={u.image || "/avatar.png"}
//         className="w-8 h-8 rounded-full object-cover"
//       />

//       <div>
//         <div className="font-medium">{u.name}</div>
//         <div className="text-sm text-neutral-400">
//           @{u.username}
//         </div>
//       </div>
//     </Link>
//   ))}
// </div>
//       </div>
//     </div>
//   );
// }