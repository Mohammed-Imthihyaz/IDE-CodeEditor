import { motion } from "framer-motion";
import { Clock, LogOut, Star, User } from "lucide-react";
import React, { useEffect } from "react";
import { UseSnippetStore } from "../../../store/SnippetStore";
import { UseCodeEditor } from "../../../store/UseCodeEditor";
import { useAuthStore } from "../../../store/authStore";
import NavigationHeader from "./NavigationHeader";

const ProfilePage = () => {
  const { fetchStarredSnippets, starredSnippets, getStarCount } =
    UseSnippetStore();
  const { fetchUserExecutions, executions } = UseCodeEditor();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchStarredSnippets();
      fetchUserExecutions(user._id);
    }
  }, [user, fetchStarredSnippets, fetchUserExecutions]);

  const handleLogOut = async () => {
    try {
      await logout();
      toast.success("Logged-Out Successfully")
    } catch (error) {
      toast.error("Something went wrong !!");
    }
  };
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 p-6 bg-gray-900 rounded-xl shadow-md"
        >
          <div className="p-3 bg-blue-500 rounded-full">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-white text-xl font-semibold p-2">
              {user?.name || "User"}
            </h2>
            <span className="flex items-center gap-2 text-gray-400 p-1">
              <Star className="w-5 h-5 text-yellow-400" />
            </span>
            <div className="flex items-center gap-2 text-gray-400 p-2">
              {user?.email}
            </div>
            <div className="flex items-center gap-2 text-gray-400 p-1">
              <Clock className="h-4 w-4" />
              <span> Account Created: {user.createdAt}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <h3 className="text-lg text-white font-semibold mb-4">
            Starred Snippets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {starredSnippets.length > 0 ? (
              starredSnippets.map((snippet) => (
                <motion.div
                  key={snippet._id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-gray-800 rounded-lg shadow-md"
                >
                  <h4 className="text-white font-medium">{snippet.title}</h4>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {snippet.code}
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No starred snippets yet.</p>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <h3 className="text-lg text-white font-semibold mb-4">
            Code Executions
          </h3>
          <div className="space-y-4">
            {executions.length > 0 ? (
              executions.map((execution) => (
                <motion.div
                  key={execution._id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-gray-800 rounded-lg shadow-md"
                >
                  <h4 className="text-white font-medium">
                    {execution.language.toUpperCase()}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {execution.output || "No output available"}
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No code executions yet.</p>
            )}
          </div>
          <motion.div
            className="flex justify-center items-center mt-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={handleLogOut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-3 px-72 py-2 bg-red-600 text-white text-2xl font-bold rounded-full shadow-lg hover:bg-red-700 transition-all"
            >
              <LogOut size={27} />
              Log Out
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
