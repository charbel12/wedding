import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { wedding } from "../../data/wedding"
import styles from "./Hero.module.css"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

type Props = {
  /** "card" is the printed card inside the envelope; "page" is the top of the site. */
  variant: "card" | "page"
  /** The page hero comes alive once the envelope has handed over to it. */
  live?: boolean
}

function Corner({ className }: { className: string }) {
  return (
    <svg className={`${styles.corner} ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M2 38 V14 C2 7 7 2 14 2 H38" />
      <path d="M8 38 V18 C8 12 12 8 18 8 H38" />
      <path d="M14 14 C18 18 22 18 26 14 C22 10 18 10 14 14 Z" />
      <circle cx="8" cy="8" r="1.6" />
    </svg>
  )
}

export function Hero({ variant, live = false }: Props) {
  const reduce = useReducedMotion()
  const { couple, hero } = wedding
  const page = variant === "page"
  const { scrollY } = useScroll()
  const drift = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 160])
  const settle = useTransform(scrollY, [0, 700], [1, reduce ? 1 : 0.94])

  return (
    <header
      className={`${styles.hero} ${page ? styles.page : styles.card}`}
      id={page ? "top" : undefined}
      tabIndex={page ? -1 : undefined}
      data-live={live || undefined}
    >
      <div className={styles.paper} aria-hidden="true" />
      <div className={styles.frame} aria-hidden="true">
        <Corner className={styles.tl} />
        <Corner className={styles.tr} />
        <Corner className={styles.bl} />
        <Corner className={styles.br} />
      </div>

      <motion.div className={styles.canvas} style={page ? { y: drift, scale: settle } : undefined}>
        <p className={styles.sideline}>{hero.sideline}</p>

        <div className={styles.inner}>
          <div className={styles.ornament} aria-hidden="true">
            <span className={styles.rule} />
            <span className={styles.diamond} />
            <span className={styles.rule} />
          </div>

          <p className={styles.eyebrow}>{hero.eyebrow}</p>

          <h1 className={styles.names}>
            <span className={styles.name}>{couple.partnerA}</span>
            <span className={styles.amp}>
              <span className={styles.ampGlyph}>{couple.conjunction}</span>
            </span>
            <span className={styles.name}>{couple.partnerB}</span>
          </h1>

          <p className={styles.invite}>{hero.invite}</p>

          <div className={styles.meta}>
            <p>{hero.date}</p>
            <p>
              {hero.venue}
              <span aria-hidden="true"> · </span>
              {hero.city}
            </p>
          </div>
        </div>
      </motion.div>

      {page ? (
        <motion.div
          className={styles.scrollWrap}
          initial={false}
          animate={live ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.35, ease }}
        >
          <a className={styles.scroll} href="#story" tabIndex={live ? undefined : -1}>
            <span>{hero.scroll}</span>
            <i />
          </a>
        </motion.div>
      ) : null}
    </header>
  )
}
