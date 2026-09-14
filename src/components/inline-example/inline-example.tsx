import { useEffect, useMemo, useRef, useState } from "react";
import collapsible from "./generated/collapsible.html?raw";
import dialog from "./generated/dialog.html?raw";
import assets from "./generated/assets.json";

const examples = { collapsible, dialog };
let runtimePromise: Promise<void> | undefined;

function loadRuntime() {
  // Only called from an effect: the browser bundle must never execute in SSR.
  return (runtimePromise ??= new Promise<void>((resolve, reject) => {
    if (customElements.get("sel-collapsible")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = assets.runtime;
    script.dataset.inlineExampleRuntime = "";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Unable to load the component preview"));
    document.head.append(script);
  }));
}

export function InlineExample({
  name,
  instanceId,
}: {
  name: keyof typeof examples;
  instanceId: string;
}) {
  if (!/^[a-z][a-z0-9-]*$/.test(instanceId)) {
    throw new Error("Use a unique lowercase instanceId, such as hero-bookings");
  }

  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  // Trusted, build-time HTML only. The same ID replacement runs on the server
  // and client; separate placements must supply different instance IDs.
  const markup = useMemo(
    () => ({ __html: examples[name].replaceAll("__INSTANCE__", instanceId) }),
    [name, instanceId],
  );

  useEffect(() => {
    let active = true;
    const element = container.current;
    void loadRuntime().then(
      () => {
        if (active) setReady(true);
      },
      () => {
        if (active) setFailed(true);
      },
    );
    return () => {
      active = false;
      // Close this preview's modal when React removes it during navigation.
      // The library's observer then restores the page's scroll state.
      element
        ?.querySelectorAll<HTMLDialogElement>("dialog[open]")
        .forEach((modal) => modal.close());
    };
  }, []);

  return (
    <div>
      <div
        ref={container}
        className="sa-inline-example"
        inert={!ready}
        aria-busy={!ready && !failed}
        dangerouslySetInnerHTML={markup}
      />
      {failed && (
        <p role="status">The preview could not load. Refresh to try again.</p>
      )}
    </div>
  );
}
