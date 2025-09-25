import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import React from "react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      theme="snow"
      placeholder={placeholder || "Write something..."}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-primary/2 mb-10"
    />
  );
}
