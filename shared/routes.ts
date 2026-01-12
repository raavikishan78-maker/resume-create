import { z } from "zod";
import { insertResumeSchema, resumes } from "./schema";

export const api = {
  resumes: {
    create: {
      method: "POST" as const,
      path: "/api/resumes",
      input: insertResumeSchema,
      responses: {
        200: z.custom<typeof resumes.$inferSelect>(), // Returns the updated resume object with generated content
        400: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/resumes",
      responses: {
        200: z.array(z.custom<typeof resumes.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/resumes/:id",
      responses: {
        200: z.custom<typeof resumes.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
  },
};

export const errorSchemas = {
  internal: z.object({ message: z.string() }),
  notFound: z.object({ message: z.string() }),
  validation: z.object({ message: z.string() }),
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
