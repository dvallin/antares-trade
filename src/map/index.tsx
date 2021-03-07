import { h } from 'preact'
import { isBand, StarSystem } from '../star-system'
import { collectEntities, collectTrajectories } from '../dynamics'
import { deselect, moveSelectedShip, selectEntity, setViewBox } from './state'
import { useApplicationState } from '../application-state'
import { useRef, useState } from 'preact/hooks'
import { dragViewBox, zoomViewBox } from '../view-box'
import { getPosition } from '../dynamics/state'

const colorScheme = {
  foreground: '#f1f1f1',
  background: '#261f39',
  color0: '#1b1d1e',
  color1: '#f1f1f1',
  color2: '#98de00',
  color3: '#fd5d77',
  color4: '#03cbca',
  color5: '#473b6b',
  color6: '#fecf87',
  color7: '#ccccc6',
  color8: '#505354',
  color9: '#fe207b',
  color10: '#b6e354',
  color11: '#fea182',
  color12: '#2dfcde',
  color13: '#6e719c',
  color14: '#fef184',
  color15: '#f8f8f2',
}

const regularStyle: h.JSX.CSSProperties = { vectorEffect: 'non-scaling-stroke' }

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
          const p = getPosition(state, id)
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

export const TrajectoriesSvg = () => {
  const [state, mutate] = useApplicationState()
  const trajectories = collectTrajectories(state, state.starSystems.currentSystem)
  return (
    <g>
      {trajectories.map(({ id, from, to }) => (
        <g key={id}>
          <line
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            style={{ ...regularStyle, stroke: colorScheme.color2, strokeDasharray: '4', strokeWidth: 2 }}
          />
          <line
            onClick={(e) => {
              if (state.map.state === undefined) {
                e.stopPropagation()
                mutate(selectEntity(id))
              }
            }}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            fill="none"
            stroke="none"
            style={{ pointerEvents: 'visible', strokeWidth: 20 }}
          />
        </g>
      ))}
    </g>
  )
}

export const ObjectsSvg = () => {
  const [state, mutate] = useApplicationState()
  const entities = collectEntities(state, state.starSystems.currentSystem)
  return (
    <g>
      {entities.map((id) => {
        const p = getPosition(state, id)
        const body = state.bodies.bodies[id]
        return (
          <g key={id} id={id}>
            <circle
              cx={p.x}
              cy={p.y}
              r={body.radius}
              fill={colorScheme.color3}
              stroke={colorScheme.color1}
              style={{ ...regularStyle, strokeWidth: state.map.selected ? 2 : 0 }}
            />
            <circle
              onClick={(e) => {
                if (state.map.state === undefined) {
                  e.stopPropagation()
                  mutate(selectEntity(id))
                } else if (state.map.subState === 'select_dockable_location') {
                  const selected = state.map.selected
                  if (selected !== undefined && id !== selected) {
                    e.stopPropagation()
                    mutate(moveSelectedShip(id, state.ships.specs[selected].speed))
                  }
                }
              }}
              cx={p.x}
              cy={p.y}
              r={body.radius * 2}
              fill="none"
              stroke="none"
              style={{ pointerEvents: 'visible' }}
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
  const [didDrag, setDidDrag] = useState(false)

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
        if (!didDrag && state.map.subState !== undefined && state.map.subState === 'select_navigable_location') {
          const pt = svg.current.createSVGPoint()
          pt.x = e.x
          pt.y = e.y
          const target = pt.matrixTransform(svg.current.getScreenCTM()?.inverse())
          const selected = state.map.selected
          if (selected !== undefined) {
            mutate(
              moveSelectedShip(
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
        setDidDrag(false)
      }}
      onMouseDown={() => {
        setDrag(true)
        if (state.map.state === undefined) {
          mutate(deselect())
        }
      }}
      onMouseUp={() => {
        setDrag(false)
      }}
      onMouseLeave={() => setDrag(false)}
      onMouseMove={(e) => {
        if (drag) {
          setDidDrag(true)
          mutate(setViewBox(dragViewBox(box, e.movementX, e.movementY)))
        }
      }}
    >
      <pattern id="asteroids" x="0" y="0" width={10 * viewScaleX} height={10 * viewScaleY} patternUnits="userSpaceOnUse">
        <rect
          x={6 * viewScaleX}
          y={-5 * viewScaleY}
          width={2 * viewScaleX}
          height={2 * viewScaleY}
          transform="rotate(45)"
          style={regularStyle}
          fill={colorScheme.color5}
          stroke={colorScheme.color5}
        />
      </pattern>
      <g>
        <StarSystemSvg system={state.starSystems.systems[state.starSystems.currentSystem]} cx={0} cy={0} />
        <ObjectsSvg />
        <TrajectoriesSvg />
      </g>
    </svg>
  )
}
