export interface Polar {
  radius: number
  phi: number
}

export function toPolar(x: number, y: number, cx = 0, cy = 0): Polar {
  const rx = x - cx
  const ry = y - cy
  const radius = Math.sqrt(rx * rx + ry * ry)
  const phi = Math.atan2(ry, rx)
  return { radius, phi }
}

export function fromPolar(polar: Polar, cx = 0, cy = 0): [number, number] {
  return [polar.radius * Math.cos(polar.phi) + cx, polar.radius * Math.sin(polar.phi) + cy]
}
