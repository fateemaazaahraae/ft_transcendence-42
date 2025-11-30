## BACKEND workflow

# What happens in authentication phase through registration form: 
👤 User fills form → 📦 Data sent to /register → 🧠 Your function runs:
    │
    ├── ✅ Check all fields are filled
    ├── ✅ Check username isn't taken  
    ├── ✅ Check email isn't registered
    ├── ✅ Check passwords match
    ├── ✅ Create user in database
    ├── ✅ Generate JWT token (like a membership card)
    └── ✅ Send success response back

 # In the part of jwt token ->
   ├── ✅ Generate JWT token (like a membership card):: how it happens: by calling the function:
      const token = fastify.jwt.sign({
        id: newuser.id,
        email: newuser.email,
        userName: newuser.userName,
      });


## In summary how the auth works : 
# 1-first create server instance *but* before Import dependencies && Routes
# 2-then configure Security && Plugins: ===> two things has been done: 
one-Allows frontend applications from any domain (origin: '*') to communicate with this server
two-Configures JSON Web Token encryption using your secret key
# 3-Register all Routes
routes are like different phone numbers for diff departements and each route contain three things: urlPath+httpMethod+FuncToExecute
# 4-Start The Server: 
    fastify.log.info(`Server listening at ${address}`)



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