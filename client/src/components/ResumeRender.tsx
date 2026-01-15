import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { templates, colorThemes } from "@/lib/templates";
import { Resume } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface ResumeRenderProps {
  resume: Resume;
}

export function ResumeRender({ resume }: ResumeRenderProps) {
  const template = templates.find(t => t.id === resume.templateId) || templates[0];
  const theme = colorThemes.find(t => t.id === resume.colorTheme) || colorThemes[0];

  if (!resume.generatedResume) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 min-h-[600px]">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p>Generating resume content...</p>
      </div>
    );
  }

  return (
    <div 
      className={cn("resume-wrapper w-full bg-white shadow-xl", template.class)}
      style={{ "--theme-color": theme.hex } as React.CSSProperties}
    >
      <div className="resume-container min-h-[1000px] print:shadow-none print:m-0">
        <ReactMarkdown>{resume.generatedResume}</ReactMarkdown>
      </div>
    </div>
  );
}
