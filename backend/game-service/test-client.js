// test-client.js
const io = require('socket.io-client');

// We simulate a logged-in user by passing an 'auth' object
const socket = io('http://localhost:3003', {
  auth: {
    token: "Salma_123" // simulating a user ID or JWT
  }
});

socket.on('connect', () => {
  console.log('✅ Connected successfully!');
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

export function HomeEventListener() {
  setTimeout(() => {
    // 1. Existing Local Game Button
    const btnPlay = document.getElementById("play-btn");
    if (btnPlay) {
      btnPlay.addEventListener("click", () => {
        console.log("play Button clicked");
        navigate("/LocalgameStyle");
      });
    }

    // 2. NEW: Remote Game Button
    const btnRemote = document.getElementById("remote-btn");
    if (btnRemote) {
      btnRemote.addEventListener("click", () => {
        console.log("Remote Play Clicked - Attempting Connection...");

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, cannot play remotely.");
          navigate("/login"); 
          return;
        }

        // 3. Connect to your Game Service (Port 3003)
        // We pass the token in the 'auth' object, just like we did in the test script
        const socket = io("http://localhost:3003", {
          auth: {
            token: token 
          }
        });

        // 4. Listen for success
        socket.on("connect", () => {
          console.log("✅ Successfully connected to Game Server! Socket ID:", socket.id);
          
          // FOR NOW: We just log success. 
          // IN NEXT STEPS: We will navigate to a 'Waiting Room' page here.
          alert("Connected to Game Server! Check console for ID.");
        });

        // 5. Listen for connection errors (like invalid token)
        socket.on("connect_error", (err) => {
          console.error("❌ Connection failed:", err.message);
        });
      });
    }
  }, 100);
}
