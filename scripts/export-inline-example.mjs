// A small, website-only export experiment. Read existing Razor exports; never
// edit public/demo. Run after regenerating those exports to refresh this example.
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parse, serialize } from "parse5";
import { parse as parseCss } from "postcss";

const root = new URL("../", import.meta.url);
const output = new URL("src/components/inline-example/generated/", root);
await mkdir(output, { recursive: true });

function visit(node, callback) {
  callback(node);
  for (const child of node.childNodes ?? []) visit(child, callback);
}

for (const name of ["collapsible", "dialog"]) {
  const source = new URL(`public/demo/tag-helpers/${name}-intro.html`, root);
  const document = parse(await readFile(source, "utf8"));
  let preview;
  visit(document, (node) => {
    if (
      node.attrs?.some(
        (a) => a.name === "class" && a.value.split(/\s+/).includes("preview"),
      )
    )
      preview = node;
  });
  if (!preview) throw new Error(`Missing preview in ${source}`);

  // Remove demo-only centering/min-height wrappers, keeping component markup.
  const container = preview.childNodes.find((node) => node.tagName === "div");
  const ids = new Map();
  visit(container, (node) => {
    const id = node.attrs?.find((a) => a.name === "id");
    if (id) ids.set(id.value, `__INSTANCE__-${id.value}`);
  });
  visit(container, (node) => {
    if (node.tagName === "script")
      throw new Error("Inline scripts need an explicit initializer");
    for (const attr of node.attrs ?? []) {
      if (
        [
          "id",
          "for",
          "commandfor",
          "popovertarget",
          "aria-controls",
          "aria-labelledby",
          "aria-describedby",
        ].includes(attr.name)
      ) {
        attr.value = attr.value
          .split(/\s+/)
          .map((id) => ids.get(id) ?? id)
          .join(" ");
      }
      if (attr.name === "class" && name === "collapsible") {
        attr.value = attr.value.replace("w-[350px]", "w-full");
      }
      if (node.tagName === "img" && attr.name === "src")
        attr.value = "/demo/tag-helpers/assets/kyoto.jpg";
    }
  });
  await writeFile(new URL(`${name}.html`, output), serialize(container));
}

const assetNames = await readdir(
  new URL("public/demo/tag-helpers/assets/", root),
);
const runtime = assetNames.filter((name) =>
  /^stellar-admin\..*\.js$/.test(name),
);
if (runtime.length !== 1) throw new Error("Expected one exported runtime");
await writeFile(
  new URL("assets.json", output),
  JSON.stringify(
    { runtime: `/demo/tag-helpers/assets/${runtime[0]}` },
    null,
    2,
  ) + "\n",
);

// Parse the compiled theme. Scope top-level selectors; nested selectors retain
// their parent relationship. Namespace animation and Tailwind property names so
// their document-global registrations cannot change the website's own utilities.
const css = parseCss(
  await readFile(
    new URL(
      "public/demo/tag-helpers/assets/stellar-admin.observatory.css",
      root,
    ),
    "utf8",
  ),
);
const wrapper = ".sa-inline-example";
const animations = new Map();
css.walkAtRules("keyframes", (rule) => {
  animations.set(rule.params, `sa-inline-${rule.params}`);
  rule.params = `sa-inline-${rule.params}`;
});
css.walkDecls((decl) => {
  decl.prop = decl.prop.replaceAll("--tw-", "--sa-inline-tw-");
  decl.value = decl.value.replaceAll("--tw-", "--sa-inline-tw-");
  if (decl.prop === "animation" || decl.prop === "animation-name") {
    decl.value = decl.value.replace(
      /[\w-]+/g,
      (word) => animations.get(word) ?? word,
    );
  }
});
css.walkAtRules("property", (rule) => {
  rule.params = rule.params.replaceAll("--tw-", "--sa-inline-tw-");
});
css.walkRules((rule) => {
  let ancestor = rule.parent;
  while (ancestor) {
    if (
      ancestor.type === "rule" ||
      (ancestor.type === "atrule" && ancestor.name.endsWith("keyframes"))
    )
      return;
    ancestor = ancestor.parent;
  }
  // The homepage supplies the surface around each example. Keep the document
  // background out of the fragment so it blends into its surrounding card.
  if (rule.selector === "body") {
    rule.walkDecls("background-color", (decl) => decl.remove());
  }
  rule.selectors = rule.selectors.map((selector) => {
    if ([":root", ":host", "html", "body"].includes(selector)) return wrapper;
    if (selector === ":root:not(.dark)")
      return `${wrapper}:not(.dark):not(.dark *)`;
    if (selector === ".dark") return `:is(.dark ${wrapper}, ${wrapper}.dark)`;
    // These are the supported document selectors in the current theme. Fail on
    // newly introduced root selectors instead of silently exporting broken CSS.
    if (/:root|:host|(^|[\s>+~])(html|body)(?=$|[\s>+~.#[:])/.test(selector))
      throw new Error(`Review document selector: ${selector}`);
    return `:where(${wrapper}) ${selector}`;
  });
});
await writeFile(
  new URL("observatory.css", output),
  `/* Generated by scripts/export-inline-example.mjs. */\n${css.toString()}`,
);
console.log(`Exported inline example to ${fileURLToPath(output)}`);
