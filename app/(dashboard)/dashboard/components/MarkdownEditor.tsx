"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";

const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MarkdownEditor({
                                         value,
                                         onChange,
                                         placeholder = "Start typing...",
                                         className = "",
                                       }: MarkdownEditorProps) {
  const options = useMemo(() => {
    return {
      spellChecker: false,
      placeholder,
      status: false,
      minHeight: "200px",
      toolbar: [
        "bold",
        "italic",
        "strikethrough",
        "|",
        "heading-smaller",
        "heading-bigger",
        "|",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "quote",
        "code",
        "preview",
        "guide",
      ],
      // @ts-ignore
    } as SimpleMDE.Options;
  }, [placeholder]);

  const handleChange = useCallback(
    (val: string) => {
      onChange(val);
    },
    [onChange]
  );

  return (
    <div className={`rounded-lg border border-gray-700 bg-[#1f2330] ${className}`}>
      <SimpleMdeReact value={value} onChange={handleChange} options={options} />

      <style jsx global>{`
        .EasyMDEContainer .editor-toolbar {
          background-color: #1f2330;
          border-color: #2a2d3a;
        }

        .EasyMDEContainer .CodeMirror {
          background-color: #1f2330;
          color: #fff;
          border: none;
        }

        .EasyMDEContainer .CodeMirror-cursor {
          border-left: 1px solid #fff;
        }

        .EasyMDEContainer .editor-toolbar button {
          color: #bbb;
          background-color: #1f2330;
        }

        .EasyMDEContainer .editor-toolbar button.active,
        .EasyMDEContainer .editor-toolbar button:hover {
          color: #fff;
          background-color: #2a2d3a;
        }

        .EasyMDEContainer .CodeMirror-scroll {
          min-height: 200px;
        }
      `}</style>
    </div>
  );
}
