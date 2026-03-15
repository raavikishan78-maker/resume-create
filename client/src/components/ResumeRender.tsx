import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { getTemplateById, colorThemes, TemplateLayout } from "@/lib/templates";
import { Resume } from "@shared/schema";
import { Loader2, Edit3, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ResumeRenderProps {
  resume: Resume;
  editable?: boolean;
  onContentChange?: (content: string) => void;
}

function parseResumeContent(markdown: string) {
  const lines = markdown.split("\n");
  let name = "";
  let subtitle = "";
  let contact = "";
  let sections: { title: string; content: string }[] = [];
  let currentSection = "";
  let currentContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("# ")) {
      name = line.replace("# ", "").trim();
    } else if (!name && line.startsWith("**")) {
      subtitle = line.replace(/\*\*/g, "").trim();
    } else if (line.startsWith("## ")) {
      if (currentSection) {
        sections.push({ title: currentSection, content: currentContent.join("\n").trim() });
      }
      currentSection = line.replace("## ", "").trim();
      currentContent = [];
    } else if (!currentSection && line.includes("|") && line.includes("@")) {
      contact = line.trim();
    } else if (!currentSection && (line.includes("@") || line.includes("•") || line.includes("|"))) {
      if (!subtitle) contact = line.trim();
    } else {
      if (currentSection) currentContent.push(line);
      else if (line.startsWith("**") || line.includes("@") || line.includes("Phone")) {
        contact += " " + line.replace(/\*\*/g, "");
      }
    }
  }
  if (currentSection) {
    sections.push({ title: currentSection, content: currentContent.join("\n").trim() });
  }

  const summaryIdx = sections.findIndex(s => s.title.toLowerCase().includes("summary") || s.title.toLowerCase().includes("profile") || s.title.toLowerCase().includes("objective"));
  const summary = summaryIdx >= 0 ? sections[summaryIdx] : null;
  const mainSections = sections.filter((_, i) => i !== summaryIdx);

  return { name, subtitle, contact: contact.trim(), summary, sections: mainSections };
}

