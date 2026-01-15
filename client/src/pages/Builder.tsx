import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertResumeSchema } from "@shared/schema";
import { useCreateResume } from "@/hooks/use-resumes";
import { Layout } from "@/components/Layout";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { templates, colorThemes } from "@/lib/templates";
import { cn } from "@/lib/utils";

const steps = ["Personal Info", "Experience & Skills", "Target Job", "Design"];

// Extend the schema for form validation if needed, or use as is
const formSchema = insertResumeSchema;
type FormData = z.infer<typeof formSchema>;

export default function Builder() {
  const [currentStep, setCurrentStep] = useState(0);
  const { mutate: createResume, isPending } = useCreateResume();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      workExperience: "",
      skills: "",
      education: "",
      projects: "",
      certifications: "",
      targetJobTitle: "",
      jobDescription: "",
      extraInstructions: "",
      templateId: "modern",
      colorTheme: "blue"
    },
    mode: "onChange" 
  });

  const { register, trigger, watch, setValue, formState: { errors, isValid } } = form;
  const currentTemplateId = watch("templateId");
  const currentColorTheme = watch("colorTheme");

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    if (currentStep === 0) {
      fieldsToValidate = ["fullName", "email", "phone", "location"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["workExperience", "skills", "education"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["targetJobTitle", "jobDescription"];
    }
    // Step 3 (Design) doesn't strictly need validation as defaults are set

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = (data: FormData) => {
    createResume(data);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Build Your Resume</h1>
          <p className="text-muted-foreground">Let AI analyze your profile and target job to create the perfect application.</p>
        </div>

        <StepIndicator currentStep={currentStep} steps={steps} />

        <Card className="p-6 md:p-8 shadow-lg border-border/60 bg-card/50 backdrop-blur-sm mt-8">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" placeholder="John Doe" {...register("fullName")} className={errors.fullName ? "border-destructive" : ""} />
                      {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@example.com" {...register("email")} className={errors.email ? "border-destructive" : ""} />
                      {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+1 (555) 000-0000" {...register("phone")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="City, State" {...register("location")} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="currentRole">Current Role (Optional)</Label>
                      <Input id="currentRole" placeholder="e.g. Senior Software Engineer" {...register("currentRole")} />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="workExperience">Work Experience</Label>
                    <Textarea 
                      id="workExperience" 
                      placeholder="Paste your resume work history or describe your past roles here..." 
                      className={`min-h-[150px] font-mono text-sm ${errors.workExperience ? "border-destructive" : ""}`}
                      {...register("workExperience")} 
                    />
                    <p className="text-xs text-muted-foreground">Tip: Copy-paste directly from your LinkedIn or old resume.</p>
                    {errors.workExperience && <p className="text-xs text-destructive">{errors.workExperience.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Textarea 
                      id="education" 
                      placeholder="Degrees, universities, graduation years..." 
                      className={`min-h-[100px] font-mono text-sm ${errors.education ? "border-destructive" : ""}`}
                      {...register("education")} 
                    />
                    {errors.education && <p className="text-xs text-destructive">{errors.education.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Textarea 
                      id="skills" 
                      placeholder="List your technical and soft skills (comma separated or bullet points)..." 
                      className={`min-h-[100px] font-mono text-sm ${errors.skills ? "border-destructive" : ""}`}
                      {...register("skills")} 
                    />
                    {errors.skills && <p className="text-xs text-destructive">{errors.skills.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="projects">Key Projects (Optional)</Label>
                      <Textarea id="projects" placeholder="Describe key projects..." className="min-h-[100px] font-mono text-sm" {...register("projects")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications (Optional)</Label>
                      <Textarea id="certifications" placeholder="List certifications..." className="min-h-[100px] font-mono text-sm" {...register("certifications")} />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900 mb-6">
                    <div className="flex gap-3">
                      <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">AI Optimization Target</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Paste the exact job description you're applying for. The AI will tailor your resume keywords and phrasing to match this specific role.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetJobTitle">Target Job Title</Label>
                    <Input 
                      id="targetJobTitle" 
                      placeholder="e.g. Product Manager" 
                      className={errors.targetJobTitle ? "border-destructive" : ""}
                      {...register("targetJobTitle")} 
                    />
                    {errors.targetJobTitle && <p className="text-xs text-destructive">{errors.targetJobTitle.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea 
                      id="jobDescription" 
                      placeholder="Paste the full job description here..." 
                      className={`min-h-[200px] font-mono text-sm ${errors.jobDescription ? "border-destructive" : ""}`}
                      {...register("jobDescription")} 
                    />
                    {errors.jobDescription && <p className="text-xs text-destructive">{errors.jobDescription.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="extraInstructions">Extra Instructions (Optional)</Label>
                    <Textarea 
                      id="extraInstructions" 
                      placeholder="e.g. Focus on my leadership experience, keep it to one page..." 
                      className="min-h-[80px]" 
                      {...register("extraInstructions")} 
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step4"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Choose a Template</h3>
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                        {templates.length} Styles Available
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className={cn(
                            "cursor-pointer rounded-lg border-2 p-4 hover:border-primary/50 transition-all relative",
                            currentTemplateId === template.id ? "border-primary bg-primary/5 shadow-sm" : "border-border"
                          )}
                          onClick={() => setValue("templateId", template.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-foreground">{template.name}</h4>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                            </div>
                            {currentTemplateId === template.id && (
                              <div className="bg-primary text-primary-foreground rounded-full p-1 absolute top-3 right-3">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Select Accent Color</h3>
                    <div className="flex flex-wrap gap-4">
                      {colorThemes.map((theme) => (
                        <div
                          key={theme.id}
                          className={cn(
                            "cursor-pointer w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border",
                            currentColorTheme === theme.id ? "ring-2 ring-offset-2 ring-primary" : "border-transparent"
                          )}
                          style={{ backgroundColor: theme.hex }}
                          onClick={() => setValue("colorTheme", theme.id)}
                          title={theme.name}
                        >
                          {currentColorTheme === theme.id && (
                            <Check className="h-6 w-6 text-white drop-shadow-md" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between pt-8 mt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0 || isPending}
                className="w-32"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep} className="w-32">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isPending} 
                  className="w-48 bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Resume
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
