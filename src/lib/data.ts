import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "prisma", "dev.db");
// Ensure the parent directory exists before opening the database
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

const db = new Database(DB_PATH);

const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS category (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);
CREATE TABLE IF NOT EXISTS meeting (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS meeting_category (
  id TEXT PRIMARY KEY,
  meeting_id TEXT NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES category(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS participant (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  meeting_id TEXT NOT NULL REFERENCES meeting(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS action_item (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  assignee TEXT NOT NULL,
  due_date TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  priority TEXT NOT NULL DEFAULT 'medium',
  meeting_id TEXT NOT NULL REFERENCES meeting(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS decision (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  context TEXT,
  meeting_id TEXT NOT NULL REFERENCES meeting(id) ON DELETE CASCADE
);
`;

type CategoryRow = { id: string; name: string; description?: string };
type ParticipantRow = { id: string; name: string; role: string; department?: string; meeting_id: string };
type ActionItemRow = { id: string; description: string; assignee: string; due_date: string; completed: number; priority: string; meeting_id: string };
type DecisionRow = { id: string; description: string; context?: string; meeting_id: string };
type MeetingRow = { id: string; title: string; description?: string; created_at: string; updated_at: string };

db.exec(CREATE_TABLES);

function insertCategory(db: Database.Database, row: CategoryRow) {
  db.prepare("INSERT OR IGNORE INTO category (id, name, description) VALUES (?, ?, ?)").run(row.id, row.name, row.description ?? null);
}
function insertMeeting(db: Database.Database, row: MeetingRow) {
  db.prepare("INSERT OR IGNORE INTO meeting (id, title, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)").run(row.id, row.title, row.description ?? null, row.created_at, row.updated_at);
}
function insertMeetingCategory(db: Database.Database, id: string, meetingId: string, categoryId: string) {
  db.prepare("INSERT OR IGNORE INTO meeting_category (id, meeting_id, category_id) VALUES (?, ?, ?)").run(id, meetingId, categoryId);
}
function insertParticipant(db: Database.Database, row: ParticipantRow) {
  db.prepare("INSERT OR IGNORE INTO participant (id, name, role, department, meeting_id) VALUES (?, ?, ?, ?, ?)").run(row.id, row.name, row.role, row.department ?? null, row.meeting_id);
}

function seedData(): boolean {
  const count = db.prepare("SELECT COUNT(*) AS count FROM meeting").get() as { count: number };
  if (count.count > 0) return false;

  const now = new Date().toISOString();
  insertMeeting(db, { id: "meeting-1", title: "Sprint Planning: SprintNotes MVP", description: "Align on 5-day sprint goals and priorities.", created_at: now, updated_at: now });
  insertCategory(db, { id: "cat-product", name: "Product", description: "Product planning" });
  insertCategory(db, { id: "cat-backend", name: "Backend", description: "Backend infrastructure" });
  insertMeetingCategory(db, "mc-1", "meeting-1", "cat-product");
  insertMeetingCategory(db, "mc-2", "meeting-1", "cat-backend");
  insertParticipant(db, { id: "p-1", name: "Alex", role: "PM", department: "Product", meeting_id: "meeting-1" });
  insertParticipant(db, { id: "p-2", name: "Sam", role: "Engineer", department: "Backend", meeting_id: "meeting-1" });
  insertParticipant(db, { id: "p-3", name: "Jordan", role: "Designer", department: "UX", meeting_id: "meeting-1" });

  db.prepare("INSERT OR IGNORE INTO action_item (id, description, assignee, due_date, completed, priority, meeting_id) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "ai-1", "Prisma schema + migrate", "Sam", new Date(Date.now() + 86400000 * 2).toISOString(), 1, "high", "meeting-1"
  );
  db.prepare("INSERT OR IGNORE INTO action_item (id, description, assignee, due_date, completed, priority, meeting_id) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "ai-2", "Word + category input UI", "Jordan", new Date(Date.now() + 86400000 * 3).toISOString(), 1, "high", "meeting-1"
  );
  db.prepare("INSERT OR IGNORE INTO action_item (id, description, assignee, due_date, completed, priority, meeting_id) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "ai-3", "Success page v1", "Sam", new Date(Date.now() + 86400000 * 5).toISOString(), 0, "medium", "meeting-1"
  );
  db.prepare("INSERT OR IGNORE INTO decision (id, description, context, meeting_id) VALUES (?, ?, ?, ?)").run(
    "d-1", "Use single-page server-rendered UI for v1", "Avoid extra API routes and keep impact minimal", "meeting-1"
  );
  db.prepare("INSERT OR IGNORE INTO decision (id, description, context, meeting_id) VALUES (?, ?, ?, ?)").run(
    "d-2", "Defer serialization UX to a follow-up session", "Focus on clarity first", "meeting-1"
  );
  return true;
}

export type MeetingWithRelations = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  participant: Record<string, string>[];
  categoriesMeetingCategory: { category: { name: string } }[];
  actionItem: { description: string; assignee: string; dueDate: string; completed: boolean }[];
  decision: { description: string; context?: string }[];
};

export function getMeeting(): MeetingWithRelations {
  const meeting = db.prepare("SELECT * FROM meeting LIMIT 1").get() as MeetingRow;
  const categories = db.prepare("SELECT c.name FROM meeting_category mc JOIN category c ON c.id = mc.category_id WHERE mc.meeting_id = ?").all(meeting.id) as CategoryRow[];
  const participants = db.prepare("SELECT name, role FROM participant WHERE meeting_id = ?").all(meeting.id) as ParticipantRow[];
  const decisions = db.prepare("SELECT description, context FROM decision WHERE meeting_id = ?").all(meeting.id) as DecisionRow[];
  const actionItems = db.prepare("SELECT description, assignee, due_date, completed FROM action_item WHERE meeting_id = ?").all(meeting.id) as ActionItemRow[];

  return {
    id: meeting.id,
    title: meeting.title,
    description: meeting.description,
    createdAt: meeting.created_at,
    updatedAt: meeting.updated_at,
    participant: participants.map((p) => ({ name: p.name, role: p.role })),
    categoriesMeetingCategory: categories.map((c) => ({ category: { name: c.name } })),
    decision: decisions.map((d) => ({ description: d.description, context: d.context })),
    actionItem: actionItems.map((a) => ({ description: a.description, assignee: a.assignee, dueDate: a.due_date.slice(0, 10), completed: a.completed === 1 })),
  };
}

export async function getData(): Promise<MeetingWithRelations> {
  seedData();
  return getMeeting();
}
