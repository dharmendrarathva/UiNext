"use client";

import { useState, useMemo, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Category } from "@/types/Category";
import ErrorModal from "../Errors/ErrorModal";

import { FaHtml5, FaCss3Alt, FaJs, FaUndo } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";

type Tab = "html" | "css" | "js" | "tailwind";


interface FormState {
  title: string;
  category: string;
implementation: "HTML" | "TAILWIND" | "";
  html: string;
  css: string;
  js: string;
  tailwind: string;
}

interface Props {
  open: boolean;
  form: FormState;
  categories: Category[];
  onChange: (e: any) => void;
  onClose: () => void;
onUpdate: (status: "DRAFT" | "PENDING") => void;
}

export default function EditProduct({
  open,
  form,
  categories,
  onChange,
  onClose,
  onUpdate
}: Props) {

  const [tab,setTab] = useState<Tab>("html");
  const [darkPreview,setDarkPreview] = useState(true);

  const [error,setError] = useState("");
  const [showError,setShowError] = useState(false);
  const [debouncedForm,setDebouncedForm] = useState(form);

//////////////////////////////////////////////////////
// SET TAB BASED ON STACK
//////////////////////////////////////////////////////


useEffect(()=>{

  if(!open) return;

  if(form.implementation === "TAILWIND"){
    setTab("tailwind");
  }else{
    setTab("html");
  }

},[open,form.implementation]);

//////////////////////////////////////////////////////
// VALIDATION
//////////////////////////////////////////////////////

function validate(){

  if(!form.title?.trim()){
    setError("Component name required");
    setShowError(true);
    return false;
  }

  if(!form.category){
    setError("Category must be selected");
    setShowError(true);
    return false;
  }

  if(form.implementation==="HTML" && !form.html?.trim()){
    setError("HTML code required");
    setShowError(true);
    return false;
  }

  if(form.implementation==="TAILWIND" && !form.tailwind?.trim()){
    setError("Tailwind code required");
    setShowError(true);
    return false;
  }

  return true;
}

//////////////////////////////////////////////////////
// LIVE PREVIEW
//////////////////////////////////////////////////////

const previewSrc = useMemo(()=>{

  if(form.implementation==="TAILWIND"){

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<script src="https://cdn.tailwindcss.com"></script>
<style>
body{
margin:0;
height:100vh;
display:grid;
place-items:center;
background:${darkPreview ? "#1e1e1e" : "#ffffff"};
}
</style>
</head>

<body>
${form.tailwind || ""}
</body>
</html>
`;
  }

  const html = form.html || "";
  const css = form.css || "";
  const js = form.js || "";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>

<style>
*{box-sizing:border-box}

html,body{
margin:0;
height:100%;
width:100%;
}

body{
display:grid;
place-items:center;
background:${darkPreview ? "#1e1e1e" : "#ffffff"};
font-family:system-ui;
}

${css}
</style>

</head>

<body>

${html}

<script>
try{
${js}
}catch(e){
document.body.innerHTML += "<pre style='color:red'>"+e+"</pre>";
}
</script>

</body>
</html>
`;

},[form,darkPreview]);

//////////////////////////////////////////////////////
// CURRENT CODE
//////////////////////////////////////////////////////

const currentCode = useMemo(()=>{

  switch(tab){
    case "html": return form.html || "";
    case "css": return form.css || "";
    case "js": return form.js || "";
    case "tailwind": return form.tailwind || "";
    default: return "";
  }

},[tab,form]);

//////////////////////////////////////////////////////
// RESET CODE
//////////////////////////////////////////////////////

function resetCode(){

  if(form.implementation==="HTML"){
    onChange({target:{name:"html",value:""}});
    onChange({target:{name:"css",value:""}});
    onChange({target:{name:"js",value:""}});
  }

  if(form.implementation==="TAILWIND"){
    onChange({target:{name:"tailwind",value:""}});
  }

}

//////////////////////////////////////////////////////
// FILTER TABS BASED ON STACK
//////////////////////////////////////////////////////

const tabs = useMemo(()=>{

  if(form.implementation === "TAILWIND"){

    return [
      {key:"tailwind",label:"Tailwind.tsx",icon:<SiTailwindcss className="text-sky-400"/>}
    ];

  }

  return [

    {key:"html",label:"index.html",icon:<FaHtml5 className="text-orange-500"/>},
    {key:"css",label:"style.css",icon:<FaCss3Alt className="text-blue-500"/>},
    {key:"js",label:"script.js",icon:<FaJs className="text-yellow-400"/>}

  ];

},[form.implementation]);

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

if(!open) return null;

return(

<>
<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50 mt-14">

<div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-7xl h-[85vh] flex flex-col overflow-hidden">

{/* HEADER */}

<div className="p-4 border-b border-neutral-800 flex gap-4 flex-wrap">

<input
name="title"
value={form.title || ""}
onChange={onChange}
placeholder="Component name"
className="bg-neutral-800 px-3 py-2 rounded w-64"
/>

<select
name="category"
value={form.category || ""}
onChange={onChange}
className="bg-neutral-800 px-3 py-2 rounded"
>

<option value="">Select Category</option>

{categories.map(cat=>(
<option key={cat._id} value={cat._id}>
{cat.name}
</option>
))}

</select>

{/* STACK LOCKED */}

<select
name="implementation"
value={form.implementation}
disabled
className="bg-neutral-700 px-3 py-2 rounded cursor-not-allowed"
>
<option value="HTML">HTML + CSS + JS</option>
<option value="TAILWIND">Tailwind</option>
</select>

</div>

{/* EDITOR */}

<div className="grid lg:grid-cols-2 flex-1 overflow-hidden">

{/* PREVIEW */}

<div className="relative border-r border-neutral-700">

<div className="absolute top-3 right-3 z-10">

<button
onClick={()=>setDarkPreview(!darkPreview)}
className="text-xs px-3 py-1 bg-neutral-800 rounded"
>
Dark / Light
</button>

</div>

<iframe
sandbox="allow-scripts"
srcDoc={previewSrc}
className="w-full h-full"
/>

</div>

{/* CODE */}

<div className="flex flex-col bg-[#1e1e1e]">

<div className="flex justify-between items-center bg-neutral-800 border-b border-neutral-700">

<div className="flex overflow-x-auto">

{tabs.map((t:any)=>(
<button
key={t.key}
onClick={()=>setTab(t.key)}
className={`flex items-center gap-2 px-4 py-2 text-xs ${
tab===t.key
? "bg-[#1e1e1e] text-white"
: "text-neutral-400 hover:text-white"
}`}
>
{t.icon}
{t.label}
</button>
))}

</div>

<button
onClick={resetCode}
className="flex items-center gap-2 px-4 text-xs text-neutral-400 hover:text-white"
>
<FaUndo/>
Reset
</button>

</div>

<Editor
  key={tab}
  height="100%"
  theme="vs-dark"
  language={
    tab === "html"
      ? "html"
      : tab === "css"
      ? "css"
      : tab === "js"
      ? "javascript"
      : "html"
  }
  value={currentCode}
  onChange={(value) => {
    onChange({
      target: {
        name: tab,
        value: value ?? ""
      }
    });
  }}
  options={{
    fontSize: 14,
    minimap: { enabled: false },
    wordWrap: "on",
    automaticLayout: true,
    scrollBeyondLastLine: false
  }}
/>

</div>

</div>

{/* FOOTER */}

<div className="p-4 border-t border-neutral-800 flex justify-end gap-3">

  <button
    onClick={onClose}
    className="bg-neutral-800 px-4 py-2 rounded"
  >
    Cancel
  </button>

  <button
    onClick={()=>{
      if(validate()) onUpdate("DRAFT")
    }}
    className="bg-neutral-700 px-4 py-2 rounded"
  >
    Save Draft
  </button>

  <button
    onClick={()=>{
      if(validate()) onUpdate("PENDING")
    }}
    className="bg-yellow-500 text-black px-4 py-2 rounded"
  >
    Submit
  </button>

</div>
</div>

</div>

<ErrorModal
isOpen={showError}
message={error}
onClose={()=>setShowError(false)}
/>

</>

);

}