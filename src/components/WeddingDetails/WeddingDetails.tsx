import { motion } from "framer-motion"
import { Gem, MapPin, Shirt, Wine } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { wedding } from "../../data/wedding"
import { InView } from "../Reveal/Reveal"
import { SectionHeading } from "../SectionHeading/SectionHeading"
import styles from "./WeddingDetails.module.css"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const icons: Record<(typeof wedding.details.blocks)[number]["id"], LucideIcon> = {
  ceremony: Gem,
  reception: Wine,
  venue: MapPin,
  dress: Shirt,
}

export function WeddingDetails() {
  const { details } = wedding

  return (
    <section className={styles.section} id="details" aria-labelledby="details-title">
      <div className="wrap">
        <SectionHeading
          index={details.index}
          kicker={details.kicker}
          title={details.title}
          intro={details.intro}
          headingId="details-title"
        />

        <div className={styles.list}>
          {details.blocks.map((block, index) => {
            const Icon = icons[block.id]
            return (
              <InView key={block.id} className={styles.row} delay={index * 0.05}>
                <motion.span
                  className={styles.draw}
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.85, delay: index * 0.08, ease }}
                  style={{ transformOrigin: "left center" }}
                />
                <Icon className={styles.icon} strokeWidth={1.25} aria-hidden="true" />
                <div>
                  <p className={styles.label}>{block.label}</p>
                  <p className={styles.primary}>{block.primary}</p>
                  {block.secondary ? <p className={styles.secondary}>{block.secondary}</p> : null}
                  <p className={styles.note}>{block.note}</p>
                  {block.id === "venue" ? (
                    <a className={styles.link} href="#venue">
                      {details.venueLink}
                    </a>
                  ) : null}
                </div>
              </InView>
            )
          })}
        </div>
      </div>
    </section>
  )
}
