import { motion, useReducedMotion } from "framer-motion"
import { Fragment } from "react"
import { InView } from "../Reveal/Reveal"
import styles from "./SectionHeading.module.css"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

type Props = {
  index: string
  kicker: string
  title: string
  intro?: string
  className?: string
  headingId?: string
}

export function SectionHeading({ index, kicker, title, intro, className, headingId }: Props) {
  const reduce = useReducedMotion()
  const view = { once: true, margin: "-10% 0px" } as const
  const words = title.split(" ")

  return (
    <InView className={[styles.heading, className].filter(Boolean).join(" ")}>
      <p className={styles.kicker}>
        <span className={styles.index}>{index}</span>
        {kicker}
      </p>
      <h2 className={styles.title} id={headingId} aria-label={title}>
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className={styles.word} aria-hidden="true">
              <motion.span
                className={styles.wordInner}
                initial={reduce ? false : { y: "110%", rotate: 4 }}
                whileInView={{ y: "0%", rotate: 0 }}
                viewport={view}
                transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.12 + i * 0.08, ease }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </h2>
      <span className={styles.ornament} aria-hidden="true">
        <motion.i
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={view}
          transition={{ duration: reduce ? 0 : 1, delay: 0.3, ease }}
          style={{ transformOrigin: "right center" }}
        />
        <motion.b
          initial={reduce ? false : { scale: 0, rotate: 0 }}
          whileInView={{ scale: 1, rotate: 45 }}
          viewport={view}
          transition={{ duration: reduce ? 0 : 0.8, delay: 0.55, ease }}
        />
        <motion.i
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={view}
          transition={{ duration: reduce ? 0 : 1, delay: 0.3, ease }}
          style={{ transformOrigin: "left center" }}
        />
      </span>
      {intro ? <p className={styles.intro}>{intro}</p> : null}
    </InView>
  )
}
