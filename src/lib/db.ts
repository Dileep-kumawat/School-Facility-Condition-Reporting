import { MongoClient, Db } from 'mongodb';
import fs from 'fs';
import path from 'path';
import dns from 'dns';
import { User, Issue, TimelineEvent, Notification } from '@/types';
import { getSeedData } from './seedData';

// Override default DNS servers if MONGODB_URI is provided
// to prevent querySrv ECONNREFUSED errors on some local router/DNS setups
if (process.env.MONGODB_URI) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {
    console.warn('Failed to set custom DNS servers for MongoDB connection:', err);
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'school_facilities';
const JSON_DB_DIR = path.join(process.cwd(), 'src', 'data');
const JSON_DB_PATH = path.join(JSON_DB_DIR, 'db.json');

// Interface for JSON database structure
interface JsonSchema {
  users: User[];
  issues: Issue[];
  timelines: TimelineEvent[];
  notifications: Notification[];
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Initialize JSON database if it doesn't exist
async function ensureJsonDb(): Promise<JsonSchema> {
  if (!fs.existsSync(JSON_DB_DIR)) {
    fs.mkdirSync(JSON_DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(JSON_DB_PATH)) {
    const seed = await getSeedData();
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }

  try {
    const content = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to parse db.json, resetting to seed data', error);
    const seed = await getSeedData();
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

async function writeJsonDb(data: JsonSchema): Promise<void> {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// MongoDB Connection
async function connectToMongo(): Promise<{ client: MongoClient; db: Db }> {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  // Seed MongoDB exactly once across all processes using an atomic upsert lock.
  // findOneAndUpdate with upsert returns the *previous* document (before: 'before').
  // If `value` is null, this process won the race and is the first to create the lock → seed.
  // All other processes get a non-null `value` and skip seeding.
  const lockResult = await db.collection('_meta').findOneAndUpdate(
    { _id: 'seed_lock' as unknown as import('mongodb').ObjectId },
    { $setOnInsert: { _id: 'seed_lock', seededAt: new Date() } },
    { upsert: true, returnDocument: 'before' }
  );

  if (!lockResult) {
    const seed = await getSeedData();
    await db.collection('users').insertMany(seed.users);
    await db.collection('issues').insertMany(seed.issues);
    await db.collection('timelines').insertMany(seed.timelines);
    await db.collection('notifications').insertMany(seed.notifications);
    console.log('Successfully seeded MongoDB');
  }

  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

// Generic Data Manager
export class DB {
  private static isMongo(): boolean {
    return !!MONGODB_URI;
  }

  // USERS
  static async getUsers(): Promise<User[]> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      const docs = await db.collection<User>('users').find({}).toArray();
      return docs.map(doc => {
        const { _id, ...rest } = doc;
        return rest;
      });
    } else {
      const data = await ensureJsonDb();
      return data.users;
    }
  }

  static async getUser(id: string): Promise<User | null> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      const doc = await db.collection<User>('users').findOne({ id });
      if (!doc) return null;
      const { _id, ...rest } = doc;
      return rest;
    } else {
      const data = await ensureJsonDb();
      return data.users.find(u => u.id === id) || null;
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      const doc = await db.collection<User>('users').findOne({ email: email.toLowerCase() });
      if (!doc) return null;
      const { _id, ...rest } = doc;
      return rest;
    } else {
      const data = await ensureJsonDb();
      return data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
  }

  static async addUser(user: User): Promise<void> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      await db.collection('users').insertOne(user);
    } else {
      const data = await ensureJsonDb();
      data.users.push(user);
      await writeJsonDb(data);
    }
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<void> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      await db.collection('users').updateOne({ id }, { $set: updates });
    } else {
      const data = await ensureJsonDb();
      data.users = data.users.map(u => (u.id === id ? { ...u, ...updates } : u));
      await writeJsonDb(data);
    }
  }

  // ISSUES
  static async getIssues(): Promise<Issue[]> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      const docs = await db.collection<Issue>('issues').find({}).toArray();
      return docs.map(doc => {
        const { _id, ...rest } = doc;
        return rest;
      });
    } else {
      const data = await ensureJsonDb();
      return data.issues;
    }
  }

  static async getIssue(id: string): Promise<Issue | null> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      const doc = await db.collection<Issue>('issues').findOne({ id });
      if (!doc) return null;
      const { _id, ...rest } = doc;
      return rest;
    } else {
      const data = await ensureJsonDb();
      return data.issues.find(i => i.id === id) || null;
    }
  }

  static async addIssue(issue: Issue): Promise<void> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      await db.collection('issues').insertOne(issue);
    } else {
      const data = await ensureJsonDb();
      data.issues.push(issue);
      await writeJsonDb(data);
    }
  }

  static async updateIssue(id: string, updates: Partial<Issue>): Promise<void> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      await db.collection('issues').updateOne({ id }, { $set: updates });
    } else {
      const data = await ensureJsonDb();
      data.issues = data.issues.map(i => (i.id === id ? { ...i, ...updates } : i));
      await writeJsonDb(data);
    }
  }

  static async deleteIssue(id: string): Promise<void> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      await db.collection('issues').deleteOne({ id });
      await db.collection('timelines').deleteMany({ issueId: id });
    } else {
      const data = await ensureJsonDb();
      data.issues = data.issues.filter(i => i.id !== id);
      data.timelines = data.timelines.filter(t => t.issueId !== id);
      await writeJsonDb(data);
    }
  }

  // TIMELINES
  static async getTimelines(issueId: string): Promise<TimelineEvent[]> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      const docs = await db.collection<TimelineEvent>('timelines').find({ issueId }).toArray();
      return docs.map(doc => {
        const { _id, ...rest } = doc;
        return rest;
      }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else {
      const data = await ensureJsonDb();
      return data.timelines
        .filter(t => t.issueId === issueId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  }

  static async addTimeline(event: TimelineEvent): Promise<void> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      await db.collection('timelines').insertOne(event);
    } else {
      const data = await ensureJsonDb();
      data.timelines.push(event);
      await writeJsonDb(data);
    }
  }

  // NOTIFICATIONS
  static async getNotifications(userId: string): Promise<Notification[]> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      const docs = await db.collection<Notification>('notifications').find({ userId }).toArray();
      return docs.map(doc => {
        const { _id, ...rest } = doc;
        return rest;
      }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      const data = await ensureJsonDb();
      return data.notifications
        .filter(n => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  static async addNotification(notification: Notification): Promise<void> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      await db.collection('notifications').insertOne(notification);
    } else {
      const data = await ensureJsonDb();
      data.notifications.push(notification);
      await writeJsonDb(data);
    }
  }

  static async markNotificationAsRead(id: string): Promise<void> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      await db.collection('notifications').updateOne({ id }, { $set: { read: true } });
    } else {
      const data = await ensureJsonDb();
      data.notifications = data.notifications.map(n => (n.id === id ? { ...n, read: true } : n));
      await writeJsonDb(data);
    }
  }

  static async markAllNotificationsAsRead(userId: string): Promise<void> {
    if (this.isMongo()) {
      const { db } = await connectToMongo();
      await db.collection('notifications').updateMany({ userId }, { $set: { read: true } });
    } else {
      const data = await ensureJsonDb();
      data.notifications = data.notifications.map(n => (n.userId === userId ? { ...n, read: true } : n));
      await writeJsonDb(data);
    }
  }
}
