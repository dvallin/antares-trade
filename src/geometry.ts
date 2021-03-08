export function distSquared(x: number, y: number, cx: number, cy: number): number {
  const dx = x - cx
  const dy = y - cy
  return dx * dx + dy * dy
}
export function dist(x: number, y: number, cx: number, cy: number): number {
  return Math.sqrt(distSquared(x, y, cx, cy))
}
