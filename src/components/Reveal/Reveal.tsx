import { motion, useReducedMotion } from "framer-motion"
import type { CSSProperties, ReactNode } from "react"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  active: boolean
  y?: number
  as?: "div" | "span"
}

export function Reveal({ children, className, delay = 0, active, y = 18, as = "div" }: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = as === "span" ? motion.span : motion.div

  if (reduce) {
    const Tag = as
    return (
      <Tag className={className} style={{ opacity: active ? 1 : 0 }}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.95, delay, ease }}
    >
      {children}
    </MotionTag>
  )
}

type InViewProps = {
  children: ReactNode
  className?: string
  delay?: number
  style?: CSSProperties
}

export function InView({ children, className, delay = 0, style }: InViewProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  )
}
