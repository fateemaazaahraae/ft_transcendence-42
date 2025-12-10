# Chat Service Architecture Explanation

## Overview
This document explains how the database, friends model, and router work together to manage user friendships and display chat contacts.

---

## 1. DATABASE LAYER (`src/config/db.js`)

### Purpose
Creates and manages the SQLite database with all necessary tables.

### Tables Created

#### **friends table** (Most Important)
```javascript
CREATE TABLE IF NOT EXISTS friends(
    id TEXT PRIMARY KEY,              // Unique ID (nanoid)
    user_a TEXT NOT NULL,             // First user in friendship
    user_b TEXT NOT NULL,             // Second user in friendship
    status TEXT DEFAULT 'pending',    // 'pending' or 'accepted'
    created_at INTEGER,               // When friendship was created
    updated_at INTEGER,               // When status changed
    UNIQUE(user_a, user_b)            // Can't have duplicate friendships
);
```

**Why this design?**
- `user_a` and `user_b` are bidirectional - works regardless of who sent the request
- `status` tracks: pending (waiting to accept) or accepted (friends)
- `UNIQUE` constraint prevents duplicate entries

#### **conversations table**
```javascript
CREATE TABLE IF NOT EXISTS conversations(
    id TEXT PRIMARY KEY,
    user_a TEXT NOT NULL,
    user_b TEXT NOT NULL,
    created_at INTEGER,
    UNIQUE (user_a, user_b)
);
```
**Purpose:** Stores chat history between two users

#### **messages table**
```javascript
CREATE TABLE IF NOT EXISTS messages(
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,    // Links to conversations
    sender_id TEXT NOT NULL,          // Who sent it
    content TEXT NOT NULL,            // Message text
    created_at INTEGER
);
```
**Purpose:** Individual messages within a conversation

---

## 2. FRIENDS MODEL (`src/models/friends.js`)

### Purpose
Provides a clean interface to interact with the friends table. Uses **prepared statements** for security and performance.

### Key Functions

#### **listFriends(userId)**
```javascript
const listFriendsStmt = db.prepare(
  `SELECT * FROM friends 
   WHERE (user_a = ? OR user_b = ?) 
   AND status = 'accepted' 
   ORDER BY updated_at DESC`
);

export const listFriends = (userId) => {
  return listFriendsStmt.all(userId, userId);
}
```

**What it does:**
1. Takes a `userId` as input
2. Finds ALL rows where:
   - Either `user_a = userId` OR `user_b = userId`
   - AND `status = 'accepted'` (only confirmed friends)
3. Returns them sorted by most recently updated first

**Example Result:**
```javascript
[
  {
    id: 'abc123',
    user_a: '1',
    user_b: '2',
    status: 'accepted',
    created_at: 1702000000,
    updated_at: 1702100000
  },
  {
    id: 'def456',
    user_a: '1',
    user_b: '4',
    status: 'accepted',
    created_at: 1702050000,
    updated_at: 1702150000
  }
]
```

#### **addFriend(user_a, user_b)**
```javascript
const addFriendStmt = db.prepare(
  `INSERT OR IGNORE INTO friends 
   (id, user_a, user_b, status) 
   VALUES (?, ?, ?, 'pending')`
);

export const addFriend = (user_a, user_b) => {
  const id = nanoid();
  addFriendStmt.run(id, user_a, user_b);
  return { id, user_a, user_b, status: 'pending' };
}
```
**What it does:** Creates a friend request (status = 'pending')

#### **acceptFriend(user_a, user_b)**
```javascript
const acceptFriendStmt = db.prepare(
  `UPDATE friends 
   SET status = 'accepted', updated_at = strftime('%s','now') 
   WHERE (user_a = ? AND user_b = ?) 
   OR (user_a = ? AND user_b = ?)`
);

export const acceptFriend = (user_a, user_b) => {
  acceptFriendStmt.run(user_a, user_b, user_b, user_a);
}
```
**What it does:** Changes pending friendship to accepted
- Handles both directions: (1,2) OR (2,1)
- Updates the timestamp

---

## 3. ROUTER LAYER (`src/routes/router-simple.js`)

### Purpose
Provides API endpoints that the frontend calls. Orchestrates data from multiple sources.

### Endpoint 1: GET `/api/chats/contacts/:userId`

**Purpose:** Get all accepted friends with their latest message

**Flow:**

