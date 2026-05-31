import { FileUploaderDropContainer, FileUploaderItem } from "@carbon/react";

interface ResumeUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function ResumeUpload({ file, onFileChange }: ResumeUploadProps) {
  const handleDrop = (event: { addedFiles: File[] }) => {
    const f = event.addedFiles[0];
    if (f) onFileChange(f);
  };

  return (
    <div>
      {!file ? (
        <FileUploaderDropContainer
          accept={[".pdf", ".docx", ".txt"]}
          labelText="Drag and drop your resume here or click to upload"
          onAddFiles={(_, { addedFiles }) => {
            handleDrop({ addedFiles });
            return false;
          }}
        />
      ) : (
        <FileUploaderItem
          name={file.name}
          status="edit"
          iconDescription="Remove file"
          onDelete={() => onFileChange(null)}
        />
      )}
    </div>
  );
}
