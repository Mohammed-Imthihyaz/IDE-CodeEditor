import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { UseSnippetStore } from "../../../../store/SnippetStore";

const StarButton = ({ snippetId }) => {
  const { isSnippetStarred, getStarCount, starSnippet } = UseSnippetStore();
  const [starred, setStarred] = useState(false);
  const [starCount, setStarCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const isStarred = await isSnippetStarred(snippetId);
      const count = await getStarCount(snippetId);
      setStarred(isStarred);
      setStarCount(count);
    };
    fetchData();
  }, [snippetId]);

  const handleStar = async () => {
    try {
      await starSnippet(snippetId);
      setStarred((prev) => !prev); 
      setStarCount((prev) => (starred ? prev - 1 : prev + 1)); 
    } catch (error) {
      console.log("Error in starring the snippet", error);
    }
  };

  return (
    <button
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
        starred
          ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
          : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
      }`}
      onClick={handleStar}
    >
      <Star
        className={`w-4 h-4 ${starred ? "fill-yellow-500" : "fill-none group-hover:fill-gray-400"}`}
      />
      <span className={`text-xs font-medium ${starred ? "text-yellow-500" : "text-gray-400"}`}>
        {starCount}
      </span>
    </button>
  );
};

export default StarButton;