```
1. Frontend calls: GET /api/chats/contacts/1

2. Router receives userId = '1'

3. Step A: Get Friends
   ├─ friendsModel.listFriends('1')
   └─ Query friends table:
      SELECT * FROM friends 
      WHERE (user_a='1' OR user_b='1') AND status='accepted'
   
   Returns: [
     { id: 'abc', user_a: '1', user_b: '2', status: 'accepted' },
     { id: 'def', user_a: '1', user_b: '4', status: 'accepted' },
     { id: 'ghi', user_a: '1', user_b: '5', status: 'accepted' }
   ]

4. Step B: For Each Friend - Get Contact Details
   ├─ For friend {user_a: '1', user_b: '2'}
   │  ├─ Extract contactId = '2' (the other user)
   │  ├─ Try to fetch from auth-service: GET /api/users/2
   │  │  └─ Gets: { id: '2', userName: 'user_B', profileImage: '...', status: 'online' }
   │  └─ Fallback to local DB if auth-service fails
   │
   ├─ For friend {user_a: '1', user_b: '4'}
   │  └─ Same process...
   │
   └─ For friend {user_a: '1', user_b: '5'}
      └─ Same process...

5. Step C: Get Last Message for Each Friend
   ├─ For user 2:
   │  ├─ Find conversation: SELECT id FROM conversations 
   │  │   WHERE (user_a='1' AND user_b='2') OR (user_a='2' AND user_b='1')
   │  ├─ Returns: { id: 'conv123' }
   │  └─ Get last message: SELECT content, created_at FROM messages 
   │      WHERE conversation_id='conv123' 
   │      ORDER BY created_at DESC LIMIT 1
   │      └─ Returns: { content: 'Hi user A! How are you?', created_at: 1702100000 }
   │
   └─ Repeat for users 4 and 5

6. Step D: Build Response Object
   Returns:
   [
     {
       id: '2',
       username: 'user_B',
       avatar: 'https://...',
       status: 'online',
       last_message: 'Hi user A! How are you?',
       last_message_timestamp: 1702100000,
       conversation_id: 'conv123'
     },
     {
       id: '4',
       username: 'user_D',
       avatar: 'https://...',
       status: 'online',
       last_message: 'Hey, want to play a game?',
       last_message_timestamp: 1702100050,
       conversation_id: 'conv456'
     },
     {
       id: '5',
       username: 'user_E',
       avatar: 'https://...',
       status: 'online',
       last_message: 'Hello user E!',
       last_message_timestamp: 1702100100,
       conversation_id: 'conv789'
     }
   ]

7. Frontend receives this and displays in the contacts list
```

### Endpoint 2: GET `/api/chats/search/:userId?q=query`

**Purpose:** Search for friends by username

**Flow:**

```
1. Frontend calls: GET /api/chats/search/1?q=user_B

2. Router receives userId='1', query='user_b' (lowercase)

3. Get all accepted friends
   ├─ friendsModel.listFriends('1')
   └─ Returns friends list (same as endpoint 1)

4. For Each Friend - Filter by Username
   ├─ Get user details from auth-service or DB
   ├─ Check: Does username.toLowerCase().includes('user_b')?
   │  ├─ user_B matches 'user_b' ✓ INCLUDE
   │  ├─ user_D matches 'user_b' ✗ SKIP
   │  └─ user_E matches 'user_b' ✗ SKIP
   │
   └─ Get last message for matching contacts

5. Returns:
   [
     {
       id: '2',
       username: 'user_B',
       avatar: 'https://...',
       status: 'online',
       last_message: 'Hi user A! How are you?',
       last_message_timestamp: 1702100000,
       conversation_id: 'conv123'
     }
   ]

6. Frontend displays only the matching friend
```

---

## 4. DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Browser)                       │
│  User clicks on Chat → calls /api/chats/contacts/1           │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                   ROUTER (router-simple.js)                  │
│  Receives: userId=1                                          │
│  Task: Fetch friends and their details                       │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│              FRIENDS MODEL (friends.js)                      │
│  Call: listFriends('1')                                      │
│  Query friends table for accepted friendships               │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│            DATABASE (db.js - SQLite)                         │
│                                                              │
│  SELECT * FROM friends                                       │
│  WHERE (user_a='1' OR user_b='1')                           │
│  AND status='accepted'                                       │
│                                                              │
│  Result: [                                                   │
│    {id:'abc', user_a:'1', user_b:'2', status:'accepted'},   │
│    {id:'def', user_a:'1', user_b:'4', status:'accepted'},   │
│    {id:'ghi', user_a:'1', user_b:'5', status:'accepted'}    │
│  ]                                                           │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼ (Back to Router)
┌─────────────────────────────────────────────────────────────┐
│              ROUTER (continues processing)                   │
│                                                              │
│  For each friend:                                            │
│  1. Extract contactId (the other user)                       │
│  2. Get user details from auth-service or local DB          │
│  3. Get last message from conversations + messages tables   │
│  4. Build contact object                                     │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│           FRONTEND receives JSON response                    │
│                                                              │
│  [                                                           │
│    {id:'2', username:'user_B', status:'online', ...},       │
│    {id:'4', username:'user_D', status:'online', ...},       │
│    {id:'5', username:'user_E', status:'online', ...}        │
│  ]                                                           │
│                                                              │
│  Renders contacts list in the UI                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Example Walkthrough

