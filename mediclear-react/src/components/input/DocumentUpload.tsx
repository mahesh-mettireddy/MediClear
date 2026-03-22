"use client";

import { Upload, File as FileIcon, X } from "lucide-react";

interface DocumentUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

/**
 * Handles multi-file uploads with drag and drop support.
 * @param {File[]} files - Currently uploaded files
 * @param {Function} onFilesChange - Callback for updating file list
 */
export default function DocumentUpload({ files, onFilesChange }: DocumentUploadProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      onFilesChange([...files, ...droppedFiles]);
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-[350px]">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-slate-400" /> Medical Documents
      </h2>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex-1 border-2 border-dashed border-slate-700 bg-slate-950/50 rounded-lg flex flex-col items-center justify-center p-6 text-center hover:border-slate-500 transition-colors cursor-pointer group relative"
      >
        <label htmlFor="medical-docs-upload" className="sr-only">Upload medical documents</label>
        <input 
          id="medical-docs-upload"
          type="file" 
          multiple 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => {
            if (e.target.files) {
              onFilesChange([...files, ...Array.from(e.target.files)]);
            }
          }}
          accept=".jpg,.jpeg,.png,.pdf"
          aria-label="Upload medical documents (Photos, PDFs, Pill Bottles)"
        />
        <div className="p-3 bg-slate-800 rounded-full mb-3 group-hover:bg-slate-700 transition-colors">
          <Upload className="w-6 h-6 text-electricGreen" />
        </div>
        <p className="text-sm text-slate-300 font-medium mb-1">Drag and drop or click to upload</p>
        <p className="text-xs text-slate-500 max-w-[200px] text-balance">
          Upload pill bottles, medical history, referral notes, handwritten docs
        </p>
      </div>
      
      {files.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {files.map((file, i) => (
            <div key={i} className="relative flex-shrink-0 bg-slate-800 rounded-md p-2 flex items-center gap-2 pr-8 border border-slate-700">
              <FileIcon className="w-4 h-4 text-electricGreen" />
              <span className="text-xs text-slate-300 truncate max-w-[100px]">{file.name}</span>
              <button 
                onClick={() => removeFile(i)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-400 focus:ring-1 focus:ring-red-400 focus:outline-none rounded"
                aria-label={`Remove file ${file.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
