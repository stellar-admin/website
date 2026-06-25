import { useEffect, useRef, useState } from "react";

export function DemoPreview({ src }: { src: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState("auto");

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    function resizeIframe() {
      if (iframe?.contentWindow) {
        setHeight(`${iframe.contentWindow.document.body.scrollHeight + 5}px`);
      }
    }

    iframe.addEventListener("load", resizeIframe);
    iframe.src = src;
    return () => {
      iframe.removeEventListener("load", resizeIframe);
    };
  }, [src]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full"
      title="Component demo"
      style={{
        height: height,
      }}
    ></iframe>
  );
}
