const cursor = document.getElementById("cursor") as HTMLDivElement;

document.addEventListener("mousemove", (e: MouseEvent) => {
  if (cursor) {
    cursor.style.top = `${e.clientY}px`;
    cursor.style.left = `${e.clientX}px`;
  }
});