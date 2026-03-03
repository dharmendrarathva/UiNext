"use client";

import { useState } from "react";

interface Activity {
  _id: string;
  type: string;
  createdAt: string | null;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string | null;
}

interface Props {
  activities: Activity[];
  notifications: Notification[];
}

export default function UserLogs({
  activities,
  notifications,
}: Props) {
  const INITIAL_COUNT = 3;
  const LOAD_COUNT = 5;

  const [visibleActivities, setVisibleActivities] =
    useState(INITIAL_COUNT);

  const [visibleNotifications, setVisibleNotifications] =
    useState(INITIAL_COUNT);

  const loadMoreActivities = () => {
    setVisibleActivities((prev) =>
      Math.min(prev + LOAD_COUNT, activities.length)
    );
  };

  const loadMoreNotifications = () => {
    setVisibleNotifications((prev) =>
      Math.min(prev + LOAD_COUNT, notifications.length)
    );
  };

  const hasMoreActivities =
    visibleActivities < activities.length;

  const hasMoreNotifications =
    visibleNotifications < notifications.length;

  return (
    <div className="space-y-8">

      {/* ================= RECENT ACTIVITY ================= */}
      <section className="bg-neutral-900 rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold border-b border-neutral-800 pb-4">
          Recent Activity
        </h2>

        {activities.length > 0 ? (
          <>
            <div className="space-y-3">
              {activities
                .slice(0, visibleActivities)
                .map((act) => (
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

            {hasMoreActivities && (
              <button
                onClick={loadMoreActivities}
                className="mt-4 px-5 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm"
              >
                Load More
              </button>
            )}
          </>
        ) : (
          <p className="text-neutral-500 text-sm">
            No recent activity found
          </p>
        )}
      </section>

      {/* ================= RECENT NOTIFICATIONS ================= */}
      <section className="bg-neutral-900 rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold border-b border-neutral-800 pb-4">
          Recent Notifications
        </h2>

        {notifications.length > 0 ? (
          <>
            <div className="space-y-3">
              {notifications
                .slice(0, visibleNotifications)
                .map((n) => (
                  <div
                    key={n._id}
                    className="bg-neutral-800 p-4 rounded-xl text-sm"
                  >
                    <p className="font-semibold">
                      {n.title}
                    </p>
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

            {hasMoreNotifications && (
              <button
                onClick={loadMoreNotifications}
                className="mt-4 px-5 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm"
              >
                Load More
              </button>
            )}
          </>
        ) : (
          <p className="text-neutral-500 text-sm">
            No notifications found
          </p>
        )}
      </section>

    </div>
  );
}