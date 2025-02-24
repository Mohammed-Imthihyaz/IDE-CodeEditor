import { Check, Copy } from 'lucide-react';
import React, { useState } from 'react';

const CopyButton = ({code}) => {
    const [copied,setCopied]=useState(false);
    const copyToCliboard=async()=>{
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(()=>setCopied(false),3000);
            
        } catch (error) {
            
        }
    }
  return (
    <button onClick={copyToCliboard}
    className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group relative"
   type='button'
   >
       {copied ? (<Check className="size-4 text-green-400" />) :(<Copy className=" size-4 text-gray-400 group-hover:text-gray-300" />)}
        </button>
  )
}

export default CopyButton