### Scenario: User 1 opens chat and sees contacts

**Database State:**
```
friends table:
┌────┬────────┬────────┬──────────┐
│ id │ user_a │ user_b │ status   │
├────┼────────┼────────┼──────────┤
│ a1 │ 1      │ 2      │ accepted │  ✓ User 1 ↔ User 2
│ a2 │ 1      │ 3      │ pending  │  ✗ User 1 ↔ User 3 (pending)
│ a3 │ 1      │ 4      │ accepted │  ✓ User 1 ↔ User 4
│ a4 │ 1      │ 5      │ accepted │  ✓ User 1 ↔ User 5
└────┴────────┴────────┴──────────┘

users table:
┌────┬────────┬────────┐
│ id │ userName│ status │
├────┼────────┼────────┤
│ 1  │ user_A │ online │
│ 2  │ user_B │ offline│
│ 3  │ user_C │ offline│
│ 4  │ user_D │ online │
│ 5  │ user_E │ online │
└────┴────────┴────────┘
```

**API Call:**
```
GET /api/chats/contacts/1
```

**Router Processing:**

Step 1: `friendsModel.listFriends('1')`
```javascript
// Only returns accepted friends
friends = [
  { id: 'a1', user_a: '1', user_b: '2', status: 'accepted' },
  { id: 'a3', user_a: '1', user_b: '4', status: 'accepted' },
  { id: 'a4', user_a: '1', user_b: '5', status: 'accepted' }
]
// Note: User 3 is NOT included because status='pending'
```

Step 2: For each friend, get contact details
```javascript
// Friend 1: user_a='1', user_b='2'
contactId = '2'  // The other user
userRow = { id: '2', username: 'user_B', status: 'offline', avatar: null }

// Get last message
conversation = SELECT FROM conversations WHERE (user_a='1' AND user_b='2')
lastMsg = { content: 'Hi user A! How are you?', created_at: 1702100000 }

// Build contact object
contact = {
  id: '2',
  username: 'user_B',
  avatar: null,
  status: 'offline',
  last_message: 'Hi user A! How are you?',
  last_message_timestamp: 1702100000,
  conversation_id: 'conv123'
}
```

**Frontend Response:**
```json
[
  {
    "id": "2",
    "username": "user_B",
    "avatar": null,
    "status": "offline",
    "last_message": "Hi user A! How are you?",
    "last_message_timestamp": 1702100000,
    "conversation_id": "conv123"
  },
  {
    "id": "4",
    "username": "user_D",
    "avatar": null,
    "status": "online",
    "last_message": "Hey, want to play a game?",
    "last_message_timestamp": 1702100050,
    "conversation_id": "conv456"
  },
  {
    "id": "5",
    "username": "user_E",
    "avatar": null,
    "status": "online",
    "last_message": "Hello user E!",
    "last_message_timestamp": 1702100100,
    "conversation_id": "conv789"
  }
]
```

**Frontend displays:**
```
Chat Contacts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 user_B (offline)
   "Hi user A! How are you?"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 user_D (online)
   "Hey, want to play a game?"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 user_E (online)
   "Hello user E!"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

(user_C is NOT shown because friendship is pending)
```

---

## 6. Key Concepts

### Prepared Statements
```javascript
const listFriendsStmt = db.prepare(`SELECT * FROM friends ...`);
listFriendsStmt.all(userId, userId);
```
**Why?** Security + Performance
- SQL injection protection (values are parameterized with `?`)
- Statements are compiled once, executed many times

### Bidirectional Friendships
```javascript
WHERE (user_a = ? OR user_b = ?)
```
**Why?** Friendship works both ways
- User 1 can have friend 2 as (1,2) or (2,1)
- Both directions are checked to find friends

### Status Filtering
```javascript
AND status = 'accepted'
```
**Why?** Only show confirmed friends
- `pending` = waiting for acceptance
- `accepted` = confirmed friendship
- This prevents showing pending requests in contacts list

---

## Summary

| Component | Purpose | Key Method |
|-----------|---------|-----------|
| **db.js** | Creates SQLite tables | `db.exec()` - table creation |
| **friends.js** | Queries friend relationships | `listFriends()` - get accepted friends |
| **router-simple.js** | HTTP API endpoints | `/api/chats/contacts/:userId` - get contacts with details |
| **Frontend** | Displays contacts | Calls router → renders list |

The system works by:
1. **Store** friendships in `friends` table with status
2. **Query** only accepted friendships via `friends.js`
3. **Enrich** with user details and last messages in router
4. **Return** complete contact information to frontend
5. **Display** in user interface
