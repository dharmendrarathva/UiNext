"use client";

import { useEffect, useState } from "react";

export function ChunkErrorHandler({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Handle chunk loading errors
    const handleChunkError = (event: ErrorEvent) => {
      if (event.message?.includes("Failed to load chunk") || 
          event.message?.includes("Loading chunk failed")) {
        event.preventDefault();
        console.warn("Chunk load error detected, attempting recovery...");
        
        // Clear corrupted cache
        if ('caches' in window) {
          caches.keys().then(keys => {
            keys.forEach(key => caches.delete(key));
          });
        }
        
        // Reload the page after clearing cache
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    };

    // Handle unhandled promise rejections
    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes("Failed to load chunk")) {
        event.preventDefault();
        window.location.reload();
      }
    };

    window.addEventListener("error", handleChunkError);
    window.addEventListener("unhandledrejection", handlePromiseRejection);
    
    return () => {
      window.removeEventListener("error", handleChunkError);
      window.removeEventListener("unhandledrejection", handlePromiseRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}