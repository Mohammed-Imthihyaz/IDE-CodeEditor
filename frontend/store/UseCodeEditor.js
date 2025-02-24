 import axios from "axios";
import { create } from "zustand";
import { LanguageConfig } from "../src/HomePage/constants";


const API_URI = import.meta.env.VITE_API_URI;
axios.defaults.withCredentials=true;
function getInitialState(){
    if(typeof window === "undefined"){
        return {
            language:"javascript",
            fontSize: 16,
            theme:"vs-light",
        }
    }
    const savedLanguage=localStorage.getItem("editor-language") || "javascript";
    const savedTheme=localStorage.getItem("editor-theme")||"vs-light";
    const savedFontSize=localStorage.getItem("editor-font-size")||16;
    return{
        language:savedLanguage,
        theme:savedTheme,
        fontSize:Number(savedFontSize)
    }
}
export const UseCodeEditor=create((set,get)=>{
    const initialState =getInitialState();
    return {
        ...initialState,
    output: "",
    isRunning: false,
    error: null,
    editor: null,
    executionResult: null,
    executions: [],

    getCode: () => get().editor?.getValue() || "",
    setEditor: (editor) => {
        const savedCode =localStorage.getItem(`editor-code-${get().language}`)
        if(savedCode) editor.setValue(savedCode);
        set({editor});
    },
    setTheme: (theme) => {
        localStorage.setItem("editor-theme",theme);
        set({theme});
    },
    setFontSize: (fontSize) => {
        localStorage.setItem("editor-font-size",fontSize);
        set({fontSize});
    },
    setLanguage: (language) => {
        // Save current language code before switching
        const currentCode = get().editor?.getValue();
        if (currentCode) {
          localStorage.setItem(`editor-code-${get().language}`, currentCode);
        }
  
        localStorage.setItem("editor-language", language);
  
        set({
          language,
          output: "",
          error: null,
        });
      },
      runCode:async()=>{
       const {language,getCode}=get();
        const code =getCode();
        if(!code) {
            set({error:"Please enter some code"})
        }
        set({isRunning:true,error:null,output:""});
        try {
            const runtime =LanguageConfig[language].pistonRuntime;
            const response =await fetch("https://emkc.org/api/v2/piston/execute",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    language:runtime.language,
                    version:runtime.version,
                    files:[{content:code}]
                })
            })
            const data =await response.json();
            console.log("data:",data);
            //handle API-Level error
            if(data.message){
                set({error: data.message,executionResult:{code,output:"",error:data.message}});
                return;
            }
            //handel  compile time erro
            if(data.compile && data.compile.code !==0){
                const error =data.compile.stdrr || data.compile.output;
                set({
                    error,
                    executionResult:{
                        code,
                        output:"",
                        error
                    }
                })
                return;
            }
            //handel run-time error
            if(data.run && data.run.code !==0){
                const error =data.run.stdrr || data.run.output;
                set({
                    error,
                    executionResult:{
                        code,
                        output:"",
                        error
                    }
                })
                return;
            }

            //if execution is successfull 
            const output =data.run.output;
            set({
                output:output.trim(),
                error:null,
                executionResult:{
                    code,
                    output:output.trim(),
                    error:null
                }
            })

        } catch (error) {
            console.log("error running the code",error);
            set({
                error:"error running the code",
                executionResult:{
                    code,
                    output:"",
                    error:"error running the code"
                }
            })
        }finally{
            set({isRunning:false});
        }
      },
      saveExecutionResult: async(code,language,output,error)=>{
        try {
           
           const response= await axios.post(`${API_URI}/save-code`,{code,language,output,error});
           if (response.data.success) {
            console.log("Execution saved successfully");
          } 
        } catch (error) {
            console.error("Error saving execution:", error);
        }
      },
      saveSnippets:async(code,language,title)=>{
        try {
            const response =await axios.post(`${API_URI}/post-snippets`,{code,language,title});
            if(response.data.success){
                console.log("Snippet Shared Sucessfully");
            }
        } catch (error) {
            console.error("Error Sharing Snippet",error);
        }
      },
      fetchUserExecutions: async (userId, page = 1, limit = 10) => {
        try {
          const response = await axios.get(
            `${API_URI}/user-executions/${userId}`);
      
          if (response.data.success) {
            set({ executions: response.data.data });
          }
        } catch (error) {
          console.error("Error fetching user executions:", error.response?.data || error.message);
        }
      },
      
  }
})