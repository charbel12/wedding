import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import { memo, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { wedding } from "../../data/wedding"
import { Hero } from "../Hero/Hero"
import { EnvelopeBack, EnvelopePocket, FlapInside, FlapOutside } from "./EnvelopeArt"
import { measure } from "./geometry"
import { WaxSeal } from "./WaxSeal"
import styles from "./Envelope.module.css"

type Bezier = [number, number, number, number]
const settle: Bezier = [0.22, 1, 0.36, 1]
const gravity: Bezier = [0.55, 0, 0.9, 0.45]

/** The printed card never changes, so it skips re-rendering while the envelope animates. */
const CardFace = memo(function CardFace() {
  return (
    <div className={styles.cardFace}>
      <Hero variant="card" />
    </div>
  )
})

const wait = (seconds: number) => new Promise((resolve) => window.setTimeout(resolve, seconds * 1000))

type Props = {
  onFinished: () => void
}

export function Envelope({ onFinished }: Props) {
  const reduce = useReducedMotion()
  const { couple, envelope } = wedding
  const [g, setG] = useState(() => measure(window.innerWidth, window.innerHeight))
  const [opening, setOpening] = useState(false)
  const done = useRef(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const sealRef = useRef<HTMLDivElement>(null)
  const sealLeft = useRef<HTMLDivElement>(null)
  const sealRight = useRef<HTMLDivElement>(null)
  const chromeRef = useRef<HTMLDivElement>(null)

  // Shared by the back and front layers so the card can sit between them.
  const lift = useMotionValue(reduce ? 0 : 56)
  const turn = useMotionValue(reduce ? 0 : -3)
  const presence = useMotionValue(reduce ? 1 : 0)
  const sway = useMotionValue(1)
  const floatY = useMotionValue(0)
  const floatR = useMotionValue(0)
  const tiltX = useSpring(0, { stiffness: 70, damping: 16 })
  const tiltY = useSpring(0, { stiffness: 70, damping: 16 })
  const hover = useSpring(1, { stiffness: 220, damping: 22 })
  const glossX = useMotionValue(50)
  const glossY = useMotionValue(30)
  const gloss = useMotionValue(1)

  const y = useTransform(() => lift.get() + floatY.get())
  const rotate = useTransform(() => turn.get() + floatR.get())
  const sheen = useTransform(
    () => `radial-gradient(circle at ${glossX.get()}% ${glossY.get()}%, rgba(255,255,255,0.2), rgba(255,255,255,0) 58%)`,
  )

  const flapClosed = useMotionValue(0)
  const flapOpen = useMotionValue(90)
  const closedShade = useTransform(flapClosed, [0, 90], [0, 0.4])
  const openShade = useTransform(flapOpen, [90, 180], [0.45, 0])
  const crack = useMotionValue(0)
  // Swapped mid-flip without a React render, so the hand-off never hitches.
  const closedVisibility = useMotionValue("visible")
  const openVisibility = useMotionValue("hidden")
  // Fades only during the first moments of the growth so the shadow isn't repainted at full size.
  const cardShadow = useMotionValue(1)

  useAnimationFrame((time) => {
    if (reduce) return
    const amount = sway.get()
    if (amount === 0 && floatY.get() === 0) return
    floatY.set(Math.sin(time / 1500) * 5 * amount)
    floatR.set(Math.sin(time / 2300) * 0.55 * amount)
  })

  useEffect(() => {
    if (reduce) return
    animate(presence, 1, { duration: 0.9, ease: "easeOut", delay: 0.15 })
    animate(lift, 0, { type: "spring", stiffness: 60, damping: 14, delay: 0.15 })
    animate(turn, 0, { type: "spring", stiffness: 50, damping: 12, delay: 0.15 })
  }, [reduce, presence, lift, turn])

  useEffect(() => {
    if (opening) return
    const onResize = () => setG(measure(window.innerWidth, window.innerHeight))
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [opening])

  useEffect(() => {
    if (opening || reduce) return
    const onMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5
      const ny = event.clientY / window.innerHeight - 0.5
      tiltY.set(nx * 12)
      tiltX.set(-ny * 10)
      glossX.set(50 - nx * 90)
      glossY.set(30 - ny * 80)
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [opening, reduce, tiltX, tiltY, glossX, glossY])

  function finish() {
    if (done.current) return
    done.current = true
    onFinished()
  }

  async function open() {
    if (opening) return
    setOpening(true)
    if (reduce) {
      finish()
      return
    }

    const card = cardRef.current
    const seal = sealRef.current
    const left = sealLeft.current
    const right = sealRight.current
    if (!card || !seal || !left || !right) {
      finish()
      return
    }

    const { env, vh } = g
    // The page's own hero, laid out (but hidden) beneath — the card lands exactly on it.
    const hero = document.getElementById("top")?.getBoundingClientRect()
    const target = {
      left: hero?.left ?? 0,
      top: hero?.top ?? 0,
      width: hero?.width || document.documentElement.clientWidth,
      height: hero?.height || window.innerHeight,
    }

    try {
      // Hold still — the envelope stops swaying and faces the guest.
      animate(sway, 0, { duration: 0.5 })
      tiltX.set(0)
      tiltY.set(0)
      hover.set(1)
      animate(gloss, 0, { duration: 0.4 })
      if (chromeRef.current) animate(chromeRef.current, { opacity: 0 }, { duration: 0.35 })

      // Press the seal until the wax gives.
      await animate(seal, { scale: 0.92 }, { duration: 0.16, ease: "easeOut" })
      animate(crack, 1, { duration: 0.12, ease: "easeIn" })
      await wait(0.1)
      animate(seal, { scale: 1 }, { duration: 0.25, ease: settle })
      const fall = vh - env.top - g.flap + g.seal
      animate(
        left,
        { x: [0, -g.seal * 0.12, -g.seal * 0.55], y: [0, 2, fall], rotate: [0, -10, -70] },
        { duration: 1.15, times: [0, 0.18, 1], ease: ["easeOut", gravity] },
      )
      animate(
        right,
        { x: [0, g.seal * 0.12, g.seal * 0.6], y: [0, 3, fall * 1.05], rotate: [0, 12, 84] },
        { duration: 1.2, times: [0, 0.18, 1], ease: ["easeOut", gravity] },
      )
      await wait(0.22)

      // Lift the flap toward the guest, then let it fall back over the top.
      await animate(flapClosed, 90, { duration: 0.36, ease: [0.5, 0, 0.9, 0.5] })
      closedVisibility.set("hidden")
      openVisibility.set("visible")
      await animate(flapOpen, 180, { duration: 0.55, ease: [0.1, 0.55, 0.35, 1] })

      // Draw the card out while the envelope is held lower.
      const sink = vh * 0.07
      const rest = g.card.top + sink
      const rise = Math.min(g.card.height * 0.6, rest - vh * 0.035)
      animate(lift, sink, { duration: 1, ease: settle })
      await animate(card, { top: rest - rise }, { duration: 1.05, ease: [0.45, 0, 0.2, 1] })

      // Let go of the envelope; the card grows until it is the page.
      animate(lift, vh - env.top + env.height * 0.4, { duration: 0.85, ease: gravity })
      animate(turn, 6, { duration: 0.85, ease: "easeIn" })
      await wait(0.1)
      animate(cardShadow, 0, { duration: 0.45, ease: "easeIn" })
      await animate(card, { ...target, borderRadius: 0 }, { duration: 1.3, ease: [0.7, 0, 0.18, 1] })
    } catch {
      /* skipped or unmounted mid-sequence */
    }

    finish()
  }

  function onPointerMove(event: ReactPointerEvent) {
    if (event.pointerType === "mouse" || opening) return
    const rect = event.currentTarget.getBoundingClientRect()
    tiltY.set(((event.clientX - rect.left) / rect.width - 0.5) * 14)
    tiltX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 12)
  }

  const { env } = g
  const rig = {
    left: env.left,
    top: env.top,
    width: env.width,
    height: env.height,
    y,
    rotate,
    rotateX: tiltX,
    rotateY: tiltY,
    scale: hover,
    opacity: presence,
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`${couple.partnerA} and ${couple.partnerB} wedding invitation`}
    >
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.spot} />
      </div>

      <div className={styles.layer} aria-hidden="true">
        <motion.div className={`${styles.rig} ${styles.rigBack}`} style={rig}>
          <EnvelopeBack g={g} />
          <motion.div
            className={styles.flap}
            style={{ height: g.flap, rotateX: flapOpen, visibility: openVisibility }}
          >
            <FlapInside g={g} />
            <motion.div className={styles.flapShade} style={{ opacity: openShade }} />
          </motion.div>
        </motion.div>
      </div>

      {/* Sealed inside until the flap opens — never visible while the envelope fades in. */}
      <motion.div
        ref={cardRef}
        className={styles.card}
        style={{
          left: g.card.left,
          top: g.card.top,
          width: g.card.width,
          height: g.card.height,
          visibility: opening ? "visible" : "hidden",
        }}
        aria-hidden="true"
      >
        <motion.div className={styles.cardShadow} style={{ opacity: cardShadow }} />
        <CardFace />
      </motion.div>

      <div className={styles.layer} aria-hidden="true">
        <motion.div className={styles.rig} style={rig}>
          <div className={styles.pocket}>
            <EnvelopePocket g={g} />
          </div>
          <motion.div
            className={styles.flap}
            style={{ height: g.flap, rotateX: flapClosed, z: 1, visibility: closedVisibility }}
          >
            <FlapOutside g={g} />
            <motion.div className={styles.flapShade} style={{ opacity: closedShade }} />
          </motion.div>
          <motion.div className={styles.sheen} style={{ backgroundImage: sheen, opacity: gloss, z: 2 }} />
          <div className={styles.sealSpot} style={{ top: g.flap }}>
            <div className={styles.sealPulse} data-hidden={opening || undefined} style={{ width: g.seal, height: g.seal }} />
            <div ref={sealRef}>
              <WaxSeal
                initials={couple.initials}
                size={g.seal}
                crackLength={crack}
                leftRef={sealLeft}
                rightRef={sealRight}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div ref={chromeRef} className={styles.chrome}>
        <motion.p
          className={styles.preface}
          style={{ top: env.top - 56 }}
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: settle }}
        >
          {envelope.preface}
        </motion.p>

        <button
          type="button"
          className={styles.hit}
          style={{ left: env.left, top: env.top, width: env.width, height: env.height }}
          onClick={open}
          onPointerEnter={(event) => event.pointerType === "mouse" && !opening && hover.set(1.025)}
          onPointerLeave={() => hover.set(1)}
          onPointerMove={onPointerMove}
          disabled={opening}
          aria-label={envelope.openLabel}
        />

        <motion.p
          className={styles.hint}
          style={{ top: env.top + env.height + 30 }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          aria-hidden="true"
        >
          <span className={styles.hintFine}>{envelope.openLabel}</span>
          <span className={styles.hintCoarse}>{envelope.tapLabel}</span>
        </motion.p>

        <button type="button" className={styles.skip} onClick={finish}>
          {envelope.skipLabel}
        </button>
      </div>
    </div>
  )
}
