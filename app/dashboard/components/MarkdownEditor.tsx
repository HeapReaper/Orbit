"use client";

import {
  MDXEditor,
  MDXEditorMethods,
  toolbarPlugin,
  markdownShortcutPlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  linkPlugin,
  linkDialogPlugin,
  codeBlockPlugin,
  diffSourcePlugin,
  thematicBreakPlugin,
  frontmatterPlugin,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertCodeBlock,
  ListsToggle,
  UndoRedo,
  Separator,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useRef, useEffect } from "react";

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
  const editorRef = useRef<MDXEditorMethods>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.getMarkdown() !== value) {
      editorRef.current.setMarkdown(value);
    }
  }, [value]);

  return (
    <div
      className={`rounded-lg border border-gray-700 bg-[#1f2330] ${className}`}
    >
      <MDXEditor
        ref={editorRef}
        markdown={value}
        placeholder={placeholder}
        contentEditableClassName="min-h-[200px] text-white p-4 focus:outline-none prose prose-invert"
        onChange={() => onChange(editorRef.current?.getMarkdown() ?? "")}
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <ListsToggle />
                <Separator />
                <CreateLink />
                <Separator />
                <InsertCodeBlock />
              </>
            ),
          }),
          markdownShortcutPlugin(),
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          codeBlockPlugin(),
          diffSourcePlugin(),
          thematicBreakPlugin(),
          frontmatterPlugin(),
        ]}
      />
      <style jsx global>{`
        .mdx-editor-wrapper .mdxeditor {
          color: #1e90ff; /* Overwrite text color */
        }
      `}</style>
    </div>
  );
}
