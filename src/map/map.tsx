import { h } from 'preact'
import { isBand, StarSystem } from '../star-system'
import { collectEntities } from '../dynamics'
import { moveSelectedShip, selectEntity, setViewBox } from './state'
import { useApplicationState } from '../state'
import { useRef, useState } from 'preact/hooks'

export const RingSvg = (props: { innerRadius: number; outerRadius: number; cx: number; cy: number }) => (
  <path
    className="belt"
    fill="url(#asteroids)"
    stroke="black"
    d={`
M ${props.cx}, ${props.cy} 
m 0 -${props.outerRadius}
a ${props.outerRadius} ${props.outerRadius} 0 1 0 1 0
z
m -1 ${props.outerRadius - props.innerRadius}    
a ${props.innerRadius} ${props.innerRadius} 0 1 1 -1 0     
Z`}
    vectorEffect="non-scaling-stroke"
  />
)

export const StarSystemSvg = (props: { system: StarSystem; cx: number; cy: number }) => {
  const [state] = useApplicationState()
  return (
    <g>
      {Object.entries(props.system).map(([id, part]) => {
        if (isBand(part)) {
          return (
            <g id={id}>
              <RingSvg innerRadius={part.innerRadius} outerRadius={part.outerRadius} cx={props.cx} cy={props.cy} />
            </g>
          )
        } else {
          const p = state.dynamics.positions[id]
          return (
            <g id={id}>
              <circle
                key="orbit"
                cx={props.cx}
                cy={props.cy}
                r={part.radius}
                stroke="black"
                strokeWidth="1"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
              {part.sub && <StarSystemSvg system={part.sub} cx={p.x} cy={p.y} />}
            </g>
          )
        }
      })}
    </g>
  )
}

export const ObjectsSvg = () => {
  const [state, mutate] = useApplicationState()
  const entities = collectEntities(state, state.starSystems.currentSystem)
  return (
    <g>
      {entities.map((id) => {
        const p = state.dynamics.positions[id]
        const body = state.bodies.bodies[id]
        return (
          <g key={id} id={id}>
            <circle
              cx={p.x}
              cy={p.y}
              r={body.radius}
              stroke="black"
              strokeWidth={id === state.map.selected ? 2 : 1}
              fill="white"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={body.radius * 1.5}
              onClick={(e) => {
                if (state.map.state === undefined) {
                  e.stopPropagation()
                  mutate(selectEntity(id))
                } else if (state.map.subState === 'select_dockable_location') {
                  const selected = state.map.selected
                  if (selected !== undefined && id !== selected) {
                    e.stopPropagation()
                    mutate(moveSelectedShip(selected, id, state.ships.specs[selected].speed))
                  }
                }
              }}
              fill="none"
              stroke="none"
              pointerEvents="visible"
            />
          </g>
        )
      })}
    </g>
  )
}

export default () => {
  const [state, mutate] = useApplicationState()
  const [drag, setDrag] = useState(false)

  const svg = useRef<SVGSVGElement>(null)
  const box = state.map.viewBox

  const viewScaleX = box.w / 800
  const viewScaleY = box.h / 800
  return (
    <svg
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      ref={svg}
      onWheel={(e) => {
        e.preventDefault()
        const dw = box.w * Math.sign(e.deltaY) * 0.05
        const dh = box.h * Math.sign(e.deltaY) * 0.05
        const dx = (dw * e.offsetX) / svg.current.clientWidth
        const dy = (dh * e.offsetY) / svg.current.clientHeight
        mutate(
          setViewBox({
            x: box.x + dx,
            y: box.y + dy,
            w: box.w - dw,
            h: box.h - dh,
          })
        )
      }}
      onClick={(e) => {
        if (state.map.subState !== undefined && state.map.subState === 'select_navigable_location') {
          const pt = svg.current.createSVGPoint()
          pt.x = e.x
          pt.y = e.y
          const target = pt.matrixTransform(svg.current.getScreenCTM()?.inverse())
          const selected = state.map.selected
          if (selected !== undefined) {
            mutate(
              moveSelectedShip(
                selected,
                {
                  system: state.starSystems.currentSystem,
                  x: target.x,
                  y: target.y,
                },
                state.ships.specs[selected].speed
              )
            )
          }
        }
      }}
      onMouseDown={() => setDrag(true)}
      onMouseUp={() => setDrag(false)}
      onMouseLeave={() => setDrag(false)}
      onMouseMove={(e) => {
        const dx = e.movementX * (box.w / 800)
        const dy = e.movementY * (box.h / 800)
        if (drag) {
          mutate(setViewBox({ x: box.x - dx, y: box.y - dy, w: box.w, h: box.h }))
        }
      }}
    >
      <pattern id="asteroids" x="0" y="0" width={10 * viewScaleX} height={10 * viewScaleY} patternUnits="userSpaceOnUse">
        <rect x={6 * viewScaleX} y={-5 * viewScaleY} width={2 * viewScaleX} height={2 * viewScaleY} transform="rotate(45)" />
      </pattern>
      <g>
        <StarSystemSvg system={state.starSystems.systems[state.starSystems.currentSystem]} cx={0} cy={0} />
        <ObjectsSvg />
      </g>
    </svg>
  )
}
