"use client";

import Image from "next/image";
import FollowButton from "@/components/small/FollowButton";

interface Props {
  user: {
    _id: string;
    name: string;            // ✅ add this
    username: string;
    image: string | null;
    bio: string;
    website: string;
    followersCount: number;
    isFollowing: boolean;
  };
  currentUserId?: string;
}

export default function ProfileView({ user, currentUserId }: Props) {
  const isOwnProfile = currentUserId === user._id;

  return (
    <div className="max-w-2xl mx-auto text-white p-10 space-y-8">
      <div className="bg-neutral-900 rounded-3xl p-10 border border-neutral-800">

        {/* Profile Image */}
        {user.image && (
          <Image
  src={user.image}
  alt={user.username ? `${user.username}'s profile image` : "User profile image"}
  width={120}
  height={120}
  className="rounded-full mb-6"
/>
        )}

        {/* Username */}
<div className="mt-4">
  {user.name && (
    <h1 className="text-3xl font-bold">{user.name}</h1>
  )}
  <p className="text-neutral-400 text-lg">@{user.username}</p>
</div>
        {/* Followers */}
        <p className="text-neutral-400 mt-2">
          {user.followersCount} followers
        </p>

        {/* Bio */}
        {user.bio && (
          <p className="mt-6 text-neutral-300">{user.bio}</p>
        )}

        {/* Website */}
        {user.website && (
          <a
            href={user.website}
            target="_blank"
            className="block mt-4 text-yellow-400 hover:underline"
          >
            {user.website}
          </a>
        )}

        {/* Follow Button */}
        {!isOwnProfile && (
          <div className="mt-8">
            <FollowButton
              targetUserId={user._id}
              initialIsFollowing={user.isFollowing}
            />
          </div>
        )}

      </div>
    </div>
  );
}