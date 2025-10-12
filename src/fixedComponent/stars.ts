function createStars(count: number) {
  const container = document.getElementById("stars");
  if (!container) return;

  container.innerHTML = "";

  // Make sure stars cover entire scrollable area
  const height = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    window.innerHeight
  );
  const width = Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    window.innerWidth
  );

  container.style.height = `${height}px`;
  container.style.width = `${width}px`;

  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    const x = Math.random() * width;
    const y = Math.random() * height;

    const size = Math.random() * 2 + 0.5;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;

    const twinkleDuration = Math.random() * 2 + 1;
    const driftDuration = Math.random() * 5 + 3;
    star.style.animation = `
      twinkle ${twinkleDuration}s infinite,
      drift ${driftDuration}s linear infinite
    `;
    star.style.setProperty("--drift-x", `${Math.random() * 50 - 25}px`);
    star.style.setProperty("--drift-y", `${Math.random() * 50 - 25}px`);

    container.appendChild(star);
  }
}

// CSS animations
const style = document.createElement("style");
style.innerHTML = `
  .star {
    position: absolute;
    background: white;
    border-radius: 50%;
    pointer-events: none;
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

// Initialize
createStars(300);

// Update on resize or scroll height change
window.addEventListener("resize", () => createStars(300));
window.addEventListener("scroll", () => {
  const stars = document.getElementById("stars");
  if (stars && parseInt(stars.style.height) < document.body.scrollHeight)
    createStars(300);
});
