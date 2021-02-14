import { Component, createRef, Ref } from 'inferno'
import { connect, Storage } from '../store'
import { isBand, StarSystem } from '../star-system'
import { Name } from '../name/state'
import { Body } from '../body/state'
import { Position } from '../dynamics/state'
import { collectEntities } from '../dynamics'
import { MapState, ViewBox } from './state'

export interface ComponentState {
  drag: boolean
}

export interface Props {
  currentSystem: string
  system: StarSystem
  entities: string[]
  names: Storage<Name>
  bodies: Storage<Body>
  positions: Storage<Position>
  state: MapState['state']
  subState: MapState['subState']
  viewBox: ViewBox

  selected: string
  select: (id: string) => void
  selectNavigableLocation: (location: [number, number], system: string, selected: string) => void
  selectDockableLocation: (location: string, selected: string) => void

  setViewBox: (viewBox: ViewBox) => void
}

export class Map extends Component<Props, ComponentState> {
  readonly state: ComponentState = {
    drag: false,
  }

  render(): JSX.Element {
    const svg: Ref<SVGSVGElement> = createRef()
    const box = this.props.viewBox

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
          this.props.setViewBox({ x: box.x + dx, y: box.y + dy, w: box.w - dw, h: box.h - dh })
        }}
        onClick={(e) => {
          if (this.props.subState !== undefined && this.props.subState === 'select_navigable_location') {
            const pt = svg.current.createSVGPoint()
            pt.x = e.x
            pt.y = e.y
            const target = pt.matrixTransform(svg.current.getScreenCTM().inverse())
            this.props.selectNavigableLocation([target.x, target.y], this.props.currentSystem, this.props.selected)
          }
        }}
        onMouseDown={() => this.setState({ drag: true })}
        onMouseUp={() => this.setState({ drag: false })}
        onMouseLeave={() => this.setState({ drag: false })}
        onMouseMove={(e) => {
          const dx = e.movementX * (box.w / 800)
          const dy = e.movementY * (box.h / 800)
          if (this.state.drag) {
            this.props.setViewBox({ x: box.x - dx, y: box.y - dy, w: box.w, h: box.h })
          }
        }}
      >
        <pattern id="asteroids" x="0" y="0" width={10 * viewScaleX} height={10 * viewScaleY} patternUnits="userSpaceOnUse">
          <rect x={6 * viewScaleX} y={-5 * viewScaleY} width={2 * viewScaleX} height={2 * viewScaleY} transform="rotate(45)" />
        </pattern>
        {this.renderMap()}
      </svg>
    )
  }

  private renderStarSystem(system: StarSystem, cx = 0, cy = 0): JSX.Element {
    return (
      <g>
        {Object.entries(system).map(([id, part]) => {
          if (isBand(part)) {
            return <g id={id}>{this.renderRing(cx, cy, part.innerRadius, part.outerRadius)}</g>
          } else {
            const p = this.props.positions[id]
            return (
              <g id={id}>
                <circle
                  key="orbit"
                  cx={cx}
                  cy={cy}
                  r={part.radius}
                  stroke="black"
                  strokeWidth="1"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
                {part.sub && this.renderStarSystem(part.sub, p.x, p.y)}
              </g>
            )
          }
        })}
      </g>
    )
  }

  private renderObjects(): JSX.Element {
    return (
      <g>
        {this.props.entities.map((id) => {
          const p = this.props.positions[id]
          const body = this.props.bodies[id]
          return (
            <g key={id} id={id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={body.radius}
                stroke="black"
                strokeWidth={id === this.props.selected ? 2 : 1}
                fill="white"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={body.radius * 1.5}
                onClick={(e) => {
                  if (this.props.state === undefined) {
                    e.stopPropagation()
                    this.props.select(id)
                  } else if (this.props.subState === 'select_dockable_location') {
                    if (id !== this.props.selected) {
                      e.stopPropagation()
                      this.props.selectDockableLocation(id, this.props.selected)
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

  private renderMap(): JSX.Element {
    return (
      <g>
        {this.renderStarSystem(this.props.system)}
        {this.renderObjects()}
      </g>
    )
  }

  private renderRing(cx: number, cy: number, innerRadius: number, outerRadius: number): JSX.Element {
    return (
      <path
        className="belt"
        fill="url(#asteroids)"
        stroke="black"
        d={`
      M ${cx}, ${cy} 
      m 0 -${outerRadius}
      a ${outerRadius} ${outerRadius} 0 1 0 1 0
      z
      m -1 ${outerRadius - innerRadius}    
      a ${innerRadius} ${innerRadius} 0 1 1 -1 0     
      Z`}
        vectorEffect="non-scaling-stroke"
      />
    )
  }
}

export default connect(
  (s) => ({
    selected: s.map.selected,
    currentSystem: s.starSystems.currentSystem,
    system: s.starSystems.systems[s.starSystems.currentSystem],
    names: s.names.names,
    bodies: s.bodies.bodies,
    positions: s.dynamics.positions,
    entities: collectEntities(s.dynamics, s.starSystems.currentSystem),
    state: s.map.state,
    subState: s.map.subState,
    viewBox: s.map.viewBox,
  }),
  (d) => ({
    select: (id: string) => d({ type: 'SELECT_ENTITY', id }),
    selectNavigableLocation: (location: [string, string], system: string, id: string) =>
      d({ type: 'SELECT_NAVIGABLE_LOCATION', location, system, id }),
    selectDockableLocation: (location: string, id: string) => d({ type: 'SELECT_DOCKABLE_LOCATION', location, id }),
    setViewBox: (viewBox: ViewBox) => d({ type: 'SET_VIEW_BOX', viewBox }),
  })
)(Map)
