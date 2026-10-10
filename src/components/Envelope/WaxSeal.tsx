import { motion, type MotionValue } from "framer-motion"
import { useId } from "react"
import styles from "./Envelope.module.css"

/** A wobbly wax outline: points around a circle joined with smooth curves. */
function waxOutline() {
  const bumps = [0, 1.6, -0.8, 2.4, 0.6, -1.2, 1.8, 3.2, 0.2, -0.6, 2, 0.8, -1.4, 1.2, 2.8, -0.2]
  const points = bumps.map((bump, i) => {
    const angle = (i / bumps.length) * Math.PI * 2
    const radius = 44 + bump
    return [50 + Math.cos(angle) * radius, 50 + Math.sin(angle) * radius] as const
  })
  const count = points.length
  let d = ""
  for (let i = 0; i < count; i += 1) {
    const p0 = points[(i - 1 + count) % count]
    const p1 = points[i]
    const p2 = points[(i + 1) % count]
    const p3 = points[(i + 2) % count]
    if (i === 0) d += `M${p1[0].toFixed(2)},${p1[1].toFixed(2)} `
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += `C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)} `
  }
  return `${d}Z`
}

const outline = waxOutline()
const crack = "M51,2 L47,17 L55,31 L46,47 L54,62 L47,77 L52,90 L50,99"
const leftHalf = "M-4,-4 L51,-4 L51,2 L47,17 L55,31 L46,47 L54,62 L47,77 L52,90 L50,99 L50,104 L-4,104 Z"
const rightHalf = "M51,-4 L104,-4 L104,104 L50,104 L50,99 L52,90 L47,77 L54,62 L46,47 L55,31 L47,17 L51,2 Z"

const leaves = Array.from({ length: 18 }, (_, i) => (i / 18) * 360)

type Props = {
  initials: string
  size: number
  crackLength: MotionValue<number>
  leftRef: React.Ref<HTMLDivElement>
  rightRef: React.Ref<HTMLDivElement>
}

function SealArt({ id, initials }: { id: string; initials: string }) {
  return (
    <>
      <path d={outline} fill={`url(#${id}-wax)`} />
      <path d={outline} fill={`url(#${id}-rim)`} />
      <circle cx="50" cy="50" r="31.5" fill={`url(#${id}-well)`} />
      <circle cx="50" cy="50" r="31.5" fill="none" stroke={`url(#${id}-edge)`} strokeWidth="1.6" />
      <g className={styles.sealWreath}>
        {leaves.map((angle) => (
          <ellipse
            key={angle}
            cx="50"
            cy="15.2"
            rx="1.05"
            ry="2.3"
            transform={`rotate(${angle} 50 50) rotate(28 50 15.2)`}
          />
        ))}
      </g>
      <text x="50" y="50" className={styles.sealShade} dx="0.9" dy="1.1">
        {initials}
      </text>
      <text x="50" y="50" className={styles.sealLight} dx="-0.7" dy="-0.8">
        {initials}
      </text>
      <text x="50" y="50" className={styles.sealText}>
        {initials}
      </text>
      <ellipse cx="36" cy="30" rx="13" ry="7" fill="#fff" opacity="0.2" filter={`url(#${id}-soft)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <rect className={styles.sealGlint} x="-40" y="-20" width="26" height="140" fill={`url(#${id}-glint)`} />
      </g>
    </>
  )
}

export function WaxSeal({ initials, size, crackLength, leftRef, rightRef }: Props) {
  const id = useId().replace(/:/g, "")
  const defs = (
    <defs>
      <radialGradient id={`${id}-wax`} cx="36%" cy="30%" r="78%">
        <stop offset="0%" stopColor="var(--wax-light)" />
        <stop offset="48%" stopColor="var(--wax)" />
        <stop offset="100%" stopColor="var(--wax-deep)" />
      </radialGradient>
      <radialGradient id={`${id}-rim`} cx="50%" cy="50%" r="50%">
        <stop offset="78%" stopColor="#000" stopOpacity="0" />
        <stop offset="94%" stopColor="#000" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.32" />
      </radialGradient>
      <radialGradient id={`${id}-well`} cx="58%" cy="60%" r="70%">
        <stop offset="0%" stopColor="var(--wax)" />
        <stop offset="100%" stopColor="var(--wax-deep)" />
      </radialGradient>
      <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#000" stopOpacity="0.45" />
        <stop offset="55%" stopColor="#000" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0.38" />
      </linearGradient>
      <linearGradient id={`${id}-glint`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fff" stopOpacity="0" />
        <stop offset="50%" stopColor="#fff" stopOpacity="0.32" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <clipPath id={`${id}-clip`}>
        <path d={outline} />
      </clipPath>
      <clipPath id={`${id}-left`}>
        <path d={leftHalf} />
      </clipPath>
      <clipPath id={`${id}-right`}>
        <path d={rightHalf} />
      </clipPath>
    </defs>
  )

  return (
    <div className={styles.seal} style={{ width: size, height: size }}>
      <div ref={leftRef} className={styles.sealHalf}>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          {defs}
          <g clipPath={`url(#${id}-left)`}>
            <SealArt id={id} initials={initials} />
          </g>
        </svg>
      </div>
      <div ref={rightRef} className={styles.sealHalf}>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <g clipPath={`url(#${id}-right)`}>
            <SealArt id={id} initials={initials} />
          </g>
          <motion.path d={crack} className={styles.sealCrack} style={{ pathLength: crackLength }} />
        </svg>
      </div>
    </div>
  )
}
