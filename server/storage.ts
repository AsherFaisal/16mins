import { userSettings, sessions, type UserSettings, type InsertUserSettings, type Session, type InsertSession } from "@shared/schema";

export interface IStorage {
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings>;
  createSession(session: InsertSession): Promise<Session>;
  getUserSessions(userId: string): Promise<Session[]>;
}

export class MemStorage implements IStorage {
  private userSettings: Map<string, UserSettings>;
  private sessions: Map<number, Session>;
  private currentSettingsId: number;
  private currentSessionId: number;

  constructor() {
    this.userSettings = new Map();
    this.sessions = new Map();
    this.currentSettingsId = 1;
    this.currentSessionId = 1;
  }

  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(
      (settings) => settings.userId === userId
    );
  }

  async createUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const id = this.currentSettingsId++;
    const settings: UserSettings = {
      ...insertSettings,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userSettings.set(id, settings);
    return settings;
  }

  async updateUserSettings(userId: string, updates: Partial<InsertUserSettings>): Promise<UserSettings> {
    const existing = await this.getUserSettings(userId);
    if (!existing) {
      throw new Error("User settings not found");
    }
    
    const updated: UserSettings = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.userSettings.set(existing.id, updated);
    return updated;
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.currentSessionId++;
    const session: Session = {
      ...insertSession,
      id,
      completedAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.userId === userId
    );
  }
}

export const storage = new MemStorage();
