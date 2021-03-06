import { h } from 'preact'
import { isBand, StarSystem } from '../star-system'
import { collectEntities } from '../dynamics'
import { moveSelectedShip, selectEntity, setViewBox } from './state'
import { useApplicationState } from '../state'
import { useRef, useState } from 'preact/hooks'
import { dragViewBox, zoomViewBox } from '../view-box'

const regularStyle: h.JSX.CSSProperties = { vectorEffect: 'non-scaling-stroke', stroke: 'black' }

export const RingSvg = (props: { innerRadius: number; outerRadius: number; cx: number; cy: number }) => (
  <path
    className="belt"
    fill="url(#asteroids)"
    d={`
M ${props.cx}, ${props.cy} 
m 0 -${props.outerRadius}
a ${props.outerRadius} ${props.outerRadius} 0 1 0 1 0
z
m -1 ${props.outerRadius - props.innerRadius}    
a ${props.innerRadius} ${props.innerRadius} 0 1 1 -1 0     
Z`}
    style={regularStyle}
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
              <circle cx={props.cx} cy={props.cy} r={part.radius} fill="none" style={regularStyle} />
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
          <g
            key={id}
            id={id}
            onClick={(e) => {
              console.log(e)
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
          >
            <circle cx={p.x} cy={p.y} r={body.radius} strokeWidth={id === state.map.selected ? 2 : 1} fill="white" style={regularStyle} />
            <circle cx={p.x} cy={p.y} r={body.radius * 1.5} fill="none" stroke="none" pointerEvents="visible" />
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
        mutate(setViewBox(zoomViewBox(box, e.deltaY, e.offsetX, e.offsetY, svg.current.clientWidth, svg.current.clientHeight)))
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
        if (drag) {
          mutate(setViewBox(dragViewBox(box, e.movementX, e.movementY)))
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
