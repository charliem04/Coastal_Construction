/** The before-and-after slider's position after a key press, 0 to 100. */
export function sliderKey(value: number, key: string): number {
  if (key === "Home") return 0;
  if (key === "End") return 100;
  if (key === "ArrowLeft") return Math.max(0, value - 5);
  if (key === "ArrowRight") return Math.min(100, value + 5);
  return value;
}
