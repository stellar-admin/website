import { useEffect, useRef, useState } from "react";

export function DemoPreview({ src }: { src: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState("auto");

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let observer: ResizeObserver | undefined;

    // Track the demo body's size instead of measuring once: the content grows and
    // shrinks after load (accordions opening, theme swaps changing metrics). The
    // load listener re-attaches the observer to each new document.
    function observeBody() {
      observer?.disconnect();
      const body = iframe?.contentWindow?.document.body;
      if (!body) return;
      observer = new ResizeObserver(() => {
        setHeight(`${body.scrollHeight + 5}px`);
      });
      observer.observe(body);
    }

    iframe.addEventListener("load", observeBody);
    iframe.src = src;
    return () => {
      iframe.removeEventListener("load", observeBody);
      observer?.disconnect();
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
