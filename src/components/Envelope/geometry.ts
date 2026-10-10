export type Rect = { left: number; top: number; width: number; height: number }

export type Geometry = {
  vw: number
  vh: number
  portrait: boolean
  /** Envelope box in viewport pixels. */
  env: Rect
  /** Card resting inside the envelope, in viewport pixels. */
  card: Rect
  /** Depth of the top flap from the hinge to its tip. */
  flap: number
  /** Height the bottom flap climbs from the bottom edge. */
  bottom: number
  /** Where the side flaps meet, from the top edge. */
  side: number
  seal: number
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/**
 * The card shares the viewport's orientation so it can grow into the hero
 * without its layout flipping, and the envelope is cut to fit the card.
 */
export function measure(vw: number, vh: number): Geometry {
  const aspect = clamp(vw / vh, 0.62, 1.5)
  const portrait = aspect < 1
  const width = Math.round(Math.min(vw * (portrait ? 0.8 : 0.62), 600, vh * 0.6 * aspect))
  const height = Math.round(width / aspect)
  const left = Math.round((vw - width) / 2)
  const top = Math.round((vh - height) / 2 + vh * 0.025)

  const cardWidth = Math.round(width * 0.9)
  const cardHeight = Math.round(height * 0.9)
  const flap = Math.round(Math.min(height * 0.56, width * 0.5))
  // The closed flap must cover the whole opening, so the sides meet above its tip…
  const side = Math.round(Math.min(height * 0.52, flap * 0.93))
  // …and the bottom flap climbs past where the sides meet, leaving no gap.
  const bottom = Math.round(Math.max(Math.min(height * 0.58, width * 0.62), height - side + height * 0.07))

  return {
    vw,
    vh,
    portrait,
    env: { left, top, width, height },
    card: {
      left: left + Math.round((width - cardWidth) / 2),
      top: top + Math.round(height * 0.06),
      width: cardWidth,
      height: cardHeight,
    },
    flap,
    bottom,
    side,
    seal: Math.round(clamp(Math.min(width, height) * 0.26, 72, 112)),
  }
}

type Point = [number, number]

/** Closed path through the points with each corner softened by its radius. */
export function roundedPath(points: Point[], radii: number[]) {
  const count = points.length
  let d = ""
  for (let i = 0; i < count; i += 1) {
    const [x, y] = points[i]
    const [px, py] = points[(i - 1 + count) % count]
    const [nx, ny] = points[(i + 1) % count]
    const r = radii[i] ?? 0
    const inLen = Math.hypot(x - px, y - py)
    const outLen = Math.hypot(nx - x, ny - y)
    const a = Math.min(r, inLen / 2)
    const b = Math.min(r, outLen / 2)
    const sx = x + ((px - x) / inLen) * a
    const sy = y + ((py - y) / inLen) * a
    const ex = x + ((nx - x) / outLen) * b
    const ey = y + ((ny - y) / outLen) * b
    d += `${i === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)} Q${x.toFixed(1)},${y.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)} `
  }
  return `${d}Z`
}
