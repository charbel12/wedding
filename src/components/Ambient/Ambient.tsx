import type { CSSProperties } from "react"
import styles from "./Ambient.module.css"

/** Deterministic pseudo-random so the scene is the same on every render. */
function seeded(seed: number) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

const rand = seeded(7)

const motes = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: rand() * 100,
  y: rand() * 100,
  size: 1 + rand() * 2,
  rise: 40 + rand() * 90,
  sway: (rand() - 0.5) * 60,
  duration: 14 + rand() * 18,
  twinkle: 2.5 + rand() * 4,
  delay: -rand() * 30,
}))

const petals = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  kind: i % 3 === 0 ? "leaf" : "petal",
  x: 4 + rand() * 92,
  size: 9 + rand() * 9,
  sway: 30 + rand() * 70,
  spin: (rand() > 0.5 ? 1 : -1) * (240 + rand() * 360),
  duration: 20 + rand() * 16,
  delay: -rand() * 36,
}))

/** Soft light that drifts behind the page. */
export function Aurora() {
  return (
    <div className={styles.aurora} data-aurora aria-hidden="true">
      <span className={`${styles.blob} ${styles.blobA}`} />
      <span className={`${styles.blob} ${styles.blobB}`} />
      <span className={`${styles.blob} ${styles.blobC}`} />
    </div>
  )
}

/** Gold dust and the occasional falling petal, above everything. */
export function Particles() {
  return (
    <div className={styles.particles} aria-hidden="true">
      {motes.map((mote) => (
        <span
          key={mote.id}
          className={styles.mote}
          style={
            {
              left: `${mote.x}%`,
              top: `${mote.y}%`,
              width: mote.size,
              height: mote.size,
              "--rise": `${-mote.rise}px`,
              "--sway": `${mote.sway}px`,
              "--twinkle": `${mote.twinkle}s`,
              animationDuration: `${mote.duration}s, ${mote.twinkle}s`,
              animationDelay: `${mote.delay}s, ${mote.delay}s`,
            } as CSSProperties
          }
        />
      ))}
      {petals.map((petal) => (
        <span
          key={petal.id}
          className={styles.fall}
          style={
            {
              left: `${petal.x}%`,
              "--sway": `${petal.sway}px`,
              animationDuration: `${petal.duration}s`,
              animationDelay: `${petal.delay}s`,
            } as CSSProperties
          }
        >
          <svg
            className={petal.kind === "leaf" ? styles.leaf : styles.petal}
            viewBox="0 0 20 20"
            width={petal.size}
            height={petal.size}
            style={
              {
                "--spin": `${petal.spin}deg`,
                animationDuration: `${petal.duration / 3}s`,
                animationDelay: `${petal.delay}s`,
              } as CSSProperties
            }
          >
            {petal.kind === "leaf" ? (
              <>
                <path d="M10 1 C16 5 16 14 10 19 C4 14 4 5 10 1 Z" />
                <path d="M10 3 V18" className={styles.vein} />
              </>
            ) : (
              <path d="M10 2 C15 2 18 8 16 13 C14 18 6 18 4 13 C2 8 5 2 10 2 Z" />
            )}
          </svg>
        </span>
      ))}
    </div>
  )
}
