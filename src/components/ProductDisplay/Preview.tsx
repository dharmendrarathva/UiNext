// "use client";

// import { useState, useMemo, useEffect } from "react";
// import Editor from "@monaco-editor/react";
// import { FaHtml5, FaCss3Alt, FaJs, FaReact } from "react-icons/fa";
// import { SiNextdotjs, SiTailwindcss } from "react-icons/si";
// import { FaUndo } from "react-icons/fa";

// interface Codes {
//   html?: string;
//   css?: string;
//   js?: string;
//   react?: string;
//   next?: string;
//   tailwind?: string;
// }

// type Tab = "html" | "css" | "js" | "react" | "next" | "tailwind";

// export default function Preview({ codes }: { codes: Codes }) {

//   const [tab, setTab] = useState<Tab>("html");

//   const [html, setHtml] = useState(codes?.html || "");
//   const [css, setCss] = useState(codes?.css || "");
//   const [js, setJs] = useState(codes?.js || "");

//   const [darkPreview, setDarkPreview] = useState(true);

//   //////////////////////////////////////////////////////
//   // RESET IF PRODUCT CHANGES
//   //////////////////////////////////////////////////////

//   useEffect(() => {

//     setHtml(codes?.html || "");
//     setCss(codes?.css || "");
//     setJs(codes?.js || "");

//   }, [codes]);

//   //////////////////////////////////////////////////////
//   // PREVIEW
//   //////////////////////////////////////////////////////

//   const previewSrc = useMemo(() => {

//     return `
// <!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8"/>

// <style>
// *{box-sizing:border-box}

// html,body{
// margin:0;
// height:100%;
// width:100%;
// }

// body{
// display:grid;
// place-items:center;
// background:${darkPreview ? "#1E1E1E" : "#ffffff"};
// font-family:system-ui;
// }
// </style>

// <style>${css}</style>

// </head>

// <body>

// ${html}

// <script>

// try{
// ${js || ""}
// }catch(e){
// document.body.innerHTML += "<pre style='color:red'>"+e+"</pre>";
// }

// </script>

// </body>
// </html>
// `;

//   }, [html, css, js, darkPreview]);

//   //////////////////////////////////////////////////////
//   // RESET
//   //////////////////////////////////////////////////////

//   function resetCode() {

//     setHtml(codes?.html || "");
//     setCss(codes?.css || "");
//     setJs(codes?.js || "");

//   }

//   //////////////////////////////////////////////////////
//   // TABS
//   //////////////////////////////////////////////////////

//   const tabs = [
//     { key: "html", label: "index.html", icon: <FaHtml5 className="text-orange-500"/> },
//     { key: "css", label: "style.css", icon: <FaCss3Alt className="text-blue-500"/> },
//     { key: "js", label: "script.js", icon: <FaJs className="text-yellow-400"/> },
//     { key: "react", label: "React.tsx", icon: <FaReact className="text-cyan-400"/> },
//     { key: "next", label: "Next.tsx", icon: <SiNextdotjs className="text-white"/> },
//     { key: "tailwind", label: "Tailwind.tsx", icon: <SiTailwindcss className="text-sky-400"/> },
//   ];

//   //////////////////////////////////////////////////////
//   // CURRENT VALUE
//   //////////////////////////////////////////////////////

//   const currentCode =
//     tab === "html"
//       ? html
//       : tab === "css"
//       ? css
//       : tab === "js"
//       ? js
//       : codes?.[tab];

//   //////////////////////////////////////////////////////
//   // EDITABLE?
//   //////////////////////////////////////////////////////

//   const editable = tab === "html" || tab === "css" || tab === "js";

//   //////////////////////////////////////////////////////
//   // UI
//   //////////////////////////////////////////////////////

//   return (

//     <div className="border border-neutral-700 rounded-2xl overflow-hidden bg-neutral-900">

//       <div className="grid lg:grid-cols-2 h-[600px]">

//         {/* PREVIEW */}

//         <div className="relative border-r border-neutral-700">

