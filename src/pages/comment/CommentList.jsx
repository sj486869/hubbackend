import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVideoComments } from "../../redux/slices/commentSlice";
import CommentItem from "./CommentItem";

const CommentList = ({ videoId }) => {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.comment);
  console.log("comments",comments)

  useEffect(() => {
    if (videoId) dispatch(getVideoComments(videoId));
  }, [videoId, dispatch]);

  if (loading) return <p className="text-gray-400">Loading comments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 space-y-4">
      {comments.length > 0 ? (
        comments.map((comment) => <CommentItem key={comment._id} comment={comment} />)
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}
    </div>
  );
};

export default CommentList;
