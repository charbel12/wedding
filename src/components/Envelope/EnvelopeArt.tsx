import { memo, useId } from "react"
import { roundedPath, type Geometry } from "./geometry"

type Props = { g: Geometry }

/** Botanical lattice printed on the liner paper. */
function LinerPattern({ id }: { id: string }) {
  return (
    <pattern id={id} width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="26" height="26" fill="var(--liner-base)" />
      <path d="M0 0 H26 M0 0 V26" stroke="var(--liner-line)" strokeWidth="0.6" />
      <g fill="var(--liner-motif)">
        <ellipse cx="13" cy="9.4" rx="1.3" ry="3" />
        <ellipse cx="13" cy="16.6" rx="1.3" ry="3" />
        <ellipse cx="9.4" cy="13" rx="3" ry="1.3" />
        <ellipse cx="16.6" cy="13" rx="3" ry="1.3" />
      </g>
      <circle cx="13" cy="13" r="1.1" fill="var(--liner-line)" />
      <circle cx="0" cy="0" r="1.4" fill="var(--liner-line)" />
    </pattern>
  )
}

function topFlapPath(g: Geometry, inset = 0) {
  const { width: w } = g.env
  const tipY = g.flap - inset * 1.6
  return roundedPath(
    [
      [inset, inset * 0.6],
      [w - inset, inset * 0.6],
      [w / 2, tipY],
    ],
    [3, 3, w * 0.07],
  )
}

/** Everything that sits behind the card: the inside of the envelope and the opened flap. */
export const EnvelopeBack = memo(function EnvelopeBack({ g }: Props) {
  const id = useId().replace(/:/g, "")
  const { width: w, height: h } = g.env
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <LinerPattern id={`${id}-liner`} />
        <linearGradient id={`${id}-depth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.1" />
          <stop offset="55%" stopColor="#000" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.42" />
        </linearGradient>
      </defs>
      <rect width={w} height={h} rx="3" fill="var(--env-inside)" />
      <rect x="5" y="4" width={w - 10} height={h - 8} rx="2" fill={`url(#${id}-liner)`} />
      <rect width={w} height={h} rx="3" fill={`url(#${id}-depth)`} />
    </svg>
  )
})

/** The inside face of the top flap, seen once it has swung past upright. */
export const FlapInside = memo(function FlapInside({ g }: Props) {
  const id = useId().replace(/:/g, "")
  const { width: w } = g.env
  return (
    <svg width={w} height={g.flap} viewBox={`0 0 ${w} ${g.flap}`} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <LinerPattern id={`${id}-liner`} />
        <linearGradient id={`${id}-fold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.22" />
          <stop offset="18%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={topFlapPath(g)} fill="var(--env-inside)" />
      <path d={topFlapPath(g, 7)} fill={`url(#${id}-liner)`} />
      <path d={topFlapPath(g)} fill={`url(#${id}-fold)`} />
    </svg>
  )
})

/** The outside face of the top flap while it is closed. */
export const FlapOutside = memo(function FlapOutside({ g }: Props) {
  const id = useId().replace(/:/g, "")
  const { width: w } = g.env
  return (
    <svg width={w} height={g.flap + 12} viewBox={`0 0 ${w} ${g.flap + 12}`} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--env-light)" />
          <stop offset="100%" stopColor="var(--env-mid)" />
        </linearGradient>
        <filter id={`${id}-cast`} x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#1c140a" floodOpacity="0.26" />
        </filter>
      </defs>
      <path d={topFlapPath(g)} fill={`url(#${id}-paper)`} filter={`url(#${id}-cast)`} />
      <path d={topFlapPath(g)} fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1" />
    </svg>
  )
})

/** The glued pocket — side flaps under the bottom flap — that holds the card. */
export const EnvelopePocket = memo(function EnvelopePocket({ g }: Props) {
  const id = useId().replace(/:/g, "")
  const { width: w, height: h } = g.env
  const apex = w * 0.5
  const left = roundedPath(
    [
      [0, 0],
      [apex - 2, g.side],
      [0, h],
    ],
    [2, w * 0.05, 3],
  )
  const right = roundedPath(
    [
      [w, 0],
      [w, h],
      [apex + 2, g.side],
    ],
    [2, 3, w * 0.05],
  )
  const bottom = roundedPath(
    [
      [0, h],
      [apex, h - g.bottom],
      [w, h],
    ],
    [3, w * 0.09, 3],
  )

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}-left`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--env-mid)" />
          <stop offset="100%" stopColor="var(--env-shade)" />
        </linearGradient>
        <linearGradient id={`${id}-right`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--env-mid)" />
          <stop offset="100%" stopColor="var(--env-shade)" />
        </linearGradient>
        <linearGradient id={`${id}-bottom`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--env-mid)" />
          <stop offset="100%" stopColor="var(--env-light)" />
        </linearGradient>
        <filter id={`${id}-side`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.2" floodColor="#1c140a" floodOpacity="0.22" />
        </filter>
        <filter id={`${id}-lift`} x="-10%" y="-30%" width="120%" height="140%">
          <feDropShadow dx="0" dy="-2" stdDeviation="3" floodColor="#1c140a" floodOpacity="0.2" />
        </filter>
      </defs>
      <path d={left} fill={`url(#${id}-left)`} filter={`url(#${id}-side)`} />
      <path d={right} fill={`url(#${id}-right)`} filter={`url(#${id}-side)`} />
      <path d={bottom} fill={`url(#${id}-bottom)`} filter={`url(#${id}-lift)`} />
      <path d={bottom} fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1" />
    </svg>
  )
})
