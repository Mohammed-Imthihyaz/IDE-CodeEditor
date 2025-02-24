import { MessageSquare } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSnippetDetail } from "../../../../../store/SnippetDetail";
import { useAuthStore } from "../../../../../store/authStore";
import Comment from "../../Components/Comment";
import CommentForm from "../../Components/CommentForm";

const CommentsSection = ({ snippet }) => {
  const { getComments, comments, addComments, deleteComment } =
    useSnippetDetail();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingComment, setDeletingComment] = useState("");
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchComments = async () => {
      await getComments(snippet);
    };
    fetchComments();
  }, [snippet]);

  const handleSubmitComment = async (comment) => {
    setIsSubmitting(true);
    try {
      await addComments(snippet, comment);
    } catch (error) {
      console.error("Something went wrong", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setDeletingComment(commentId);
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error("Something went wrong", error);
    } finally {
      setDeletingComment("");
    }
  };

  return (
    <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl overflow-hidden">
      <div className="px-6 sm:px-8 py-6 border-b border-[#ffffff0a]">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Discussion ({comments.length})
        </h2>
      </div>

      <div className="p-6 sm:p-8">
        <CommentForm
          onSubmit={handleSubmitComment}
          isSubmitting={isSubmitting}
        />

        <div className="space-y-6">
          {Array.isArray(comments) && comments.length > 0 ? (
            comments
              .filter((comment) => comment && comment._id) 
              .map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  currentUserId={user?._id}
                  isDeleting={deletingComment === comment._id}
                  onDelete={handleDeleteComment}
                />
              ))
          ) : (
            <p className="text-gray-400">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
