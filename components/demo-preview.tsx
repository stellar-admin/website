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
    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.onload = resizeIframe;

    if (
      iframe.contentDocument &&
      (iframe.contentDocument.readyState === "complete" ||
        iframe.contentDocument.readyState === "interactive")
    ) {
      resizeIframe();
    }

    return () => {
      if (iframe) {
        iframe.onload = null;
      }
    };
  }, [src]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full"
      src={src}
      title="Demo"
      style={{
        height: height,
      }}
    ></iframe>
  );
}
