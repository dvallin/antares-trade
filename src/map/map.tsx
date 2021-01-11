import { Component } from 'inferno'
import { connect, Storage } from '../store'
import { isBand, StarSystem } from '../star-system'
import { Name } from '../name/state'
import { Body } from '../body/state'
import { Position } from '../dynamics/state'

export interface ComponentState {
  drag: boolean
  box: {
    x: number
    y: number
    w: number
    h: number
  }
}

export interface Props {
  system: StarSystem
  names: Storage<Name>
  bodies: Storage<Body>
  positions: Storage<Position>

  selected: string
  select: (id: string) => void
}

export class Map extends Component<Props, ComponentState> {
  private readonly w = 800
  private readonly h = 800

  readonly state: ComponentState = {
    drag: false,
    box: {
      x: -Math.floor(this.w / 8),
      y: -Math.floor(this.h / 8),
      w: this.w / 4,
      h: this.h / 4,
    },
  }

  render(): JSX.Element {
    const box = this.state.box
    return (
      <svg
        height={this.h}
        width={this.w}
        shapeRendering="optimizeQuality"
        viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
        onWheel={(e) => {
          e.preventDefault()
          const box = this.state.box
          const dw = box.w * Math.sign(e.deltaY) * 0.05
          const dh = box.h * Math.sign(e.deltaY) * 0.05
          const dx = (dw * e.offsetX) / this.w
          const dy = (dh * e.offsetY) / this.h
          this.setState({ box: { x: box.x + dx, y: box.y + dy, w: box.w - dw, h: box.h - dh } })
        }}
        onMouseDown={() => this.setState({ drag: true })}
        onMouseUp={() => this.setState({ drag: false })}
        onMouseLeave={() => this.setState({ drag: false })}
        onMouseMove={(e) => {
          const dx = e.movementX * (this.state.box.w / this.w)
          const dy = e.movementY * (this.state.box.h / this.h)
          if (this.state.drag) {
            this.setState({ box: { x: box.x - dx, y: box.y - dy, w: box.w, h: box.h } })
          }
        }}
      >
        {this.renderMap()}
      </svg>
    )
  }

  private renderStarSystem(system: StarSystem, cx: number = 0, cy: number = 0): JSX.Element {
    return (
      <g>
        {Object.entries(system).map(([id, part]) => {
          if (isBand(part)) {
            return <g id={id}>{this.renderRing(cx, cy, part.innerRadius, part.outerRadius)}</g>
          } else {
            const p = this.props.positions[id]
            const body = this.props.bodies[id]
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
                <circle
                  key="body"
                  cx={p.x}
                  cy={p.y}
                  r={body.radius}
                  stroke="black"
                  strokeWidth={id === this.props.selected ? 2 : 1}
                  fill="white"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  key="bounding_box"
                  cx={p.x}
                  cy={p.y}
                  r={body.radius * 1.5}
                  onClick={(e) => {
                    e.stopPropagation()
                    this.props.select(id)
                  }}
                  fill="none"
                  stroke="none"
                  pointerEvents="visible"
                />
                {part.sub && this.renderStarSystem(part.sub, p.x, p.y)}
              </g>
            )
          }
        })}
      </g>
    )
  }

  private renderMap(): JSX.Element {
    const viewScale = this.state.box.w / this.w

    return (
      <g>
        <pattern id="asteroids" x="0" y="0" width={20 * viewScale} height={20 * viewScale} patternUnits="userSpaceOnUse">
          <rect x={12 * viewScale} y={-10 * viewScale} width={4 * viewScale} height={4 * viewScale} transform="rotate(45)" />
        </pattern>
        {this.renderStarSystem(this.props.system)}
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
    system: s.starSystems.systems[s.starSystems.currentSystem],
    names: s.names.names,
    bodies: s.bodies.bodies,
    positions: s.dynamics.positions,
  }),
  (d) => ({
    select: (id: string) => d({ type: 'SELECT_ENTITY', id }),
  })
)(Map)
