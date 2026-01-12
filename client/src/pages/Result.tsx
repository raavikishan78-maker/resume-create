import { useRoute } from "wouter";
import { useResume } from "@/hooks/use-resumes";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AtsScoreChart } from "@/components/AtsScoreChart";
import { Loader2, Download, Printer, CheckCircle2, XCircle, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

export default function Result() {
  const [, params] = useRoute("/resumes/:id");
  const id = parseInt(params?.id || "0");
  const { data: resume, isLoading, error } = useResume(id);
  const { toast } = useToast();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">Fetching your resume...</h2>
        </div>
      </Layout>
    );
  }

  if (error || !resume) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Resume</h2>
          <p className="text-muted-foreground">We couldn't find the resume you requested.</p>
        </div>
      </Layout>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 no-print">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{resume.targetJobTitle}</h1>
            <p className="text-muted-foreground">Created for {resume.fullName}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print / Save PDF
            </Button>
            <Button variant="default" onClick={() => copyToClipboard(resume.generatedResume || "")}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Markdown
            </Button>
          </div>
        </div>

        <Tabs defaultValue="resume" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="resume" className="rounded-lg px-6 py-2">Resume</TabsTrigger>
            <TabsTrigger value="cover-letter" className="rounded-lg px-6 py-2">Cover Letter</TabsTrigger>
            <TabsTrigger value="analysis" className="rounded-lg px-6 py-2">ATS Analysis</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <TabsContent value="resume" className="mt-0">
                <div className="resume-paper bg-white text-black p-8 md:p-12 shadow-xl rounded-lg border min-h-[800px] markdown-content">
                  {resume.generatedResume ? (
                    <ReactMarkdown>{resume.generatedResume}</ReactMarkdown>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                      <Loader2 className="w-10 h-10 animate-spin" />
                      <p>Generating resume content...</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="cover-letter" className="mt-0">
                <div className="bg-white text-black p-8 md:p-12 shadow-xl rounded-lg border min-h-[800px] whitespace-pre-wrap font-serif text-lg leading-relaxed">
                  {resume.generatedCoverLetter ? (
                    resume.generatedCoverLetter
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                      <Loader2 className="w-10 h-10 animate-spin" />
                      <p>Generating cover letter...</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="mt-0">
                 <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6 flex flex-col items-center justify-center bg-card">
                        <h3 className="font-semibold mb-4">Match Score</h3>
                        <AtsScoreChart score={resume.atsScore || 0} />
                      </Card>
                      <Card className="p-6 bg-card">
                        <h3 className="font-semibold mb-4">Summary</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Your resume has been optimized for the <strong>{resume.targetJobTitle}</strong> role. 
                          The AI has analyzed the job description and aligned your skills and experience to maximize your ATS ranking.
                        </p>
                      </Card>
                   </div>
                   
                   <Card className="p-6">
                     <h3 className="font-semibold mb-4">Improvement Suggestions</h3>
                     <ul className="space-y-3">
                       {(resume.improvementSuggestions as string[])?.map((suggestion, idx) => (
                         <li key={idx} className="flex gap-3 text-sm text-muted-foreground items-start">
                           <div className="mt-0.5 bg-blue-100 text-blue-700 p-1 rounded-full">
                             <CheckCircle2 className="w-3 h-3" />
                           </div>
                           {suggestion}
                         </li>
                       )) || <p className="text-muted-foreground">No specific suggestions available.</p>}
                     </ul>
                   </Card>
                 </div>
              </TabsContent>
            </div>

            {/* Sidebar (Analysis Summary always visible on desktop) */}
            <div className="hidden lg:block space-y-6">
              <Card className="p-6 bg-slate-50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Quick Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">ATS Score</span>
                      <span className="font-bold">{resume.atsScore || 0}/100</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000" 
                        style={{ width: `${resume.atsScore || 0}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-sm mb-2">Job Details</h4>
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-2">
                      {resume.jobDescription}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>

      {/* Printable Area - Only visible when printing */}
      <div className="print-only hidden">
        <div className="p-8">
           <ReactMarkdown>{resume.generatedResume || ""}</ReactMarkdown>
        </div>
      </div>
    </Layout>
  );
}
