import { Layout } from "@/components/Layout";
import { useResumes } from "@/hooks/use-resumes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, ArrowRight, Clock, Star } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Home() {
  const { data: resumes, isLoading } = useResumes();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight">
            Land your dream job with <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              AI-Powered Resumes
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create professional, ATS-optimized resumes and cover letters tailored to your target job description in seconds.
          </p>
          <div className="pt-4">
            <Link href="/create">
              <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1">
                Create Free Resume <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Recent Resumes Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Your Documents</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : resumes && resumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Create New Card */}
              <Link href="/create">
                <div className="group h-full min-h-[250px] flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/20 rounded-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Create New Resume</h3>
                  <p className="text-sm text-muted-foreground mt-2 text-center">Tailor for a new job application</p>
                </div>
              </Link>

              {/* Existing Resumes */}
              {resumes.map((resume) => (
                <Card key={resume.id} className="hover:shadow-lg transition-all duration-300 border-muted/50 hover:border-border overflow-hidden group">
                  <CardHeader className="pb-4 border-b border-muted/30 bg-muted/20">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary border border-muted/50">
                        <FileText className="w-5 h-5" />
                      </div>
                      {resume.atsScore && (
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          {resume.atsScore}
                        </div>
                      )}
                    </div>
                    <CardTitle className="mt-4 text-lg font-bold truncate pr-4">
                      {resume.targetJobTitle}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground truncate">
                      {resume.fullName}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Created {format(new Date(resume.createdAt!), "MMM d, yyyy")}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link href={`/resumes/${resume.id}`} className="w-full">
                      <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-muted-foreground/20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-6">Create your first AI-optimized resume to get started.</p>
              <Link href="/create">
                <Button>Create Resume</Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
