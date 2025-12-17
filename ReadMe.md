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

First step add the Event Listener to the play button ofc..
then apply the Alg ccd
### Why we stopped using dcd algorithm: lmachakil li f dcd
there is two main problems: 
#### first: hight velocity: 
we'll see more of what is velocity later, and when there is a hight velocity (the object's speed is large in the game's units per second. ===> the faster the object, the further is will move during one frame) to get distance moved per frame: distance = speed * dt;
#### second: tunneling:
is when one object completly pass through another object without ever overlapping at simpled instance at a t
in arabic: 
تداخل مجسم في مجسم أو مرور واحد عبر الآخر
to fix those problems we use ccd here we'll se what it is and how it work



### What is CCD Continuous Collision Detection:

Inlike DCD Discrete Collision Detection ccd works by checking the position of the ball 
in two times the first one current position second is: curr + velocity where velocity is a 
vector that provide instruction of (to where the next position of the particule should be)
and when one of them even if the next position is crossing the second particule we call it collision
why not using DCDdiscrese collision detecetion: because sometimes we detect collision later when the previous and we have objects going in each others 
some infos about pong ccd is in: https://timallanwheeler.com/blog/2024/08/01/2d-collision-detection-and-resolution/
&& https://thecodingtrain.com/challenges/67-pong

OTHER DIFINITION in simple words: continuous collision treats motion as continuous over the frame : did objects
A and B touch at any time during the *time inerval* not *this current frame* SO CCD finds the TOI (TimeOfImpact) within the frame

## How I implement CCD Algorithm on my local game:
First it's all about treating the ball motion in the canvas on one frame as *continous* line segment from previous position P0 to new position P1
so we continously check if the ball touch the paddle between P0 and P1 if yes we seach at any time t[0,1]

note those two points x and y: 
```
P0 = (x0, y0) current ball position before this frame.

P1 = (x0 + vx * dt, y0 + vy * dt) intended new position.
```
#### why will need TOI ? the *time of impact*
good question so the fine the Y axis(interY) btw ball and paddle (after the alg ccd)we use the relation:
```
interY = prevY + (newY - prevY) * t; //<==== here we need to calculate t
```
and there is two formula of t depending on u'r calculating iterY of right paddle or left paddle: 
```
For the RIGHT paddle check:
const t = (paddleRightX - (prevX + ball.r)) / ((newX + ball.r) - (prevX + ball.r));

For the LEFT paddle ckeck:
const t = ((prevX - ball.r) - leftPlane) / ((prevX - ball.r) - (newX - ball.r) || 1);// the || 1 is because the denominator: (prevX - ball.r) - (newX - ball.r) may be negative value.

the General relation: t = (x0 + (x1 - x0) * t) + r; where t ∈ [0, 1]
```

So we saw previously that calculating the next ball position in x and y require the argument delta time (dt)
what is delta time and how it's been calculed and why using dt and not working just with pixels, because : 
Delta time makes movement independant from Fps.
So instead of   move *5 pixels* per *frame*
we change it to move *x pixels* per *second* 
and we need that very much in CCDetection

the given relation for delta time is: const dt = Math.min((now - last) / 1000, 0.04);

Ok, what that mean first delta time is the time between a frame and next frame because we now that it's not a vid it's just a bounch of frames(pictures). In the relation we have `(now - last) / 1000` it's the converted to milliseconds and `, 0,04` and this to avoid huge jumps when tab focus changes or a frame is delayed.
Why/Change:==> Delta-time movement avoids frame-rate dependent speeds (big improvement over your per-frame increments). Capping prevents the ball from teleporting huge distances after a long pause.

So dt is used in and dt = 1/fps
    const newX = ball.x + ball.vx * dt;
    const newY = ball.y + ball.vy * dt;


