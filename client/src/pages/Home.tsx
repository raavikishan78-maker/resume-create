import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useResumes } from "@/hooks/use-resumes";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, ArrowRight, Clock, Star, Sparkles, Shield, Zap, LogIn } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

function LandingPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="text-center py-20 md:py-28 space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Resume Builder
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight leading-tight">
            Elevate your career with <br className="hidden md:block" />
            <span
              className="inline-block text-black dark:text-white font-black tracking-[0.12em] uppercase"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                letterSpacing: "0.14em",
                textShadow: "2px 2px 0px rgba(0,0,0,0.08)",
                borderBottom: "4px solid black",
                paddingBottom: "4px",
              }}
            >
              RESUME CREATE
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create professional, ATS-optimized resumes and cover letters tailored to your target job — in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a href="/api/login">
              <Button size="lg" className="h-14 px-10 rounded-full text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1" data-testid="button-get-started">
                Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <Link href="/templates">
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-full text-lg">
                Browse Templates
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">No credit card required · 1,700+ templates · ATS optimized</p>
        </section>

        {/* Features */}
        <section className="pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary/30 transition-colors">
            <CardContent className="pt-8 pb-6 px-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold">AI-Generated Content</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                GPT-powered resume writing that tailors every word to your target job description for maximum impact.
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-primary/30 transition-colors">
            <CardContent className="pt-8 pb-6 px-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold">ATS Optimized</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Beat applicant tracking systems with keyword analysis and an ATS score so you land more interviews.
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-primary/30 transition-colors">
            <CardContent className="pt-8 pb-6 px-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold">1,700+ Templates</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Choose from 170 profession-specific layouts across 10 visual styles with custom colors and photo support.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CTA Banner */}
        <section className="mb-24 rounded-3xl bg-gradient-to-br from-primary to-blue-600 p-10 text-center text-white space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to land your dream job?</h2>
          <p className="text-white/80 max-w-lg mx-auto">Sign in with Google, GitHub, or email and build your first resume in minutes.</p>
          <a href="/api/login">
            <Button size="lg" variant="secondary" className="h-12 px-8 rounded-full font-semibold">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In & Get Started
            </Button>
          </a>
        </section>
      </div>
    </Layout>
  );
}

function Dashboard() {
  const { data: resumes, isLoading } = useResumes();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight">
            Elevate your career with <br className="hidden md:block" />
            <span
              className="inline-block text-black dark:text-white font-black tracking-[0.12em] uppercase"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                letterSpacing: "0.14em",
                textShadow: "2px 2px 0px rgba(0,0,0,0.08)",
                borderBottom: "4px solid black",
                paddingBottom: "4px",
              }}
            >
              RESUME CREATE
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
                <Link key={resume.id} href={`/resumes/${resume.id}`}>
                  <Card className="group h-full hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer" data-testid={`card-resume-${resume.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        {resume.atsScore && (
                          <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">
                            <Star className="w-3 h-3 fill-current" />
                            ATS {resume.atsScore}
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-base mt-3 group-hover:text-primary transition-colors">
                        {resume.targetJobTitle || "Untitled Resume"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-muted-foreground font-medium">{resume.fullName}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{resume.jobDescription}</p>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground flex items-center gap-1 pt-0">
                      <Clock className="w-3 h-3" />
                      {resume.createdAt ? format(new Date(resume.createdAt), "MMM d, yyyy") : "Recently"}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No resumes yet</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Create your first AI-powered resume in minutes, tailored specifically to your dream job.</p>
              <Link href="/create">
                <Button size="lg" className="rounded-full px-8">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Resume
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LandingPage />;
}
