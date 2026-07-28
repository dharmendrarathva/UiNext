"use client";

import { useMemo } from "react";

/**
 * PreviewFrame.tsx
 * Standalone preview renderer for the Hero grid — intentionally NOT the
 * ProductCard/MiniPreview component. Same srcDoc-building idea, but sized
 * to fill a grid cell (no fixed h-56/h-64, no rounded-t-2xl) so it drops
 * cleanly into a dense multi-column layout instead of a single card.
 */

type Codes = {
  tailwind?: string;
  html?: string;
  css?: string;
  js?: string;
};

export default function PreviewFrame({ codes }: { codes?: Codes | null }) {
  const srcDoc = useMemo(() => {
    if (!codes) return null;

    if (codes.tailwind && codes.tailwind.trim()) {
      return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<script src="https://cdn.tailwindcss.com"></script>
<style>
  *{box-sizing:border-box}
  html,body{
    margin:0;height:100%;width:100%;
    display:flex;align-items:center;justify-content:center;
    background:#111;font-family:system-ui;
  }
</style>
</head>
<body>
${codes.tailwind}
</body>
</html>`;
    }

    if (!codes.html) return null;

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  *{box-sizing:border-box}
  html,body{
    margin:0;height:100%;width:100%;
    display:flex;align-items:center;justify-content:center;
    background:#2B2B2B;font-family:system-ui;
    overflow:hidden;
  }
  ::-webkit-scrollbar{ display:none; }
  ${codes.css ?? ""}
</style>
</head>
<body>
<div id="preview-root">${codes.html}</div>
<script>
  try {
    ${codes.js ?? ""}
  } catch (e) {
    document.body.innerHTML += "<pre style='color:red'>" + e + "</pre>";
  }
</script>
</body>
</html>`;
  }, [codes]);

  if (!srcDoc) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600">
        No preview
      </div>
    );
  }

  return (
    <iframe
      loading="lazy"
      sandbox="allow-scripts"
      srcDoc={srcDoc}
      className="w-70 h-full border-0"
    />
  );
}