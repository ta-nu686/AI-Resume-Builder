import React from 'react'

const Banner = () => {
    return(
        
         <div className=" bg-gradient-to-br from-[#e1e6f1] to-[#bec3f4] py-3 text-center text-sm border-b border-slate-100">
        <span className="bg-[#1a4fcc] text-white px-2 py-0.5 rounded-full text-xs font-bold mr-2">
          New
        </span>
        AI Resume Builder is here! Create, improve, and tailor your resume with smart AI.
        <a href="#" className="text-[#1a4fcc] font-semibold ml-1 hover:underline">
          Try it now →
        </a>
      </div>
   
    )
}
export default Banner