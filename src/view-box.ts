import { produce } from 'immer'

export interface ViewBox {
  x: number
  y: number
  w: number
  h: number
}

export function focusViewBox(box: ViewBox, x: number, y: number): ViewBox {
  return produce(box, (d) => {
    d.x = x - d.w / 2
    d.y = y - d.h / 2
  })
}

export function zoomViewBox(box: ViewBox, delta: number, x: number, y: number, w: number, h: number, speed = 0.1): ViewBox {
  const dw = box.w * Math.sign(-delta) * speed
  const dh = box.h * Math.sign(-delta) * speed
  const dx = (dw * x) / w
  const dy = (dh * y) / h
  return {
    x: box.x + dx,
    y: box.y + dy,
    w: box.w - dw,
    h: box.h - dh,
  }
}

export function centerOfViewBox(box: ViewBox): [number, number] {
  return [box.x + box.w / 2, box.y + box.h / 2]
}

export function dragViewBox(box: ViewBox, dx: number, dy: number, speed = 0.002): ViewBox {
  return { x: box.x - dx * box.w * speed, y: box.y - dy * box.h * speed, w: box.w, h: box.h }
}
