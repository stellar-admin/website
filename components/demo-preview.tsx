"use client";

import { useEffect, useRef, useState } from "react";

export function DemoPreview({ src }: { src: string }) {
  const iframeRef = useRef(null);
  const [height, setHeight] = useState(undefined);

  function handleLoad() {
    // @ts-ignore
    if (iframeRef?.current?.contentWindow) {
      const computedStyle = window.getComputedStyle(iframeRef.current);
      const paddingTop = parseFloat(
        computedStyle.getPropertyValue("padding-top"),
      );
      const paddingBottom = parseFloat(
        computedStyle.getPropertyValue("padding-bottom"),
      );
      setHeight(
        // @ts-ignore
        iframeRef.current?.contentWindow.document.body.scrollHeight +
          paddingTop +
          paddingBottom +
          5,
      );
    }
  }

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <iframe
      ref={iframeRef}
      className="w-full"
      src={src}
      onLoad={handleLoad}
      style={{
        height: height === undefined ? undefined : height + "px",
      }}
    ></iframe>
  );
}
