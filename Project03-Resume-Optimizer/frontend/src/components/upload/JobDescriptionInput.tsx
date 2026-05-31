import { TextArea } from "@carbon/react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  return (
    <TextArea
      labelText="Job Description"
      placeholder="Paste the job description here..."
      value={value}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      rows={10}
      style={{ borderRadius: 0 }}
    />
  );
}
