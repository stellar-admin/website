import manifestJson from "../../public/demo/tag-helpers/assets/stellar-admin.theme-variables.json";

// The variable tables on the docs' theme variables page, from the manifest the DocsSamplesGenerator
// exports, so the docs list the variables of the exported library.
interface Choice {
  label: string;
  value: string;
}

interface ThemeVariable {
  name: string;
  group: string;
  label: string;
  meaning: string;
  type: string;
  essential?: boolean;
  default?: string;
  optional?: boolean;
  follows?: string;
  min?: number;
  max?: number;
  unit?: string;
  named?: Choice[];
  choices?: Choice[];
}

const manifestVariables: ThemeVariable[] = manifestJson.variables;

function values(variable: ThemeVariable): string {
  switch (variable.type) {
    case "switch":
      return "0 or 1";
    case "color":
      return "any colour";
    case "number":
    case "length": {
      const unit = variable.type === "length" ? (variable.unit ?? "") : "";
      const named =
        variable.named?.map((choice) => `${choice.label} (${choice.value})`) ??
        [];
      return [
        `${variable.min}${unit} to ${variable.max}${unit}`,
        ...named,
      ].join(", ");
    }
    case "font":
      return `a font stack; the theme builder offers ${variable.choices?.map((choice) => choice.label).join(", ")}`;
    case "choice":
      return (
        variable.choices
          ?.map((choice) => `\`${choice.value}\` (${choice.label})`)
          .join(", ") ?? ""
      );
    default:
      return "";
  }
}

function Code({ text }: { text: string }) {
  // Choice lists mark values with backticks.
  return (
    <>
      {text
        .split("`")
        .map((part, index) =>
          index % 2 ? <code key={index}>{part}</code> : part,
        )}
    </>
  );
}

/** One table of variables: a group by id, or the essential variables of every group. */
export function ThemeVariableReference({
  group,
  essential,
}: {
  group?: string;
  essential?: boolean;
}) {
  const variables = manifestVariables.filter((variable) =>
    essential ? variable.essential : variable.group === group,
  );
  const follows = (name: string) =>
    manifestVariables.find((variable) => variable.name === name)?.label ?? name;
  return (
    <table>
      <thead>
        <tr>
          <th>Variable</th>
          <th>Default</th>
          <th>Values</th>
          <th>Meaning</th>
        </tr>
      </thead>
      <tbody>
        {variables.map((variable) => (
          <tr key={variable.name}>
            <td className="whitespace-nowrap">
              <code>{variable.name}</code>
            </td>
            <td>
              {variable.optional ? (
                <>Unset: follows {follows(variable.follows ?? "")}</>
              ) : (
                <code>{variable.default}</code>
              )}
            </td>
            <td>
              <Code text={values(variable)} />
            </td>
            <td>{variable.meaning}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
