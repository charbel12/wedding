import { motion, useReducedMotion } from "framer-motion"
import { wedding } from "../../data/wedding"
import styles from "./Footer.module.css"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
}

export function Footer() {
  const reduce = useReducedMotion()
  const { couple, hero, closing } = wedding

  return (
    <footer className={styles.footer}>
      <div className={styles.frame} aria-hidden="true" />
      <motion.div
        className={styles.inner}
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-12% 0px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
        }}
      >
        <motion.p className={styles.mark} variants={item}>
          {couple.initials}
        </motion.p>
        <motion.p className={styles.kicker} variants={item}>
          {closing.kicker}
        </motion.p>
        <motion.p className={styles.names} variants={item}>
          <span>{couple.partnerA}</span>
          <span className={styles.amp}>{couple.conjunction}</span>
          <span>{couple.partnerB}</span>
        </motion.p>
        <motion.p className={styles.line} variants={item}>
          {closing.line}
        </motion.p>
        <motion.p className={styles.meta} variants={item}>
          {hero.date}
          <span aria-hidden="true"> · </span>
          {hero.city}
        </motion.p>
      </motion.div>
    </footer>
  )
}
