import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSettingsSchema, insertSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get user settings
  app.get("/api/settings/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const settings = await storage.getUserSettings(userId);
      
      if (!settings) {
        return res.status(404).json({ message: "Settings not found" });
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get settings" });
    }
  });

  // Create or update user settings
  app.post("/api/settings", async (req, res) => {
    try {
      const validatedData = insertUserSettingsSchema.parse(req.body);
      
      const existing = await storage.getUserSettings(validatedData.userId);
      let settings;
      
      if (existing) {
        settings = await storage.updateUserSettings(validatedData.userId, validatedData);
      } else {
        settings = await storage.createUserSettings(validatedData);
      }
      
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save settings" });
    }
  });

  // Create session
  app.post("/api/sessions", async (req, res) => {
    try {
      const validatedData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(validatedData);
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // Get user sessions
  app.get("/api/sessions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const sessions = await storage.getUserSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sessions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
