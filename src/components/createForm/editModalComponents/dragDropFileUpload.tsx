import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

interface FileUploadProps {
  imageFiles: File[];
  onFilesUploaded: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  imageFiles,
  onFilesUploaded,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>(imageFiles);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles = [...droppedFiles];
    droppedFiles.forEach((file, index) => {
      const newName = `Uploaded Image ${files.length + 1}`;
      const blob = new Blob([file], { type: file.type });
      newFiles.splice(index, 1, new File([blob], newName, { type: file.type }));
    });
    if (validateFiles(newFiles)) {
      setFiles([...files, ...newFiles]);
      onFilesUploaded([...imageFiles, ...newFiles]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const droppedFiles = Array.from(e.target.files!);
    const newFiles = [...droppedFiles];
    droppedFiles.forEach((file, index) => {
      const newName = `Uploaded Image ${files.length + 1}`;
      const blob = new Blob([file], { type: file.type });
      newFiles.splice(index, 1, new File([blob], newName, { type: file.type }));
    });
    if (validateFiles(newFiles)) {
      setFiles([...files, ...newFiles]);
      onFilesUploaded([...imageFiles, ...newFiles]);
    }
  };
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const validateFiles = (files: File[]) => {
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    for (const file of files) {
      if (file.size > maxSize) {
        toast(`File ${file.name} is too large. Maximum size is 2MB.`, {
          type: "error",
        });
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast(`File ${file.name} is not an image.`, { type: "error" });
        return false;
      }
    }
    return true;
  };

  return (
    <div className="file-upload space-y-2">
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />
      <div
        className="drop-zone h-40 bg-gray-100 mr-2 p-2 rounded-lg flex items-center justify-center"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span>Drag and drop files here, or click to select files</span>
      </div>
      <ul className="space-y-1">
        {files.map((file, index) => (
          <li
            key={index}
            className="flex items-center justify-between border border-green-500 rounded-lg p-1 mr-2"
          >
            <span>
              {file.name} ({file.size / 1024} KB)
            </span>
            <i
              className="fa fa-trash"
              onClick={() => {
                const i = files.indexOf(file);
                const newFiles = [...files];
                newFiles.splice(i, 1);
                newFiles.forEach((file, ind) => {
                  const newName = `Uploaded Image ${ind + 1}`;
                  const blob = new Blob([file], { type: file.type });
                  newFiles.splice(
                    ind,
                    1,
                    new File([blob], newName, { type: file.type })
                  );
                });
                setFiles(newFiles);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
