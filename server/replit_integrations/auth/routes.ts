import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

function isAdmin(req: any): boolean {
  const userEmail = req.user?.claims?.email;
  if (!ADMIN_EMAIL) return false;
  return userEmail === ADMIN_EMAIL;
}

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin: get all users (only accessible to ADMIN_EMAIL)
  app.get("/api/admin/users", isAuthenticated, async (req: any, res) => {
    try {
      if (!isAdmin(req)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const allUsers = await authStorage.getAllUsers();
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching all users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Admin: check if current user is admin
  app.get("/api/admin/me", isAuthenticated, async (req: any, res) => {
    res.json({ isAdmin: isAdmin(req) });
  });
}
