"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {

  useEffect(() => {

    if (error.message.includes("DATABASE_CONNECTION_FAILED")) {
      toast.error("Database connection failed");
    }

    else if (error.message.includes("ECONNREFUSED")) {
      toast.error("Network connection issue");
    }

    else {
      toast.error("Something went wrong");
    }

  }, [error]);

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-950 text-white">

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          Something went wrong
        </h1>

        <p className="text-neutral-400">
          {error.message}
        </p>

        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-blue-600 rounded"
        >
          Try Again
        </button>
      </div>

    </div>
  );
}