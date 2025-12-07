import Fastify from "fastify";
import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";

const fastify = Fastify({ logger: true });

// --- 1 Setup SQLite ---
const dbFile = path.join(__dirname, "contacts.db");
const dbExists = fs.existsSync(dbFile);
const db = new sqlite3.Database(dbFile);

if (!dbExists) {
  db.serialize(() => {
    db.run(`CREATE TABLE contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      avatar TEXT,
      online INTEGER,
      lastMessage TEXT
    )`);

    db.run(`INSERT INTO contacts (name, avatar, online, lastMessage)
            VALUES ('Bouchra', 'green-girl.svg', 1, 'Hey, how are you?'),
                   ('Salma', 'white-boy.svg', 0, 'Let''s meet tomorrow'),
                   ('Ali', 'white-boy.svg', 1, 'See you soon!')`);
  });
}

// --- 2 API endpoint ---
fastify.get("/contacts", async (request, reply) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM contacts", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

// --- 3 Serve HTML frontend ---
fastify.get("/", async (request, reply) => {
  reply.type("text/html").send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Chat Test</title>
      <style>
        body { background: #111; color: #fff; font-family: sans-serif; }
        .contact-item { cursor: pointer; padding: 5px; margin: 3px; border: 1px solid #444; }
        .contact-item:hover { background: #222; }
      </style>
    </head>
    <body>
      <h1>Chat Contacts</h1>
      <input type="text" id="search" placeholder="Search contacts..." />
      <div id="contacts"></div>

      <div id="chatWindow" style="margin-top:20px; display:none;">
        <h2 id="chatTitle"></h2>
        <div id="messages"></div>
      </div>

      <script>
        async function loadContacts() {
          const res = await fetch('/contacts');
          const contacts = await res.json();
          const container = document.getElementById('contacts');
          container.innerHTML = '';
          contacts.forEach(c => {
            const div = document.createElement('div');
            div.className = 'contact-item';
            div.dataset.id = c.id;
            div.textContent = c.name + (c.online ? ' 🟢' : ' 🔴');
            div.addEventListener('click', () => openChat(c));
            container.appendChild(div);
          });
        }

        function openChat(contact) {
          document.getElementById('chatWindow').style.display = 'block';
          document.getElementById('chatTitle').textContent = contact.name;
          document.getElementById('messages').innerHTML = contact.lastMessage;
        }

        document.getElementById('search').addEventListener('input', (e) => {
          const val = e.target.value.toLowerCase();
          document.querySelectorAll('.contact-item').forEach(item => {
            item.style.display = item.textContent.toLowerCase().includes(val) ? 'block' : 'none';
          });
        });

        loadContacts();
      </script>
    </body>
    </html>
  `);
});

// --- 4 Start server ---
fastify.listen({ port: 4000 }).then(() => {
  console.log("Server running at http://localhost:4000");
});
