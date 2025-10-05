
function createStars(count: number) {
  const container = document.getElementById("stars");
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    // Random position
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    // Very small size
    const size = Math.random() + 0.3; // 0.5px to 1.5px
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    // Position
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;

    // Twinkle + drift animation
    star.style.animation = `
      twinkle ${Math.random() * 5 + 5}s infinite,
      drift ${Math.random() * 20 + 10}s linear infinite
    `;

    // Random drift direction
    star.style.setProperty("--drift-x", `${Math.random() * 50 - 25}px`);
    star.style.setProperty("--drift-y", `${Math.random() * 50 - 25}px`);

    container.appendChild(star);
  }
}

// Add twinkle + drift animation
const style = document.createElement("style");
style.innerHTML = `
  .star {
    position: absolute;
    background: white;
    border-radius: 50%;
  }

  @keyframes twinkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @keyframes drift {
    0% { transform: translate(0, 0); }
    50% { transform: translate(var(--drift-x), var(--drift-y)); }
    100% { transform: translate(0, 0); }
  }
`;
document.head.appendChild(style);

// Generate 200 stars
createStars(200);
