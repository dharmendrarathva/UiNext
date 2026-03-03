import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Follow } from "@/models/Follow";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import ProfileView from "./profile-view";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PublicProfile({ params }: Props) {
  const { id } = await params; // ✅ unwrap params first

  await connectDB();

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const user = await User.findOne({
    _id: id,
    isDeleted: false,
    isBlocked: false,
  })
    .select("name username image bio website followersCount")
    .lean();

  if (!user) return notFound();

  let isFollowing = false;

  if (currentUserId) {
    const follow = await Follow.findOne({
      follower: currentUserId,
      following: id,
    });

    isFollowing = !!follow;
  }

 return (
  <ProfileView
    user={{
      _id: user._id.toString(),
      name: user.name ?? "",          // ✅ add this
      username: user.username,
      image: user.image ?? null,
      bio: user.bio ?? "",
      website: user.website ?? "",
      followersCount: user.followersCount ?? 0,
      isFollowing,
    }}
    currentUserId={currentUserId}
  />
);
}