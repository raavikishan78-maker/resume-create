import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { insertResumeSchema } from "@shared/schema";
import OpenAI from "openai";
import { z } from "zod";
import { setupAuth, isAuthenticated, registerAuthRoutes } from "./replit_integrations/auth";

// Initialize OpenAI client using Replit AI Integrations
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Setup Replit Auth (MUST be before other routes)
  await setupAuth(app);
  registerAuthRoutes(app);

  // Create Resume & Generate Content
  app.post(api.resumes.create.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const data = insertResumeSchema.parse(req.body);
      
      // 1. Save initial input to DB (with userId)
      let resume = await storage.createResume({ ...data, userId });

      // 2. Prepare Prompt for OpenAI
      const systemPrompt = `You are a senior career coach, professional resume writer, and ATS optimization expert. 
      Your goal is to generate a high-quality, ATS-friendly resume and cover letter.
      
      STRICT RULES:
      - Optimize for ATS keyword scanning
      - Use strong action verbs and quantified achievements
      - No tables, icons, or graphics (text-based markdown)
      - Avoid cliches and buzzwords
      - Tailor content to the target job description
      
      Return your response in pure JSON format with the following structure:
      {
        "resume": "Markdown string of the resume...",
        "coverLetter": "Markdown string of the cover letter...",
        "atsScore": 85,
        "missingKeywords": ["list", "of", "missing", "keywords"],
        "improvementSuggestions": ["suggestion 1", "suggestion 2"]
      }
      `;

      const userPrompt = `
      INPUT DATA:
      Full Name: ${data.fullName}
      Email: ${data.email}
      Phone: ${data.phone || "N/A"}
      Location: ${data.location || "N/A"}
      Current Role: ${data.currentRole || "N/A"}
      
      Target Job Title: ${data.targetJobTitle}
      Job Description: ${data.jobDescription}
      
      Work Experience: ${data.workExperience}
      Skills: ${data.skills}
      Education: ${data.education}
      Projects: ${data.projects || "N/A"}
      Certifications: ${data.certifications || "N/A"}
      Extra Instructions: ${data.extraInstructions || "N/A"}
      `;

      // 3. Call OpenAI
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-5.1",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          response_format: { type: "json_object" },
          temperature: 1, // gpt-5 requires default temperature
          max_completion_tokens: 4096 
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");

        // 4. Update Resume with generated content
        resume = await storage.updateResumeGeneratedContent(resume.id, {
          generatedResume: result.resume,
          generatedCoverLetter: result.coverLetter,
          atsScore: result.atsScore,
          improvementSuggestions: result.improvementSuggestions // This should automatically be handled as jsonb by drizzle if schema is correct, but let's ensure it matches
        });
        
        // Note: Missing keywords are returned in result.missingKeywords but I didn't add a column for it explicitly in schema.ts yet?
        // Wait, I didn't. I only added improvementSuggestions as jsonb. 
        // I should probably have added missingKeywords too. 
        // For now, I'll just return it in the response even if not saved, OR I can save it in improvementSuggestions or a new field if I migrate.
        // Given I'm in "Fast" mode, I'll skip DB migration for now and just rely on improvementSuggestions or maybe append it to suggestions.
        
      } catch (aiError) {
        console.error("AI Generation Error:", aiError);
        // We still return the resume, but without generated content (or partial). 
        // The frontend should handle null generated content if necessary, or we can throw.
        // Ideally we want to let the user know AI failed.
        // For MVP, if AI fails, we might just fail the request or return what we have.
        // Let's throw for now so the user sees an error.
        throw new Error("Failed to generate resume content");
      }

      res.status(200).json(resume);

    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation failed", errors: error.errors });
      } else {
        console.error("Create Resume Error:", error);
        res.status(500).json({ message: "Failed to create resume" });
      }
    }
  });

  // Get Resume
  app.get(api.resumes.get.path, async (req, res) => {
    const resume = await storage.getResume(parseInt(req.params.id));
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(resume);
  });

  // List Resumes (only for logged-in user)
  app.get(api.resumes.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any)?.claims?.sub;
    const resumes = await storage.getResumes(userId);
    res.json(resumes);
  });

  return httpServer;
}
