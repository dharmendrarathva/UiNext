// "use client";

// import { useState, useMemo } from "react";
// import Editor from "@monaco-editor/react";
// import { FaHtml5, FaCss3Alt, FaJs, FaReact } from "react-icons/fa";
// import { SiNextdotjs, SiTailwindcss } from "react-icons/si";

// type Tab = "html" | "css" | "js" | "react" | "next" | "tailwind";

// export default function AdminPreview({
//   product,
//   onClose,
//   onApprove,
//   onReject,
// }: any) {

//   const [tab, setTab] = useState<Tab>("html");
//   const [darkPreview, setDarkPreview] = useState(true);
//   const [codes, setCodes] = useState(product?.codes || {});
//   const [saving, setSaving] = useState(false);

//   //////////////////////////////////////////////////////
//   // PREVIEW HTML
//   //////////////////////////////////////////////////////

//   const previewSrc = useMemo(() => {

//     return `
// <!DOCTYPE html>
// <html>
// <head>
// <style>

// *{box-sizing:border-box}

// html,body{
// margin:0;
// height:100%;
// width:100%;
// display:grid;
// place-items:center;
// background:${darkPreview ? "#1e1e1e" : "#ffffff"};
// font-family:system-ui;
// }

// ${codes.css || ""}

// </style>
// </head>

// <body>

// ${codes.html || ""}

// <script>
// ${codes.js || ""}
// </script>

// </body>
// </html>
// `;

//   }, [codes, darkPreview]);

//   //////////////////////////////////////////////////////
//   // SAVE CHANGES
//   //////////////////////////////////////////////////////

//   async function saveChanges() {

//     try {

//       setSaving(true);

//       await fetch(`/api/admin/userproducts/${product._id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ codes }),
//       });

//       alert("Saved successfully");

//     } catch (err) {

//       console.error(err);

//     } finally {

//       setSaving(false);

//     }

//   }

//   //////////////////////////////////////////////////////
//   // TABS
//   //////////////////////////////////////////////////////

//   const tabs = [
//     { key: "html", label: "HTML", icon: <FaHtml5 className="text-orange-500" /> },
//     { key: "css", label: "CSS", icon: <FaCss3Alt className="text-blue-500" /> },
//     { key: "js", label: "JS", icon: <FaJs className="text-yellow-400" /> },
//     { key: "react", label: "React", icon: <FaReact className="text-cyan-400" /> },
//     { key: "next", label: "Next", icon: <SiNextdotjs /> },
//     { key: "tailwind", label: "Tailwind", icon: <SiTailwindcss className="text-sky-400" /> },
//   ];

//   //////////////////////////////////////////////////////
//   // UI
//   //////////////////////////////////////////////////////

//   return (

// <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 mt-8">

//   <div className="w-full max-w-[1400px] h-[85vh] bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col shadow-2xl overflow-hidden">

//     {/* HEADER */}

//     <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-800">

//       <div>

//         <h2 className="text-xl font-semibold">{product.title}</h2>

//         <p className="text-sm text-neutral-400">
//           @{product.createdBy?.username}
//         </p>

//       </div>

//       <div className="flex gap-3">

//         <button
//           onClick={saveChanges}
//           className="bg-yellow-500 text-black hover:bg-yellow-400 px-4 py-2 rounded-lg"
//         >
//           {saving ? "Saving..." : "Save"}
//         </button>

//         <button
//           onClick={() => onApprove(product._id)}
//           className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
//         >
//           Approve
//         </button>

//         <button
//           onClick={() => onReject(product._id)}
//           className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
//         >
//           Reject
//         </button>

//         <button
//           onClick={onClose}
//           className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg"
//         >
//           Close
//         </button>

//       </div>

//     </div>

//     {/* GRID */}

//     <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 overflow-hidden">

//       {/* PREVIEW */}

//       <div className="relative bg-neutral-950 border-r border-neutral-800">

//         <button
//           onClick={() => setDarkPreview(!darkPreview)}
//           className="absolute top-4 right-4 text-xs px-3 py-1 bg-neutral-800 rounded"
//         >
//           Dark / Light
//         </button>

//         <iframe
//           sandbox="allow-scripts"
//           srcDoc={previewSrc}
//           className="w-full h-full"
//         />

//       </div>

//       {/* EDITOR */}

//       <div className="flex flex-col bg-[#1e1e1e]">

//         <div className="flex border-b border-neutral-700 bg-neutral-800 overflow-x-auto">

//           {tabs.map((t: any) => (

//             <button
//               key={t.key}
//               onClick={() => setTab(t.key)}
//               className={`flex items-center gap-2 px-4 py-2 text-xs ${
//                 tab === t.key
//                   ? "bg-[#1e1e1e] text-white"
//                   : "text-neutral-400 hover:text-white"
//               }`}
//             >
//               {t.icon}
//               {t.label}
//             </button>

//           ))}

//         </div>

//         <div className="flex-1">

