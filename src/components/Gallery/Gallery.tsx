import { motion, useReducedMotion } from "framer-motion"
import type { PointerEvent } from "react"
import type { FrameSize, FrameTone } from "../../data/wedding"
import { wedding } from "../../data/wedding"
import { SectionHeading } from "../SectionHeading/SectionHeading"
import styles from "./Gallery.module.css"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const tones: Record<FrameTone, string> = {
  ivory: styles.ivory,
  champagne: styles.champagne,
  sage: styles.sage,
  forest: styles.forest,
  gold: styles.gold,
}

const sizes: Record<FrameSize, string> = {
  short: styles.short,
  mid: styles.mid,
  tall: styles.tall,
}

/** Leans the frame toward the pointer and moves its glare with it. */
function tilt(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return
  const node = event.currentTarget
  const rect = node.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  node.style.setProperty("--ry", `${(x - 0.5) * 9}deg`)
  node.style.setProperty("--rx", `${(0.5 - y) * 9}deg`)
  node.style.setProperty("--gx", `${x * 100}%`)
  node.style.setProperty("--gy", `${y * 100}%`)
}

function untilt(event: PointerEvent<HTMLElement>) {
  const node = event.currentTarget
  node.style.setProperty("--ry", "0deg")
  node.style.setProperty("--rx", "0deg")
}

export function Gallery() {
  const reduce = useReducedMotion()
  const { gallery } = wedding

  return (
    <section className={styles.section} id="gallery" aria-labelledby="gallery-title">
      <div className="wrap">
        <SectionHeading
          index={gallery.index}
          kicker={gallery.kicker}
          title={gallery.title}
          intro={gallery.intro}
          headingId="gallery-title"
        />

        <div className={styles.grid}>
          {gallery.photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className={sizes[photo.size]}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: reduce ? 0 : 0.9, delay: index * 0.05, ease }}
            >
              <motion.figure
                className={[styles.frame, tones[photo.tone], sizes[photo.size], photo.src ? styles.hasImage : ""]
                  .filter(Boolean)
                  .join(" ")}
                initial={reduce ? false : { clipPath: "inset(12% 12% 12% 12%)" }}
                whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: reduce ? 0 : 1.15, delay: 0.08 + index * 0.05, ease }}
                onPointerMove={reduce ? undefined : tilt}
                onPointerLeave={reduce ? undefined : untilt}
              >
                {photo.src ? <img src={photo.src} alt="" /> : null}
                <span className={styles.year}>{photo.year}</span>
                <figcaption className={styles.caption}>{photo.caption}</figcaption>
              </motion.figure>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
