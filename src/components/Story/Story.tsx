import { motion, useReducedMotion } from "framer-motion"
import type { CSSProperties } from "react"
import { wedding } from "../../data/wedding"
import { InView } from "../Reveal/Reveal"
import { SectionHeading } from "../SectionHeading/SectionHeading"
import styles from "./Story.module.css"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function Story() {
  const reduce = useReducedMotion()
  const { story } = wedding
  const trackStyle = { "--count": String(story.chapters.length) } as CSSProperties

  return (
    <section className={styles.section} id="story" aria-labelledby="story-title">
      <div className="wrap">
        <SectionHeading
          index={story.index}
          kicker={story.kicker}
          title={story.title}
          intro={story.intro}
          headingId="story-title"
        />

        <div className={styles.track} style={trackStyle}>
          {reduce ? (
            <div className={styles.axis} />
          ) : (
            <motion.div
              className={styles.axis}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ duration: 1.45, ease }}
            />
          )}

          {story.chapters.map((chapter, index) => (
            <InView
              key={chapter.year + chapter.title}
              className={`${styles.chapter} ${index % 2 === 0 ? styles.above : styles.below}`}
              delay={index * 0.06}
              style={
                {
                  "--col": String(index + 1),
                  "--row": index % 2 === 0 ? "1" : "3",
                  "--ripple": `${index * 0.45}s`,
                } as CSSProperties
              }
            >
              <span className={styles.node} aria-hidden="true">
                {reduce ? (
                  <span className={styles.nodeDot} />
                ) : (
                  <motion.span
                    className={styles.nodeDot}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.15 + index * 0.07, ease }}
                  />
                )}
              </span>
              <p className={styles.year}>{chapter.year}</p>
              <h3 className={styles.title}>{chapter.title}</h3>
              <p className={styles.text}>{chapter.text}</p>
            </InView>
          ))}
        </div>
      </div>
    </section>
  )
}
