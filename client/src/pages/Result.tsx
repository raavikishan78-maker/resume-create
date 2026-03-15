import { useRoute } from "wouter";
import { useResume } from "@/hooks/use-resumes";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AtsScoreChart } from "@/components/AtsScoreChart";
import { Loader2, Printer, CheckCircle2, Copy, LayoutTemplate } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { ResumeRender } from "@/components/ResumeRender";
import { Link } from "wouter";

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
          <h2 className="text-xl font-semibold">Generating your resume...</h2>
          <p className="text-muted-foreground text-sm">AI is crafting your personalized content</p>
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content copied to clipboard" });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 no-print">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{resume.targetJobTitle}</h1>
            <p className="text-muted-foreground">Created for {resume.fullName}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/templates">
              <Button variant="outline">
                <LayoutTemplate className="w-4 h-4 mr-2" />
                Change Template
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.print()} data-testid="button-print">
              <Printer className="w-4 h-4 mr-2" />
              Print / PDF
            </Button>
            <Button onClick={() => copyToClipboard(resume.generatedResume || "")} data-testid="button-copy">
              <Copy className="w-4 h-4 mr-2" />
              Copy Text
            </Button>
          </div>
        </div>

        <Tabs defaultValue="resume" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="resume" className="rounded-lg px-6 py-2" data-testid="tab-resume">Resume</TabsTrigger>
            <TabsTrigger value="cover-letter" className="rounded-lg px-6 py-2" data-testid="tab-cover-letter">Cover Letter</TabsTrigger>
            <TabsTrigger value="analysis" className="rounded-lg px-6 py-2" data-testid="tab-analysis">ATS Analysis</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <TabsContent value="resume" className="mt-0">
                <ResumeRender resume={resume} editable={true} />
              </TabsContent>

              <TabsContent value="cover-letter" className="mt-0">
                <div className="bg-white text-black p-8 md:p-12 shadow-xl rounded-lg border min-h-[800px] whitespace-pre-wrap font-serif text-base leading-loose">
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

              <TabsContent value="analysis" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 flex flex-col items-center justify-center">
                    <h3 className="font-semibold mb-4">ATS Match Score</h3>
                    <AtsScoreChart score={resume.atsScore || 0} />
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Summary</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your resume has been optimized for the <strong>{resume.targetJobTitle}</strong> role.
                      The AI analyzed the job description and aligned your profile to maximize ATS ranking.
                    </p>
                    <div className="mt-4 p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Template used:</span> {resume.templateId?.replace(/-/g, " ")}
                      </p>
                    </div>
                  </Card>
                </div>
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Improvement Suggestions</h3>
                  <ul className="space-y-3">
                    {(resume.improvementSuggestions as string[])?.map((s, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-muted-foreground items-start">
                        <div className="mt-0.5 bg-blue-100 text-blue-700 p-1 rounded-full flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        {s}
                      </li>
                    )) || <p className="text-muted-foreground text-sm">No suggestions available.</p>}
                  </ul>
                </Card>
              </TabsContent>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block space-y-6">
              <Card className="p-6 bg-slate-50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Quick Summary</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">ATS Score</span>
                      <span className="font-bold text-foreground">{resume.atsScore || 0}/100</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-1000 rounded-full" style={{ width: `${resume.atsScore || 0}%` }} />
                    </div>
                  </div>

                  <div className="pt-3 border-t space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Target Role</p>
                      <p className="text-sm font-medium">{resume.targetJobTitle}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Candidate</p>
                      <p className="text-sm font-medium">{resume.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Job Description Preview</p>
                      <p className="text-xs text-muted-foreground line-clamp-4">{resume.jobDescription}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <Link href="/create">
                      <Button variant="outline" size="sm" className="w-full">Create Another Resume</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>

      {/* Print-only */}
      <div className="hidden print:block">
        <ResumeRender resume={resume} />
      </div>
    </Layout>
  );
}