//           <Editor
//             height="100%"
//             theme="vs-dark"
//             language={
//               tab === "html"
//                 ? "html"
//                 : tab === "css"
//                 ? "css"
//                 : tab === "js"
//                 ? "javascript"
//                 : "typescript"
//             }
//             value={codes?.[tab] || ""}
//             onChange={(value) =>
//               setCodes((prev: any) => ({
//                 ...prev,
//                 [tab]: value || "",
//               }))
//             }
//             options={{
//               readOnly: false,
//               fontSize: 14,
//               minimap: { enabled: false },
//               wordWrap: "on",
//               automaticLayout: true,
//             }}
//           />

//         </div>

//       </div>

//     </div>

//   </div>

// </div>

//   );
// }










"use client";

import { useState, useMemo } from "react";
import Editor from "@monaco-editor/react";
import { FaHtml5, FaCss3Alt, FaJs, FaReact } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss } from "react-icons/si";

type Tab = "html" | "css" | "js" | "react" | "next" | "tailwind";

export default function AdminPreview({
  product,
  onClose,
  onApprove,
  onReject,
}: any) {

  const [tab, setTab] = useState<Tab>("html");
  const [darkPreview, setDarkPreview] = useState(true);
  const [codes, setCodes] = useState(product?.codes || {});
  const [saving, setSaving] = useState(false);

  //////////////////////////////////////////////////////
  // PREVIEW HTML
  //////////////////////////////////////////////////////

  const previewSrc = useMemo(() => {

    //////////////////////////////////////////////////////
    // TAILWIND PREVIEW
    //////////////////////////////////////////////////////

    if (codes?.tailwind && codes.tailwind.trim()) {

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
display:grid;
place-items:center;
background:${darkPreview ? "#1e1e1e" : "#ffffff"};
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

    //////////////////////////////////////////////////////
    // HTML / CSS / JS PREVIEW
    //////////////////////////////////////////////////////

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
display:grid;
place-items:center;
background:${darkPreview ? "#1e1e1e" : "#ffffff"};
font-family:system-ui;
}

${codes.css || ""}

</style>

</head>

<body>

${codes.html || ""}

<script>

try{

${codes.js || ""}

}catch(e){

document.body.innerHTML += "<pre style='color:red'>"+e+"</pre>";

}

</script>

</body>

</html>
`;

  }, [codes, darkPreview]);

  //////////////////////////////////////////////////////
  // SAVE CHANGES
  //////////////////////////////////////////////////////

  async function saveChanges() {

    try {

      setSaving(true);

      await fetch(`/api/admin/userproducts/${product._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codes }),
      });

      alert("Saved successfully");

    } catch (err) {

      console.error(err);

    } finally {

      setSaving(false);

    }

  }

  //////////////////////////////////////////////////////
  // TABS
  //////////////////////////////////////////////////////

  const tabs = [
    { key: "html", label: "HTML", icon: <FaHtml5 className="text-orange-500" /> },
    { key: "css", label: "CSS", icon: <FaCss3Alt className="text-blue-500" /> },
    { key: "js", label: "JS", icon: <FaJs className="text-yellow-400" /> },
    { key: "react", label: "React", icon: <FaReact className="text-cyan-400" /> },
    { key: "next", label: "Next", icon: <SiNextdotjs /> },
    { key: "tailwind", label: "Tailwind", icon: <SiTailwindcss className="text-sky-400" /> },
  ];

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 mt-8">

  <div className="w-full max-w-[1400px] h-[85vh] bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col shadow-2xl overflow-hidden">

    {/* HEADER */}

    <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-800">

      <div>

        <h2 className="text-xl font-semibold">{product.title}</h2>

        <p className="text-sm text-neutral-400">
          @{product.createdBy?.username}
        </p>

      </div>

      <div className="flex gap-3">

        <button
          onClick={saveChanges}
          className="bg-yellow-500 text-black hover:bg-yellow-400 px-4 py-2 rounded-lg"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          onClick={() => onApprove(product._id)}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
        >
          Approve
        </button>

        <button
          onClick={() => onReject(product._id)}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Reject
        </button>

        <button
          onClick={onClose}
          className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg"
        >
          Close
        </button>

      </div>

    </div>

    {/* GRID */}

    <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 overflow-hidden">

      {/* PREVIEW */}

      <div className="relative bg-neutral-950 border-r border-neutral-800">

        <button
          onClick={() => setDarkPreview(!darkPreview)}
          className="absolute top-4 right-4 text-xs px-3 py-1 bg-neutral-800 rounded"
        >
          Dark / Light
        </button>

        <iframe
          sandbox="allow-scripts"
          srcDoc={previewSrc}
          className="w-full h-full"
        />

      </div>

      {/* EDITOR */}

      <div className="flex flex-col bg-[#1e1e1e]">

        <div className="flex border-b border-neutral-700 bg-neutral-800 overflow-x-auto">

          {tabs.map((t: any) => (

            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 text-xs ${
                tab === t.key
                  ? "bg-[#1e1e1e] text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {t.icon}
              {t.label}
            </button>

          ))}

        </div>

        <div className="flex-1">

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
            value={codes?.[tab] || ""}
            onChange={(value) =>
              setCodes((prev: any) => ({
                ...prev,
                [tab]: value || "",
              }))
            }
            options={{
              readOnly: false,
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
              automaticLayout: true,
            }}
          />

        </div>

      </div>

    </div>

  </div>

</div>

  );

}