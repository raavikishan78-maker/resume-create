import { resumes, type InsertResume, type Resume } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createResume(resume: InsertResume): Promise<Resume>;
  getResume(id: number): Promise<Resume | undefined>;
  getResumes(): Promise<Resume[]>;
  updateResumeGeneratedContent(id: number, content: Partial<Resume>): Promise<Resume>;
}

export class DatabaseStorage implements IStorage {
  async createResume(insertResume: InsertResume): Promise<Resume> {
    const [resume] = await db
      .insert(resumes)
      .values(insertResume)
      .returning();
    return resume;
  }

  async getResume(id: number): Promise<Resume | undefined> {
    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id));
    return resume;
  }

  async getResumes(): Promise<Resume[]> {
    return await db
      .select()
      .from(resumes)
      .orderBy(desc(resumes.createdAt));
  }

  async updateResumeGeneratedContent(id: number, content: Partial<Resume>): Promise<Resume> {
    const [updatedResume] = await db
      .update(resumes)
      .set(content)
      .where(eq(resumes.id, id))
      .returning();
    return updatedResume;
  }
}

export const storage = new DatabaseStorage();
