import { AnimatePresence, motion } from "framer-motion";
import { Search, Tag } from "lucide-react";
import React, { useEffect } from "react";
import { UseSnippetStore } from "../../../store/SnippetStore";
import NavigationHeader from "../Components/NavigationHeader";
import SnippetCard from "./Components/SnippetCard";
import SnippetsPageSkeleton from "./Components/SnippetPageSkeleton";

const SnippetPage = () => {
  const {
    snippets,
    isLoading,
    searchQuery,
    selectedLanguage,
    fetchSnippets,
    setSearchQuery,
    setSelectedLanguage,
  } = UseSnippetStore();
  useEffect(() => {
    fetchSnippets();
    
  }, []);
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <NavigationHeader />
        <SnippetsPageSkeleton />
      </div>
    );
  }
  const languages = [...new Set(snippets.map((s) => s.language))];
  const popularLanguages = languages.slice(0, 5);
  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage = !selectedLanguage || snippet.language === selectedLanguage;

    return matchesSearch && matchesLanguage;
});

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      <div className="relative max-w-7xl mx-auto ">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-6"
          >
            Discuss & Share Your Code
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 mb-8"
          >
            Discover a collection of code snippets shared by the community.
          </motion.p>
        </div>
        <div className="relative group max-w-5xl mx-auto mb-5">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search snippets by title, language, or author..."
              className="w-full pl-12 pr-4 py-4 bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                            rounded-xl border border-[#313244] hover:border-[#414155] transition-all duration-200
                            placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 ml-32">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Languages:</span>
            </div>
        {popularLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLanguage(lang)}
            className={`group relative px-3 py-2 rounded-lg transition-all duration-200 
        ${
          selectedLanguage === lang
            ? "text-blue-400 bg-blue-500/10 ring-2 ring-blue-500/50"
            : "text-gray-400 hover:text-gray-300 bg-[#1e1e2e] hover:bg-[#262637] ring-1 ring-gray-800"
        }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{lang}</span>
            </div>
          </button>
        ))}
      </div>
      <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10"
                    layout
                >
                    <AnimatePresence mode="popLayout">
                        {filteredSnippets.map((snippet) => (
                          
                            <SnippetCard key={snippet._id} snippet={snippet} />
                        ))}
                    </AnimatePresence>
                </motion.div>
    </div>
    </div>
  );
};

export default SnippetPage;
