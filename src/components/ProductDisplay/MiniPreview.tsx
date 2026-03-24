"use client";

import { useMemo } from "react";

export default function MiniPreview({ codes }: { codes?: any }) {

  const preview = useMemo(() => {

    if (!codes) return null;

    //////////////////////////////////////////////////////
    // TAILWIND PREVIEW
    //////////////////////////////////////////////////////

    if (codes.tailwind && codes.tailwind.trim()) {

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
display:flex;
align-items:center;
justify-content:center;
background:#111;
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

    if (!codes.html) return null;

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
display:flex;
align-items:center;
justify-content:center;
background:#111;
font-family:system-ui;
}

${codes.css ?? ""}

</style>

</head>

<body>

${codes.html}

<script>

try{

${codes.js ?? ""}

}catch(e){

document.body.innerHTML += "<pre style='color:red'>"+e+"</pre>";

}

</script>

</body>

</html>
`;

  }, [codes]);

  if (!preview) {
    return (
      <div className="h-40 flex items-center justify-center text-neutral-500">
        No preview
      </div>
    );
  }

  return (
    <iframe
      loading="lazy"
      sandbox="allow-scripts"
      srcDoc={preview}
      className="w-full h-40 border-0"
    />
  );
}