//           <div className="absolute top-3 right-3 z-10">

//             <button
//               onClick={() => setDarkPreview(!darkPreview)}
//               className="text-xs px-3 py-1 bg-neutral-800 rounded"
//             >
//               Dark / Light
//             </button>

//           </div>

//           <iframe
//             className="w-full h-full"
//             sandbox="allow-scripts"
//             srcDoc={previewSrc}
//           />

//         </div>

//         {/* CODE */}

//         <div className="flex flex-col bg-[#1e1e1e]">

//           {/* TAB BAR */}

//           <div className="flex justify-between items-center bg-neutral-800 border-b border-neutral-700">

//             <div className="flex overflow-x-auto">

//               {tabs.map((t:any)=>(
//                 <button
//                   key={t.key}
//                   onClick={()=>setTab(t.key)}
//                   className={`flex items-center gap-2 px-4 py-2 text-xs whitespace-nowrap ${
//                     tab===t.key
//                       ? "bg-[#1e1e1e] text-white"
//                       : "text-neutral-400 hover:text-white"
//                   }`}
//                 >
//                   {t.icon}
//                   {t.label}
//                 </button>
//               ))}

//             </div>

//             {editable && (
//               <button
//                 onClick={resetCode}
//                 className="flex items-center gap-2 px-4 text-xs text-neutral-400 hover:text-white"
//               >
//                 <FaUndo/>
//                 Reset
//               </button>
//             )}

//           </div>

//           {/* EDITOR */}

//           {currentCode ? (

//             <Editor
//               height="100%"
//               theme="vs-dark"
//               language={
//                 tab === "html"
//                   ? "html"
//                   : tab === "css"
//                   ? "css"
//                   : tab === "js"
//                   ? "javascript"
//                   : "typescript"
//               }
//               value={currentCode}
//               onChange={(value)=>{

//                 if(tab==="html") setHtml(value || "");
//                 if(tab==="css") setCss(value || "");
//                 if(tab==="js") setJs(value || "");

//               }}
//               options={{
//                 readOnly: !editable,
//                 fontSize:14,
//                 minimap:{enabled:false},
//                 wordWrap:"on",
//                 automaticLayout:true,
//                 scrollBeyondLastLine:false
//               }}
//             />

//           ) : (

//             <div className="flex items-center justify-center h-full text-neutral-400 text-sm">
//               {tab.toUpperCase()} version is not available for this component.
//             </div>

//           )}

//         </div>

//       </div>

//     </div>

//   );

// }









"use client";

import { useState, useMemo, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { FaHtml5, FaCss3Alt, FaJs, FaReact } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss } from "react-icons/si";
import { FaUndo } from "react-icons/fa";

interface Codes {
  html?: string;
  css?: string;
  js?: string;
  react?: string;
  next?: string;
  tailwind?: string;
}

type Tab = "html" | "css" | "js" | "react" | "next" | "tailwind";

