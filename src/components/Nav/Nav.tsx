import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import { useEffect, useState } from "react"
import { wedding } from "../../data/wedding"
import styles from "./Nav.module.css"

type Props = {
  visible: boolean
}

export function Nav({ visible }: Props) {
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(() => window.scrollY > 12)
  const [open, setOpen] = useState(false)
  const { couple, nav } = wedding
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const menuOpen = visible && open

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menuOpen])

  return (
    <>
      <motion.header
        className={`${styles.bar} ${scrolled ? styles.scrolled : ""}`}
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible || reduce ? 0 : -10,
        }}
        transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: visible ? "auto" : "none" }}
        aria-hidden={!visible}
      >
        <a className={styles.brand} href="#top">
          {couple.initials}
        </a>
        <nav className={styles.links} aria-label="Invitation">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <motion.span className={styles.progress} style={{ scaleX: progress, opacity: scrolled ? 1 : 0 }} aria-hidden="true" />
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          onClick={() => setOpen((value) => !value)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className={styles.menu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <nav aria-label="Invitation">
              {nav.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.45 }}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
