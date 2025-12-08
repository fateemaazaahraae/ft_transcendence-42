## BACKEND workflow

# What happens in authentication phase through registration form: 
```
👤 User fills form → 📦 Data sent to /register → 🧠 Your function runs:
    │
    ├── ✅ Check all fields are filled
    ├── ✅ Check username isn't taken  
    ├── ✅ Check email isn't registered
    ├── ✅ Check passwords match
    ├── ✅ Create user in database
    ├── ✅ Generate JWT token (like a membership card)
    └── ✅ Send success response back

 # In the part of jsonwebtoken -jwk- token ->
   ├── ✅ Generate JWT token (like a membership card):: how it happens: by calling the function:
      const token = fastify.jwt.sign({
        id: newuser.id,
        email: newuser.email,
        userName: newuser.userName,
      });

```
# In summary how the auth works : 
## 1-first create server instance *but* before Import dependencies && Routes
## 2-then configure Security && Plugins: ===> two things has been done: 
one-Allows frontend applications from any domain (origin: '*') to communicate with this server
two-Configures JSON Web Token encryption using your secret key
## 3-Register all Routes
routes are like different phone numbers for diff departements and each route contain three things: urlPath+httpMethod+FuncToExecute
## 4-Start The Server: 
    fastify.log.info(`Server listening at ${address}`)

```
How things work::
FRONTEND (React)
    ↓
HTTP POST to localhost:3000/register
    ↓
EXPRESS SERVER (Port 3000)
    ↓
Routes/register.js ← Your data arrives here!
    ↓
Validation (check passwords match, email format)
    ↓
Database Check (is email/userName already taken?)
    ↓
Password Hashing (convert "myPassword123" to secure hash)
    ↓
SQLite Database ← Data gets stored permanently
    ↓
Generate Response
    ↓
Send JSON back to frontend: {message: "Success!"}
    ↓
FRONTEND receives response
```



# 🎮 LOCAL GAME PART 🎮
==================================================

First step add the Event Listener to the play button..


==================================================
## First creat server instance: 
               *********************
### WHAT `server.js` file has: 
**1️⃣ First: Importing Fastify and creating the server instance**
➡️ The server starts by importing the Fastify library and creating a server object.

---

**2️⃣ Next: The GET and POST routes — what they are used for**

- **GET `/test`**  
  `"Is the ping pong table available?"`

- **POST `/create-game`**  
  `"I want to start a ping pong match!"`

---

**3️⃣ Next: The data sent in the request body goes here**

```js
const { playerName, gameType } = request.body;
```
this one :     const gameId = Date.now();    It Create a unique id for the game, the what happens

(what happen is like : 

Player 1 can say "I'm in game #123"

Player 2 can say "I want to join game #123"

Server knows which game you're talking about

Date.now() = Current timestamp in milliseconds (like 1701469200000)

It's unique because time always moves forward!)

➡️
Next : Creating a JavaScript object that represents a Pong game "const game"
id(The unique gameId)

player1 and player2(No opponent yet)

score(Starting with:0-0)

status(Waiting for a game)

createdAT(CreatedAt)
```
Here is a visualisation:
┌───────────────────────────┐
│ PONG MATCH #1701469200000 │
├───────────────────────────┤
│ Status: WAITING           │
│ Player 1: Salma     0     │
│ Player 2: (empty)   0     │
│ Created: 2024-12-01 10:00 │
└───────────────────────────┘
```
```
➡️
returning response  success: true
                    message: 'Game created'
                    gameId&&joinUrl
```

### Soo *WHY* we need another server for the game:aka (Microservices)
***
#### ANSWER: A frontend (static or SSR) server handles HTTP requests and serves pages/assets, while a game server handles real-time, low-latency state, persistent connections (WebSockets), authoritative game state, and game logic. Splitting them improves performance, reliability, security, and scalability.
***

### Why separate servers? (Concrete reasons)

#### 1- Separation of concerns
Frontend server: serve HTML/CSS/JS, handle non-real-time REST endpoints, static assets.
Game server: run game loop, manage real-time connections, authoritative physics/state, match logic.
#### 2- Different protocols and performance needs
HTTP(S) is request/response and stateless → great for login, fetching data, loading the app.
WebSockets (or WebRTC) keep persistent connections → required for low-latency multiplayer updates (positions, inputs).
#### 3- Scaling independently
If many players join games, only game servers need more resources. If many visitors browse pages, only frontend/CDN needs scaling.
#### 4- Authoritative game logic & fairness
Keeping game rules on the server prevents cheating. Clients send inputs; server computes and broadcasts state.
#### 5- Fault isolation & maintenance
Deploying or restarting the frontend won’t kick players out of games if the game server is separate (and vice versa).
#### 6- Security
The game server can be put behind more strict rules and only expose sockets. Sensitive operations (matchmaking, anti-cheat) stay isolated.
#### 7- Easier testing & development
You can run and test the game server locally without rebuilding frontend assets, and mock HTTP endpoints independently.

```
[Clients (browsers)]
   ├─ HTTP(S) ──> [Frontend Server / CDN]  (static files, REST APIs for profile, leaderboard)
   └─ WebSocket -> [Game Gateway / Matchmaker] -> [Game Server(s)]
                                        └─ Redis pub/sub (optional, for multi-instance sync)
                                        └─ Database (Postgres) for persistence
```

### APIs vs Microservices (How different are they?) down here a good resource
https://youtu.be/zVdcxuM1LEo?si=iMxPiUcOs-K3Ucnz

                ===================
