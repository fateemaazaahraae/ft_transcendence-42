function createStars(count) {
    var container = document.getElementById("stars");
    if (!container)
        return;
    for (var i = 0; i < count; i++) {
        var star = document.createElement("div");
        star.classList.add("star");
        // Random position
        var x = Math.random() * window.innerWidth;
        var y = Math.random() * window.innerHeight;
        // Very small size
        var size = Math.random() + 0.3; // 0.5px to 1.5px
        star.style.width = "".concat(size, "px");
        star.style.height = "".concat(size, "px");
        // Position
        star.style.left = "".concat(x, "px");
        star.style.top = "".concat(y, "px");
        // Twinkle + drift animation
        star.style.animation = "\n      twinkle ".concat(Math.random() * 5 + 5, "s infinite,\n      drift ").concat(Math.random() * 20 + 10, "s linear infinite\n    ");
        // Random drift direction
        star.style.setProperty("--drift-x", "".concat(Math.random() * 50 - 25, "px"));
        star.style.setProperty("--drift-y", "".concat(Math.random() * 50 - 25, "px"));
        container.appendChild(star);
    }
}
// Add twinkle + drift animation
var style = document.createElement("style");
style.innerHTML = "\n  .star {\n    position: absolute;\n    background: white;\n    border-radius: 50%;\n  }\n\n  @keyframes twinkle {\n    0%, 100% { opacity: 1; }\n    50% { opacity: 0.3; }\n  }\n\n  @keyframes drift {\n    0% { transform: translate(0, 0); }\n    50% { transform: translate(var(--drift-x), var(--drift-y)); }\n    100% { transform: translate(0, 0); }\n  }\n";
document.head.appendChild(style);
// Generate 200 stars
createStars(200);
