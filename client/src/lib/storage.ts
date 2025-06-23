// client/src/lib/storage.ts

export interface Session {
    id: string;
    duration: number; // in seconds
    completedAt: number; // timestamp (ms)
  }
  
  const SESSIONS_KEY = "sessions";
  
  export const storage = {
    getSessions(): Session[] {
      const data = localStorage.getItem(SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    },
  
    createSession(session: Omit<Session, "id" | "completedAt">): Session {
      const sessions = storage.getSessions();
      const newSession: Session = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        duration: session.duration,
        completedAt: Date.now(),
      };
      sessions.push(newSession);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
      return newSession;
    },
  
    clearSessions() {
      localStorage.removeItem(SESSIONS_KEY);
    }
  };