#### Next we'll see the concept of *velocity*, what's that?
Ok and what vx, vy (and why not moving by 4px example: newx = ball.x + 5)
Alright alright 1-vx and xy mean===> v meaning the *velocity* so the velocity is a vector(represented as arrow geometrically) that's providing instruction as to where the next position of the particule(the ball in our case) should be. Position' = Position + velocity * dt;(NextPosition = PrevPosition + velocity * dt;) *and when there is acceleration the velocity changes* (with velocity' = velocity + acceleration)
and x-> ball moving left/right y-> ball moving up/down
vx: pixels per second in x 
vy: pixels per second in y 

And to convert from per second to per frame me multiply by dt

```
horizontal and verticall velocity (geometrically represented)
          vy
          ↑
          |
          | 
     -----+----→ vx
```


### The two main objects
so besids canvas we have the ball and the paddle(right/left)
The ball have several variable defining it (caracterising it's movement) 
we have : 
const ball = {
  x: width / 2,
  y: height / 2,
  r: 10,
  vx: (Math.random() < 0.5 ? 1 : -1) * 300,
  vy: (Math.random() < 0.5 ? 1 : -1) * 200,
};
x, y: obviously starting the ball from the center of the canvas.
r : the radius of the ball
vx, vy: (Math.random() < 0.5 ? 1 : -1) for direction (it means 1 pixel up or down and going left or right) and 300px/s for horizontal initiall speed, 200px/s for vertical initiall speed (those values will slightly change during the game proccess). 
this means the ball will have fast horizontal speed and slightly slower vertical speed 

NEXT we'll go to the function: resetBall
it this function may take a bool true or false or nothing as we will see in the first implementation
and inside the ft we initialize:
1- x, y (center)
2-speed = 320 (increamented) 
3-angle: and it is defined const angle = (Math.random() - 0.5) * (Math.PI / 6); why ==> to create a small random angle btw -15° and +15° (so the movement of the ball is mostly horizontal and only a small amount is vertical) So we don't have the ball flying horizontal and it has just a little curve.
4-dir: while direction is const dir = typeof towardsRight === 'boolean' ? (towardsRight ? 1 : -1) : (Math.random() < 0.5 ? 1 : -1); If caller provided a boolean, we use it; (3la hsab chkon li rba7 katkon 3ndo la defonce) si nn randomly choosing right or left
5-vx, vy: while vx =  dir * baseSpeed * Math.cos(angle); and for vy same but without dir: vy = baseSpeed * Math.sin(angle); and also for x axis we multiply by cos(angle) and for y axis we multiply by sin(angle)


### What's better in our browser game using animate() or requestAnimationFrame(animate)??
  
When using animate();
You get:
```
infinite loop running as fast as possible

CPU goes to 100%

browser lags or freezes

animation speed depends on how fast your computer is (inconsistent)

This is NOT how animation should be done.
```
✅ Instead, with:

requestAnimationFrame(animate);

```
the browser will:

✔ call animate at the best time (usually 60 times per second)
✔ sync the drawing with the monitor refresh rate (no tearing)
✔ pause automatically when tab is not visible (saves CPU)
✔ give you now timestamp for smooth movement via dt
✔ provide stable game speed on all computers
This is what ALL modern web games use.
```


=====================
## 🎮 AI GAME (LOCALY done)

Okey okey so in the in part first of all we're commenting the condition where we're moving up and down keys by press and we're do
do instead 3 things: 
#### first: Find where the paddle should move
my function called : predictBallY()
```
    function predictBallY(): number | null {
    if (ball.vx <= 1) return null; // small threshold to avoid division by zero / near-zero

    const timeToReachPaddle = (paddleRightX - ball.x) / ball.vx;
    if (timeToReachPaddle <= 0) return null; // either already past or moving away

    return ball.y + ball.vy * timeToReachPaddle;
    }

Ok I'll explain so when the func returns null means do not move the paddle it's either the ball moving towards the human player or the ai paddle already touches the ball OR the func returns a valid number is where the ball will be and where the paddle y axis the ai should move to
```
#### second: Find where the paddle should move
How I did that 
```
by calculating the diff btw the paddle should be(value returned by the ft) and where currently is: 
    const targetCenterY = predictedY - paddleHeight / 2;
    const diff = targetCenterY - paddleRightY;
If:

    diff > 0: paddle is too high → needs to move DOWN
    diff < 0: paddle is too low → needs to move UP
```
#### last: move toward the goal y position smoothly
```
So here there is two senarios eather 1- where the ball should be is very close to where it is so we keep that position and not move the paddle: 
const deadzone = 5; // pixels
if (Math.abs(diff) <= deadzone) {
    paddleRightY = targetCenterY;
}

Or 2-the paddle is away from where it should be and here we will calculate if we should move up or down by seeing if the diff pos or neg
const move = Math.sign(diff) * PaddleSpeed * speedFactor * dt;
the formula : Math.sign(diff) returns -1 or +1: 
+1 → move down
-1 → move up
and PaddleSpeed * speedFactor * dt: gives how many pixels to move this frame
```
finally here is a small line 
paddleRightY = Math.max(0, Math.min(height - paddleHeight, paddleRightY));
just to ensure that the Ai paddle's doesn't leave the screen


# 🎮 REMOTE GAME PART 🎮
==================================================

## Before any thing I want to go over why using multiple servers(microservices)

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

APIs vs Microservices (How different are they?) down here a good resource:
-https://youtu.be/zVdcxuM1LEo?si=iMxPiUcOs-K3Ucnz

### Soo WHY we need another server for the game:aka (Microservices)
***
#### ANSWER: A frontend (static or SSR) server handles HTTP requests and serves pages/assets, while a game server handles real-time, low-latency state, persistent connections (WebSockets), authoritative game state, and game logic. Splitting them improves performance, reliability, security, and scalability.
***
```
[Clients (browsers)]
   ├─ HTTP(S) ──> [Frontend Server / CDN]  (static files, REST APIs for profile, leaderboard)
   └─ WebSocket -> [Game Gateway / Matchmaker] -> [Game Server(s)]
                                        └─ Redis pub/sub (optional, for multi-instance sync)
                                        └─ Database (Postgres) for persistence
```


                ===================
now let's comfortably go through the steps I follow to make this remote game playable 💪🔥

## First creat server instance:
Ok done but why
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

## Second Read about *Websocket* and *socket.io* 
### Here is a good reference from the official socket.io documentation:--> https://socket.io/docs

** What socket.io is:
Socket.IO is a library that enables low-latency, bidirectional and event-based communication between a client and a server.

The Socket.IO connection can be established with different low-level transports:

HTTP long-polling
WebSocket
WebTransport

Socket.IO will automatically pick the best available option, depending on:

the capabilities of the browser (see here and here)
the network (some networks block WebSocket and/or WebTransport connections)

## third: Now we'll see the steps until I have the front pong table game running 🔥 (we'll go through the process from clicking the button creating server and more)

#### first I installed the socket.io in the frontend the use the emet and event listeners
#### and then I call it in the backend

#### then: I found out that I should add event listener to the button that's taking me to the remote game
how I did that: 
* check if user has JWT // That means the user is registered and has an account
* if yes pass to Creates a WebSocket connection to my game server 3003
* and sends the JWT token as part of handshake
* then The token is sent automatically in the connection request
* and When connection is successfully established I get: A unique socket.id assigned by server
#### What Happens on the Server Side:
* in the server side of the game I created a server that listen for any connection comming from the port 3003.

* check if this connection has jwt (that mean the connection is comming from my game) only Socket.IO level not via curl.

* then next I add the player to my queue: 
    ```
        socket.on('join_queue', () => {
            if (waitingQueue.find(s => s.id === socket.id)) { // if the tocken already in my array return 
                return;
            }
            // if not push it
            waitingQueue.push(socket);
    ```

* Okkk now when my *waitingQueue* will reach two players we'll create a *game* instance if not wait for second player:
    ```
    if (waitingQueue.length >= 2) {
        const player1 = waitingQueue.shift();
        const player2 = waitingQueue.shift();

        const matchId = `match_${Date.now()}`; 
        console.log(`Match found! ${player1.data.userId} vs ${player2.data.userId}`);

        // this is what is make screen switch to Game Screen yaaaay
        player1.emit('match_found', { matchId: matchId, opponentId: player2.data.userId });
        player2.emit('match_found', { matchId: matchId, opponentId: player1.data.userId });

        // GAME IS ONNN
        const game = new GameRoom(io, matchId, player1, player2);
        game.start();
        }
    else {// mazal mawslna l joj dial players
        socket.emit('waiting_for_match', { message: `Waiting for opponent... Current queue: ${waitingQueue.length}` });
    }
    ```
* lastly handle if a player disconnect.

### So a quick summary until now: 
```
I click the button "Remote Play"
        ↓
Then the ft getGameSocket(token) get called
        ↓
Create a socket object with io("localhost:3003", { auth }) // ThisIsHowTheTokenReachesTheServer
        ↓
HTTP handshake + token // kandiro wa7d lhandshake m3a lbrowser fiha token
        ↓
Server io.on("connection") // server kaytkonecta m3ana
        ↓
connect event fires // the server we listen for events like: "join_queue"
        ↓
emit join_queue // and InThe Client Li Howa Fin Kayn Lbutton Diana "home.ts"file Kansifto socket.emit('join_queue'); to call events
        ↓
Server matchmaking
        ↓
match_found
        ↓
navigate("/remote-game")

(so when ever I type socket.emit('Myevent', ...) I fire an event and when I type socket.on(('Myevent'), () => {}); I handle that event I fired).
```

### sf db mnin kanjm3o two players with there unique id from the socket and one unique Game Room we'll call the frontend game pong table


### ➡️ In this part we saw that we Creating a JavaScript object that represents a Pong game "const game"
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

### in this step I create the file GameRoom.js WHY??

So this file will be watching all the movement inside my game room (ball position, paddles position and more) so he can brodcast positions to the users in the same room 30 times each second. (so he is the one resposible for the movements and will contain the game logic prolly I will do the ccd alg same as local game)
```
    start() {
      console.log(`🎮 Game Room ${this.roomId} started!`);
      
      // update with new position 30 times each 1 second (u may think it's a lot but it is good)
      this.interval = setInterval(() => {
        this.update();     // move the object
        this.broadcast();  // and send new positions
      }, 1000 / 30); 
    }
```
### I also create the file RemoteGame.ts in the front WHY??
In this file we listen to the key press (w/s/up/down) and send those events to the server side and he will update the position and then send the new positions to the frontend hhh it's called (Server Authority) 😈

So in summary we press a key the frontend detect that and send it to the server(backend) reads what has been clicked then moves the corresponding paddle following the corresponding movement and sends back the new positions to the frontend

### Then I did what should be done 
* Draw a ball
* Make it move
* Draw paddles
* Make them move following the movement of w/s or up/down
* Handle collision

I am thinking next maybe I should apply the ccd alg like I did in local game

