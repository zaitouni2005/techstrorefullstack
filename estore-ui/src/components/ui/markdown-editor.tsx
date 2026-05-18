import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "@tiptap/markdown";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Code,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder: placeholder ?? "Écrire en markdown..." }),
      Markdown,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange((editor.storage.markdown as unknown as { getMarkdown: () => string }).getMarkdown());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[250px] px-4 py-3",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  const toggle = (cb: () => void) => cb();

  return (
    <div className="rounded-xl border border-input bg-background overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-input bg-muted/30">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => toggle(() => editor.chain().focus().toggleBold().run())}
          title="Gras"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => toggle(() => editor.chain().focus().toggleItalic().run())}
          title="Italique"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() =>
            toggle(() => editor.chain().focus().toggleHeading({ level: 1 }).run())
          }
          title="Titre 1"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            toggle(() => editor.chain().focus().toggleHeading({ level: 2 }).run())
          }
          title="Titre 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => toggle(() => editor.chain().focus().toggleBulletList().run())}
          title="Liste"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => toggle(() => editor.chain().focus().toggleOrderedList().run())}
          title="Liste ordonnée"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Toggle
          size="sm"
          pressed={editor.isActive("codeBlock")}
          onPressedChange={() => toggle(() => editor.chain().focus().toggleCodeBlock().run())}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() => toggle(() => editor.chain().focus().toggleBlockquote().run())}
          title="Citation"
        >
          <Quote className="h-4 w-4" />
        </Toggle>
        <div className="ml-auto flex items-center gap-0.5">
          <Toggle
            size="sm"
            pressed={false}
            onPressedChange={() => toggle(() => editor.chain().focus().undo().run())}
            title="Annuler"
          >
            <Undo className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={false}
            onPressedChange={() => toggle(() => editor.chain().focus().redo().run())}
            title="Rétablir"
          >
            <Redo className="h-4 w-4" />
          </Toggle>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
