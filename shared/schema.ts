import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  currentRole: text("current_role"),
  workExperience: text("work_experience").notNull(), 
  skills: text("skills").notNull(),
  education: text("education").notNull(),
  projects: text("projects"),
  certifications: text("certifications"),
  
  // Target
  targetJobTitle: text("target_job_title").notNull(),
  jobDescription: text("job_description").notNull(),
  extraInstructions: text("extra_instructions"),
  
  // Profile Photo (base64 data URL)
  profilePhoto: text("profile_photo"),

  // Design Preference
  templateId: text("template_id").default("modern"),
  colorTheme: text("color_theme").default("blue"),

  // Generated Content
  generatedResume: text("generated_resume"),
  generatedCoverLetter: text("generated_cover_letter"),
  atsScore: integer("ats_score"),
  improvementSuggestions: jsonb("improvement_suggestions"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({ 
  id: true, 
  createdAt: true,
  generatedResume: true,
  generatedCoverLetter: true,
  atsScore: true,
  improvementSuggestions: true
});

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

export type GenerateResumeRequest = InsertResume;

export interface AtsAnalysis {
  score: number;
  missingKeywords: string[];
  suggestions: string[];
}
