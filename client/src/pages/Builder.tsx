import { useState, useRef } from "react";
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
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Check, LayoutTemplate, Search, X, Camera, UserCircle2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { templates, colorThemes, categories } from "@/lib/templates";
import { TemplateThumbnail } from "@/components/ResumeRender";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const steps = ["Personal Info", "Experience & Skills", "Target Job", "Design"];

const formSchema = insertResumeSchema;
type FormData = z.infer<typeof formSchema>;

function getUrlParam(key: string) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

export default function Builder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategory, setTemplateCategory] = useState("All");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const { mutate: createResume, isPending } = useCreateResume();

  const urlTemplate = getUrlParam("template");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      currentRole: "",
      workExperience: "",
      skills: "",
      education: "",
      projects: "",
      certifications: "",
      targetJobTitle: "",
      jobDescription: "",
      extraInstructions: "",
      templateId: urlTemplate || "software-engineer-sidebar-left",
      colorTheme: "blue",
      profilePhoto: "",
    },
    mode: "onChange",
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPhotoPreview(dataUrl);
      setValue("profilePhoto", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setValue("profilePhoto", "");
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const { register, trigger, watch, setValue, formState: { errors } } = form;
  const currentTemplateId = watch("templateId");
  const currentColorTheme = watch("colorTheme");
  const currentTheme = colorThemes.find(t => t.id === currentColorTheme) || colorThemes[0];

  const filteredTemplates = templates.filter((t) => {
    const matchSearch = !templateSearch ||
      t.profession.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(templateSearch.toLowerCase());
    const matchCat = templateCategory === "All" || t.category === templateCategory;
    return matchSearch && matchCat;
  }).slice(0, 40);

  const selectedTemplate = templates.find(t => t.id === currentTemplateId) || templates[0];

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    if (currentStep === 0) fieldsToValidate = ["fullName", "email"];
    else if (currentStep === 1) fieldsToValidate = ["workExperience", "skills", "education"];
    else if (currentStep === 2) fieldsToValidate = ["targetJobTitle", "jobDescription"];
    const ok = await trigger(fieldsToValidate);
    if (ok) setCurrentStep((p) => Math.min(p + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 0));

  const onSubmit = (data: FormData) => createResume(data);

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Build Your Resume</h1>
          <p className="text-muted-foreground">
            Let AI create a perfectly tailored resume for your target role.
          </p>
        </div>

        <StepIndicator currentStep={currentStep} steps={steps} />

        <Card className="p-6 md:p-8 shadow-lg border-border/60 bg-card/50 backdrop-blur-sm mt-8">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Info */}
              {currentStep === 0 && (
                <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                  {/* Photo Upload */}
                  <div className="flex items-start gap-6 p-4 rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/20 hover:border-primary/40 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-4 border-white shadow-md flex items-center justify-center relative">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <UserCircle2 className="w-14 h-14 text-muted-foreground/40" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm font-semibold">Profile Photo <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                      <p className="text-xs text-muted-foreground">Add your photo to templates that support a profile picture. Recommended: square image, min 200×200px.</p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => photoInputRef.current?.click()}
                          data-testid="button-upload-photo"
                        >
                          <Camera className="w-3.5 h-3.5 mr-1.5" />
                          {photoPreview ? "Change Photo" : "Upload Photo"}
                        </Button>
                        {photoPreview && (
                          <Button type="button" variant="ghost" size="sm" onClick={removePhoto} className="text-destructive hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                          </Button>
                        )}
                      </div>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        data-testid="input-photo-file"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input id="fullName" placeholder="John Doe" {...register("fullName")} className={errors.fullName ? "border-destructive" : ""} data-testid="input-fullname" />
                      {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="john@example.com" {...register("email")} className={errors.email ? "border-destructive" : ""} data-testid="input-email" />
                      {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+1 (555) 000-0000" {...register("phone")} data-testid="input-phone" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="City, State" {...register("location")} data-testid="input-location" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="currentRole">Current Role (Optional)</Label>
                      <Input id="currentRole" placeholder="e.g. Senior Software Engineer" {...register("currentRole")} data-testid="input-current-role" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Experience */}
              {currentStep === 1 && (
                <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="workExperience">Work Experience *</Label>
                    <Textarea id="workExperience" placeholder="Paste your resume work history or describe your past roles..." className={`min-h-[150px] font-mono text-sm ${errors.workExperience ? "border-destructive" : ""}`} {...register("workExperience")} data-testid="input-work-experience" />
                    <p className="text-xs text-muted-foreground">Tip: Copy-paste directly from your LinkedIn or old resume.</p>
                    {errors.workExperience && <p className="text-xs text-destructive">{errors.workExperience.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">Education *</Label>
                    <Textarea id="education" placeholder="Degrees, universities, graduation years..." className={`min-h-[100px] font-mono text-sm ${errors.education ? "border-destructive" : ""}`} {...register("education")} data-testid="input-education" />
                    {errors.education && <p className="text-xs text-destructive">{errors.education.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills *</Label>
                    <Textarea id="skills" placeholder="List your technical and soft skills..." className={`min-h-[100px] font-mono text-sm ${errors.skills ? "border-destructive" : ""}`} {...register("skills")} data-testid="input-skills" />
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

              {/* Step 3: Target Job */}
              {currentStep === 2 && (
                <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                    <div className="flex gap-3">
                      <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">AI Optimization Target</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Paste the exact job description. The AI will tailor your resume keywords to match this specific role.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetJobTitle">Target Job Title *</Label>
                    <Input id="targetJobTitle" placeholder="e.g. Product Manager" className={errors.targetJobTitle ? "border-destructive" : ""} {...register("targetJobTitle")} data-testid="input-job-title" />
                    {errors.targetJobTitle && <p className="text-xs text-destructive">{errors.targetJobTitle.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobDescription">Job Description *</Label>
                    <Textarea id="jobDescription" placeholder="Paste the full job description here..." className={`min-h-[200px] font-mono text-sm ${errors.jobDescription ? "border-destructive" : ""}`} {...register("jobDescription")} data-testid="input-job-description" />
                    {errors.jobDescription && <p className="text-xs text-destructive">{errors.jobDescription.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="extraInstructions">Extra Instructions (Optional)</Label>
                    <Textarea id="extraInstructions" placeholder="e.g. Focus on my leadership experience, keep it to one page..." className="min-h-[80px]" {...register("extraInstructions")} />
                  </div>
                </motion.div>
              )}

              {/* Step 4: Design */}
              {currentStep === 3 && (
                <motion.div key="step4" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-7">
                  {/* Selected Template Preview */}
                  {selectedTemplate && (
                    <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground flex-shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{selectedTemplate.profession}</p>
                        <p className="text-xs text-muted-foreground capitalize">{selectedTemplate.layout.replace(/-/g, " ")} · {selectedTemplate.category}</p>
                      </div>
                      <Link href="/templates">
                        <Button type="button" variant="outline" size="sm">
                          <LayoutTemplate className="w-3 h-3 mr-1" />
                          Browse 500+
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Template Search & Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold">Choose Template</h3>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{templates.length}+ templates</span>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search by profession..."
                        value={templateSearch}
                        onChange={(e) => setTemplateSearch(e.target.value)}
                        className="pl-8 text-sm h-8"
                        data-testid="input-template-search"
                      />
                      {templateSearch && (
                        <button onClick={() => setTemplateSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex gap-1.5 flex-wrap">
                      {categories.slice(0, 8).map((cat) => (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setTemplateCategory(cat)}
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all",
                            templateCategory === cat
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border text-muted-foreground hover:border-primary"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Template Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1 -mr-1">
                    {filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setValue("templateId", template.id)}
                        className={cn(
                          "cursor-pointer rounded-lg border-2 overflow-hidden hover:border-primary transition-all",
                          currentTemplateId === template.id ? "border-primary ring-2 ring-primary/20" : "border-border"
                        )}
                        data-testid={`select-template-${template.id}`}
                      >
                        <div className="relative bg-gray-50">
                          <TemplateThumbnail layout={template.layout} theme={currentTheme} name={template.profession} />
                          {currentTemplateId === template.id && (
                            <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground rounded-full p-0.5">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 border-t bg-white">
                          <p className="text-[10px] font-semibold text-foreground truncate">{template.profession}</p>
                          <p className="text-[9px] text-muted-foreground capitalize">{template.layout.replace(/-/g, " ")}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Color Theme */}
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold">Accent Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {colorThemes.map((theme) => (
                        <button
                          type="button"
                          key={theme.id}
                          onClick={() => setValue("colorTheme", theme.id)}
                          title={theme.name}
                          className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border-2",
                            currentColorTheme === theme.id ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "border-transparent"
                          )}
                          style={{ backgroundColor: theme.hex }}
                          data-testid={`select-color-${theme.id}`}
                        >
                          {currentColorTheme === theme.id && <Check className="w-4 h-4 text-white drop-shadow" />}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Selected: {currentTheme.name}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between pt-8 mt-6 border-t">
              <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0 || isPending} className="w-28">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep} className="w-28">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isPending} className="w-52 bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 shadow-lg shadow-primary/25">
                  {isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" />Generate Resume</>
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
