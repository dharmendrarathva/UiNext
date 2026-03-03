"use client";

import { useEffect, useState } from "react";
import FollowButton from "@/components/small/FollowButton";

interface UserItem {
  _id: string;
  username: string;
  image: string | null;
  isFollowing: boolean;
}

export default function UsersList() {
  const [users, setUsers] = useState<UserItem[]>([]);

  useEffect(() => {
    fetch("/api/users/public")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div className="space-y-4 max-w-md">
      {users.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between p-4 bg-neutral-900 rounded-xl"
        >
          <span>{user.username}</span>

          <FollowButton
            targetUserId={user._id}
            initialIsFollowing={user.isFollowing}
          />
        </div>
      ))}
    </div>
  );
}