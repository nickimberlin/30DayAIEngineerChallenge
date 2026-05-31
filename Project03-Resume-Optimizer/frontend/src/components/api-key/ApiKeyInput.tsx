import { PasswordInput, Select, SelectItem, Stack } from "@carbon/react";

export type LLMProvider = "gemini";

export interface ApiKeyConfig {
  provider: LLMProvider;
  key: string;
}

interface ApiKeyInputProps {
  config: ApiKeyConfig;
  onChange: (config: ApiKeyConfig) => void;
}

export default function ApiKeyInput({ config, onChange }: ApiKeyInputProps) {
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        padding: 20,
        backgroundColor: "#f4f4f4",
      }}
    >
      <p
        style={{
          fontSize: "12px",
          color: "#525252",
          marginBottom: 16,
          letterSpacing: "0.32px",
          textTransform: "uppercase",
        }}
      >
        LLM Provider
      </p>
      <Stack gap={5}>
        <Select
          id="llm-provider"
          labelText="Provider"
          value={config.provider}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onChange({ ...config, provider: e.target.value as LLMProvider })
          }
        >
          <SelectItem value="gemini" text="Google Gemini" />
        </Select>
        <PasswordInput
          id="api-key"
          labelText="API Key"
          placeholder="Enter your Gemini API key..."
          value={config.key}
          hidePasswordLabel="Show API key"
          showPasswordLabel="Hide API key"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...config, key: e.target.value })
          }
        />
        <p
          style={{
            fontSize: "12px",
            color: "#8c8c8c",
            letterSpacing: "0.16px",
          }}
        >
          Your key stays in your browser and is only sent to the API during analysis.
        </p>
      </Stack>
    </div>
  );
}