function SidebarLeftLayout({ content, theme, editable, onEdit }: LayoutProps) {
  const { name, contact, summary, sections } = parseResumeContent(content);
  const half = Math.ceil(sections.length / 2);
  const sidebarSections = sections.slice(0, half);
  const mainSections = sections.slice(half);

  return (
    <div className="flex min-h-[1050px] font-sans text-sm bg-white" style={{ "--tc": theme.hex } as any}>
      {/* Sidebar */}
      <div className="w-[35%] text-white p-6 flex flex-col gap-4" style={{ backgroundColor: theme.hex }}>
        <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center mx-auto mb-2">
          <span className="text-2xl font-bold text-white/80">{name.charAt(0)}</span>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-white uppercase tracking-wide">{name || "Your Name"}</h1>
          <p className="text-white/70 text-xs mt-1">{contact || "your@email.com"}</p>
        </div>
        <div className="h-px bg-white/30 my-2" />
        {sidebarSections.map((s) => (
          <div key={s.title}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2 border-b border-white/20 pb-1">{s.title}</h2>
            <div className="text-white/85 text-xs leading-relaxed prose-invert">
              <ReactMarkdown>{s.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 p-8">
        {summary && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2" style={{ borderColor: theme.hex, color: theme.hex }}>{summary.title}</h2>
            <div className="text-gray-700 leading-relaxed text-sm">
              <ReactMarkdown>{summary.content}</ReactMarkdown>
            </div>
          </div>
        )}
        {mainSections.map((s) => (
          <div key={s.title} className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2" style={{ borderColor: theme.hex, color: theme.hex }}>{s.title}</h2>
            <div className="text-gray-700 leading-relaxed text-sm prose">
              <ReactMarkdown>{s.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarRightLayout({ content, theme }: LayoutProps) {
  const { name, contact, summary, sections } = parseResumeContent(content);
  const half = Math.ceil(sections.length / 2);
  const mainSections = sections.slice(0, half);
  const sidebarSections = sections.slice(half);

  return (
    <div className="flex min-h-[1050px] font-sans text-sm bg-white">
      {/* Main */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-1" style={{ color: theme.hex }}>{name || "Your Name"}</h1>
        <p className="text-gray-500 text-xs mb-4">{contact}</p>
        <div className="h-1 rounded mb-6" style={{ backgroundColor: theme.hex }} />
        {summary && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: theme.hex }}>{summary.title}</h2>
            <div className="text-gray-700 text-sm leading-relaxed prose"><ReactMarkdown>{summary.content}</ReactMarkdown></div>
          </div>
        )}
        {mainSections.map((s) => (
          <div key={s.title} className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: theme.hex, borderColor: theme.hex + "44" }}>{s.title}</h2>
            <div className="text-gray-700 text-sm leading-relaxed prose"><ReactMarkdown>{s.content}</ReactMarkdown></div>
          </div>
        ))}
      </div>
      {/* Sidebar */}
      <div className="w-[30%] p-6 border-l" style={{ backgroundColor: theme.hex + "0d", borderColor: theme.hex + "33" }}>
        {sidebarSections.map((s) => (
          <div key={s.title} className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: theme.hex, borderColor: theme.hex + "55" }}>{s.title}</h2>
            <div className="text-gray-700 text-xs leading-relaxed prose"><ReactMarkdown>{s.content}</ReactMarkdown></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassicSingleLayout({ content, theme }: LayoutProps) {
  const { name, contact, summary, sections } = parseResumeContent(content);
  return (
    <div className="min-h-[1050px] font-serif text-sm bg-white p-10 max-w-3xl mx-auto">
      <div className="text-center border-b-2 pb-4 mb-6" style={{ borderColor: theme.hex }}>
        <h1 className="text-3xl font-bold text-gray-900 tracking-wide">{name || "Your Name"}</h1>
        <p className="text-gray-500 text-xs mt-2 italic">{contact}</p>
      </div>
      {summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" style={{ color: theme.hex, borderColor: theme.hex }}>{summary.title}</h2>
          <div className="text-gray-700 leading-relaxed prose text-sm"><ReactMarkdown>{summary.content}</ReactMarkdown></div>
        </div>
      )}
      {sections.map((s) => (
        <div key={s.title} className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" style={{ color: theme.hex, borderColor: theme.hex }}>{s.title}</h2>
          <div className="text-gray-700 leading-relaxed prose text-sm"><ReactMarkdown>{s.content}</ReactMarkdown></div>
        </div>
      ))}
    </div>
  );
}

function TwoColumnLayout({ content, theme }: LayoutProps) {
  const { name, contact, summary, sections } = parseResumeContent(content);
  const half = Math.ceil(sections.length / 2);
  const col1 = sections.slice(0, half);
  const col2 = sections.slice(half);

  return (
    <div className="min-h-[1050px] font-sans text-sm bg-white">
      <div className="px-8 pt-8 pb-4 text-white" style={{ backgroundColor: theme.hex }}>
        <h1 className="text-2xl font-bold">{name || "Your Name"}</h1>
        <p className="text-white/70 text-xs mt-1">{contact}</p>
        {summary && <p className="mt-3 text-white/80 text-xs leading-relaxed line-clamp-3">{summary.content.replace(/[#*_]/g, "").slice(0, 200)}</p>}
      </div>
      <div className="grid grid-cols-2 gap-6 p-8">
        <div className="space-y-5">
          {col1.map((s) => (
            <div key={s.title}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2" style={{ color: theme.hex, borderColor: theme.hex }}>{s.title}</h2>
              <div className="text-gray-700 text-xs leading-relaxed prose"><ReactMarkdown>{s.content}</ReactMarkdown></div>
            </div>
          ))}
        </div>
        <div className="space-y-5">
          {col2.map((s) => (
            <div key={s.title}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2" style={{ color: theme.hex, borderColor: theme.hex }}>{s.title}</h2>
              <div className="text-gray-700 text-xs leading-relaxed prose"><ReactMarkdown>{s.content}</ReactMarkdown></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopBarLayout({ content, theme }: LayoutProps) {
  const { name, contact, summary, sections } = parseResumeContent(content);
  return (
    <div className="min-h-[1050px] font-sans text-sm bg-white">
      <div className="h-3 w-full" style={{ backgroundColor: theme.hex }} />
      <div className="px-8 pt-6 pb-4 flex justify-between items-end border-b" style={{ borderColor: theme.hex + "33" }}>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{name || "Your Name"}</h1>
          <p className="text-xs mt-1" style={{ color: theme.hex }}>{contact}</p>
        </div>
        <div className="w-14 h-14 rounded-full border-4 flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: theme.hex, borderColor: theme.hex + "88" }}>
          {name.charAt(0)}
        </div>
      </div>
      <div className="p-8">
        {summary && (
          <div className="mb-6 p-4 rounded-lg text-sm" style={{ backgroundColor: theme.hex + "0d" }}>
            <div className="text-gray-700 leading-relaxed prose"><ReactMarkdown>{summary.content}</ReactMarkdown></div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2" style={{ color: theme.hex, borderColor: theme.hex }}>{s.title}</h2>
              <div className="text-gray-700 text-xs leading-relaxed prose"><ReactMarkdown>{s.content}</ReactMarkdown></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MinimalLayout({ content, theme }: LayoutProps) {
  const { name, contact, summary, sections } = parseResumeContent(content);
  return (
    <div className="min-h-[1050px] font-sans text-sm bg-white px-12 py-10">
      <h1 className="text-4xl font-light text-gray-900 tracking-tight mb-1">{name || "Your Name"}</h1>
      <div className="flex items-center gap-2 mb-8">
        <div className="h-px flex-1" style={{ backgroundColor: theme.hex }} />
        <p className="text-xs text-gray-400 px-2">{contact}</p>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
      {summary && (
        <div className="mb-8">
          <p className="text-gray-600 leading-loose italic text-sm">{summary.content.replace(/[#*_]/g, "").slice(0, 300)}</p>
        </div>
      )}
      {sections.map((s) => (
        <div key={s.title} className="mb-7">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.hex }} />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">{s.title}</h2>
          </div>
          <div className="text-gray-700 text-sm leading-relaxed prose pl-5"><ReactMarkdown>{s.content}</ReactMarkdown></div>
        </div>
      ))}
    </div>
  );
}

function BoldHeaderLayout({ content, theme }: LayoutProps) {
  const { name, contact, summary, sections } = parseResumeContent(content);
  return (
    <div className="min-h-[1050px] font-sans text-sm bg-white">
      <div className="p-8 flex gap-6 items-center" style={{ background: `linear-gradient(135deg, ${theme.hex}, ${theme.hex}cc)` }}>
        <div className="w-24 h-24 rounded-full border-4 border-white/40 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0" style={{ backgroundColor: theme.hex + "55" }}>
          {name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">{name || "Your Name"}</h1>
          <p className="text-white/70 text-xs mt-1">{contact}</p>
          {summary && <p className="text-white/80 text-xs mt-2 leading-relaxed max-w-xl line-clamp-2">{summary.content.replace(/[#*_]/g, "").slice(0, 160)}</p>}
        </div>
      </div>
      <div className="p-8 grid grid-cols-2 gap-6">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2" style={{ color: theme.hex, borderColor: theme.hex }}>{s.title}</h2>
            <div className="text-gray-700 text-xs leading-relaxed prose"><ReactMarkdown>{s.content}</ReactMarkdown></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfographicLayout({ content, theme }: LayoutProps) {
  const { name, contact, summary, sections } = parseResumeContent(content);
  const half = Math.ceil(sections.length / 2);
  const leftSections = sections.slice(0, half);
  const rightSections = sections.slice(half);

  return (
    <div className="flex min-h-[1050px] font-sans text-sm bg-white">
      <div className="w-[38%] text-white p-6 flex flex-col gap-5" style={{ background: `linear-gradient(180deg, ${theme.hex} 0%, ${theme.hex}dd 100%)` }}>
        <div className="text-center py-4">
          <div className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center text-2xl font-black mx-auto mb-3" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            {name.charAt(0)}
          </div>
          <h1 className="text-lg font-black uppercase">{name || "Your Name"}</h1>
          <p className="text-white/60 text-xs mt-1">{contact}</p>
        </div>
        {leftSections.map((s) => (
          <div key={s.title}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 border-b border-white/20 pb-1 mb-2">{s.title}</h2>
            <div className="text-white/80 text-xs leading-relaxed prose-invert"><ReactMarkdown>{s.content}</ReactMarkdown></div>
          </div>
        ))}
      </div>
      <div className="flex-1 p-8">
        {summary && (
          <div className="mb-5 p-4 rounded-xl text-sm" style={{ backgroundColor: theme.hex + "10" }}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: theme.hex }}>{summary.title}</h2>
            <div className="text-gray-600 text-xs leading-relaxed prose"><ReactMarkdown>{summary.content}</ReactMarkdown></div>
          </div>
        )}
        {rightSections.map((s) => (
          <div key={s.title} className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 rounded" style={{ backgroundColor: theme.hex }} />
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.hex }}>{s.title}</h2>
            </div>
            <div className="text-gray-700 text-xs leading-relaxed prose pl-3"><ReactMarkdown>{s.content}</ReactMarkdown></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExecutiveLayout({ content, theme }: LayoutProps) {
  const { name, contact, summary, sections } = parseResumeContent(content);
  return (
    <div className="min-h-[1050px] font-serif text-sm bg-white px-12 py-10">
      <div className="text-center mb-2">
        <h1 className="text-4xl font-bold text-gray-900 tracking-wide">{name || "Your Name"}</h1>
        <div className="flex justify-center items-center gap-3 mt-2">
          <div className="h-px w-16 bg-gray-400" />
          <p className="text-xs text-gray-500 tracking-wider uppercase">{contact}</p>
          <div className="h-px w-16 bg-gray-400" />
        </div>
        <div className="h-1 w-24 mx-auto mt-4 rounded" style={{ backgroundColor: theme.hex }} />
      </div>
      <div className="mt-8">
        {summary && (
          <div className="mb-7 text-center">
            <div className="text-gray-600 italic text-sm leading-relaxed prose max-w-2xl mx-auto"><ReactMarkdown>{summary.content}</ReactMarkdown></div>
            <div className="h-px bg-gray-200 mt-6" />
          </div>
        )}
        {sections.map((s) => (
          <div key={s.title} className="mb-7">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b-2 pb-2 mb-3" style={{ borderColor: theme.hex }}>{s.title}</h2>
            <div className="text-gray-700 leading-relaxed prose text-sm"><ReactMarkdown>{s.content}</ReactMarkdown></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreativeSplitLayout({ content, theme }: LayoutProps) {
  const { name, contact, summary, sections } = parseResumeContent(content);

  return (
    <div className="min-h-[1050px] font-sans text-sm bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[45%] h-full opacity-5 rounded-bl-[100px]" style={{ backgroundColor: theme.hex }} />
      <div className="relative p-8">
        <div className="mb-6 pb-4 border-b-4" style={{ borderColor: theme.hex }}>
          <h1 className="text-4xl font-black uppercase tracking-tight" style={{ color: theme.hex }}>{name || "Your Name"}</h1>
          <p className="text-gray-500 text-xs mt-1">{contact}</p>
        </div>
        {summary && (
          <div className="mb-6 pl-4 border-l-4" style={{ borderColor: theme.hex }}>
            <div className="text-gray-700 text-sm leading-relaxed prose"><ReactMarkdown>{summary.content}</ReactMarkdown></div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-xs font-black uppercase tracking-widest mb-2 px-2 py-0.5 inline-block rounded text-white" style={{ backgroundColor: theme.hex }}>{s.title}</h2>
              <div className="text-gray-700 text-xs leading-relaxed prose mt-2"><ReactMarkdown>{s.content}</ReactMarkdown></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface LayoutProps {
  content: string;
  theme: { hex: string; name: string };
  editable?: boolean;
  onEdit?: (content: string) => void;
}

function renderLayout(layout: TemplateLayout, props: LayoutProps) {
  switch (layout) {
    case "sidebar-left": return <SidebarLeftLayout {...props} />;
    case "sidebar-right": return <SidebarRightLayout {...props} />;
    case "classic-single": return <ClassicSingleLayout {...props} />;
    case "two-column": return <TwoColumnLayout {...props} />;
    case "top-bar": return <TopBarLayout {...props} />;
    case "minimal": return <MinimalLayout {...props} />;
    case "bold-header": return <BoldHeaderLayout {...props} />;
    case "infographic": return <InfographicLayout {...props} />;
    case "executive": return <ExecutiveLayout {...props} />;
    case "creative-split": return <CreativeSplitLayout {...props} />;
    default: return <ClassicSingleLayout {...props} />;
  }
}

export function ResumeRender({ resume, editable = false, onContentChange }: ResumeRenderProps) {
  const template = getTemplateById(resume.templateId || "");
  const theme = colorThemes.find(t => t.id === resume.colorTheme) || colorThemes[0];
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(resume.generatedResume || "");

  const handleSave = useCallback(() => {
    if (onContentChange) onContentChange(editContent);
    setIsEditing(false);
  }, [editContent, onContentChange]);

  const handleCancel = useCallback(() => {
    setEditContent(resume.generatedResume || "");
    setIsEditing(false);
  }, [resume.generatedResume]);

  if (!resume.generatedResume) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 min-h-[600px]">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p>Generating resume content...</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Edit your resume content (Markdown supported):</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCancel}><X className="w-3 h-3 mr-1" /> Cancel</Button>
            <Button size="sm" onClick={handleSave}><Check className="w-3 h-3 mr-1" /> Save</Button>
          </div>
        </div>
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="min-h-[600px] font-mono text-xs"
        />
      </div>
    );
  }

  return (
    <div className="relative group">
      {editable && (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsEditing(true)}
          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        >
          <Edit3 className="w-3 h-3 mr-1" /> Edit
        </Button>
      )}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden border">
        {renderLayout(template.layout, { content: resume.generatedResume, theme })}
      </div>
    </div>
  );
}

export function TemplateThumbnail({ layout, theme, name }: { layout: TemplateLayout; theme: { hex: string }; name: string }) {
  const previewContent = `# ${name}\n\n**Professional Title**\nemail@example.com | (555) 000-0000 | City, State\n\n## Summary\nExperienced professional with proven track record of delivering results.\n\n## Experience\n**Senior Role** — Company Name\nKey achievement and responsibility here.\n\n## Skills\nSkill One, Skill Two, Skill Three\n\n## Education\n**Degree** — University Name`;

  return (
    <div className="w-full overflow-hidden" style={{ height: "200px" }}>
      <div className="origin-top-left scale-[0.28] w-[357%] pointer-events-none">
        {renderLayout(layout, { content: previewContent, theme: { hex: theme.hex, name: "" } })}
      </div>
    </div>
  );
}
