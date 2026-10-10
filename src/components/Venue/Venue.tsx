import { motion, useReducedMotion } from "framer-motion"
import { wedding } from "../../data/wedding"
import { InView } from "../Reveal/Reveal"
import { SectionHeading } from "../SectionHeading/SectionHeading"
import styles from "./Venue.module.css"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function Venue() {
  const reduce = useReducedMotion()
  const { venue } = wedding
  const draw = {
    initial: reduce ? false : { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport: { once: true, margin: "-12% 0px" },
    transition: { duration: reduce ? 0 : 1.7, ease },
  } as const

  return (
    <section className={styles.section} id="venue" aria-labelledby="venue-title">
      <div className={`wrap ${styles.layout}`}>
        <div className={styles.copy}>
          <SectionHeading
            index={venue.index}
            kicker={venue.kicker}
            title={venue.title}
            className={styles.heading}
            headingId="venue-title"
          />
          <InView>
            <address className={styles.address}>
              <span>{venue.address}</span>
            </address>
            <p className={styles.note}>{venue.note}</p>
          </InView>
        </div>

        <InView className={styles.mapFrame} delay={0.12}>
          <svg className={styles.map} viewBox="0 0 720 480" role="img" aria-label={venue.mapCaption}>
            <motion.rect x="32" y="32" width="656" height="416" {...draw} />
            <motion.path d="M32 168 H392 V32" {...draw} transition={{ ...draw.transition, delay: 0.15 }} />
            <motion.path d="M392 32 V312 H688" {...draw} transition={{ ...draw.transition, delay: 0.28 }} />
            <motion.path d="M168 448 V300 H392" {...draw} transition={{ ...draw.transition, delay: 0.4 }} />
            <motion.path d="M520 168 H688" {...draw} transition={{ ...draw.transition, delay: 0.5 }} />
            <motion.rect x="236" y="196" width="132" height="88" {...draw} transition={{ ...draw.transition, delay: 0.55 }} />
            <motion.circle
              className={styles.pin}
              cx="302"
              cy="240"
              r="5"
              initial={reduce ? false : { opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 1.15, ease }}
            />
            <text x="360" y="420">
              {venue.mapCaption}
            </text>
          </svg>
        </InView>
      </div>
    </section>
  )
}
