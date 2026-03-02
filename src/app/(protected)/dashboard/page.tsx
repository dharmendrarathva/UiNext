import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        Dashboard
      </h1>

      <p>Welcome {session?.user?.email}</p>
      <p>Role: {session?.user?.role}</p>
      <a
  href="/profile"
  className="text-blue-500 underline block mt-4"
>
  Go to Profile
</a>

      <form action="/api/auth/signout" method="post">
        <button className="bg-red-500 text-white px-4 py-2 rounded mt-4">
          Sign Out
        </button>
      </form>
    </div>
  );
}