



"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ErrorModal from "@/components/Errors/ErrorModal";
import Loader from "./Loader";
import LikeButton from "./LikeButton";

interface Props {
  productId: string;
}

interface Comment {
  _id: string;
  content: string;
  likesCount: number;
  liked?: boolean;
  user?: {
    _id: string;
    username: string;
    image?: string;
  };
}

export default function CommentsSection({ productId }: Props) {

  const { data: session } = useSession();

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const MAX_LENGTH = 300;


  function showErrorModal(message: string) {
    setErrorMessage(message);
    setShowError(true);
  }


  async function loadComments() {
    try {
      const res = await fetch(`/api/comment?productId=${productId}`);

      if (!res.ok) {
        showErrorModal("Failed to load comments");
        return;
      }

      const data = await res.json();
      setComments(data);

    } catch (err) {
      console.error(err);
      showErrorModal("Network error while loading comments");
    }
  }


  async function submitComment() {

    if (!session) {
      showErrorModal("Login required to comment");
      return;
    }

    if (!commentText.trim()) return;

    if (commentText.length > MAX_LENGTH) {
      showErrorModal("Comment cannot exceed 300 characters");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId,
          content: commentText
        })
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorModal(data.error || "Failed to post comment");
        return;
      }

      setComments(prev => [data, ...prev]);
      setCommentText("");

    } catch (err) {

      console.error(err);
      showErrorModal("Network error while posting comment");

    } finally {
      setLoading(false);
    }
  }


  async function toggleLike(commentId: string) {

    if (!session) {
      showErrorModal("Login required to like comments");
      return;
    }

    try {

      const res = await fetch("/api/like-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ commentId })
      });

      if (!res.ok) {
        showErrorModal("Failed to like comment");
        return;
      }

      const data = await res.json();

      setComments(prev =>
        prev.map(c =>
          c._id === commentId
            ? {
                ...c,
                liked: data.liked,
                likesCount: data.liked
                  ? (Number(c.likesCount) || 0) + 1
                  : Math.max(0, (Number(c.likesCount) || 0) - 1)
              }
            : c
        )
      );

    } catch (err) {

      console.error(err);
      showErrorModal("Network error while liking comment");

    }
  }

 
  async function deleteComment(commentId: string) {

    try {

      const res = await fetch("/api/comment", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ commentId })
      });

      if (!res.ok) {
        showErrorModal("Failed to delete comment");
        return;
      }

      setComments(prev => prev.filter(c => c._id !== commentId));

    } catch (err) {

      console.error(err);
      showErrorModal("Network error while deleting comment");

    }
  }


  useEffect(() => {
    if (productId) {
      loadComments();
    }
  }, [productId]);



  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mt-14">

      <h2 className="text-xl font-semibold mb-6">
        Comments
      </h2>


      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 mb-8">

        <textarea
          value={commentText}
          maxLength={MAX_LENGTH}
          rows={3}
          placeholder="Write a comment..."
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full bg-transparent outline-none resize-none text-sm"
        />

        <div className="flex justify-between items-center mt-3">

          <span className={`text-xs ${
            commentText.length > 280
              ? "text-red-400"
              : "text-neutral-400"
          }`}>
            {commentText.length}/{MAX_LENGTH}
          </span>

        <button
  onClick={submitComment}
  disabled={loading || !commentText.trim()}
  className="
    flex items-center justify-center gap-2
    min-w-[90px]
    bg-neutral-900 hover:bg-neutral-400
    text-white text-sm font-semibold
    border border-amber-500
    px-5 py-2
    rounded-lg
    transition-all duration-200
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
  "
>
  {loading ? (
    <>
      <Loader />
    </>
  ) : (
    "Post"
  )}
</button>

        </div>

      </div>


      <div className="space-y-4">

        {comments.length === 0 && (
          <p className="text-neutral-500 text-sm">
            No comments yet
          </p>
        )}

        {comments.map((c) => (

          <div
            key={c._id}
            className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 hover:border-neutral-600 transition"
          >

            <div className="flex gap-3">


<div className="w-10 h-10 rounded-full bg-neutral-700 overflow-hidden flex-shrink-0 self-start">
                {c.user?.image ? (
                  <img
                    src={c.user.image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm">
                    {c.user?.username?.[0]?.toUpperCase()}
                  </div>
                )}

              </div>

<div className="flex-1 min-w-0">
  <p className="text-sm font-semibold">
    @{c.user?.username}
  </p>

  <p
  className="text-neutral-300 text-sm mt-1 whitespace-pre-wrap"
  style={{
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  }}
>
  {c.content}
</p>      <div className="flex items-center gap-5 text-xs mt-3">

                <div className="flex items-center gap-2">

  <LikeButton
    checked={c.liked ?? false}
    onChange={() => toggleLike(c._id)}
  />

  <span className="text-xs text-neutral-400">
    {Number(c.likesCount) || 0}
  </span>

</div>
                  {session?.user?.id === c.user?._id && (
                    <button
                      onClick={() => deleteComment(c._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  )}

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      <ErrorModal
        isOpen={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />

    </div>
  );
}


