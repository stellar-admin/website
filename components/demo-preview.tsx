"use client";

import { useEffect, useRef, useState } from "react";

export function DemoPreview({ src }: { src: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState("auto");

  function resizeIframe() {
    if (iframeRef?.current?.contentWindow) {
      setHeight(
        `${iframeRef.current?.contentWindow.document.body.scrollHeight + 5}px`,
      );
    }
  }

  useEffect(() => {
    iframeRef.current?.addEventListener("load", resizeIframe);
    if (iframeRef.current) {
      iframeRef.current.src = src;
    }
    return () => {
      iframeRef.current?.removeEventListener("load", resizeIframe);
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
