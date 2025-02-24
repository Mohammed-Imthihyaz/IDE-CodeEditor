
 // Assuming you have an auth store
 import { motion } from "framer-motion"; // Ensure this is imported
import { Trash2, User } from "lucide-react";
import { useState } from "react";
import { UseSnippetStore } from "../../../../store/SnippetStore";
import { useAuthStore } from "../../../../store/authStore";
import StarButton from "./StarButton";

function SnippetCard({ snippet }) {
  const { user } = useAuthStore(); 
  const [isDeleting, setIsDeleting] = useState(false);
  const {deleteSnippet}=UseSnippetStore();

  const handleDelete = async () => {
    setIsDeleting(true);
    const currentSnippets = UseSnippetStore.getState().snippets;
    const updatedSnippets = currentSnippets.filter(snippetItem => snippetItem._id !== snippet._id);
    UseSnippetStore.setState({ snippets: updatedSnippets });
  
    try {
      await deleteSnippet(snippet._id);
    } catch (error) {
      toast.error("Error deleting the snippet");
      console.log("Error deleting the snippet:", error);
      UseSnippetStore.setState({ snippets: currentSnippets });
    } finally {
      setIsDeleting(false);
    }
  };
  
  

  return (
    <motion.div
  layout
  className="group relative"
  whileHover={{ y: -2 }}
  transition={{ duration: 0.2 }}
>
      <a href={`/snippets-Id/${snippet._id}`} className="h-full block">
        <div
          className="relative h-full bg-[#1e1e2e]/80 backdrop-blur-sm rounded-xl 
          border border-[#313244]/50 hover:border-[#313244] 
          transition-all duration-300 overflow-hidden"
        >
          <div className="p-6">
           
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 
                  group-hover:opacity-30 transition-all duration-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-1">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium">
                    {snippet.language}
                  </span>
                </div>
              </div>
              <div
                className="absolute top-5 right-5 z-10 flex gap-4 items-center"
                onClick={(e) => e.preventDefault()}
              >
                <StarButton snippetId={snippet._id} />
               

                {user?._id === snippet.userId && (
                  <div className="z-10" onClick={(e) => e.preventDefault()}>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200
                                  ${
                                    isDeleting
                                      ? "bg-red-500/20 text-red-400 cursor-not-allowed"
                                      : "bg-gray-500/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                                  }
                                `}
                    >
                      {isDeleting ? (
                        <div className="size-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {snippet.title}
                </h2>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-gray-800/50">
                      <User className="size-3" />
                    </div>
                    <span className="truncate max-w-[150px]">{snippet.name}</span>
                  </div>
                </div>
              </div>

              <div className="relative group/code">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-purple-500/5 rounded-lg opacity-0 group-hover/code:opacity-100 transition-all" />
                <pre className="relative bg-black/30 rounded-lg p-4 overflow-hidden text-sm text-gray-300 font-mono line-clamp-3">
                  {snippet.code}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export default SnippetCard;
