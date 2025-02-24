import Editor from "@monaco-editor/react";
import { Code, MessageSquare } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnippetDetail } from "../../../../store/SnippetDetail";
import NavigationHeader from "../../Components/NavigationHeader";
import { LanguageConfig } from "../../constants";
import CommentsSection from "./snippetdetails.component/Comments";
import CopyButton from "./snippetdetails.component/CopyButton";
import SnippetLoadingSkeleton from "./snippetdetails.component/SnippetLoadingSkeleton";

const SingleSnippetPage = () => {
  const { getSnippetById, getComments, comments } = useSnippetDetail();
  const { snippetId } = useParams();
  const [snippet, setSnippet] = useState(null);

  useEffect(() => {
    const fetchSnippet = async () => {
      if (!snippetId) return; 
      try {
        const snip = await getSnippetById(snippetId); 
        setSnippet(snip);
      } catch (error) {
        console.error("Error fetching snippet:", error);
      }
    };
    fetchSnippet();
  }, [snippetId, getSnippetById]);

  if (snippet === null) return <SnippetLoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 sm:p-8 mb-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                    {snippet?.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[#8b8b8d]">
                      
                      <span>{snippet?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#8b8b8d]">
                    <MessageSquare className="w-4 h-4" />
                      <span>{comments?.length} comments</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center px-3 py-1.5 bg-[#ffffff08] text-[#808086] rounded-lg text-sm font-medium">
                {snippet?.language}
              </div>
            </div>
          </div>
        <div className="mb-8 rounded-2xl overflow-hidden border border-[#ffffff0a] bg-[#121218]">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#ffffff0a]">
              <div className="flex items-center gap-2 text-[#808086]">
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">Source Code</span>
              </div>
              <CopyButton code={snippet.code} />
            </div>
            <Editor
            height="600px"
            language={LanguageConfig[snippet.language].monacoLanguage}
            value={snippet.code}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              readOnly: true,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 16 },
              renderWhitespace: "selection",
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
              fontLigatures: true,
            }}
          />
          </div>
          <CommentsSection snippet={snippetId}/>
          </div>
      </main>
    </div>
  );
};

export default SingleSnippetPage;