export default function Preview({ codes }: { codes: Codes }) {

  const [tab, setTab] = useState<Tab>("html");

  const [html, setHtml] = useState(codes?.html || "");
  const [css, setCss] = useState(codes?.css || "");
  const [js, setJs] = useState(codes?.js || "");

  const [darkPreview, setDarkPreview] = useState(true);

  //////////////////////////////////////////////////////
  // RESET IF PRODUCT CHANGES
  //////////////////////////////////////////////////////

  useEffect(() => {
    setHtml(codes?.html || "");
    setCss(codes?.css || "");
    setJs(codes?.js || "");
  }, [codes]);

  //////////////////////////////////////////////////////
  // PREVIEW
  //////////////////////////////////////////////////////

  const previewSrc = useMemo(() => {

    //////////////////////////////////////////////////////
    // TAILWIND PREVIEW
    //////////////////////////////////////////////////////

    if (codes?.tailwind) {

      return `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8"/>

<script src="https://cdn.tailwindcss.com"></script>

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
background:${darkPreview ? "#1E1E1E" : "#ffffff"};
font-family:system-ui;
}
</style>

</head>

<body>

${codes.tailwind}

</body>

</html>
`;

    }

 

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
background:${darkPreview ? "#1E1E1E" : "#ffffff"};
font-family:system-ui;
}

${css}

</style>

</head>

<body>

${html}

<script>

try{

${js || ""}

}catch(e){

document.body.innerHTML += "<pre style='color:red'>"+e+"</pre>";

}

</script>

</body>

</html>
`;

  }, [html, css, js, codes?.tailwind, darkPreview]);

  //////////////////////////////////////////////////////
  // RESET
  //////////////////////////////////////////////////////

  function resetCode() {
    setHtml(codes?.html || "");
    setCss(codes?.css || "");
    setJs(codes?.js || "");
  }

  //////////////////////////////////////////////////////
  // TABS
  //////////////////////////////////////////////////////

  const tabs = [
    { key: "html", label: "index.html", icon: <FaHtml5 className="text-orange-500"/> },
    { key: "css", label: "style.css", icon: <FaCss3Alt className="text-blue-500"/> },
    { key: "js", label: "script.js", icon: <FaJs className="text-yellow-400"/> },
    { key: "react", label: "React.tsx", icon: <FaReact className="text-cyan-400"/> },
    { key: "next", label: "Next.tsx", icon: <SiNextdotjs className="text-white"/> },
    { key: "tailwind", label: "Tailwind.tsx", icon: <SiTailwindcss className="text-sky-400"/> },
  ];

  //////////////////////////////////////////////////////
  // CURRENT CODE
  //////////////////////////////////////////////////////

  const currentCode =
    tab === "html"
      ? html
      : tab === "css"
      ? css
      : tab === "js"
      ? js
      : codes?.[tab];

  //////////////////////////////////////////////////////
  // EDITABLE?
  //////////////////////////////////////////////////////

  const editable = tab === "html" || tab === "css" || tab === "js";

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="border border-neutral-700 rounded-2xl overflow-hidden bg-neutral-900">

      <div className="grid lg:grid-cols-2 h-[600px]">

        {/* PREVIEW */}

        <div className="relative border-r border-neutral-700">

          <div className="absolute top-3 right-3 z-10">

            <button
              onClick={() => setDarkPreview(!darkPreview)}
              className="text-xs px-3 py-1 bg-neutral-800 rounded"
            >
              Dark / Light
            </button>

          </div>

          <iframe
            className="w-full h-full"
            sandbox="allow-scripts"
            srcDoc={previewSrc}
          />

        </div>

        {/* CODE */}

        <div className="flex flex-col bg-[#1e1e1e]">

          {/* TAB BAR */}

          <div className="flex justify-between items-center bg-neutral-800 border-b border-neutral-700">

            <div className="flex overflow-x-auto">

              {tabs.map((t:any)=>(
                <button
                  key={t.key}
                  onClick={()=>setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs whitespace-nowrap ${
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

            {editable && (
              <button
                onClick={resetCode}
                className="flex items-center gap-2 px-4 text-xs text-neutral-400 hover:text-white"
              >
                <FaUndo/>
                Reset
              </button>
            )}

          </div>

          {/* EDITOR */}

          {currentCode ? (

            <Editor
              height="100%"
              theme="vs-dark"
              language={
                tab === "html"
                  ? "html"
                  : tab === "css"
                  ? "css"
                  : tab === "js"
                  ? "javascript"
                  : "typescript"
              }
              value={currentCode}
              onChange={(value)=>{

                if(tab==="html") setHtml(value || "");
                if(tab==="css") setCss(value || "");
                if(tab==="js") setJs(value || "");

              }}
              options={{
                readOnly: !editable,
                fontSize:14,
                minimap:{enabled:false},
                wordWrap:"on",
                automaticLayout:true,
                scrollBeyondLastLine:false
              }}
            />

          ) : (

            <div className="flex items-center justify-center h-full text-neutral-400 text-sm">
              {tab.toUpperCase()} version is not available for this component.
            </div>

          )}

        </div>

      </div>

    </div>

  );

}