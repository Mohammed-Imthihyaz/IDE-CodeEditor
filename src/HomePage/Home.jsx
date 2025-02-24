import React from "react";
import EditorPanel from "./Components/EditorPanel";
import Headers from "./Components/Header";
import OutputPanel from "./Components/OutputPanel";

const Home = () => {
  return (
    
    <div className="min-h-screen text-white">
    <div className="max-w-[1800px] mx-auto p-4">
    <Headers/>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <EditorPanel />
    <OutputPanel />
    </div>
    </div>
    </div>
  );
};

export default Home;
