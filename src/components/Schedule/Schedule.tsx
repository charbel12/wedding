import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import { useRef } from "react"
import { wedding } from "../../data/wedding"
import { SectionHeading } from "../SectionHeading/SectionHeading"
import styles from "./Schedule.module.css"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function Schedule() {
  const reduce = useReducedMotion()
  const { schedule } = wedding
  const listRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] })
  const travel = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })
  const top = useTransform(travel, [0, 1], ["0%", "100%"])

  return (
    <section className={styles.section} id="schedule" aria-labelledby="schedule-title">
      <div className="wrap">
        <SectionHeading
          index={schedule.index}
          kicker={schedule.kicker}
          title={schedule.title}
          intro={schedule.intro}
          headingId="schedule-title"
        />

        <div className={styles.list} ref={listRef}>
          <motion.span
            className={styles.spine}
            aria-hidden="true"
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: reduce ? 0 : 1.3, ease }}
            style={{ transformOrigin: "top center" }}
          />
          {reduce ? null : <motion.span className={styles.bead} aria-hidden="true" style={{ top }} />}
          {schedule.events.map((event, index) => (
            <motion.div
              key={event.title}
              className={styles.item}
              initial={reduce ? false : { opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: reduce ? 0 : 0.75, delay: 0.08 + index * 0.07, ease }}
            >
              <time className={styles.time}>{event.time}</time>
              <div>
                <h3 className={styles.title}>{event.title}</h3>
                <p className={styles.detail}>{event.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
